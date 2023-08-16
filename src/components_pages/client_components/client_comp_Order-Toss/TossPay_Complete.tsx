/* eslint-disable no-undef */
import React, { useEffect, useState } from 'react';
import tossPayComplete from '../../../styles/tossPay_complete.module.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import getToken from '../../../constant/getToken';

const { REACT_APP_KEY_BACK } = process.env;

// constant
const filterUniqueCode = (time: string) => {
  const uniqueKey = time.replace(/[-T:]/g, '').replace(/\+.*/, '');
  return uniqueKey;
};

const timeFix = (time: string) => {
  const timeFixed = time.replace(/[T]/g, ' T').replace(/\+.*/, '');
  return timeFixed;
};

export default function TossPay_Complete() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search);
  const [orderID, setOrderID] = useState<string>('');
  const [orderTime, setOrderTime] = useState<string>('');

  useEffect(() => {
    // 주문정보 가져오기
    const getData = async () => {
      try {
        const sessionId = searchQuery.get('sessionID');
        const paymentData = await axios.get(
          `${REACT_APP_KEY_BACK}/toss/data?sessionID=${sessionId}`,
        );

        if (paymentData.status === 200) {
          localStorage.setItem('payments', JSON.stringify(paymentData.data));
          return;
        }
      } catch (err: any) {
        navigate(
          `/error?errorMessage=${err.response.data}&errorCode=${err.response.status}`,
        );
        console.error(err);
      }
    };

    // 로컬스토리지 정보 뺴오기
    const finalOrderPost = async () => {
      //로컬에서 주문내역 뺴서 가공
      const productJSON = localStorage.getItem('products');
      const products = productJSON ? await JSON.parse(productJSON) : null;
      const recipienJSON = localStorage.getItem('recipien');
      const recipien = recipienJSON ? await JSON.parse(recipienJSON) : null;
      const paymentsJSON = localStorage.getItem('payments');
      const payments = paymentsJSON ? await JSON.parse(paymentsJSON) : null;

      setOrderID(payments.orderId);
      setOrderTime(payments.approvedAt);

      //백으로 최종 주문내역서 보내기
      try {
        const tokenValue = await getToken();
        const finalOrderData = await axios.post(
          `${REACT_APP_KEY_BACK}/store/order`,
          {
            token: tokenValue,
            //상품정보
            products: products,
            //받는 이 정보
            message: recipien.message,
            recipientName: recipien.recipientName,
            recipientZipcode: recipien.recipientZipcode,
            recipientAddress: recipien.recipientAddress,
            recipientAddressDetail: recipien.recipientAddressDetail,
            phoneCode: recipien.phoneCode,
            phoneMidNum: recipien.phoneMidNum,
            phoneLastNum: recipien.phoneLastNum,
            payments: {
              status: payments.status,
              orderId: payments.orderId,
              orderName: payments.orderName,
              approvedAt: payments.approvedAt,
              discount: payments.discount,
              totalAmount: payments.totalAmount,
              method: payments.method,
            },
          },
        );
        if (finalOrderData.status === 200) {
          localStorage.clear();
          return;
        } else if (finalOrderData.status == 409) {
          navigate('/store');
          alert('중복된 주문 오류');
          return;
        } else {
          navigate('/store');
          alert('주문실패');
          return;
        }
      } catch (err: any) {
        navigate(
          `/error?errorMessage=${err.response.data}&errorCode=${err.response.status}`,
        );
        console.error(err);
      }
    };

    const array = async () => {
      try {
        await getData();
        await finalOrderPost();
      } catch (err: any) {
        navigate(
          `/error?errorMessage=${err.response.data}&errorCode=${err.response.status}`,
        );
        console.error('Error occurred:', err);
      }
    };

    array();
  }, []);

  return (
    <div className={tossPayComplete.toss_complete_container}>
      <div className={tossPayComplete.wrap}>
        <p className={tossPayComplete.complete_title}>Order Complete</p>
        <div className={tossPayComplete.complete_box}>
          <p className={tossPayComplete.order_title}>
            고객님의 주문이 완료되었습니다.
          </p>
          <p className={tossPayComplete.order_guide}>
            주문내역 및 배송에 관한 안내는 <span>주문조회</span>를 통하여
            확인가능합니다.
          </p>
          <p className={tossPayComplete.order_info_number}>
            주문번호:{' '}
            <span className={tossPayComplete.number}>
              {filterUniqueCode(orderTime) + orderID}
            </span>
          </p>
          <p className={tossPayComplete.order_info_date}>
            주문일자:{' '}
            <span className={tossPayComplete.date}>{timeFix(orderTime)}</span>
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
            주문확인하기
          </button>
        </div>

        <div className={tossPayComplete.notice_wrap}>
          <div className={tossPayComplete.notice_use}>
            <p className={tossPayComplete.use_title}>이용안내</p>
            <p className={tossPayComplete.use_desc}>
              배송은 결제완료 후 지역에 따라 3일 ~ 7일 가량이 소요됩니다. <br />
              상품별 자세한 배송과정은 주문조회를 통하여 조회하실 수 있습니다.
              <br />
              주문의 취소 및 환불, 교환에 관한 사항은 이용안내의 내용을
              참고하십시오.
            </p>
          </div>
          <div className={tossPayComplete.notice_recip}>
            <p className={tossPayComplete.recip_title}>세금계산서 발행 안내</p>
            <p className={tossPayComplete.recip_desc}>
              부가가치세법 제 54조에 의거하여 세금계산서는 배송완료일로부터
              다음달 10일까지만 요청하실 수 있습니다. <br />
              세금계산서는 사업자만 신청하실 수 있습니다.
              <br />
              배송이 완료된 주문에 한하여 세금계산서 발행신청이 가능합니다.
              <br />
              [세금계산서 신청]버튼을 눌러 세금계산서 신청양식을 작성한 후
              팩스로 사업자등록증사본을 보내셔야 세금계산서 발행이 가능합니다.
              <br />
              [세금계산서 인쇄]버튼을 누르면 발행된 세금계산서를 인쇄하실 수
              있습니다.
            </p>
          </div>
          <div className={tossPayComplete.notice_recip_detail}>
            <p className={tossPayComplete.recip_detail_title}>
              부가가치세법 변경에 따른 신용카드매출전표 및 세금계산서 변경안내
            </p>
            <p className={tossPayComplete.recip_detail_desc}>
              변경된 부가가치세법에 의거, 2004.07.01 이후 신용카드로 결제하신
              주문에 대해서는 세금계산서 발행이 불가하며 <br />
              신용카드매출전표로 부가가치세 신고를 하셔야 합니다.(부가가치세법
              시행령 57조) <br />
              상기 부가가치세법 변경내용에 따라 신용카드 이외의 결제건에
              대해서만 세금계산서 발행이 가능함을 양지하여 주시기 바랍니다.
            </p>
          </div>
          <div className={tossPayComplete.notice_cash}>
            <p className={tossPayComplete.cash_title}>현금영수증 이용안내</p>
            <p className={tossPayComplete.cash_desc}>
              현금영수증은 1원 이상의 현금성거래(무통장입금, 실시간계좌이체,
              에스크로, 예치금)에 대해 발행이 됩니다.
              <br />
              현금영수증은 발행 금액에는 배송비는 포함되고, 적립금사용액은
              포함되지 않습니다.
              <br />
              발행신청 기간제한 현금영수증은 입금확인일로 부터 48시간 안에
              발행을 해야 합니다. <br />
              현금영수증 발행 취소의 경우는 시간 제한이 없습니다. (국세청의
              정책에 따라 변경 될 수 있습니다.) <br />
              현금영수증이나 세금계산서 중 하나만 발행이 가능합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
