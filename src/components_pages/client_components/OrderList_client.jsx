import React, { useEffect, useState } from 'react';
import orderList from '../../styles/orderlist_client.module.scss';
import axios from 'axios';
import getToken from '../../store/modules/getToken';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Loading from './Loading';
import { BsArrowDownCircle } from 'react-icons/bs';

const PD_Images = styled.div`
  ${(props) =>
    props.img &&
    `background-image: url('http://localhost:4000/uploads/${props.img}')`}
`;

export default function OrderList_client() {
  const [orderListArray, setOrderListArray] = useState([]);
  const [emptyOrderArray, setEmptyOrderArray] = useState(false);
  const [cancelListArray, setCancelListArray] = useState([]);
  const [emptyCancelArray, setEmptyCancelArray] = useState(false);
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  // 주문상세내역서용 - order
  const [detailInfo, setDetailInfo] = useState([]);
  // 주문상세내역서용 - cancel
  const [detailInfoCancel, setDetailInfoCancel] = useState([]);

  // 주문상세내역서용 핸들 - order
  const handleArrowDetail = (index) => {
    if (detailInfo[index] === 'off') {
      setDetailInfo((cur) => cur.map((el, num) => (num === index ? 'on' : el)));
    } else {
      setDetailInfo((cur) =>
        cur.map((el, num) => (num === index ? 'off' : el)),
      );
    }
  };

  // 주문상세내역서용 핸들 - cancel
  const handleArrowDetailCancel = (index) => {
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

  //날짜 분활
  const dateSplit = (date) => {
    const splitData = date.split(/[T+]/);
    const dataSum = `${splitData[0]}  /  ${splitData[1]}`;
    return dataSum;
  };

  // 배송정보 DB업데이트 후 해당 회원의 전체 주문내역 가져오기
  const getOrderList = async () => {
    try {
      const tokenValue = await getToken();
      const getOrderListData = await axios.post(
        'http://localhost:4000/order_list/getMemberOrderList',
        { token: tokenValue },
      );
      if (getOrderListData.status === 200 && getOrderListData.data.length > 0) {
        setOrderListArray((cur) => getOrderListData.data);
        setDetailInfo((cur) =>
          new Array(getOrderListData.data.length).fill('off'),
        );
        return;
      } else {
        return setEmptyOrderArray((cur) => true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getCancelList = async () => {
    try {
      const tokenValue = await getToken();
      const getCancelListData = await axios.post(
        'http://localhost:4000/order_list/getCancelList',
        {
          token: tokenValue,
        },
      );
      if (
        getCancelListData.status === 200 &&
        getCancelListData.data.length > 0
      ) {
        setCancelListArray((cur) => getCancelListData.data);
        setDetailInfoCancel((cur) =>
          new Array(getCancelListData.data.length).fill('off'),
        );
        return;
      } else {
        return setEmptyCancelArray((cur) => true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 마운트시 1회
  useEffect(() => {
    getOrderList();
    getCancelList();
  }, []);

  // 필요한 날짜만 추리기
  const filterTimeDay = (time) => {
    const position = time.indexOf('T');
    const day = time.slice(0, position);

    return day;
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

  return (
    <section className={orderList.orderList_container}>
      {
        // 조건1, 주문내역과 취소내역이 모두 데이터가 있을때
        (orderListArray !== [] &&
          orderListArray.length > 0 &&
          cancelListArray !== [] &&
          cancelListArray.length > 0) ||
        // 또는 조건2, 주문내역과 취소내역이 모두 데이터가 없을때
        (emptyOrderArray && emptyCancelArray) ||
        // 또는 조건3, 주문내역은 데이터가 있는데, 취소내역이 데이터가 없을때
        (orderListArray !== [] &&
          orderListArray.length > 0 &&
          emptyCancelArray) ||
        // 또는 조건4, 주문내역은 데이터가 없는데, 취소내역이 데이터가 있을때
        (emptyOrderArray &&
          cancelListArray !== [] &&
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
                  onClick={() => setPage((cur) => 1)}
                >
                  주문내역조회
                  <span>({orderListArray.length})</span>
                </span>
                <span
                  className={
                    page === 2
                      ? `${orderList.order_list_check} ${orderList.on}`
                      : orderList.order_list_check
                  }
                  onClick={() => setPage((cur) => 2)}
                >
                  취소내역
                  <span>
                    (
                    {cancelListArray.reduce((acc, cur) => {
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
                  {orderListArray.map((el, index) => {
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
                                    {frontPriceComma(pdInfo.unitSumPrice)}{' '}
                                  </strong>
                                  KRW /{' '}
                                  <strong style={{ fontSize: '15px' }}>
                                    {frontPriceComma(pdInfo.quantity)}
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
                                : `${frontPriceComma(el.payments.discount)} ₩`}
                            </p>
                            <p className={orderList.payments_totalAmount}>
                              결제금액:{' '}
                              {!el.payments.totalAmount
                                ? '0 ₩'
                                : `${frontPriceComma(
                                    el.payments.totalAmount,
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
                              {frontPriceComma(el.payments.totalAmount)}{' '}
                            </strong>
                            KRW /{' '}
                            <strong style={{ fontSize: '17px' }}>
                              {frontPriceComma(
                                el.products.reduce(
                                  (acc, cur) => acc + cur.quantity,
                                  0,
                                ),
                              )}
                            </strong>{' '}
                            ea
                          </p>
                          <p className={orderList.status}>
                            {el.payments.status === 'DONE' &&
                            !el.isReturnSubmit &&
                            !el.isReturn ? (
                              '입금완료 / '
                            ) : el.payments.status !== 'DONE' &&
                              !el.isReturnSubmit &&
                              !el.isShipping &&
                              !el.isCancel &&
                              !el.isReturn &&
                              !el.isDelivered &&
                              el.shippingCode === 0 ? (
                              '입금 전 / '
                            ) : (
                              <></>
                            )}

                            {el.shippingCode === 0 &&
                            !el.isReturn &&
                            !el.isShipping &&
                            !el.isDelivered &&
                            !el.isReturnSubmite ? (
                              '배송준비중'
                            ) : el.shippingCode !== 0 &&
                              el.isShipping &&
                              !el.isDelivered &&
                              !el.isReturn &&
                              !el.isReturnSubmit ? (
                              '배송중'
                            ) : el.shippingCode !== 0 &&
                              !el.isShipping &&
                              el.isDelivered &&
                              !el.isReturn &&
                              !el.isReturnSubmit ? (
                              '배송완료'
                            ) : el.shippingCode !== 0 &&
                              !el.isShipping &&
                              el.isDelivered &&
                              !el.isReturn &&
                              el.isReturnSubmit ? (
                              '반품신청완료'
                            ) : el.shippingCode !== 0 &&
                              !el.isShipping &&
                              !el.isDelivered &&
                              el.isReturn &&
                              !el.isReturnSubmit ? (
                              '교환진행 중'
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
                            <button
                              className={orderList.orderCancle}
                              onClick={() => {
                                navigate(
                                  `/mypage/orderlist/cancel/${el.payments.orderId}`,
                                );
                              }}
                            >
                              주문취소
                            </button>
                          ) : el.shippingCode !== 0 &&
                            !el.isShipping &&
                            el.isDelivered &&
                            !el.isReturn &&
                            !el.isReturnSubmit ? (
                            <button
                              className={orderList.orderCancle}
                              onClick={() => {
                                navigate(
                                  `/mypage/orderlist/return/${el.payments.orderId}`,
                                );
                              }}
                            >
                              반품신청
                            </button>
                          ) : (el.shippingCode !== 0 &&
                              !el.isShipping &&
                              !el.isReturn &&
                              el.isDelivered &&
                              el.isReturnSubmit) ||
                            (el.shippingCode !== 0 &&
                              !el.isShipping &&
                              el.isReturn &&
                              !el.isDelivered &&
                              !el.isReturnSubmit) ? (
                            <button
                              className={orderList.orderCancle}
                              onClick={() => {
                                navigate(
                                  `/mypage/orderlist/return_check/${el.payments.orderId}`,
                                );
                              }}
                            >
                              반품신청내역 확인
                            </button>
                          ) : el.payments.status !== 'DONE' &&
                            !el.isDelivered &&
                            el.shippingCode === 0 &&
                            !el.isReturn &&
                            !el.isShipping &&
                            !el.isReturnSubmit ? (
                            <button
                              className={orderList.orderCancle}
                              onClick={() => {
                                navigate(
                                  `/mypage/orderlist/cancel_onlyOrder/${el.payments.orderId}`,
                                );
                              }}
                            >
                              주문취소
                            </button>
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
                  {cancelListArray.map((el, index) => {
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
                                      {frontPriceComma(pdInfo.unitSumPrice)}{' '}
                                    </strong>
                                    KRW /{' '}
                                    <strong style={{ fontSize: '15px' }}>
                                      {frontPriceComma(pdInfo.quantity)}
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
                                  : `${frontPriceComma(
                                      el.payments.discount,
                                    )} ₩`}
                              </p>
                              <p className={orderList.payments_totalAmount}>
                                취소금액:{' '}
                                {!el.cancels.cancelAmount
                                  ? '0 ₩'
                                  : `${frontPriceComma(
                                      el.cancels.cancelAmount,
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
                                {frontPriceComma(el.payments.totalAmount)}{' '}
                              </strong>
                              KRW /{' '}
                              <strong style={{ fontSize: '17px' }}>
                                {frontPriceComma(
                                  el.products.reduce(
                                    (acc, cur) => acc + cur.quantity,
                                    0,
                                  ),
                                )}
                              </strong>{' '}
                              ea
                            </p>
                            <p style={{ fontSize: '15px' }}>
                              취소사유: {el.cancels.cancelReason}
                            </p>
                            <p className={orderList.status}>
                              {el.payments.status === 'CANCELED' &&
                                el.isCancel &&
                                !el.isReturn &&
                                '취소완료'}
                              {el.payments.status === 'CANCELED' &&
                                el.isCancel &&
                                el.isReturn &&
                                '환불완료'}
                            </p>
                            {el.payments.status === 'CANCELED' &&
                              el.isReturn &&
                              el.isCancel && (
                                <button
                                  className={orderList.orderCancle}
                                  onClick={() => {
                                    navigate(
                                      `/mypage/orderlist/return_check/${el.payments.orderId}`,
                                    );
                                  }}
                                >
                                  반품신청내역 확인
                                </button>
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
