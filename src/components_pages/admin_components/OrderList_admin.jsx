import React, { useEffect, useState } from 'react';
import admin_orderList from '../../styles/orderList_Admin.module.scss';
import axios from 'axios';

export default function OrderList_admin() {
  const [orderData, setOrderData] = useState([]);

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
    }
  };

  useEffect(() => {
    getOrderListInfo();
  }, []);

  console.log(orderData);

  return (
    <div className={admin_orderList.whol_Container}>
      <div className={admin_orderList.section_Wrap}>
        <p className={admin_orderList.mainTitle}>Order List (Admin)</p>
        <p className={admin_orderList.totalOrderCount}>
          Total : {orderData.length}
        </p>
        <ul className={admin_orderList.list_ul_wrap}>
          {orderData.map((el, index) => {
            return (
              <div key={index}>
                <li className={admin_orderList.list_li}>
                  <p>No. {index}</p>
                  <p>OrderID : {el.payments.orderId}</p>
                  <p>OrderName : {el.payments.orderName}</p>
                  <p>User : {el.user}</p>
                  <p>
                    Status{' '}
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
                    ) : el.payments.status === 'CANCEL' &&
                      !el.isShipping &&
                      !el.isDelivered &&
                      el.isCancel &&
                      !el.isReturnSubmit &&
                      !el.isReturn ? (
                      '결제취소'
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
      </div>
    </div>
  );
}
