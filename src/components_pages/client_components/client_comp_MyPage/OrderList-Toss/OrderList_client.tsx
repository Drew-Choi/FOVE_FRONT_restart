/* eslint-disable no-undef */
import React, { useEffect, useState } from 'react';
import orderList from '../../../../styles/orderlist_client.module.scss';
import axios from 'axios';
import getToken from '../../../../constant/getToken';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Loading from '../../Loading';
import { BsArrowDownCircle } from 'react-icons/bs';
import { useSelector } from 'react-redux';
import BTN_white_nomal_comp from '../../../../components_elements/BTN_white_nomal_comp';

type PD_ImagesType = {
  img: string;
};
const PD_Images = styled.div<PD_ImagesType>`
  ${(props) =>
    props.img && `background-image: url('${REACT_APP_KEY_IMAGE}${props.img}')`}
`;

const { REACT_APP_KEY_BACK } = process.env;
const { REACT_APP_KEY_IMAGE } = process.env;

//날짜 분활 / 매개변수만 받음 되서 고정
const dateSplit = (date: string) => {
  const splitData = date.split(/[T+]/);
  const dataSum = `${splitData[0]}  /  ${splitData[1]}`;
  return dataSum;
};

// 시간에 따라 반품신청 버튼 활성화 / 매개변수만 받음 되서 고정
const timeCheck = (data: Order_Cancel_ListType) => {
  // 현재시간 기준
  if (
    data.payments.status === 'DONE' &&
    !data.isShipping &&
    data.shippingCode !== 0 &&
    data.isDelivered &&
    !data.isCancel &&
    !data.isReturn &&
    !data.isRetrieved &&
    !data.isRefund &&
    !data.isReturnSubmit
  ) {
    const currentDate = new Date();

    // 데이터 시간에 7일을 더하여 종료시점 잡기
    const toDate = new Date(data.shippingAt);
    const fixTime = new Date(toDate.getTime() - 9 * 60 * 60 * 1000);
    const expireDay = new Date(fixTime.getTime() + 7 * 24 * 60 * 60 * 1000);

    if (currentDate > expireDay) return false;
    return true;
  } else {
    return false;
  }
};

// 필요한 날짜만 추리기  / 매개변수만 받음 되서 고정
const filterTimeDay = (time: string) => {
  const position = time.indexOf('T');
  const day = time.slice(0, position);

  return day;
};

