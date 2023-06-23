/* eslint-disable no-undef */
import React, { useEffect, useRef, useState } from 'react';
import getToken from '../../store/modules/getToken';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import orderCancel from '../../styles/orderCancel_client.module.scss';
import styled from 'styled-components';
import Loading from './Loading';

const { REACT_APP_KEY_IMAGE } = process.env;

const Pd_Images = styled.div`
  ${(props) =>
    props.img &&
    `background-image: url('${REACT_APP_KEY_IMAGE}/uploads/${props.img}')`}
`;

export default function OrderCancel_client_onlyOrder() {
  const [orderCancelItem, setOrderCancelItem] = useState(null);
  // const [selectReason, setSelectReason] = useState('단순변심');
  const navigate = useNavigate();
  const { orderId } = useParams();
  const { REACT_APP_KEY_BACK } = process.env;

  const getCancelItem = async () => {
    try {
      const tokenValue = await getToken();

      const getCancelData = await axios.post(
        `${REACT_APP_KEY_BACK}/order_list/getCancelItem`,
        {
          token: tokenValue,
          orderId: orderId,
        },
      );
      setOrderCancelItem(getCancelData.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getCancelItem();
  }, []);

  const readyCancel = async () => {
    try {
      const tokenValue = await getToken();

      const response = await axios.post(
        `${REACT_APP_KEY_BACK}/order_list/readyCancel`,
        { orderId: orderId, token: tokenValue },
      );

      if (response.status !== 200) return alert('주문취소 실패');
      // 200번대 성공이면
      navigate(`/mypage/orderlist/cancel_onlyOrder/complete`);
      return;
    } catch (err) {
      console.error(err);
      return;
    }
  };

  //db Number타입을 스트링으로 바꾸고 천단위 컴마 찍어 프론트에 보내기
  const country = navigator.language;
  const frontPriceComma = (price) => {
    if (price && typeof price.toLocaleString === 'function') {
      return price.toLocaleString(country, {
        currency: 'KRW',
      });
    } else {
      return price;
    }
  };

  // 취소 사유 리스트
  const cancelReason = ['단순변심', '다른 상품으로 다시 주문', '기타'];

  return (
    <>
      {orderCancelItem !== null && Object.keys(orderCancelItem).length > 0 ? (
        <section className={orderCancel.orderList_container}>
          <div className={orderCancel.titleArea}>
            <h5 className={orderCancel.subtitle}>CANCEL</h5>
          </div>

          <div className={orderCancel.order_info_wrap}>
            <div className={orderCancel.orderlist_Check_wrap}>
              <p className={orderCancel.older_date}>
                주문번호: <strong>{orderCancelItem.payments.orderId}</strong>
              </p>
              {/* 상품영역 */}
              {orderCancelItem.products.map((el, index) => {
                return (
                  <div key={index} className={orderCancel.older_image_info}>
                    <Pd_Images
                      onClick={() =>
                        navigate(`/store/detail/${el.productCode}`)
                      }
                      img={el.img}
                      className={orderCancel.older_image}
                    ></Pd_Images>
                    <div className={orderCancel.pdnameprice}>
                      <p
                        className={orderCancel.pdname}
                        onClick={() =>
                          navigate(`/store/detail/${el.productCode}`)
                        }
                      >
                        {el.productName}
                      </p>
                      <p className={orderCancel.pdprice}>
                        <strong style={{ fontSize: '15px' }}>
                          {frontPriceComma(el.unitSumPrice)}
                        </strong>
                        KRW /{' '}
                        <strong style={{ fontSize: '15px' }}>
                          {frontPriceComma(el.quantity)}
                        </strong>{' '}
                        ea
                      </p>
                      <p className={orderCancel.pdprice}>
                        SIZE{' '}
                        <strong style={{ fontSize: '15px' }}>{el.size}</strong>
                      </p>
                    </div>
                  </div>
                );
              })}
              <div className={orderCancel.infoCancelContainer}>
                <p className={orderCancel.older_detail_info}>* 입금 전 취소</p>
                <p className={orderCancel.older_detail_info}>
                  total ={' '}
                  <strong style={{ fontSize: '17px' }}>
                    {frontPriceComma(orderCancelItem.payments.totalAmount)}{' '}
                  </strong>
                  KRW /{' '}
                  <strong style={{ fontSize: '17px' }}>
                    {frontPriceComma(
                      orderCancelItem.products.reduce(
                        (acc, cur) => acc + cur.quantity,
                        0,
                      ),
                    )}
                  </strong>{' '}
                  ea
                </p>
                <button
                  className={orderCancel.orderBack}
                  onClick={() => navigate(-1)}
                >
                  뒤로가기
                </button>
                <button
                  className={orderCancel.orderCancle}
                  onClick={() => readyCancel()}
                >
                  취소진행
                </button>
                <p className={orderCancel.caution}>
                  *취소내역을 다시 한번 잘 확인하신 후 취소진행을 눌러주세요.
                </p>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <Loading />
      )}
    </>
  );
}
