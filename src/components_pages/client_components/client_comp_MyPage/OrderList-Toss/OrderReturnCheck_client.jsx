/* eslint-disable no-undef */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import getToken from '../../../../store/modules/getToken';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import orderReturnCheck from '../../../../styles/orderReturnCheck_client.module.scss';
import styled from 'styled-components';
import Loading from '../../Loading';
import { useSelector } from 'react-redux';
import Loading_Spinner from '../../Loading_Spinner';
const { REACT_APP_KEY_IMAGE } = process.env;

const Pd_Images = styled.div`
  ${(props) =>
    props.img && `background-image: url('${REACT_APP_KEY_IMAGE}${props.img}')`}
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
  // 스피너
  const [spinner, setSpinner] = useState(false);

  const [orderCancelItem, setOrderCancelItem] = useState(null);
  const navigate = useNavigate();
  const { orderId } = useParams();

  const { REACT_APP_KEY_BACK } = process.env;
  const { REACT_APP_KEY_IMAGE } = process.env;

  // 로그인 여부 확인 - 장바구니 담기, 바로 구매 가능 여부 판단
  const isLogin = useSelector((state) => state.user.isLogin);

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
    if (!isLogin) {
      alert('로그인이 필요한 서비스입니다.');
      return navigate(`/login`);
    }
    setSpinner((cur) => true);
    try {
      const tokenValue = await getToken();

      const response = await axios.post(
        `${REACT_APP_KEY_BACK}/admin/return_submit/submit_cancel`,
        { token: tokenValue, orderId },
      );

      if (response.status !== 200)
        return setSpinner((cur) => false), alert('철회 오류');
      // 200번대 성공이면,
      alert('반품신청 철회 완료');
      setSpinner((cur) => false);
      return navigate('/mypage/orderlist');
    } catch (err) {
      console.error(err);
      setSpinner((cur) => false);
      return;
    }
  };

  return (
    <section className={orderReturnCheck.orderList_container}>
      {spinner && <Loading_Spinner />}
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
                  {orderCancelItem.payments.status === 'DONE' &&
                  !orderCancelItem.isShipping &&
                  orderCancelItem.shippingCode !== 0 &&
                  orderCancelItem.isDelivered &&
                  !orderCancelItem.isCancel &&
                  !orderCancelItem.isReturn &&
                  !orderCancelItem.isRetrieved &&
                  !orderCancelItem.isRefund &&
                  orderCancelItem.isReturnSubmit ? (
                    '검토 중'
                  ) : orderCancelItem.payments.status === 'DONE' &&
                    !orderCancelItem.isShipping &&
                    orderCancelItem.shippingCode !== 0 &&
                    orderCancelItem.isDelivered &&
                    !orderCancelItem.isCancel &&
                    !orderCancelItem.isReturn &&
                    !orderCancelItem.isRetrieved &&
                    orderCancelItem.isRefund &&
                    orderCancelItem.isReturnSubmit ? (
                    '환불진행'
                  ) : orderCancelItem.payments.status === 'DONE' &&
                    orderCancelItem.isShipping &&
                    orderCancelItem.shippingCode !== 0 &&
                    orderCancelItem.isDelivered &&
                    !orderCancelItem.isCancel &&
                    !orderCancelItem.isReturn &&
                    !orderCancelItem.isRetrieved &&
                    orderCancelItem.isRefund &&
                    orderCancelItem.isReturnSubmit ? (
                    '상품회수 중 (환불)'
                  ) : orderCancelItem.payments.status === 'DONE' &&
                    !orderCancelItem.isShipping &&
                    orderCancelItem.shippingCode !== 0 &&
                    !orderCancelItem.isDelivered &&
                    !orderCancelItem.isCancel &&
                    !orderCancelItem.isReturn &&
                    orderCancelItem.isRetrieved &&
                    orderCancelItem.isRefund &&
                    orderCancelItem.isReturnSubmit ? (
                    '상품회수 완료 (환불)'
                  ) : orderCancelItem.payments.status === 'DONE' &&
                    !orderCancelItem.isShipping &&
                    orderCancelItem.shippingCode !== 0 &&
                    orderCancelItem.isDelivered &&
                    !orderCancelItem.isCancel &&
                    orderCancelItem.isReturn &&
                    !orderCancelItem.isRetrieved &&
                    !orderCancelItem.isRefund &&
                    orderCancelItem.isReturnSubmit ? (
                    '교환진행'
                  ) : orderCancelItem.payments.status === 'DONE' &&
                    orderCancelItem.isShipping &&
                    orderCancelItem.shippingCode !== 0 &&
                    orderCancelItem.isDelivered &&
                    !orderCancelItem.isCancel &&
                    orderCancelItem.isReturn &&
                    !orderCancelItem.isRetrieved &&
                    !orderCancelItem.isRefund &&
                    orderCancelItem.isReturnSubmit ? (
                    '상품회수 중 (교환)'
                  ) : orderCancelItem.payments.status === 'DONE' &&
                    !orderCancelItem.isShipping &&
                    orderCancelItem.shippingCode !== 0 &&
                    !orderCancelItem.isDelivered &&
                    !orderCancelItem.isCancel &&
                    orderCancelItem.isReturn &&
                    orderCancelItem.isRetrieved &&
                    !orderCancelItem.isRefund &&
                    orderCancelItem.isReturnSubmit ? (
                    '상품회수 완료 (교환)'
                  ) : orderCancelItem.payments.status === 'DONE' &&
                    orderCancelItem.isShipping &&
                    orderCancelItem.shippingCode !== 0 &&
                    !orderCancelItem.isDelivered &&
                    !orderCancelItem.isCancel &&
                    orderCancelItem.isReturn &&
                    orderCancelItem.isRetrieved &&
                    !orderCancelItem.isRefund &&
                    orderCancelItem.isReturnSubmit ? (
                    '교환상품 배송 중'
                  ) : orderCancelItem.payments.status === 'DONE' &&
                    !orderCancelItem.isShipping &&
                    orderCancelItem.shippingCode !== 0 &&
                    orderCancelItem.isDelivered &&
                    !orderCancelItem.isCancel &&
                    orderCancelItem.isReturn &&
                    !orderCancelItem.isRetrieved &&
                    !orderCancelItem.isRefund &&
                    !orderCancelItem.isReturnSubmit ? (
                    '교환상품 배송완료'
                  ) : orderCancelItem.payments.status === 'CANCELED' &&
                    !orderCancelItem.isOrdered &&
                    !orderCancelItem.isShipping &&
                    orderCancelItem.shippingCode !== 0 &&
                    !orderCancelItem.isDelivered &&
                    orderCancelItem.isCancel &&
                    !orderCancelItem.isReturn &&
                    orderCancelItem.isRetrieved &&
                    orderCancelItem.isRefund &&
                    orderCancelItem.isReturnSubmit ? (
                    '환불완료'
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
                      src={`${REACT_APP_KEY_IMAGE}${orderCancelItem.payments.orderId}/${el}`}
                    ></Preview>
                  );
                })}
                <button
                  className={orderReturnCheck.orderBack}
                  onClick={() => navigate(-1)}
                >
                  뒤로가기
                </button>
                {orderCancelItem.payments.status === 'DONE' &&
                !orderCancelItem.isShipping &&
                orderCancelItem.shippingCode !== 0 &&
                orderCancelItem.isDelivered &&
                !orderCancelItem.isCancel &&
                !orderCancelItem.isReturn &&
                !orderCancelItem.isRetrieved &&
                !orderCancelItem.isRefund &&
                orderCancelItem.isReturnSubmit ? (
                  <button
                    className={orderReturnCheck.orderCancle}
                    onClick={() => cancelSubmit()}
                  >
                    반품신청철회
                  </button>
                ) : (
                  <></>
                )}

                {orderCancelItem.payments.status === 'DONE' &&
                !orderCancelItem.isShipping &&
                orderCancelItem.shippingCode !== 0 &&
                orderCancelItem.isDelivered &&
                !orderCancelItem.isCancel &&
                !orderCancelItem.isReturn &&
                !orderCancelItem.isRetrieved &&
                !orderCancelItem.isRefund &&
                orderCancelItem.isReturnSubmit ? (
                  <p className={orderReturnCheck.caution}>
                    *검토 후 연락드리도록 하겠습니다. (카카오톡 or 주문자
                    전화번호)
                  </p>
                ) : (
                  <></>
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