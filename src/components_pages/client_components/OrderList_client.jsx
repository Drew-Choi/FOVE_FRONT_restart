import React, { useEffect, useState } from 'react';
import orderList from '../../styles/orderlist_client.module.scss';
import axios from 'axios';
import getToken from '../../store/modules/getToken';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Loading from './Loading';

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
                  <span>({cancelListArray.length})</span>
                </span>
                <span
                  className={
                    page === 3
                      ? `${orderList.order_list_check} ${orderList.on}`
                      : orderList.order_list_check
                  }
                  onClick={() => setPage((cur) => 3)}
                >
                  교환내역
                  <span>({cancelListArray.length})</span>
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
                            {el.payments.status === 'DONE'
                              ? '입금완료'
                              : '입금전'}{' '}
                            /{' '}
                            {el.shippingCode === 0
                              ? '배송준비중'
                              : el.isShipping && el.isDelivered
                              ? '배송완료'
                              : '배송중'}
                          </p>
                          <p className={orderList.shippingCode}>
                            {el.shippingCode === 0
                              ? null
                              : `송장번호: ${el.shippingCode} (한진)`}
                          </p>
                          {el.shippingCode === 0 ? (
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
                            el.isOrdered &&
                            el.isShipping &&
                            !el.isDelivered ? (
                            <>
                              <button className={orderList.orderCancle}>
                                반품신청
                              </button>
                            </>
                          ) : (
                            <p style={{ fontSize: '15px', fontWeight: '600' }}>
                              배송완료
                            </p>
                          )}

                          <p className={orderList.orderCancelInfo}>
                            * 주문취소는 배송상태가 &#39;배송준비중&#39;일
                            경우에 가능합니다.
                          </p>
                          <p className={orderList.orderCancelInfo2}>
                            * &#39;배송중&#39;일 경우 &#39;배송완료&#39; 후
                            &#39;반품신청&#39;을 이용해주세요.
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </>
              ) : page === 2 ? (
                <>
                  {cancelListArray.map((el, index) => {
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
                            el.isCancel ? (
                              '취소완료'
                            ) : (
                              <></>
                            )}
                          </p>
                          <p className={orderList.orderCancelInfo}></p>
                        </div>
                      </div>
                    );
                  })}
                </>
              ) : (
                <div>교환내역 따로 만들거임</div>
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
