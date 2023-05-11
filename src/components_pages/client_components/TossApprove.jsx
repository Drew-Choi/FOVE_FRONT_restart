import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

// import PaymentWidget, { PaymentRequest } from '@tosspayments/payment-widget';

export default function TossApprove() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  let amountparam = searchParams.get('amount');
  let orderIdparam = searchParams.get('orderId');
  let paymentKeyparam = searchParams.get('paymentKey');
  // eslint-disable-next-line no-undef
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

  const paymentApprov = async () => {
    try {
      const sKey = await getKey('SECRET_KEY');
      const encoder = await new TextEncoder();
      const utf8Array = await encoder.encode(sKey + ':');
      const encode = await btoa(String.fromCharCode.apply(null, utf8Array));
      console.log(encode);

      const response = await axios.post(
        'https://api.tosspayments.com/v1/payments/confirm',
        {
          amount: amountparam,
          orderId: orderIdparam,
          paymentKey: paymentKeyparam,
        },
        {
          headers: {
            Authorization: `Basic ${encode}`,
            'Content-Type': 'application/json',
          },
        },
      );
      if (response.status === 200) {
        localStorage.setItem('payments', JSON.stringify(response.data));
        console.log('결제승인성공');
        console.log(response.data);
        navigate('/store/order_success');
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!amountparam || !orderIdparam || !paymentKeyparam) {
      return <h1>Error</h1>;
    } else {
      paymentApprov();
    }
  }, []);

  return <></>;
}
