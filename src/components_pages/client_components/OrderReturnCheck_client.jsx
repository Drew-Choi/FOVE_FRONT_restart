import React, { useEffect, useMemo, useRef, useState } from 'react';
import getToken from '../../store/modules/getToken';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import orderReturnCheck from '../../styles/orderReturnCheck_client.module.scss';
import styled from 'styled-components';
import Loading from './Loading';

const Pd_Images = styled.div`
  ${(props) =>
    props.img &&
    `background-image: url('http://localhost:4000/uploads/${props.img}')`}
`;

const Preview = styled.img`
  position: relative;
  display: block;
  box-sizing: content-box;
  width: 40vw;
  height: auto;
  border-bottom: 0.5px solid black;
  padding: 10px;
  margin: 5px;
  margin-right: 10px;
  cursor: pointer;
`;

export default function OrderReturnCheck_client() {
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
      setOrderCancelItem(getCancelData.data);
    } catch (err) {
      console.error(err);
    }
  };

  //db Number타입을 스트링으로 바꾸고 천단위 컴마 찍어 프론트에 보내기
  const country = navigator.language;
  const frontPriceComma = (price) => {
    if (price && typeof price.toLocaleString === 'function') {
      return price.toLocaleString(country, {
        currency: 'KRW',
      });
    } else {
      return price;
    }
  };

  useEffect(() => {
    getCancelItem();
  }, []);

  console.log(orderCancelItem);
  console.log(orderId);

  return (
    <section className={orderReturnCheck.orderList_container}>
      {orderCancelItem !== null && Object.keys(orderCancelItem).length > 0 ? (
        <>
          <div className={orderReturnCheck.titleArea}>
            <h5 className={orderReturnCheck.subtitle}>RETURN CHECK</h5>
          </div>

          <div className={orderReturnCheck.order_info_wrap}>
            <div className={orderReturnCheck.orderlist_Check_wrap}>
              <p className={orderReturnCheck.older_date}>
                주문번호: <strong>{orderCancelItem.payments.orderId}</strong>
              </p>
              {/* 상품영역 */}
              {orderCancelItem.products.map((el, index) => {
                return (
                  <div
                    key={index}
                    className={orderReturnCheck.older_image_info}
                  >
                    <Pd_Images
                      onClick={() =>
                        navigate(`/store/detail/${el.productCode}`)
                      }
                      img={el.img}
                      className={orderReturnCheck.older_image}
                    ></Pd_Images>
                    <div className={orderReturnCheck.pdnameprice}>
                      <p
                        className={orderReturnCheck.pdname}
                        onClick={() =>
                          navigate(`/store/detail/${el.productCode}`)
                        }
                      >
                        {el.productName}
                      </p>
                      <p className={orderReturnCheck.pdprice}>
                        <strong style={{ fontSize: '15px' }}>
                          {frontPriceComma(el.unitSumPrice)}
                        </strong>
                        KRW /{' '}
                        <strong style={{ fontSize: '15px' }}>
                          {frontPriceComma(el.quantity)}
                        </strong>{' '}
                        ea
                      </p>
                      <p className={orderReturnCheck.pdprice}>
                        SIZE{' '}
                        <strong style={{ fontSize: '15px' }}>{el.size}</strong>
                      </p>
                    </div>
                  </div>
                );
              })}
              <p className={orderReturnCheck.older_detail_info}>
                total ={' '}
                <strong style={{ fontSize: '17px' }}>
                  {frontPriceComma(orderCancelItem.payments.totalAmount)}{' '}
                </strong>
                KRW /{' '}
                <strong style={{ fontSize: '17px' }}>
                  {frontPriceComma(
                    orderCancelItem.products.reduce(
                      (acc, cur) => acc + cur.quantity,
                      0,
                    ),
                  )}
                </strong>{' '}
                ea
              </p>
              <p className={orderReturnCheck.return_reason}>
                reason:{' '}
                <span className={orderReturnCheck.reason_text}>
                  {orderCancelItem.submitReturn.reason}
                </span>
              </p>
              <p className={orderReturnCheck.return_etc}>
                message:{' '}
                <span className={orderReturnCheck.reason_etc_text}>
                  {orderCancelItem.submitReturn.return_message}
                </span>
              </p>
              <p className={orderReturnCheck.return_reason}>
                stage:{' '}
                <span className={orderReturnCheck.reason_text}>
                  {!orderCancelItem.isCancel &&
                  !orderCancelItem.isReturn &&
                  orderCancelItem.isReturnSubmit ? (
                    '검토 중'
                  ) : !orderCancelItem.isCancel &&
                    orderCancelItem.isReturn &&
                    orderCancelItem.isReturnSubmit ? (
                    '교환'
                  ) : orderCancelItem.isCancel &&
                    !orderCancelItem.isReturn &&
                    orderCancelItem.isReturnSubmit ? (
                    '환불'
                  ) : (
                    <></>
                  )}
                </span>
              </p>
              <div className={orderReturnCheck.infoCancelContainer}>
                <div className={orderReturnCheck.line}></div>
                {orderCancelItem.submitReturn.return_img.map((el, index) => {
                  return (
                    <Preview
                      key={index}
                      src={`http://localhost:4000/uploads/${orderCancelItem.payments.orderId}/${el}`}
                    ></Preview>
                  );
                })}
                <button
                  className={orderReturnCheck.orderBack}
                  onClick={() => navigate(-1)}
                >
                  뒤로가기
                </button>
                <p className={orderReturnCheck.caution}>
                  *검토 후 연락드리도록 하겠습니다. (카카오톡 or 주문자
                  전화번호)
                </p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <Loading />
      )}
    </section>
  );
}
