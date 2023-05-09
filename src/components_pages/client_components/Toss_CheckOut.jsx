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

const selector = '#payment-widget';
const clientKey = 'test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq';
const customerKey = 'YbX2HuSlsC9uVJW6NMRMj';

export function Toss_CheckOut() {
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
    const paymentWidget = await loadPaymentWidget(clientKey, customerKey);

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
              const kim = await paymentWidget?.requestPayment({
                orderId: nanoid(),
                orderName: `${userInfo.userID}`,
                customerName: `${
                  importLocalProducts.length > 0
                    ? '상품명: ' + productName + '외 다수'
                    : '상품명: ' + productName
                }`,
                customerEmail: `${userInfo.userID}`,
                successUrl: `${window.location.origin}/store/order/checkout/approval_order`,
                failUrl: `${window.location.origin}/fail`,
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
