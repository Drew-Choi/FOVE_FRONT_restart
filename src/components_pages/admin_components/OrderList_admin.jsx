/* eslint-disable no-undef */
import React, { useEffect, useRef, useState } from 'react';
import admin_orderList from '../../styles/orderList_Admin.module.scss';
import axios from 'axios';
import LoadingAdmin from '../client_components/LoadingAdmin';
import { useNavigate } from 'react-router-dom';
import MediaQuery from 'react-responsive';
import { useDispatch, useSelector } from 'react-redux';
import { orderFilter } from '../../store/modules/admin_orderList';

export default function OrderList_admin() {
  const [orderData, setOrderData] = useState(null);
  const [cancelData, setCancelData] = useState(null);
  const [selector, setSelector] = useState('order');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { REACT_APP_KEY_BACK } = process.env;

  // 필터용 함수 및 상태보관 ----------------------------
  // 필터용 셀렉트 - 주문내역
  const filterSelect = useSelector(
    (state) => state.admin_orderList.orderFilterValue,
  );
  const handleFilterSelect = (e) => {
    dispatch(orderFilter(e.target.value));
  };

  // 필터함수 - 주문내역-반품신청내역
  const filterSubmitReturnIndex = (data) => {
    const filterData = data.filter(
      (el) =>
        el.payments.status === 'DONE' &&
        el.isOrdered &&
        !el.isShipping &&
        el.shippingCode !== 0 &&
        el.isDelivered &&
        !el.isCancel &&
        !el.isReturn &&
        !el.isRetrieved &&
        !el.isRefund &&
        el.isReturnSubmit,
    );
    return filterData;
  };

  // 필터함수 - 주문내역-최종환불내역
  const filterFinalRefundIndex = (data) => {
    const filterData = data.filter(
      (el) =>
        el.payments.status === 'DONE' &&
        el.isOrdered &&
        !el.isShipping &&
        el.shippingCode !== 0 &&
        !el.isDelivered &&
        !el.isCancel &&
        !el.isReturn &&
        el.isRetrieved &&
        el.isRefund &&
        el.isReturnSubmit,
    );
    return filterData;
  };

  const getOrderListInfo = async () => {
    try {
      const adminOrderListInfo = await axios.get(
        `${REACT_APP_KEY_BACK}/admin/orderlist`,
      );

      if (adminOrderListInfo.status !== 200) return alert('데이터 오류');
      // status 200이면,
      setOrderData((cur) => adminOrderListInfo.data);
      return;
    } catch (err) {
      console.error(err);
      return;
    }
  };

  const getCancelList = async () => {
    try {
      const adminCancelInfo = await axios.get(
        `${REACT_APP_KEY_BACK}/admin/cancel_list`,
      );

      if (adminCancelInfo.status !== 200) return alert('데이터 오류');
      // status 200이면,
      setCancelData((cur) => adminCancelInfo.data);
      return;
    } catch (err) {
      console.error(err);
      return;
    }
  };

  useEffect(() => {
    getOrderListInfo();
    getCancelList();
  }, []);

  // 핸들모음
  const handleSelector = () => {
    if (selector === 'order') {
      setSelector((cur) => 'cancel');
    } else {
      setSelector((cur) => 'order');
    }
  };

  // 랜더링 부분
  return (
    <div className={admin_orderList.whol_Container}>
      <p className={admin_orderList.mainTitle}>
        ORDER INDEX &nbsp;{' '}
        <span style={{ fontSize: '15px', fontWeight: '400' }}>Admin</span>
      </p>

      {orderData === null || cancelData === null ? (
        <LoadingAdmin />
      ) : selector === 'order' ? (
        <>
          <div className={admin_orderList.subMenu}>
            <p className={admin_orderList.selector}>
              <span
                className={
                  selector === 'order'
                    ? admin_orderList.selector_order_on
                    : admin_orderList.selector_order
                }
                onClick={handleSelector}
              >
                주문내역
              </span>
              &nbsp;&nbsp;/&nbsp;&nbsp;
              <span
                className={
                  selector === 'cancel'
                    ? admin_orderList.selector_cancel_on
                    : admin_orderList.selector_cancel
                }
                onClick={handleSelector}
              >
                취소내역
              </span>
            </p>
            <p className={admin_orderList.totalOrderCount}>
              Total :{' '}
              {selector === 'order' && orderData !== null && cancelData !== null
                ? orderData.length
                : cancelData.length}
            </p>
          </div>
          <div className={admin_orderList.filter}>
            <select
              className={admin_orderList.filter_select}
              name="orderList_index"
              defaultValue={filterSelect}
              onChange={(e) => handleFilterSelect(e)}
            >
              <option value="allIndex">전체내역</option>
              <option value="submitReturnIndex">반품신청내역</option>
              <option value="finalRefundIndex">최종환불내역</option>
            </select>
          </div>
          <ul className={admin_orderList.list_ul_wrap}>
            <li className={admin_orderList.listHeader}>
              <MediaQuery minWidth={491}>
                <p>No.</p>
              </MediaQuery>
              <MediaQuery maxWidth={490}>
                <p>#</p>
              </MediaQuery>
              <p>OrderID</p>
              <p>OrderName</p>
              <p>User</p>
              <MediaQuery minWidth={281}>
                <p>Recipient</p>
              </MediaQuery>
              <MediaQuery maxWidth={280}>
                <p>Recip</p>
              </MediaQuery>
              <p>Status</p>
            </li>
            {(filterSelect === 'allIndex'
              ? orderData
              : filterSelect === 'submitReturnIndex'
              ? filterSubmitReturnIndex(orderData)
              : filterSelect === 'finalRefundIndex'
              ? filterFinalRefundIndex(orderData)
              : []
            ).map((el, index) => {
              return (
                <li
                  className={admin_orderList.list_li}
                  key={index}
                  onClick={() =>
                    navigate(`/admin/orderlist/detail/${el.payments.orderId}`)
                  }
                >
                  <p>{index}</p>
                  <p>{el.payments.orderId}</p>
                  <p>{el.payments.orderName}</p>
                  <p>{el.user}</p>
                  <p>{el.recipient.recipientName}</p>
                  <p>
                    {el.payments.status !== 'DONE' &&
                    !el.isShipping &&
                    el.shippingCode === 0 &&
                    !el.isDelivered &&
                    !el.isCancel &&
                    !el.isReturn &&
                    !el.isRetrieved &&
                    !el.isRefund &&
                    !el.isReturnSubmit ? (
                      '결제 전'
                    ) : el.payments.status === 'DONE' &&
                      !el.isShipping &&
                      el.shippingCode === 0 &&
                      !el.isDelivered &&
                      !el.isCancel &&
                      !el.isReturn &&
                      !el.isRetrieved &&
                      !el.isRefund &&
                      !el.isReturnSubmit ? (
                      '결제완료 (배송 전)'
                    ) : el.payments.status === 'DONE' &&
                      el.isShipping &&
                      el.shippingCode !== 0 &&
                      !el.isDelivered &&
                      !el.isCancel &&
                      !el.isReturn &&
                      !el.isRetrieved &&
                      !el.isRefund &&
                      !el.isReturnSubmit ? (
                      '배송중'
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
                      el.isReturn &&
                      !el.isRetrieved &&
                      !el.isRefund &&
                      el.isReturnSubmit ? (
                      '교환진행 신청'
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
                      '교환상품 배송 완료'
                    ) : el.payments.status === 'DONE' &&
                      !el.isShipping &&
                      el.shippingCode !== 0 &&
                      el.isDelivered &&
                      !el.isCancel &&
                      !el.isReturn &&
                      !el.isRetrieved &&
                      el.isRefund &&
                      el.isReturnSubmit ? (
                      '환불진행 신청'
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
                    ) : (
                      <></>
                    )}
                  </p>
                </li>
              );
            })}
          </ul>
        </>
      ) : (
        <>
          <div className={admin_orderList.subMenu}>
            <p className={admin_orderList.selector}>
              <span
                className={
                  selector === 'order'
                    ? admin_orderList.selector_order_on
                    : admin_orderList.selector_order
                }
                onClick={handleSelector}
              >
                주문내역
              </span>
              &nbsp;&nbsp;/&nbsp;&nbsp;
              <span
                className={
                  selector === 'cancel'
                    ? admin_orderList.selector_cancel_on
                    : admin_orderList.selector_cancel
                }
                onClick={handleSelector}
              >
                취소내역
              </span>
            </p>
            <p className={admin_orderList.totalOrderCount}>
              Total :{' '}
              {selector === 'order' && orderData !== null && cancelData !== null
                ? orderData.length
                : cancelData.length}
            </p>
          </div>
          <ul className={admin_orderList.list_ul_wrap_Cancel}>
            <li className={admin_orderList.listHeader_cancel}>
              <MediaQuery minWidth={491}>
                <p>No.</p>
              </MediaQuery>
              <MediaQuery maxWidth={490}>
                <p>#</p>
              </MediaQuery>
              <p>OrderID</p>
              <p>OrderName</p>
              <p>User</p>
              <MediaQuery minWidth={1051}>
                <p>Recipient</p>
              </MediaQuery>
              <MediaQuery maxWidth={1050} minWidth={281}>
                <p>Recip</p>
              </MediaQuery>
              <MediaQuery maxWidth={280}>
                <p>Reci</p>
              </MediaQuery>
              <p>Status</p>
            </li>
            {cancelData.map((el, index) => {
              return (
                <li
                  className={admin_orderList.list_li}
                  key={index}
                  onClick={() =>
                    navigate(`/admin/orderlist/detail/${el.payments.orderId}`)
                  }
                >
                  <p>{index}</p>
                  <p>{el.payments.orderId}</p>
                  <p>{el.payments.orderName}</p>
                  <p>{el.user}</p>
                  <p>
                    {el.payments.status === 'CANCELED' &&
                    !el.isOrdered &&
                    !el.isShipping &&
                    el.shippingCode !== 0 &&
                    !el.isDelivered &&
                    el.isCancel &&
                    !el.isReturn &&
                    el.isRetrieved &&
                    el.isRefund &&
                    el.isReturnSubmit ? (
                      '환불완료'
                    ) : el.payments.status === 'CANCELED' &&
                      !el.isOrdered &&
                      !el.isShipping &&
                      el.shippingCode === 0 &&
                      !el.isDelivered &&
                      el.isCancel &&
                      !el.isReturn &&
                      !el.isRetrieved &&
                      !el.isRefund &&
                      !el.isReturnSubmit ? (
                      '결제취소'
                    ) : (
                      <></>
                    )}
                  </p>
                  <p>Reason : {el.cancels.cancelReason}</p>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}
