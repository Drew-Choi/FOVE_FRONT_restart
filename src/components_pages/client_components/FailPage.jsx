import React, { useEffect, useState } from 'react';
import tossPayComplete from '../../styles/tossPay_complete.module.scss';
import { useNavigate, useParams } from 'react-router-dom';

export default function FailPage() {
  const navigate = useNavigate();

  return (
    <div className={tossPayComplete.toss_complete_container}>
      <div className={tossPayComplete.wrap}>
        <p className={tossPayComplete.complete_title}>Order Cancel</p>
        <div className={tossPayComplete.complete_box}>
          <p className={tossPayComplete.order_title}>
            재고가 없거나 부족한 상품이 있어 결제진행이 중단되었습니다.
          </p>
          <p style={{ fontSize: '15px', marginBottom: '40px' }}>
            * 결제최종승인이 되지 않은 상황이라 고객님의 결제가 이루어지지
            않았습니다.
          </p>
          <p>
            {' '}
            --- &#39;장바구니&#39; 또는 &#39;상품재고 상태&#39;를 확인해주세요.
            ---
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
