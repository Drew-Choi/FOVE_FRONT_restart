import React, { useEffect, useState } from 'react';
import admin_orderList from '../../styles/orderList_Admin.module.scss';
import axios from 'axios';
import LoadingAdmin from '../client_components/LoadingAdmin';
import { useNavigate } from 'react-router-dom';

export default function OrderList_admin() {
  const [orderData, setOrderData] = useState(null);
  const [cancelData, setCancelData] = useState(null);
  const [selector, setSelector] = useState('order');
  const navigate = useNavigate();

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
          <ul className={admin_orderList.list_ul_wrap}>
            {orderData.map((el, index) => {
              return (
                <li
                  className={admin_orderList.list_li}
                  key={index}
                  onClick={() =>
                    navigate(`/admin/orderlist/detail/${el.payments.orderId}`)
                  }
                >
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
                      '결제완료 (배송 전)'
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
                      '배송완료'
                    ) : el.payments.status === 'DONE' &&
                      !el.isShipping &&
                      el.isDelivered &&
                      !el.isCancel &&
                      el.isReturnSubmit &&
                      !el.isReturn ? (
                      '반품신청 중'
                    ) : el.payments.status === 'DONE' &&
                      !el.isShipping &&
                      !el.isDelivered &&
                      !el.isCancel &&
                      !el.isReturnSubmit &&
                      el.isReturn ? (
                      '교환 중'
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
            {cancelData.map((el, index) => {
              return (
                <li
                  className={admin_orderList.list_li}
                  key={index}
                  // onClick={() =>
                  //   navigate(
                  //     `/admin/orderlist/detaliCancel/${el.payments.orderId}`,
                  //   )
                  // }
                >
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
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}