export default function OrderList_client() {
  const [orderListArray, setOrderListArray] = useState<
    Order_Cancel_ListType[] | null
  >(null);
  const [emptyOrderArray, setEmptyOrderArray] = useState<boolean>(false);
  const [cancelListArray, setCancelListArray] = useState<
    Order_Cancel_ListType[] | null
  >(null);
  const [emptyCancelArray, setEmptyCancelArray] = useState<boolean>(false);
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  // 주문상세내역서용 - order
  const [detailInfo, setDetailInfo] = useState<string[]>([]);
  // 주문상세내역서용 - cancel
  const [detailInfoCancel, setDetailInfoCancel] = useState<string[]>([]);

  // 로그인여부확인
  const isLogin = useSelector((state: IsLoginState) => state.user.isLogin);

  // 주문상세내역서용 핸들 - order
  const handleArrowDetail = (index: number) => {
    if (detailInfo[index] === 'off') {
      setDetailInfo((cur) => cur.map((el, num) => (num === index ? 'on' : el)));
    } else {
      setDetailInfo((cur) =>
        cur.map((el, num) => (num === index ? 'off' : el)),
      );
    }
  };

  // 주문상세내역서용 핸들 - cancel
  const handleArrowDetailCancel = (index: number) => {
    if (detailInfoCancel[index] === 'off') {
      setDetailInfoCancel((cur) =>
        cur.map((el, num) => (num === index ? 'on' : el)),
      );
    } else {
      setDetailInfoCancel((cur) =>
        cur.map((el, num) => (num === index ? 'off' : el)),
      );
    }
  };

  // 마운트시 1회
  useEffect(() => {
    // 배송정보 DB업데이트 후 해당 회원의 전체 주문내역 가져오기
    const getOrderList = async () => {
      try {
        const tokenValue = await getToken();
        const getOrderListData = await axios.post(
          `${REACT_APP_KEY_BACK}/order_list/getMemberOrderList`,
          { token: tokenValue },
        );
        if (
          getOrderListData.status === 200 &&
          getOrderListData.data.length > 0
        ) {
          setOrderListArray(getOrderListData.data);
          setDetailInfo(new Array(getOrderListData.data.length).fill('off'));
          return;
        } else {
          return setEmptyOrderArray(true);
        }
      } catch (err: any) {
        navigate(
          `/error?errorMessage=${err.response.data}&errorCode=${err.response.status}`,
        );
        console.error(err);
      }
    };

    const getCancelList = async () => {
      try {
        const tokenValue = await getToken();
        const getCancelListData = await axios.post(
          `${REACT_APP_KEY_BACK}/order_list/getCancelList`,
          {
            token: tokenValue,
          },
        );
        if (
          getCancelListData.status === 200 &&
          getCancelListData.data.length > 0
        ) {
          setCancelListArray(getCancelListData.data);
          setDetailInfoCancel(
            new Array(getCancelListData.data.length).fill('off'),
          );
          return;
        } else {
          return setEmptyCancelArray(true);
        }
      } catch (err: any) {
        navigate(
          `/error?errorMessage=${err.response.data}&errorCode=${err.response.status}`,
        );
        console.error(err);
      }
    };

    getOrderList();
    getCancelList();
  }, []);

  return (
    <section className={orderList.orderList_container}>
      {
        // 조건1, 주문내역과 취소내역이 모두 데이터가 있을때
        (orderListArray !== null &&
          orderListArray.length > 0 &&
          cancelListArray !== null &&
          cancelListArray.length > 0) ||
        // 또는 조건2, 주문내역과 취소내역이 모두 데이터가 없을때
        (emptyOrderArray && emptyCancelArray) ||
        // 또는 조건3, 주문내역은 데이터가 있는데, 취소내역이 데이터가 없을때
        (orderListArray !== null &&
          orderListArray.length > 0 &&
          emptyCancelArray) ||
        // 또는 조건4, 주문내역은 데이터가 없는데, 취소내역이 데이터가 있을때
        (emptyOrderArray &&
          cancelListArray !== null &&
          cancelListArray.length > 0) ? (
          <>
            {/* 주문조회 (ORDER LIST) 제목 위치 */}
            <div className={orderList.titleArea}>
              <h5 className={orderList.subtitle}>ORDER LIST</h5>
            </div>

            <div className={orderList.order_info_wrap}>
              <div className={orderList.order_info_category}>
                <span
                  className={
                    page === 1
                      ? `${orderList.order_list_check} ${orderList.on}`
                      : orderList.order_list_check
                  }
                  onClick={() => setPage(1)}
                >
                  주문내역조회
                  <span>({orderListArray?.length})</span>
                </span>
                <span
                  className={
                    page === 2
                      ? `${orderList.order_list_check} ${orderList.on}`
                      : orderList.order_list_check
                  }
                  onClick={() => setPage(2)}
                >
                  취소내역
                  <span>
                    (
                    {cancelListArray?.reduce((acc, cur) => {
                      if (cur.isCancel) {
                        return acc + 1;
                      }
                      return acc;
                    }, 0)}
                    )
                  </span>
                </span>
              </div>
              {page === 1 ? (
                <>
                  {orderListArray?.map((el, index) => {
                    return (
                      <div
                        key={index}
                        className={orderList.orderlist_Check_wrap}
                      >
                        {/* 주문 조회 내역 */}
                        <p className={orderList.older_date}>
                          <strong>
                            {filterTimeDay(el.payments.approvedAt)}
                          </strong>{' '}
                          ({el.payments.orderId})
                        </p>
                        {el.products.map((pdInfo, index) => {
                          return (
                            <div
                              key={index}
                              className={orderList.older_image_info}
                            >
                              <PD_Images
                                onClick={() =>
                                  navigate(
                                    `/store/detail/${pdInfo.productCode}`,
                                  )
                                }
                                img={pdInfo.img}
                                className={orderList.older_image}
                              ></PD_Images>
                              <div className={orderList.pdnameprice}>
                                <p
                                  className={orderList.pdname}
                                  onClick={() =>
                                    navigate(
                                      `/store/detail/${pdInfo.productCode}`,
                                    )
                                  }
                                >
                                  {pdInfo.productName}
                                </p>
                                <p className={orderList.pdprice}>
                                  <strong style={{ fontSize: '15px' }}>
                                    {pdInfo.unitSumPrice.toLocaleString(
                                      'ko-KR',
                                    )}{' '}
                                  </strong>
                                  KRW /{' '}
                                  <strong style={{ fontSize: '15px' }}>
                                    {pdInfo.quantity.toLocaleString('ko-KR')}
                                  </strong>{' '}
                                  ea
                                </p>
                                <p className={orderList.pdprice}>
                                  SIZE{' '}
                                  <strong style={{ fontSize: '15px' }}>
                                    {pdInfo.size}
                                  </strong>
                                </p>
                              </div>
                            </div>
                          );
                        })}
                        <div
                          className={orderList.arrowWrap}
                          onClick={() => handleArrowDetail(index)}
                        >
                          <BsArrowDownCircle
                            className={
                              detailInfo[index] === 'on'
                                ? orderList.arrowDown
                                : orderList.arrowDown_on
                            }
                          />
                          <span>주문상세보기</span>
                        </div>
                        <div
                          className={
                            detailInfo[index] === 'on'
                              ? orderList.detailInfoWrap
                              : `${orderList.detailInfoWrap} ${orderList.off}`
                          }
                        >
                          <div className={orderList.line}></div>
                          <p className={orderList.cashTitle}>결제정보</p>
                          <div className={orderList.cashInfo}>
                            <p className={orderList.payments_date}>
                              주문일시: {dateSplit(el.payments.approvedAt)}
                            </p>
                            <p className={orderList.payments_status}>
                              결제여부:{' '}
                              {el.payments.status !== 'DONE' ? (
                                '결제전'
                              ) : el.payments.status === 'DONE' ? (
                                '결제완료'
                              ) : el.payments.status !== 'CANCELED' ? (
                                '결제취소'
                              ) : (
                                <></>
                              )}
                            </p>
                            <p className={orderList.payments_method}>
                              결제수단: {el.payments.method}
                            </p>
                            <p className={orderList.payments_discount}>
                              할인:{' '}
                              {!el.payments.discount
                                ? '0 ₩'
                                : `${Number(
                                    el.payments.discount,
                                  ).toLocaleString('ko-KR')} ₩`}
                            </p>
                            <p className={orderList.payments_totalAmount}>
                              결제금액:{' '}
                              {!el.payments.totalAmount
                                ? '0 ₩'
                                : `${el.payments.totalAmount.toLocaleString(
                                    'ko-KR',
                                  )} ₩`}
                            </p>
                          </div>
                          <div className={orderList.line}></div>

                          <p className={orderList.cashTitle}>주문정보</p>
                          <div className={orderList.cashInfo}>
                            <p className={orderList.userId}>
                              회원ID: {el.user}
                            </p>

                            <p className={orderList.recipient_Name}>
                              받는 분: {el.recipient.recipientName}
                            </p>

                            <p className={orderList.recipient_zipcode}>
                              배송우편번호: {el.recipient.recipientZipcode}
                            </p>

                            <p className={orderList.recipient_address}>
                              배송주소: {el.recipient.recipientAddress}{' '}
                              {el.recipient.recipientAddressDetail}
                            </p>

                            <p className={orderList.recipient_phone}>
                              연락처: {el.recipient.phoneCode} -{' '}
                              {el.recipient.phoneMidNum} -{' '}
                              {el.recipient.phoneLastNum}
                            </p>

                            <p className={orderList.recipient_message}>
                              배송메시지: {el.recipient.message}
                            </p>

                            <p className={orderList.shipping_code}>
                              송장번호: {el.shippingCode} (한진)
                            </p>
                          </div>
                          <div className={orderList.line}></div>
                        </div>
                        <div className={orderList.infoCancelContainer}>
                          <p className={orderList.older_detail_info}>
                            total ={' '}
                            <strong style={{ fontSize: '17px' }}>
                              {el.payments.totalAmount.toLocaleString('ko-KR')}{' '}
                            </strong>
                            KRW /{' '}
                            <strong style={{ fontSize: '17px' }}>
                              {el.products
                                .reduce((acc, cur) => acc + cur.quantity, 0)
                                .toLocaleString('ko-KR')}
                            </strong>{' '}
                            ea
                          </p>
                          <p className={orderList.status}>
                            {el.payments.status === 'DONE' &&
                            !el.isShipping &&
                            el.shippingCode === 0 &&
                            !el.isDelivered &&
                            !el.isCancel &&
                            !el.isReturn &&
                            !el.isRetrieved &&
                            !el.isRefund &&
                            !el.isReturnSubmit ? (
                              '입금완료 / '
                            ) : el.payments.status !== 'DONE' &&
                              !el.isShipping &&
                              el.shippingCode === 0 &&
                              !el.isDelivered &&
                              !el.isCancel &&
                              !el.isReturn &&
                              !el.isRetrieved &&
                              !el.isRefund &&
                              !el.isReturnSubmit ? (
                              '입금 전'
                            ) : (
                              <></>
                            )}

                            {el.payments.status === 'DONE' &&
                            !el.isShipping &&
                            el.shippingCode === 0 &&
                            !el.isDelivered &&
                            !el.isCancel &&
                            !el.isReturn &&
                            !el.isRetrieved &&
                            !el.isRefund &&
                            !el.isReturnSubmit ? (
                              '배송준비 중'
                            ) : el.payments.status === 'DONE' &&
                              el.isShipping &&
                              el.shippingCode !== 0 &&
                              !el.isDelivered &&
                              !el.isCancel &&
                              !el.isReturn &&
                              !el.isRetrieved &&
                              !el.isRefund &&
                              !el.isReturnSubmit ? (
                              '배송 중'
                            ) : el.payments.status === 'DONE' &&
                              !el.isShipping &&
                              el.shippingCode !== 0 &&
                              el.isDelivered &&
                              !el.isCancel &&
                              !el.isReturn &&
                              !el.isRetrieved &&
                              !el.isRefund &&
                              !el.isReturnSubmit ? (
                              '배송완료'
                            ) : el.payments.status === 'DONE' &&
                              !el.isShipping &&
                              el.shippingCode !== 0 &&
                              el.isDelivered &&
                              !el.isCancel &&
                              !el.isReturn &&
                              !el.isRetrieved &&
                              !el.isRefund &&
                              el.isReturnSubmit ? (
                              '반품신청 중'
                            ) : el.payments.status === 'DONE' &&
                              !el.isShipping &&
                              el.shippingCode !== 0 &&
                              el.isDelivered &&
                              !el.isCancel &&
                              !el.isReturn &&
                              !el.isRetrieved &&
                              el.isRefund &&
                              el.isReturnSubmit ? (
                              '환불진행'
                            ) : el.payments.status === 'DONE' &&
                              el.isShipping &&
                              el.shippingCode !== 0 &&
                              el.isDelivered &&
                              !el.isCancel &&
                              !el.isReturn &&
                              !el.isRetrieved &&
                              el.isRefund &&
                              el.isReturnSubmit ? (
                              '상품회수 중 (환불)'
                            ) : el.payments.status === 'DONE' &&
                              !el.isShipping &&
                              el.shippingCode !== 0 &&
                              !el.isDelivered &&
                              !el.isCancel &&
                              !el.isReturn &&
                              el.isRetrieved &&
                              el.isRefund &&
                              el.isReturnSubmit ? (
                              '상품회수 완료 (환불)'
                            ) : el.payments.status === 'DONE' &&
                              !el.isShipping &&
                              el.shippingCode !== 0 &&
                              el.isDelivered &&
                              !el.isCancel &&
                              el.isReturn &&
                              !el.isRetrieved &&
                              !el.isRefund &&
                              el.isReturnSubmit ? (
                              '교환진행'
                            ) : el.payments.status === 'DONE' &&
                              el.isShipping &&
                              el.shippingCode !== 0 &&
                              el.isDelivered &&
                              !el.isCancel &&
                              el.isReturn &&
                              !el.isRetrieved &&
                              !el.isRefund &&
                              el.isReturnSubmit ? (
                              '상품회수 중 (교환)'
                            ) : el.payments.status === 'DONE' &&
                              !el.isShipping &&
                              el.shippingCode !== 0 &&
                              !el.isDelivered &&
                              !el.isCancel &&
                              el.isReturn &&
                              el.isRetrieved &&
                              !el.isRefund &&
                              el.isReturnSubmit ? (
                              '상품회수 완료 (교환)'
                            ) : el.payments.status === 'DONE' &&
                              el.isShipping &&
                              el.shippingCode !== 0 &&
                              !el.isDelivered &&
                              !el.isCancel &&
                              el.isReturn &&
                              el.isRetrieved &&
                              !el.isRefund &&
                              el.isReturnSubmit ? (
                              '교환상품 배송 중'
                            ) : el.payments.status === 'DONE' &&
                              !el.isShipping &&
                              el.shippingCode !== 0 &&
                              el.isDelivered &&
                              !el.isCancel &&
                              el.isReturn &&
                              !el.isRetrieved &&
                              !el.isRefund &&
                              !el.isReturnSubmit ? (
                              '교환상품 배송완료'
                            ) : (
                              <></>
                            )}
                          </p>
                          <p className={orderList.shippingCode}>
                            {el.shippingCode === 0
                              ? null
                              : `송장번호: ${el.shippingCode} (한진)`}
                          </p>
                          {el.payments.status === 'DONE' &&
                          !el.isDelivered &&
                          el.shippingCode === 0 &&
                          !el.isReturn &&
                          !el.isShipping &&
                          !el.isReturnSubmit ? (
                            <BTN_white_nomal_comp
                              borderRadius="0"
                              padding="5px 10px"
                              fontSize="13px"
                              fontWeight="500"
                              activeBackgroundColor="#e2e2e2"
                              onClickEvent={() => {
                                if (isLogin) {
                                  navigate(
                                    `/mypage/orderlist/cancel/${el.payments.orderId}`,
                                  );
                                } else {
                                  alert('로그인이 필요한 서비스입니다.');
                                  return navigate(`/login`);
                                }
                              }}
                            >
                              주문취소
                            </BTN_white_nomal_comp>
                          ) : timeCheck(el) === true &&
                            el.payments.status === 'DONE' &&
                            !el.isShipping &&
                            el.shippingCode !== 0 &&
                            el.isDelivered &&
                            !el.isCancel &&
                            !el.isReturn &&
                            !el.isRetrieved &&
                            !el.isRefund &&
                            !el.isReturnSubmit ? (
                            <BTN_white_nomal_comp
                              borderRadius="0"
                              padding="5px 10px"
                              fontSize="13px"
                              fontWeight="500"
                              activeBackgroundColor="#e2e2e2"
                              onClickEvent={() => {
                                if (isLogin) {
                                  navigate(
                                    `/mypage/orderlist/return/${el.payments.orderId}`,
                                  );
                                } else {
                                  alert('로그인이 필요한 서비스입니다.');
                                  return navigate(`/login`);
                                }
                              }}
                            >
                              반품신청
                            </BTN_white_nomal_comp>
                          ) : (el.payments.status === 'DONE' &&
                              !el.isShipping &&
                              el.shippingCode !== 0 &&
                              el.isDelivered &&
                              !el.isCancel &&
                              !el.isReturn &&
                              !el.isRetrieved &&
                              !el.isRefund &&
                              el.isReturnSubmit) ||
                            (el.payments.status === 'DONE' &&
                              !el.isShipping &&
                              el.shippingCode !== 0 &&
                              el.isDelivered &&
                              !el.isCancel &&
                              el.isReturn &&
                              !el.isRetrieved &&
                              !el.isRefund &&
                              el.isReturnSubmit) ||
                            (el.payments.status === 'DONE' &&
                              el.isShipping &&
                              el.shippingCode !== 0 &&
                              el.isDelivered &&
                              !el.isCancel &&
                              el.isReturn &&
                              !el.isRetrieved &&
                              !el.isRefund &&
                              el.isReturnSubmit) ||
                            (el.payments.status === 'DONE' &&
                              !el.isShipping &&
                              el.shippingCode !== 0 &&
                              !el.isDelivered &&
                              !el.isCancel &&
                              el.isReturn &&
                              el.isRetrieved &&
                              !el.isRefund &&
                              el.isReturnSubmit) ||
                            (el.payments.status === 'DONE' &&
                              el.isShipping &&
                              el.shippingCode !== 0 &&
                              !el.isDelivered &&
                              !el.isCancel &&
                              el.isReturn &&
                              el.isRetrieved &&
                              !el.isRefund &&
                              el.isReturnSubmit) ||
                            (el.payments.status === 'DONE' &&
                              !el.isShipping &&
                              el.shippingCode !== 0 &&
                              el.isDelivered &&
                              !el.isCancel &&
                              !el.isReturn &&
                              !el.isRetrieved &&
                              el.isRefund &&
                              el.isReturnSubmit) ||
                            (el.payments.status === 'DONE' &&
                              el.isShipping &&
                              el.shippingCode !== 0 &&
                              el.isDelivered &&
                              !el.isCancel &&
                              !el.isReturn &&
                              !el.isRetrieved &&
                              el.isRefund &&
                              el.isReturnSubmit) ||
                            (el.payments.status === 'DONE' &&
                              !el.isShipping &&
                              el.shippingCode !== 0 &&
                              !el.isDelivered &&
                              !el.isCancel &&
                              !el.isReturn &&
                              el.isRetrieved &&
                              el.isRefund &&
                              el.isReturnSubmit) ? (
                            <BTN_white_nomal_comp
                              borderRadius="0"
                              padding="5px 10px"
                              fontSize="13px"
                              fontWeight="500"
                              activeBackgroundColor="#e2e2e2"
                              onClickEvent={() => {
                                if (isLogin) {
                                  navigate(
                                    `/mypage/orderlist/return_check/${el.payments.orderId}`,
                                  );
                                } else {
                                  alert('로그인이 필요한 서비스입니다.');
                                  return navigate(`/login`);
                                }
                              }}
                            >
                              반품신청내역 확인
                            </BTN_white_nomal_comp>
                          ) : el.payments.status !== 'DONE' &&
                            !el.isDelivered &&
                            el.shippingCode === 0 &&
                            !el.isReturn &&
                            !el.isShipping &&
                            !el.isReturnSubmit ? (
                            <BTN_white_nomal_comp
                              borderRadius="0"
                              padding="5px 10px"
                              fontSize="13px"
                              fontWeight="500"
                              activeBackgroundColor="#e2e2e2"
                              onClickEvent={() => {
                                if (isLogin) {
                                  navigate(
                                    `/mypage/orderlist/cancel_onlyOrder/${el.payments.orderId}`,
                                  );
                                } else {
                                  alert('로그인이 필요한 서비스입니다.');
                                  return navigate(`/login`);
                                }
                              }}
                            >
                              주문취소
                            </BTN_white_nomal_comp>
                          ) : el.payments.status === 'DONE' &&
                            !el.isShipping &&
                            el.shippingCode !== 0 &&
                            el.isDelivered &&
                            !el.isCancel &&
                            el.isReturn &&
                            !el.isRetrieved &&
                            !el.isRefund &&
                            !el.isReturnSubmit ? (
                            <>
                              <BTN_white_nomal_comp
                                borderRadius="0"
                                padding="5px 10px"
                                fontSize="13px"
                                fontWeight="500"
                                activeBackgroundColor="#e2e2e2"
                                onClickEvent={() => {
                                  if (isLogin) {
                                    navigate(
                                      `/mypage/orderlist/return_check/${el.payments.orderId}`,
                                    );
                                  } else {
                                    alert('로그인이 필요한 서비스입니다.');
                                    return navigate(`/login`);
                                  }
                                }}
                              >
                                반품신청내역 확인
                              </BTN_white_nomal_comp>
                            </>
                          ) : (
                            <></>
                          )}

                          <p className={orderList.orderCancelInfo}>
                            * 주문취소는 배송상태가 &#39;배송준비중&#39;일
                            경우에 가능합니다.
                          </p>
                          <p className={orderList.orderCancelInfo2}>
                            * &#39;배송중&#39;일 경우 &#39;배송완료&#39; 후
                            &#39;반품신청&#39;을 이용해주세요.
                          </p>
                          <p className={orderList.orderCancelInfo2}>
                            * &#39;교환진행 중&#39;일 경우 배송 전이며, 교환상품
                            발송시 &#39;배송 중&#39;으로 진행됩니다.
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </>
              ) : page === 2 ? (
                <>
                  {cancelListArray?.map((el, index) => {
                    if (el.isCancel)
                      return (
                        <div
                          key={index}
                          className={orderList.orderlist_Check_wrap}
                        >
                          {/* 주문 조회 내역 */}
                          <p className={orderList.older_date}>
                            취소날짜:{' '}
                            <strong>
                              {filterTimeDay(el.cancels.canceledAt)}
                            </strong>{' '}
                            ({el.payments.orderId})
                          </p>
                          {el.products.map((pdInfo, index) => {
                            return (
                              <div
                                key={index}
                                className={orderList.older_image_info}
                              >
                                <PD_Images
                                  onClick={() =>
                                    navigate(
                                      `/store/detail/${pdInfo.productCode}`,
                                    )
                                  }
                                  img={pdInfo.img}
                                  className={orderList.older_image}
                                ></PD_Images>
                                <div className={orderList.pdnameprice}>
                                  <p
                                    className={orderList.pdname}
                                    onClick={() =>
                                      navigate(
                                        `/store/detail/${pdInfo.productCode}`,
                                      )
                                    }
                                  >
                                    {pdInfo.productName}
                                  </p>
                                  <p className={orderList.pdprice}>
                                    <strong style={{ fontSize: '15px' }}>
                                      {pdInfo.unitSumPrice.toLocaleString(
                                        'ko-KR',
                                      )}{' '}
                                    </strong>
                                    KRW /{' '}
                                    <strong style={{ fontSize: '15px' }}>
                                      {pdInfo.quantity.toLocaleString('ko-KR')}
                                    </strong>{' '}
                                    ea
                                  </p>
                                  <p className={orderList.pdprice}>
                                    SIZE{' '}
                                    <strong style={{ fontSize: '15px' }}>
                                      {pdInfo.size}
                                    </strong>
                                  </p>
                                </div>
                              </div>
                            );
                          })}

                          <div
                            className={orderList.arrowWrap}
                            onClick={() => handleArrowDetailCancel(index)}
                          >
                            <BsArrowDownCircle
                              className={
                                detailInfoCancel[index] === 'on'
                                  ? orderList.arrowDown
                                  : orderList.arrowDown_on
                              }
                            />
                            <span>주문상세보기</span>
                          </div>
                          <div
                            className={
                              detailInfoCancel[index] === 'on'
                                ? orderList.detailInfoWrap
                                : `${orderList.detailInfoWrap} ${orderList.off}`
                            }
                          >
                            <div className={orderList.line}></div>
                            <p className={orderList.cashTitle}>결제정보</p>
                            <div className={orderList.cashInfo}>
                              <p className={orderList.payments_status}>
                                결제여부:{' '}
                                {el.payments.status !== 'DONE' &&
                                el.payments.status !== 'CANCELED' ? (
                                  '결제전'
                                ) : el.payments.status === 'DONE' ? (
                                  '결제완료'
                                ) : el.payments.status === 'CANCELED' ? (
                                  '결제취소'
                                ) : (
                                  <></>
                                )}
                              </p>
                              <p className={orderList.payments_date}>
                                취소일시: {dateSplit(el.cancels.canceledAt)}
                              </p>

                              <p className={orderList.payments_method}>
                                결제수단: {el.payments.method}
                              </p>
                              <p className={orderList.payments_discount}>
                                할인:{' '}
                                {!el.payments.discount
                                  ? '0 ₩'
                                  : `${Number(
                                      el.payments.discount,
                                    ).toLocaleString('ko-KR')} ₩`}
                              </p>
                              <p className={orderList.payments_totalAmount}>
                                취소금액:{' '}
                                {!el.cancels.cancelAmount
                                  ? '0 ₩'
                                  : `${el.cancels.cancelAmount.toLocaleString(
                                      'ko-KR',
                                    )} ₩`}
                              </p>
                              <p className={orderList.payments_totalAmount}>
                                취소이유: {el.cancels.cancelReason}
                              </p>
                            </div>
                            <div className={orderList.line}></div>

                            <p className={orderList.cashTitle}>주문정보</p>
                            <div className={orderList.cashInfo}>
                              <p className={orderList.userId}>
                                회원ID: {el.user}
                              </p>

                              <p className={orderList.recipient_Name}>
                                받는 분: {el.recipient.recipientName}
                              </p>

                              <p className={orderList.recipient_zipcode}>
                                배송우편번호: {el.recipient.recipientZipcode}
                              </p>

                              <p className={orderList.recipient_address}>
                                배송주소: {el.recipient.recipientAddress}{' '}
                                {el.recipient.recipientAddressDetail}
                              </p>

                              <p className={orderList.recipient_phone}>
                                연락처: {el.recipient.phoneCode} -{' '}
                                {el.recipient.phoneMidNum} -{' '}
                                {el.recipient.phoneLastNum}
                              </p>

                              <p className={orderList.recipient_message}>
                                배송메시지: {el.recipient.message}
                              </p>

                              <p className={orderList.shipping_code}>
                                송장번호: {el.shippingCode} (한진)
                              </p>
                            </div>
                            <div className={orderList.line}></div>
                          </div>

                          <div className={orderList.infoCancelContainer}>
                            <p className={orderList.older_detail_info}>
                              total ={' '}
                              <strong style={{ fontSize: '17px' }}>
                                {el.payments.totalAmount.toLocaleString(
                                  'kr-KR',
                                )}{' '}
                              </strong>
                              KRW /{' '}
                              <strong style={{ fontSize: '17px' }}>
                                {el.products
                                  .reduce((acc, cur) => acc + cur.quantity, 0)
                                  .toLocaleString('ko-KR')}
                              </strong>{' '}
                              ea
                            </p>
                            <p style={{ fontSize: '15px' }}>
                              취소사유: {el.cancels.cancelReason}
                            </p>
                            <p className={orderList.status}>
                              {el.payments.status === 'CANCELED' &&
                                !el.isOrdered &&
                                !el.isShipping &&
                                !el.isDelivered &&
                                el.isCancel &&
                                !el.isReturn &&
                                !el.isRetrieved &&
                                !el.isRefund &&
                                !el.isReturnSubmit &&
                                '취소완료'}
                              {el.payments.status === 'CANCELED' &&
                                !el.isOrdered &&
                                !el.isShipping &&
                                !el.isDelivered &&
                                el.isCancel &&
                                !el.isReturn &&
                                el.isRetrieved &&
                                el.isRefund &&
                                el.isReturnSubmit &&
                                '환불완료'}
                            </p>
                            {el.payments.status === 'CANCELED' &&
                              !el.isOrdered &&
                              !el.isShipping &&
                              !el.isDelivered &&
                              el.isCancel &&
                              !el.isReturn &&
                              el.isRetrieved &&
                              el.isRefund &&
                              el.isReturnSubmit && (
                                <BTN_white_nomal_comp
                                  borderRadius="0"
                                  padding="5px 10px"
                                  fontSize="13px"
                                  fontWeight="500"
                                  activeBackgroundColor="#e2e2e2"
                                  onClickEvent={() => {
                                    if (isLogin) {
                                      navigate(
                                        `/mypage/orderlist/return_check/${el.payments.orderId}`,
                                      );
                                    } else {
                                      alert('로그인이 필요한 서비스입니다.');
                                      return navigate(`/login`);
                                    }
                                  }}
                                >
                                  반품신청내역 확인
                                </BTN_white_nomal_comp>
                              )}

                            <p className={orderList.orderCancelInfo}></p>
                          </div>
                        </div>
                      );
                  })}
                </>
              ) : (
                <></>
              )}
            </div>
          </>
        ) : (
          <Loading />
        )
      }
    </section>
  );
}
