import React, { useEffect, useRef, useState } from 'react';
import getToken from '../../store/modules/getToken';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import orderReturn from '../../styles/orderReturn_client.module.scss';
import styled from 'styled-components';
import Loading from './Loading';
import Select_Custom from '../../components_elements/Select_Custom';

const Pd_Images = styled.div`
  ${(props) =>
    props.img &&
    `background-image: url('http://localhost:4000/uploads/${props.img}')`}
`;

export default function OrderReturn_client() {
  const [orderCancelItem, setOrderCancelItem] = useState(null);
  // const [selectReason, setSelectReason] = useState('단순변심');
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

  useEffect(() => {
    getCancelItem();
  }, []);

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

  // 반품사유
  const cancelReasonSelet = useRef('상품파손');
  const cancelReason = ['상품파손', '기타'];
  const [reasonChange, setReasonChange] = useState('상품파손');
  const reasonHandle = () => {
    if (cancelReasonSelet.current.value === '기타')
      return setReasonChange((cur) => '기타');
    return setReasonChange((cur) => '상품파손');
  };

  return (
    <>
      {orderCancelItem !== null && Object.keys(orderCancelItem).length > 0 ? (
        <section className={orderReturn.orderList_container}>
          <div className={orderReturn.titleArea}>
            <h5 className={orderReturn.subtitle}>RETURN</h5>
          </div>

          <div className={orderReturn.order_info_wrap}>
            <div className={orderReturn.orderlist_Check_wrap}>
              <p className={orderReturn.older_date}>
                주문번호: <strong>{orderCancelItem.payments.orderId}</strong>
              </p>
              {/* 상품영역 */}
              {orderCancelItem.products.map((el, index) => {
                return (
                  <div key={index} className={orderReturn.older_image_info}>
                    <Pd_Images
                      onClick={() =>
                        navigate(`/store/detail/${el.productCode}`)
                      }
                      img={el.img}
                      className={orderReturn.older_image}
                    ></Pd_Images>
                    <div className={orderReturn.pdnameprice}>
                      <p
                        className={orderReturn.pdname}
                        onClick={() =>
                          navigate(`/store/detail/${el.productCode}`)
                        }
                      >
                        {el.productName}
                      </p>
                      <p className={orderReturn.pdprice}>
                        <strong style={{ fontSize: '15px' }}>
                          {frontPriceComma(el.unitSumPrice)}
                        </strong>
                        KRW /{' '}
                        <strong style={{ fontSize: '15px' }}>
                          {frontPriceComma(el.quantity)}
                        </strong>{' '}
                        ea
                      </p>
                      <p className={orderReturn.pdprice}>
                        SIZE{' '}
                        <strong style={{ fontSize: '15px' }}>{el.size}</strong>
                      </p>
                    </div>
                  </div>
                );
              })}
              <p className={orderReturn.older_detail_info}>
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
              <div className={orderReturn.infoCancelContainer}>
                <Select_Custom
                  classNameDiv={orderReturn.reason_div}
                  classNameChildren={orderReturn.reason_children}
                  classNameSelect={orderReturn.reason_select}
                  inputRef={cancelReasonSelet}
                  selectList={cancelReason}
                  onChangeEvent={reasonHandle}
                >
                  * 반품 사유
                </Select_Custom>
                {reasonChange === '기타' && (
                  <textarea
                    rows="5"
                    wrap="hard"
                    maxLength="200"
                    className={orderReturn.reason_selfInput}
                    type="text"
                    placeholder="기타 사유를 남겨주시면 검토 후 연락드리겠습니다. (최대 200자)"
                  />
                )}

                <button
                  className={orderReturn.orderBack}
                  onClick={() => navigate(-1)}
                >
                  뒤로가기
                </button>
                <button className={orderReturn.orderCancle}>
                  반품신청 진행
                </button>
                <p className={orderReturn.caution}>
                  *반품신청을 해주시면 검토 후 연락드리도록 하겠습니다.
                  (카카오톡 or 주문자 전화번호)
                </p>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <Loading />
      )}
    </>
  );
}
