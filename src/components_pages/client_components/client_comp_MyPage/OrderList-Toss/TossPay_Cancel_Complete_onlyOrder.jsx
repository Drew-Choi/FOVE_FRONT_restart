import React from 'react';
import tossPayComplete from '../../../../styles/tossPay_complete.module.scss';
import { useNavigate } from 'react-router-dom';

export default function TossPay_Cancel_Complete_onlyOrder() {
  const navigate = useNavigate();

  return (
    <div className={tossPayComplete.toss_complete_container}>
      <div className={tossPayComplete.wrap}>
        <p className={tossPayComplete.complete_title}>Order Cancel</p>
        <div className={tossPayComplete.complete_box}>
          <p className={tossPayComplete.order_title}>
            고객님의 주문취소가 완료되었습니다.
          </p>
        </div>

        <div className={tossPayComplete.btn_container}>
          <button
            className={tossPayComplete.btn_continue}
            onClick={() => navigate('/store')}
          >
            쇼핑계속하기
          </button>
        </div>

        <div className={tossPayComplete.notice_wrap}>
          <div className={tossPayComplete.notice_use}>
            <p className={tossPayComplete.use_title}>이용안내</p>
            <p className={tossPayComplete.use_desc}>
              상품별 자세한 배송과정은 주문조회를 통하여 조회하실 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
