import React, { useEffect, useState } from 'react';
import tossPayComplete from '../../styles/tossPay_complete.module.scss';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import getToken from '../../store/modules/getToken';
import Loading from './Loading';

export default function TossPay_Cancel_Complete() {
  const { orderId } = useParams();
  const { reason } = useParams();
  const navigate = useNavigate();

  const [cancelInfoData, setCancelInfoData] = useState(null);

  const cancelProgress = async () => {
    try {
      const tokenValue = await getToken();
      const cancelInfo = await axios.post('http://localhost:4000/toss/cancel', {
        orderId,
        reason,
        token: tokenValue,
      });

      if (cancelInfo.status === 200) {
        console.log(cancelInfo.data);
        console.log('성공');
        setCancelInfoData((cur) => cancelInfo.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    cancelProgress();
  }, []);

  const timeFix = (time) => {
    const timeFixed = time.replace(/[T]/g, ' T').replace(/\+.*/, '');
    return timeFixed;
  };

  const filterUniqueCode = (time) => {
    const uniqueKey = time.replace(/[-T:]/g, '').replace(/\+.*/, '');
    return uniqueKey;
  };

  return (
    <>
      {cancelInfoData !== null && Object.keys(cancelInfoData).length > 0 ? (
        <div className={tossPayComplete.toss_complete_container}>
          <div className={tossPayComplete.wrap}>
            <p className={tossPayComplete.complete_title}>Order Complete</p>
            <div className={tossPayComplete.complete_box}>
              <p className={tossPayComplete.order_title}>
                고객님의 주문취소가 완료되었습니다.
              </p>
              <p className={tossPayComplete.order_guide}>
                주문취소내역에 관한 안내는{' '}
                <span>마이페이지 / 주문취소조회</span>를 통하여 확인가능합니다.
              </p>
              <p className={tossPayComplete.order_info_number}>
                주문번호:{' '}
                <span className={tossPayComplete.number}>
                  {filterUniqueCode(cancelInfoData.approvedAt) +
                    cancelInfoData.orderId}
                </span>
              </p>
              <p className={tossPayComplete.order_info_date}>
                취소일자:{' '}
                <span className={tossPayComplete.date}>
                  {timeFix(cancelInfoData.cancels[0].canceledAt)}
                </span>
              </p>
            </div>

            <div className={tossPayComplete.btn_container}>
              <button
                className={tossPayComplete.btn_continue}
                onClick={() => navigate('/store')}
              >
                쇼핑계속하기
              </button>
              <button
                className={tossPayComplete.btn_orderList}
                onClick={() => navigate('/mypage/orderlist')}
              >
                주문취소 확인하기
              </button>
            </div>

            <div className={tossPayComplete.notice_wrap}>
              <div className={tossPayComplete.notice_use}>
                <p className={tossPayComplete.use_title}>이용안내</p>
                <p className={tossPayComplete.use_desc}>
                  상품별 자세한 배송과정은 주문조회를 통하여 조회하실 수
                  있습니다.
                </p>
              </div>
            </div>

            {/* <div>{`번호: ${searchParams.get("orderId")}`}</div> */}
            {/* <div>{`주문번호: ${searchParams.get('orderId')}`}</div> */}
            {/* <div>{}</div>
        <div>{`결제 금액: ${
          Number().toLocaleString()
          searchParams.get('amount'),
        }원`}</div> */}
            {/* {/* <div>{`주문일자: ${now}`}</div> */}
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
}
