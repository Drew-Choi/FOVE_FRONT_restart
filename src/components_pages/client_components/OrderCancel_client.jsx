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
  const { orderId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
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
        await setOrderCancelItem((cur) => getCancelData.data);
      } catch (err) {
        console.error(err);
      }
    };
    getCancelItem();
  }, []);

  const [orderCancelItem, setOrderCancelItem] = useState({});

  console.log(orderCancelItem);

  return (
    <section className={orderCancel.orderList_container}>
      {/* 주문조회 (ORDER LIST) 제목 위치 */}
      <div className={orderCancel.titleArea}>
        <h5 className={orderCancel.subtitle}>ORDER LIST</h5>
      </div>

      <div className={orderCancel.order_info_wrap}>
        <div className={orderCancel.order_info_category}>
          <span className={orderCancel.order_list_check}>
            주문내역조회
            <span></span>
          </span>
          <span className={orderCancel.cancle_list_check}>
            취소/반품/교환 내역
            <span>(0)</span>
          </span>
        </div>
        <div className={orderCancel.orderlist_Check_wrap}>
          {orderCancelItem.products.map((pdInfo, index) => {
            return (
              <div key={index} className={orderCancel.older_image_info}>
                <Pd_Images
                  img={pdInfo.img}
                  className={orderCancel.older_image}
                ></Pd_Images>
                <div className={orderCancel.pdnameprice}>
                  <p className={orderCancel.pdname}>{pdInfo.productName}</p>
                  <p className={orderCancel.pdprice}>
                    <strong style={{ fontSize: '15px' }}>
                      {priceComma(pdInfo.unitSumPrice)}{' '}
                    </strong>
                    KRW /{' '}
                    <strong style={{ fontSize: '15px' }}>
                      {priceComma(pdInfo.quantity)}
                    </strong>{' '}
                    ea
                  </p>
                  <p className={orderCancel.pdprice}>
                    SIZE{' '}
                    <strong style={{ fontSize: '15px' }}>{pdInfo.size}</strong>
                  </p>
                </div>
              </div>
            );
          })}
          <div className={orderCancel.infoCancelContainer}>
            <p className={orderCancel.older_detail_info}>
              total ={' '}
              <strong style={{ fontSize: '17px' }}>
                {priceComma(orderCancelItem.payments.totalAmount)}{' '}
              </strong>
              KRW /{' '}
              <strong style={{ fontSize: '17px' }}>
                {priceComma(
                  orderCancelItem.products.reduce(
                    (acc, cur) => acc + cur.quantity,
                    0,
                  ),
                )}
              </strong>{' '}
              ea
            </p>
            <p className={orderCancel.status}>
              {orderCancelItem.payments.status === 'DONE'
                ? '입금완료'
                : '입금전'}{' '}
              / {'배송전'}
            </p>
            <button
              className={orderCancel.orderCancle}
              onClick={() => {
                navigate(
                  `/mypage/orderlist/cancel/${orderCancelItem.payments.orderId}`,
                );
              }}
            >
              주문취소
            </button>
            <p className={orderCancel.orderCancelInfo}>
              {' '}
              *주문취소는 배송상태가 &#39;배송전&#39;일 경우에 가능합니다.{' '}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
