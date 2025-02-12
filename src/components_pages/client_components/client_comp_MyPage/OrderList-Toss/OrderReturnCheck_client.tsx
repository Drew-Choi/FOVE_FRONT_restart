/* eslint-disable no-undef */
import React, { useEffect, useState } from 'react';
import getToken from '../../../../constant/getToken';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import orderReturnCheck from '../../../../styles/orderReturnCheck_client.module.scss';
import styled from 'styled-components';
import Loading from '../../Loading';
import { useSelector } from 'react-redux';
import Loading_Spinner from '../../Loading_Spinner';
import BTN_black_nomal_comp from '../../../../components_elements/BTN_black_nomal_comp';
import BTN_white_nomal_comp from '../../../../components_elements/BTN_white_nomal_comp';

const { REACT_APP_KEY_BACK } = process.env;
const { REACT_APP_KEY_IMAGE } = process.env;

const Pd_Images = styled.div<{ img: string }>`
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
  const [spinner, setSpinner] = useState<boolean>(false);
  const [orderCancelItem, setOrderCancelItem] =
    useState<Order_Cancel_ListType | null>(null);
  const navigate = useNavigate();
  const { orderId } = useParams();

  // 로그인 여부 확인 - 장바구니 담기, 바로 구매 가능 여부 판단
  const isLogin = useSelector((state: IsLoginState) => state.user.isLogin);

  useEffect(() => {
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

  const cancelSubmit = async () => {
    if (!isLogin) {
      alert('로그인이 필요한 서비스입니다.');
      return navigate(`/login`);
    }
    setSpinner(true);
    try {
      const tokenValue = await getToken();

      const response = await axios.post(
        `${REACT_APP_KEY_BACK}/admin/return_submit/submit_cancel`,
        { token: tokenValue, orderId },
      );

      if (response.status === 200) {
        // 200번대 성공이면,
        setSpinner(false);
        alert('반품신청 철회 완료');
        return navigate('/mypage/orderlist');
      }
    } catch (err: any) {
      console.error(err);
      navigate(
        `/error?errorMessage=${err.response.data}&errorCode=${err.response.status}`,
      );
      setSpinner(false);
      alert('철회 오류');
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
                          {el.unitSumPrice.toLocaleString('ko-KR')}
                        </strong>
                        KRW /{' '}
                        <strong style={{ fontSize: '15px' }}>
                          {el.quantity.toLocaleString('ko-KR')}
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
                  {orderCancelItem.payments.totalAmount.toLocaleString('ko-KR')}{' '}
                </strong>
                KRW /{' '}
                <strong style={{ fontSize: '17px' }}>
                  {orderCancelItem.products
                    .reduce((acc, cur) => acc + cur.quantity, 0)
                    .toLocaleString('ko-KR')}
                </strong>{' '}
                ea
              </p>
              <p className={orderReturnCheck.return_reason}>
                reason:{' '}
                <span className={orderReturnCheck.reason_text}>
                  {orderCancelItem.submitReturn?.reason}
                </span>
              </p>
              <p className={orderReturnCheck.return_etc}>
                message:{' '}
                <span className={orderReturnCheck.reason_etc_text}>
                  {orderCancelItem.submitReturn?.return_message}
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
                {orderCancelItem.submitReturn?.return_img?.map((el, index) => {
                  return (
                    <Preview
                      key={index}
                      src={`${REACT_APP_KEY_IMAGE}${orderCancelItem.payments.orderId}/${el}`}
                    ></Preview>
                  );
                })}
                <BTN_black_nomal_comp
                  fontWeight="500"
                  fontSize="13px"
                  borderRadius="0"
                  padding="5px 10px"
                  marginRight="10px"
                  onClickEvent={() => navigate(-1)}
                >
                  뒤로가기
                </BTN_black_nomal_comp>
                {orderCancelItem.payments.status === 'DONE' &&
                !orderCancelItem.isShipping &&
                orderCancelItem.shippingCode !== 0 &&
                orderCancelItem.isDelivered &&
                !orderCancelItem.isCancel &&
                !orderCancelItem.isReturn &&
                !orderCancelItem.isRetrieved &&
                !orderCancelItem.isRefund &&
                orderCancelItem.isReturnSubmit ? (
                  <BTN_white_nomal_comp
                    fontWeight="500"
                    fontSize="13px"
                    borderRadius="0"
                    padding="5px 10px"
                    onClickEvent={() => cancelSubmit()}
                  >
                    반품신청철회
                  </BTN_white_nomal_comp>
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
