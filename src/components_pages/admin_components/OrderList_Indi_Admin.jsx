import React from 'react';
import orderListIndi from '../../styles/orderList_Indi_Admin.module.scss';

export default function OrderList_Indi_Admin() {
  return (
    <div className={orderListIndi.wholContainer}>
      <div className={orderListIndi.mainWrap}>
        <p className={orderListIndi.mainTitle}>ORDER DETAILS</p>
        <p className={orderListIndi.subTitle}>orderID : {'주문번호바인딩'}</p>
      </div>

      <div>기다려</div>
    </div>
  );
}
