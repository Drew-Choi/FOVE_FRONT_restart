import React, { useEffect, useState } from 'react';
import getToken from '../../store/modules/getToken';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import orderCancel from '../../styles/orderCancel_client.module.scss';
import styled from 'styled-components';
import priceComma from '../../store/modules/etcModule';

const Pd_Images = styled.div`
  ${(props) =>
    props.img &&
    `background-image: url('http://localhost:4000/uploads/${props.img}')`}
`;

export default function OrderCancel_client() {
  const [orderCancelItem, setOrderCancelItem] = useState(null);
  const navigate = useNavigate();
  const { orderId } = useParams();

  const getCancelItem = async () => {
    try {
      const tokenValue = await getToken();

      const getCancelData = await axios.post(
        'http://localhost:4000/order_list/getCancelItem',
        {
          token: tokenValue,
          orderId: orderId,
        },
      );
      setOrderCancelItem((cur) => getCancelData.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getCancelItem();
  }, []);

  console.log(orderCancelItem);

  return (
    <section>
      {orderCancelItem !== null && Object.keys(orderCancelItem).length > 0 ? (
        <div className={orderCancel.order_info_wrap}>
          <h1>{orderCancelItem.isOrdered}</h1>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </section>
  );
}
