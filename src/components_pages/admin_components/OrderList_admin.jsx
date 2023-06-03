import React, { useEffect, useState } from 'react';
import admin_orderList from '../../styles/orderList_Admin.module.scss';
import axios from 'axios';
import LoadingAdmin from '../client_components/LoadingAdmin';

export default function OrderList_admin() {
  const [orderData, setOrderData] = useState([]);
  const [cancelData, setCancelData] = useState([]);
  const [selector, setSelector] = useState('order');

  const getOrderListInfo = async () => {
    try {
      const adminOrderListInfo = await axios.get(
        'http://localhost:4000/admin/orderlist',
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
        'http://localhost:4000/admin/cancel_list',
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

  return (
    <div className={admin_orderList.whol_Container}>
      <p className={admin_orderList.mainTitle}>Order List (Admin)</p>
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
          Total : {selector === 'order' ? orderData.length : cancelData.length}
        </p>
      </div>
      {orderData.length === 0 || cancelData.length === 0 ? (
        <LoadingAdmin />
      ) : selector === 'order' ? (
        <ul className={admin_orderList.list_ul_wrap}>
          {orderData.map((el, index) => {
            return (
              <div key={index}>
                <li className={admin_orderList.list_li}>
                  <p>No. {index}</p>
                  <p>OrderID : {el.payments.orderId}</p>
                  <p>OrderName : {el.payments.orderName}</p>
                  <p>User : {el.user}</p>
                  <p>Recipient : {el.recipient.recipientName}</p>
                  <p>
                    Status :{' '}
                    {el.payments.status !== 'DONE' &&
                    !el.isShipping &&
                    !el.isDelivered &&
                    !el.isCancel &&
                    !el.isReturnSubmit &&
                    !el.isReturn ? (
                      '결제 전'
                    ) : el.payments.status === 'DONE' &&
                      !el.isShipping &&
                      !el.isDelivered &&
                      !el.isCancel &&
                      !el.isReturnSubmit &&
                      !el.isReturn ? (
                      '결제완료'
                    ) : el.payments.status === 'DONE' &&
                      el.isShipping &&
                      !el.isDelivered &&
                      !el.isCancel &&
                      !el.isReturnSubmit &&
                      !el.isReturn ? (
                      '배송중'
                    ) : el.payments.status === 'DONE' &&
                      !el.isShipping &&
                      el.isDelivered &&
                      !el.isCancel &&
                      !el.isReturnSubmit &&
                      !el.isReturn ? (
                      '배달완료'
                    ) : el.payments.status === 'DONE' &&
                      !el.isShipping &&
                      el.isDelivered &&
                      !el.isCancel &&
                      el.isReturnSubmit &&
                      !el.isReturn ? (
                      '반품신청'
                    ) : el.payments.status === 'DONE' &&
                      !el.isShipping &&
                      el.isDelivered &&
                      !el.isCancel &&
                      !el.isReturnSubmit &&
                      el.isReturn ? (
                      '교환완료'
                    ) : (
                      <></>
                    )}
                  </p>
                </li>
              </div>
            );
          })}
        </ul>
      ) : (
        <ul className={admin_orderList.list_ul_wrap_Cancel}>
          {cancelData.map((el, index) => {
            return (
              <div key={index}>
                <li className={admin_orderList.list_li}>
                  <p>No. {index}</p>
                  <p>OrderID : {el.payments.orderId}</p>
                  <p>OrderName : {el.payments.orderName}</p>
                  <p>User : {el.user}</p>
                  <p>
                    Status :{' '}
                    {el.payments.status === 'CANCELED' && el.isCancel
                      ? '결제취소'
                      : '오류'}
                  </p>
                  <p>Reason : {el.cancels.cancelReason}</p>
                </li>
              </div>
            );
          })}
        </ul>
      )}
    </div>
  );
}
