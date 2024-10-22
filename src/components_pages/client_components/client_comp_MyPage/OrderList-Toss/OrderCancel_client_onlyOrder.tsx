/* eslint-disable no-undef */
import React, { useEffect, useState } from 'react';
import getToken from '../../../../constant/getToken';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import orderCancel from '../../../../styles/orderCancel_client.module.scss';
import styled from 'styled-components';
import Loading from '../../Loading';
import BTN_black_nomal_comp from '../../../../components_elements/BTN_black_nomal_comp';
import BTN_white_nomal_comp from '../../../../components_elements/BTN_white_nomal_comp';

const { REACT_APP_KEY_IMAGE } = process.env;
const { REACT_APP_KEY_BACK } = process.env;

const Pd_Images = styled.div<{ img: string }>`
  ${(props) =>
    props.img && `background-image: url('${REACT_APP_KEY_IMAGE}${props.img}')`}
`;

export default function OrderCancel_client_onlyOrder() {
  const [orderCancelItem, setOrderCancelItem] =
    useState<Order_Cancel_ListType | null>(null);
  const navigate = useNavigate();
  const { orderId } = useParams();

  useEffect(() => {
    // 상품 id로 선택한 상품 불러오기
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
      } catch (err: any) {
        navigate(
          `/error?errorMessage=${err.response.data}&errorCode=${err.response.status}`,
        );
        console.error(err);
      }
    };

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
    } catch (err: any) {
      navigate(
        `/error?errorMessage=${err.response.data}&errorCode=${err.response.status}`,
      );
      console.error(err);
      return;
    }
  };

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
                          {el.unitSumPrice.toLocaleString('ko-KR')}
                        </strong>
                        KRW /{' '}
                        <strong style={{ fontSize: '15px' }}>
                          {el.quantity.toLocaleString('ko-KR')}
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
                    {orderCancelItem.payments.totalAmount.toLocaleString(
                      'ko-KR',
                    )}{' '}
                  </strong>
                  KRW /{' '}
                  <strong style={{ fontSize: '17px' }}>
                    {orderCancelItem.products
                      .reduce((acc, cur) => acc + cur.quantity, 0)
                      .toLocaleString('ko-KR')}
                  </strong>{' '}
                  ea
                </p>
                <BTN_black_nomal_comp
                  borderRadius="0"
                  fontSize="13px"
                  padding="5px 10px"
                  font-weight="500"
                  marginRight="10px"
                  onClickEvent={() => navigate(-1)}
                >
                  뒤로가기
                </BTN_black_nomal_comp>
                <BTN_white_nomal_comp
                  borderRadius="0"
                  fontSize="13px"
                  padding="5px 10px"
                  font-weight="500"
                  className={orderCancel.orderCancle}
                  onClickEvent={() => readyCancel()}
                >
                  취소진행
                </BTN_white_nomal_comp>
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
