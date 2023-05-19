import React, { useEffect, useState } from 'react';
import orderList from '../../styles/orderlist_client.module.scss';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import getToken from '../../store/modules/getToken';

export default function OrderList_client() {
  const navigate = useNavigate();
  const userNameEncoded = useSelector((state) => state.user.userName);
  const [isSpanClicked, setIsSpanClicked] = useState(false);
  const handleSpanClick = () => {
    setIsSpanClicked(true);
  };

  const getOrderList = async () => {
    try {
      const tokenValue = await getToken();
      const getOrderListData = await axios.post(
        'http://localhost:4000/order_list/getMemberOrderList',
        { token: tokenValue },
      );
      if (getOrderListData.status === 200) {
        console.log(getOrderListData.data[0]);
      } else {
        console.log('데이터전송안됨');
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getOrderList();
  }, []);

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
            <span>(1)</span>
          </span>
          <span className={orderList.cancle_list_check}>
            취소/반품/교환 내역
            <span>(0)</span>
          </span>
        </div>

        <div className={orderList.orderlist_Check_wrap}>
          {/* 주문 조회 내역 */}
          <p className={orderList.older_date}>
            <strong>2023-04-18</strong> (20230413-0000115)
          </p>
          <div className={orderList.older_image_info}>
            <div className={orderList.older_image}></div>
            <div className={orderList.pdnameprice}>
              <p className={orderList.pdname}>
                Star Logo Jacquard Beanie - BLACK
              </p>
              <p className={orderList.pdprice}>
                KRW <strong>89,000 1</strong>개
              </p>
            </div>
          </div>
          <p className={orderList.older_detail_info}>[옵션: 1]</p>

          <p className={orderList.status}>입금전</p>
          <button className={orderList.orderCancle}>주문취소</button>
        </div>
      </div>
    </section>
  );
}
