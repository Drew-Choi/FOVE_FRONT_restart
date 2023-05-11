/* eslint-disable no-undef */
//유저 정보 받아서 데이터 바인딩 해야함
import { useEffect, useRef, useState } from 'react';
import {
  PaymentWidgetInstance,
  loadPaymentWidget,
} from '@tosspayments/payment-widget-sdk';
import { nanoid } from 'nanoid';
import tossCheckOut from '../../styles/toss_checkOut.module.scss';
import { useSelector } from 'react-redux';
import axios from 'axios';

export function Toss_CheckOut() {
  const selector = '#payment-widget';
  const app = process.env.REACT_APP_KEY_API;

  const getKey = async (key) => {
    try {
      const res = await axios.get(`http://localhost:4000/${app}`, {
        params: { key },
      });
      return res.data.key;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const paymentWidgetRef = useRef(null);
  const paymentMethodsWidgetRef = useRef(null);
  const [price, setPrice] = useState(0);
  const userInfo = useSelector((state) => state.user);

  //로컬에서 주문내역 뺴서 가공
  const importLocalProducts = JSON.parse(localStorage.getItem('products'));
  //이게 최종 금액
  let orderPrice = 0;
  importLocalProducts.map((el) => (orderPrice += el.unitSumPrice));
  //상품이름 출력
  const productName = importLocalProducts[0].productName;

  const initPayment = async () => {
    const client = await getKey('CLIENT_KEY');
    const customer = await getKey('CUSTOMER_KEY');

    const paymentWidget = await loadPaymentWidget(client, customer);

    const paymentMethodsWidget = paymentWidget.renderPaymentMethods(
      selector,
      orderPrice,
    );

    paymentWidgetRef.current = paymentWidget;
    paymentMethodsWidgetRef.current = paymentMethodsWidget;
  };

  useEffect(() => {
    initPayment();
  }, []);

  useEffect(() => {
    const paymentMethodsWidget = paymentMethodsWidgetRef.current;

    if (paymentMethodsWidget == null) {
      return;
    }

    paymentMethodsWidget.updateAmount(
      price,
      paymentMethodsWidget.UPDATE_REASON.COUPON,
    );
  }, [price]);

  return (
    <div className={tossCheckOut.checkout_container}>
      <p className={tossCheckOut.checkout_title}>Checkout</p>
      <div className={tossCheckOut.paymentBOX}>
        <div id="payment-widget" />

        <button
          onClick={async () => {
            const paymentWidget = paymentWidgetRef.current;

            try {
              await paymentWidget?.requestPayment({
                orderId: nanoid(),
                orderName: `${
                  importLocalProducts.length > 0
                    ? '상품명: ' + productName + '외 다수'
                    : '상품명: ' + productName
                }`,
                customerName: `${userInfo.userID}`,
                customerEmail: `${userInfo.userID}`,
                successUrl: `${window.location.origin}/store/order/checkout/approval_order`,
                failUrl: `${window.location.origin}/store/order/checkout/fail`,
              });
            } catch (error) {
              console.error(error);
            }
          }}
        >
          결제진행
        </button>
      </div>
    </div>
  );
}
