import React, { useEffect, useState } from 'react';
import orderList from '../../styles/orderlist_client.module.scss';
import axios from 'axios';
import getToken from '../../store/modules/getToken';
import styled from 'styled-components';

const PD_Images = styled.div`
  /* width: 100px;
  height: 100px; */
  ${(props) =>
    props.img &&
    `background-image: url('http://localhost:4000/uploads/${props.img}')`}/* background-position: center;
  background-repeat: no-repeat;
  background-size: cover; */
/* 
  @media screen and (max-width: 332px) {
    background-size: contain;
  } */
`;

export default function OrderList_client() {
  const [orderListArray, setOrderListArray] = useState([]);

  // 해당 회원의 전체 주문내역 가져오기
  const getOrderList = async () => {
    try {
      const tokenValue = await getToken();
      const getOrderListData = await axios.post(
        'http://localhost:4000/order_list/getMemberOrderList',
        { token: tokenValue },
      );
      if (getOrderListData.status === 200) {
        await setOrderListArray(getOrderListData.data);
        console.log(getOrderListData.data);
      } else {
        console.log('데이터전송안됨');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 마운트시 1회
  useEffect(() => {
    getOrderList();
  }, []);

  // 필요한 날짜만 추리기
  const filterTimeDay = (time) => {
    const position = time.indexOf('T');
    const day = time.slice(0, position);

    return day;
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

  return (
    <section className={orderList.orderList_container}>
      {/* 주문조회 (ORDER LIST) 제목 위치 */}
      <div className={orderList.titleArea}>
        <h5 className={orderList.subtitle}>ORDER LIST</h5>
      </div>

      <div className={orderList.order_info_wrap}>
        <div className={orderList.order_info_category}>
          <span className={orderList.order_list_check}>
            주문내역조회
            <span>({orderListArray.length})</span>
          </span>
          <span className={orderList.cancle_list_check}>
            취소/반품/교환 내역
            <span>(0)</span>
          </span>
        </div>
        {orderListArray.map((el, index) => {
          return (
            <div key={index} className={orderList.orderlist_Check_wrap}>
              {/* 주문 조회 내역 */}
              <p className={orderList.older_date}>
                <strong>{filterTimeDay(el.payments.approvedAt)}</strong> (
                {' 나중에 추가 '})
              </p>
              {el.products.map((pdInfo, index) => {
                return (
                  <div key={index} className={orderList.older_image_info}>
                    <PD_Images
                      img={pdInfo.img}
                      className={orderList.older_image}
                    ></PD_Images>
                    <div className={orderList.pdnameprice}>
                      <p className={orderList.pdname}>{pdInfo.productName}</p>
                      <p className={orderList.pdprice}>
                        <strong style={{ fontSize: '15px' }}>
                          {frontPriceComma(pdInfo.unitSumPrice)}{' '}
                        </strong>
                        KRW /{' '}
                        <strong style={{ fontSize: '15px' }}>
                          {frontPriceComma(pdInfo.quantity)}
                        </strong>{' '}
                        ea
                      </p>
                      <p className={orderList.pdprice}>
                        SIZE{' '}
                        <strong style={{ fontSize: '15px' }}>
                          {pdInfo.size}
                        </strong>
                      </p>
                    </div>
                  </div>
                );
              })}
              <p className={orderList.older_detail_info}>
                total ={' '}
                <strong style={{ fontSize: '17px' }}>
                  {frontPriceComma(el.payments.totalAmount)}{' '}
                </strong>
                KRW /{' '}
                <strong style={{ fontSize: '17px' }}>
                  {frontPriceComma(
                    el.products.reduce((acc, cur) => acc + cur.quantity, 0),
                  )}
                </strong>{' '}
                ea
              </p>
              <p className={orderList.status}>
                {el.payments.status === 'DONE' ? '입금완료' : '입금전'}
              </p>
              <button className={orderList.orderCancle}>주문취소</button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
