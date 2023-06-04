import React, { useEffect, useMemo, useRef, useState } from 'react';
import getToken from '../../store/modules/getToken';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import orderReturnCheck from '../../styles/orderReturnCheck_client.module.scss';
import styled from 'styled-components';
import Loading from './Loading';

const Pd_Images = styled.div`
  ${(props) =>
    props.img &&
    `background-image: url('http://localhost:4000/uploads/${props.img}')`}
`;

const Preview = styled.img`
  position: relative;
  display: block;
  box-sizing: content-box;
  width: 40vw;
  height: auto;
  padding: 10px;
  margin: 0px 0px 10px 0px;
  border-bottom: 0.5px solid black;
  cursor: pointer;

  @media screen and (max-width: 1000px) {
    width: 65vw;
  }

  @media screen and (max-width: 510px) {
    width: 80vw;
  }

  @media screen and (max-width: 280px) {
    width: 85vw;
    padding: 10px 0px;
  }
`;

export default function OrderReturnCheck_client() {
  const [orderCancelItem, setOrderCancelItem] = useState(null);
  const navigate = useNavigate();
  const { orderId } = useParams();

  const getCancelItem = async () => {
    try {
      const tokenValue = await getToken();

      const getCancelData = await axios.post(
        'http://localhost:4000/order_list/getCancelItem',
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

  useEffect(() => {
    getCancelItem();
  }, []);

  const cancelSubmit = async () => {
    try {
      const tokenValue = await getToken();

      const response = await axios.post(
        'http://localhost:4000/admin/return_submit/submit_cancel',
        { token: tokenValue, orderId },
      );

      if (response.status !== 200) return alert('철회 오류');
      // 200번대 성공이면,
      alert('반품신청 철회 완료');
      return navigate('/mypage/orderlist');
    } catch (err) {
      console.error(err);
      return;
    }
  };

  return (
    <section className={orderReturnCheck.orderList_container}>
      {orderCancelItem !== null && Object.keys(orderCancelItem).length > 0 ? (
        <>
          <div className={orderReturnCheck.titleArea}>
            <h5 className={orderReturnCheck.subtitle}>RETURN CHECK</h5>
          </div>

          <div className={orderReturnCheck.order_info_wrap}>
            <div className={orderReturnCheck.orderlist_Check_wrap}>
              <p className={orderReturnCheck.older_date}>
                주문번호: <strong>{orderCancelItem.payments.orderId}</strong>
              </p>
              {/* 상품영역 */}
              {orderCancelItem.products.map((el, index) => {
                return (
                  <div
                    key={index}
                    className={orderReturnCheck.older_image_info}
                  >
                    <Pd_Images
                      onClick={() =>
                        navigate(`/store/detail/${el.productCode}`)
                      }
                      img={el.img}
                      className={orderReturnCheck.older_image}
                    ></Pd_Images>
                    <div className={orderReturnCheck.pdnameprice}>
                      <p
                        className={orderReturnCheck.pdname}
                        onClick={() =>
                          navigate(`/store/detail/${el.productCode}`)
                        }
                      >
                        {el.productName}
                      </p>
                      <p className={orderReturnCheck.pdprice}>
                        <strong style={{ fontSize: '15px' }}>
                          {frontPriceComma(el.unitSumPrice)}
                        </strong>
                        KRW /{' '}
                        <strong style={{ fontSize: '15px' }}>
                          {frontPriceComma(el.quantity)}
                        </strong>{' '}
                        ea
                      </p>
                      <p className={orderReturnCheck.pdprice}>
                        SIZE{' '}
                        <strong style={{ fontSize: '15px' }}>{el.size}</strong>
                      </p>
                    </div>
                  </div>
                );
              })}
              <p className={orderReturnCheck.older_detail_info}>
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
              <p className={orderReturnCheck.return_reason}>
                reason:{' '}
                <span className={orderReturnCheck.reason_text}>
                  {orderCancelItem.submitReturn.reason}
                </span>
              </p>
              <p className={orderReturnCheck.return_etc}>
                message:{' '}
                <span className={orderReturnCheck.reason_etc_text}>
                  {orderCancelItem.submitReturn.return_message}
                </span>
              </p>
              <p className={orderReturnCheck.return_reason}>
                stage:{' '}
                <span className={orderReturnCheck.reason_text}>
                  {!orderCancelItem.isCancel &&
                  !orderCancelItem.isReturn &&
                  orderCancelItem.isReturnSubmit ? (
                    '검토 중'
                  ) : orderCancelItem.shippingCode === 0 &&
                    !orderCancelItem.isCancel &&
                    !orderCancelItem.isDelivered &&
                    !orderCancelItem.isShipping &&
                    orderCancelItem.isReturn &&
                    !orderCancelItem.isReturnSubmit ? (
                    '교환진행'
                  ) : (
                    <></>
                  )}
                </span>
              </p>
              <div className={orderReturnCheck.infoCancelContainer}>
                <div className={orderReturnCheck.line}></div>
                {orderCancelItem.submitReturn.return_img.map((el, index) => {
                  return (
                    <Preview
                      key={index}
                      src={`http://localhost:4000/uploads/${orderCancelItem.payments.orderId}/${el}`}
                    ></Preview>
                  );
                })}
                <button
                  className={orderReturnCheck.orderBack}
                  onClick={() => navigate(-1)}
                >
                  뒤로가기
                </button>
                {orderCancelItem.shippingCode === 0 &&
                !orderCancelItem.isCancel &&
                !orderCancelItem.isDelivered &&
                !orderCancelItem.isShipping &&
                orderCancelItem.isReturn &&
                !orderCancelItem.isReturnSubmit ? (
                  <></>
                ) : (
                  <button
                    className={orderReturnCheck.orderCancle}
                    onClick={() => cancelSubmit()}
                  >
                    반품신청철회
                  </button>
                )}

                {orderCancelItem.shippingCode === 0 &&
                !orderCancelItem.isCancel &&
                !orderCancelItem.isDelivered &&
                !orderCancelItem.isShipping &&
                orderCancelItem.isReturn &&
                !orderCancelItem.isReturnSubmit ? (
                  <p className={orderReturnCheck.caution}>
                    * 교환하실 상품을 준비 중 입니다. 배송이 시작되면 &#39;배송
                    중&#39;으로 진행됩니다.
                  </p>
                ) : (
                  <p className={orderReturnCheck.caution}>
                    *검토 후 연락드리도록 하겠습니다. (카카오톡 or 주문자
                    전화번호)
                  </p>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <Loading />
      )}
    </section>
  );
}
