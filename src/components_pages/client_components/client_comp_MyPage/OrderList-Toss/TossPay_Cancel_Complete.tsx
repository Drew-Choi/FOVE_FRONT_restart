/* eslint-disable no-undef */
import React, { useEffect, useState } from 'react';
import tossPayComplete from '../../../../styles/tossPay_complete.module.scss';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import getToken from '../../../../constant/getToken';
import Loading from '../../Loading';

const { REACT_APP_KEY_BACK } = process.env;

// constant
const timeFix = (time: string) => {
  const timeFixed = time.replace(/[T]/g, ' T').replace(/\+.*/, '');
  return timeFixed;
};

const filterUniqueCode = (time: string) => {
  const uniqueKey = time.replace(/[-T:]/g, '').replace(/\+.*/, '');
  return uniqueKey;
};

// type
interface CancelDataType {
  approvedAt: string;
  orderId: string;
  cancels: [{ canceledAt: string }];
}

export default function TossPay_Cancel_Complete() {
  const { orderId } = useParams();
  const { reason } = useParams();
  const navigate = useNavigate();
  const [cancelInfoData, setCancelInfoData] = useState<CancelDataType | null>(
    null,
  );

  useEffect(() => {
    const cancelProgress = async () => {
      try {
        const tokenValue = await getToken();
        const cancelInfo = await axios.post(
          `${REACT_APP_KEY_BACK}/toss/cancel`,
          {
            orderId,
            reason,
            token: tokenValue,
          },
        );

        if (cancelInfo.status === 200) {
          setCancelInfoData(cancelInfo.data);
          return;
        }
      } catch (err: any) {
        if (err.data.status === 409) {
          alert('중복된 취소 오류');
          navigate(
            `/error?errorMessage=${err.response.data}&errorCode=${err.response.status}`,
          );
          console.error(err);
        }
        // 409 외는 아래
        alert('오류');
        navigate(
          `/error?errorMessage=${err.response.data}&errorCode=${err.response.status}`,
        );
        console.error(err);
      }
    };

    cancelProgress();
  }, []);

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
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
}
