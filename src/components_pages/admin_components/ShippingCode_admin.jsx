import React, { useEffect, useRef, useState } from 'react';
import shippingCode from '../../styles/shippingCode_admin.module.scss';
import axios from 'axios';
import LoadingAdmin from '../client_components/LoadingAdmin';
import { useNavigate } from 'react-router-dom';
import MediaQuery from 'react-responsive';

export default function ShippingCode_admin() {
  // 전체목록 불러오기
  const [orderData, setOrderData] = useState(null);
  const [retrievedData, setRetrievedData] = useState(null);
  const [returnData, setReturnData] = useState(null);
  // 업데이트된목록-결제완료 -> 배송중으로
  const [updateInfo, setUpdateInfo] = useState([]);
  // 업데이트된목록-상품회수목록 -> 배송중으로
  const [updateInfoRetrieved, setUpdateInfoRetrieved] = useState([]);

  // 화면전환용
  const [selector, setSelector] = useState('order');
  // useEffect 재랜더링용
  const [orderRedirect, setOrderRedirect] = useState(true);
  const [retrievedRedirect, setRetrievedRedirect] = useState(true);
  const [returnRedirect, setReturnRedirect] = useState(true);

  const navigate = useNavigate();
  // 송장번호 기록하는 곳
  const shippingCodeValue = useRef([]);
  const shippingCodeValueRetrieved = useRef([]);

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

  // 결제완료된 목록
  const getDoneListInfo = async () => {
    try {
      const adminDoneListInfo = await axios.get(
        'http://localhost:4000/admin/orderlist/shippingcode',
      );

      if (adminDoneListInfo.status !== 200) return alert('데이터 오류');
      // status 200이면,
      setOrderData((cur) => adminDoneListInfo.data);
      return;
    } catch (err) {
      console.error(err);
      return;
    }
  };

  // 회수목록 불러오기 (교환 + 환불)
  const getRetrievedList = async () => {
    try {
      const adminRetrievedInfo = await axios.get(
        'http://localhost:4000/admin/orderlist/retrieved',
      );

      if (adminRetrievedInfo.status !== 200) return alert('데이터 오류');
      // status 200이면,
      setRetrievedData((cur) => adminRetrievedInfo.data);
      return;
    } catch (err) {
      console.error(err);
      return;
    }
  };

  useEffect(() => {
    getDoneListInfo();
  }, [orderRedirect]);

  useEffect(() => {
    getRetrievedList();
  }, [retrievedRedirect]);

  // 핸들모음
  // 입금완료 목록
  const handleSelectorOrder = () => {
    setSelector((cur) => 'order');
  };

  // 상품회수 목록
  const handleSelectorRetrieved = () => {
    setSelector((cur) => 'retrieved');
  };

  // 교환상품배송 목록
  const handleSelectorReturn = () => {
    setSelector((cur) => 'return');
  };

  // 송장번호 등록하기
  const registerShippingcode = async (
    orderId,
    user,
    recipientName,
    recipientAddress,
    index,
  ) => {
    try {
      const response = await axios.post(
        'http://localhost:4000/admin/orderlist/register_shippingCode',
        {
          orderId,
          user,
          recipientName,
          recipientAddress,
          shippingCode: shippingCodeValue.current[index].value,
        },
      );

      if (response.status !== 200)
        return setOrderRedirect((cur) => !cur), alert('등록실패');

      // 200번대 성공이면,
      setUpdateInfo((cur) => {
        const copy = [...cur];
        copy.push(response.data);
        return copy;
      });
      shippingCodeValue.current[index].value = '';
      setOrderRedirect((cur) => !cur);
      return;
    } catch (err) {
      console.error(err);
    }
  };

  // 회수용 송장번호 등록하기
  const registerShippingcodeRetrieved = async (
    orderId,
    user,
    recipientName,
    recipientAddress,
    index,
  ) => {
    try {
      const response = await axios.post(
        'http://localhost:4000/admin/orderlist/register_shippingCode_retrieved',
        {
          orderId,
          user,
          recipientName,
          recipientAddress,
          shippingCode: shippingCodeValue.current[index].value,
        },
      );

      if (response.status !== 200)
        return setOrderRedirect((cur) => !cur), alert('등록실패');

      // 200번대 성공이면,
      setUpdateInfo((cur) => {
        const copy = [...cur];
        copy.push(response.data);
        return copy;
      });
      shippingCodeValue.current[index].value = '';
      setOrderRedirect((cur) => !cur);
      return;
    } catch (err) {
      console.error(err);
    }
  };

  // 랜더링 부분
  return (
    <div className={shippingCode.whol_Container}>
      <p className={shippingCode.mainTitle}>
        SHIPPING CODE REGISTER &nbsp;{' '}
        <span style={{ fontSize: '15px', fontWeight: '400' }}>Admin</span>
      </p>

      {orderData === null || retrievedData === null ? (
        <LoadingAdmin />
      ) : (
        selector === 'order' && (
          <>
            <div className={shippingCode.subMenu}>
              <p className={shippingCode.selector}>
                <span
                  className={
                    selector === 'order'
                      ? shippingCode.selector_order_on
                      : shippingCode.selector_order
                  }
                  onClick={handleSelectorOrder}
                >
                  결제완료 목록 (배송준비 중)
                </span>
                &nbsp;&nbsp;/&nbsp;&nbsp;
                <span
                  className={
                    selector === 'retrieved'
                      ? shippingCode.selector_cancel_on
                      : shippingCode.selector_cancel
                  }
                  onClick={handleSelectorRetrieved}
                >
                  상품회수 목록
                </span>
                &nbsp;&nbsp;/&nbsp;&nbsp;
                <span
                  className={
                    selector === 'return'
                      ? shippingCode.selector_cancel_on
                      : shippingCode.selector_cancel
                  }
                  onClick={handleSelectorReturn}
                >
                  교환상품배송 목록
                </span>
              </p>
              <p className={shippingCode.totalOrderCount}>
                Total :{' '}
                {selector === 'order' &&
                orderData !== null &&
                retrievedData !== null
                  ? orderData.length
                  : retrievedData.length}
              </p>
            </div>
            {/* 송장등록부분 -------------------------------- */}
            <ul className={shippingCode.list_ul_wrap}>
              <p className={shippingCode.index_desc}>
                <strong>Reci</strong> = 받는 이{' '}
              </p>
              <li className={shippingCode.listHeader}>
                <p>No.</p>
                <p>OrderID</p>
                <p>ShippingCode</p>
                <p>OrderName</p>
                <p>Amount</p>
                <p>User</p>
                <p>Reci</p>
                <p>Address</p>
                <p>P.H.</p>
                <p>Message</p>
                <p>Status</p>
              </li>
              <div className={shippingCode.listBox}>
                {orderData.map((el, index) => {
                  return (
                    <div key={index}>
                      <li className={shippingCode.list_li}>
                        <p>{index}</p>
                        <p>{el.shippingCode}</p>
                        <p>{el.payments.orderId}</p>
                        <p>{el.payments.orderName}</p>
                        <p>{frontPriceComma(el.payments.totalAmount)}</p>
                        <p>{el.user}</p>
                        <p>{el.recipient.recipientName}</p>
                        <p>{`(${el.recipient.recipientZipcode}) ${el.recipient.recipientAddress} ${el.recipient.recipientAddressDetail}`}</p>
                        <p>{`${el.recipient.phoneCode}-${el.recipient.phoneMidNum}-${el.recipient.phoneLastNum}`}</p>
                        <p>{el.recipient.message}</p>
                        <p>
                          {el.payments.status !== 'DONE' &&
                          !el.isShipping &&
                          el.shippingCode === 0 &&
                          !el.isDelivered &&
                          !el.isCancel &&
                          !el.isReturn &&
                          !el.isRetrieved &&
                          !el.isRefund &&
                          !el.isReturnSubmit ? (
                            '결제 전'
                          ) : el.payments.status === 'DONE' &&
                            !el.isShipping &&
                            el.shippingCode === 0 &&
                            !el.isDelivered &&
                            !el.isCancel &&
                            !el.isReturn &&
                            !el.isRetrieved &&
                            !el.isRefund &&
                            !el.isReturnSubmit ? (
                            '결제완료 (배송 전)'
                          ) : el.payments.status === 'DONE' &&
                            el.isShipping &&
                            el.shippingCode !== 0 &&
                            !el.isDelivered &&
                            !el.isCancel &&
                            !el.isReturn &&
                            !el.isRetrieved &&
                            !el.isRefund &&
                            !el.isReturnSubmit ? (
                            '배송중'
                          ) : el.payments.status === 'DONE' &&
                            !el.isShipping &&
                            el.shippingCode !== 0 &&
                            el.isDelivered &&
                            !el.isCancel &&
                            !el.isReturn &&
                            !el.isRetrieved &&
                            !el.isRefund &&
                            !el.isReturnSubmit ? (
                            '배송완료'
                          ) : el.payments.status === 'DONE' &&
                            !el.isShipping &&
                            el.shippingCode !== 0 &&
                            el.isDelivered &&
                            !el.isCancel &&
                            !el.isReturn &&
                            !el.isRetrieved &&
                            !el.isRefund &&
                            el.isReturnSubmit ? (
                            '반품신청 중'
                          ) : el.payments.status === 'DONE' &&
                            !el.isShipping &&
                            el.shippingCode !== 0 &&
                            el.isDelivered &&
                            !el.isCancel &&
                            el.isReturn &&
                            !el.isRetrieved &&
                            !el.isRefund &&
                            el.isReturnSubmit ? (
                            '교환진행 신청'
                          ) : el.payments.status === 'DONE' &&
                            el.isShipping &&
                            el.shippingCode !== 0 &&
                            el.isDelivered &&
                            !el.isCancel &&
                            el.isReturn &&
                            !el.isRetrieved &&
                            !el.isRefund &&
                            el.isReturnSubmit ? (
                            '상품회수 중 (교환)'
                          ) : el.payments.status === 'DONE' &&
                            !el.isShipping &&
                            el.shippingCode !== 0 &&
                            !el.isDelivered &&
                            !el.isCancel &&
                            el.isReturn &&
                            el.isRetrieved &&
                            !el.isRefund &&
                            el.isReturnSubmit ? (
                            '상품회수 완료 (교환)'
                          ) : el.payments.status === 'DONE' &&
                            el.isShipping &&
                            el.shippingCode !== 0 &&
                            !el.isDelivered &&
                            !el.isCancel &&
                            el.isReturn &&
                            el.isRetrieved &&
                            !el.isRefund &&
                            el.isReturnSubmit ? (
                            '교환상품 배송 중'
                          ) : el.payments.status === 'DONE' &&
                            !el.isShipping &&
                            el.shippingCode !== 0 &&
                            el.isDelivered &&
                            !el.isCancel &&
                            el.isReturn &&
                            !el.isRetrieved &&
                            !el.isRefund &&
                            !el.isReturnSubmit ? (
                            '교환상품 배송 완료'
                          ) : el.payments.status === 'DONE' &&
                            !el.isShipping &&
                            el.shippingCode !== 0 &&
                            el.isDelivered &&
                            !el.isCancel &&
                            !el.isReturn &&
                            !el.isRetrieved &&
                            el.isRefund &&
                            el.isReturnSubmit ? (
                            '환불진행 신청'
                          ) : el.payments.status === 'DONE' &&
                            el.isShipping &&
                            el.shippingCode !== 0 &&
                            el.isDelivered &&
                            !el.isCancel &&
                            !el.isReturn &&
                            !el.isRetrieved &&
                            el.isRefund &&
                            el.isReturnSubmit ? (
                            '상품회수 중 (환불)'
                          ) : el.payments.status === 'DONE' &&
                            !el.isShipping &&
                            el.shippingCode !== 0 &&
                            !el.isDelivered &&
                            !el.isCancel &&
                            !el.isReturn &&
                            el.isRetrieved &&
                            el.isRefund &&
                            el.isReturnSubmit ? (
                            '상품회수 완료 (환불)'
                          ) : (
                            <></>
                          )}
                        </p>
                      </li>
                      <div className={shippingCode.orderInputWrap}>
                        <span
                          className={shippingCode.orderShippingCodeInput_title}
                        >
                          송장번호입력 :{' '}
                        </span>
                        <input
                          type="text"
                          placeholder="유효한 송장번호를 입력하십시오."
                          name="shippingCode"
                          className={shippingCode.orderShippingCodeInput}
                          ref={(el) => (shippingCodeValue.current[index] = el)}
                        />
                        <div
                          className={shippingCode.shippingCodeBtn}
                          onClick={() =>
                            registerShippingcode(
                              el.payments.orderId,
                              el.user,
                              el.recipient.recipientName,
                              el.recipient.recipientAddress,
                              index,
                            )
                          }
                        >
                          등록
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 등록완료된 목록 -------------------------------- */}
              <p className={shippingCode.completeTitle}>송장등록완료목록</p>
              <p className={shippingCode.completeTitle}>
                완료: {updateInfo.length}
              </p>
              <li className={shippingCode.listHeader_complete}>
                <p>No.</p>
                <p>OrderID</p>
                <p>ShippingCode</p>
                <p>OrderName</p>
                <p>Amount</p>
                <p>User</p>
                <p>Reci</p>
                <p>Address</p>
                <p>P.H.</p>
                <p>Message</p>
                <p>Status</p>
              </li>
              <div className={shippingCode.listBox_complete}>
                {updateInfo.length === 0 ? (
                  <> </>
                ) : (
                  updateInfo.map((el, index) => {
                    return (
                      <div key={index}>
                        <li className={shippingCode.list_li}>
                          <p>{index}</p>
                          <p>{el.payments.orderId}</p>
                          <p>{el.shippingCode}</p>
                          <p>{el.payments.orderName}</p>
                          <p>{frontPriceComma(el.payments.totalAmount)}</p>
                          <p>{el.user}</p>
                          <p>{el.recipient.recipientName}</p>
                          <p>{`(${el.recipient.recipientZipcode}) ${el.recipient.recipientAddress} ${el.recipient.recipientAddressDetail}`}</p>
                          <p>{`${el.recipient.phoneCode}-${el.recipient.phoneMidNum}-${el.recipient.phoneLastNum}`}</p>
                          <p>{el.recipient.message}</p>
                          <p>
                            {el.payments.status !== 'DONE' &&
                            !el.isShipping &&
                            el.shippingCode === 0 &&
                            !el.isDelivered &&
                            !el.isCancel &&
                            !el.isReturn &&
                            !el.isRetrieved &&
                            !el.isRefund &&
                            !el.isReturnSubmit ? (
                              '결제 전'
                            ) : el.payments.status === 'DONE' &&
                              !el.isShipping &&
                              el.shippingCode === 0 &&
                              !el.isDelivered &&
                              !el.isCancel &&
                              !el.isReturn &&
                              !el.isRetrieved &&
                              !el.isRefund &&
                              !el.isReturnSubmit ? (
                              '결제완료 (배송 전)'
                            ) : el.payments.status === 'DONE' &&
                              el.isShipping &&
                              el.shippingCode !== 0 &&
                              !el.isDelivered &&
                              !el.isCancel &&
                              !el.isReturn &&
                              !el.isRetrieved &&
                              !el.isRefund &&
                              !el.isReturnSubmit ? (
                              '배송중'
                            ) : el.payments.status === 'DONE' &&
                              !el.isShipping &&
                              el.shippingCode !== 0 &&
                              el.isDelivered &&
                              !el.isCancel &&
                              !el.isReturn &&
                              !el.isRetrieved &&
                              !el.isRefund &&
                              !el.isReturnSubmit ? (
                              '배송완료'
                            ) : el.payments.status === 'DONE' &&
                              !el.isShipping &&
                              el.shippingCode !== 0 &&
                              el.isDelivered &&
                              !el.isCancel &&
                              !el.isReturn &&
                              !el.isRetrieved &&
                              !el.isRefund &&
                              el.isReturnSubmit ? (
                              '반품신청 중'
                            ) : el.payments.status === 'DONE' &&
                              !el.isShipping &&
                              el.shippingCode !== 0 &&
                              el.isDelivered &&
                              !el.isCancel &&
                              el.isReturn &&
                              !el.isRetrieved &&
                              !el.isRefund &&
                              el.isReturnSubmit ? (
                              '교환진행 신청'
                            ) : el.payments.status === 'DONE' &&
                              el.isShipping &&
                              el.shippingCode !== 0 &&
                              el.isDelivered &&
                              !el.isCancel &&
                              el.isReturn &&
                              !el.isRetrieved &&
                              !el.isRefund &&
                              el.isReturnSubmit ? (
                              '상품회수 중 (교환)'
                            ) : el.payments.status === 'DONE' &&
                              !el.isShipping &&
                              el.shippingCode !== 0 &&
                              !el.isDelivered &&
                              !el.isCancel &&
                              el.isReturn &&
                              el.isRetrieved &&
                              !el.isRefund &&
                              el.isReturnSubmit ? (
                              '상품회수 완료 (교환)'
                            ) : el.payments.status === 'DONE' &&
                              el.isShipping &&
                              el.shippingCode !== 0 &&
                              !el.isDelivered &&
                              !el.isCancel &&
                              el.isReturn &&
                              el.isRetrieved &&
                              !el.isRefund &&
                              el.isReturnSubmit ? (
                              '교환상품 배송 중'
                            ) : el.payments.status === 'DONE' &&
                              !el.isShipping &&
                              el.shippingCode !== 0 &&
                              el.isDelivered &&
                              !el.isCancel &&
                              el.isReturn &&
                              !el.isRetrieved &&
                              !el.isRefund &&
                              !el.isReturnSubmit ? (
                              '교환상품 배송 완료'
                            ) : el.payments.status === 'DONE' &&
                              !el.isShipping &&
                              el.shippingCode !== 0 &&
                              el.isDelivered &&
                              !el.isCancel &&
                              !el.isReturn &&
                              !el.isRetrieved &&
                              el.isRefund &&
                              el.isReturnSubmit ? (
                              '환불진행 신청'
                            ) : el.payments.status === 'DONE' &&
                              el.isShipping &&
                              el.shippingCode !== 0 &&
                              el.isDelivered &&
                              !el.isCancel &&
                              !el.isReturn &&
                              !el.isRetrieved &&
                              el.isRefund &&
                              el.isReturnSubmit ? (
                              '상품회수 중 (환불)'
                            ) : el.payments.status === 'DONE' &&
                              !el.isShipping &&
                              el.shippingCode !== 0 &&
                              !el.isDelivered &&
                              !el.isCancel &&
                              !el.isReturn &&
                              el.isRetrieved &&
                              el.isRefund &&
                              el.isReturnSubmit ? (
                              '상품회수 완료 (환불)'
                            ) : (
                              <></>
                            )}
                          </p>
                        </li>
                      </div>
                    );
                  })
                )}
              </div>
            </ul>
          </>
        )
      )}

      {selector === 'retrieved' && (
        <>
          <div className={shippingCode.subMenu}>
            <p className={shippingCode.selector}>
              <span
                className={
                  selector === 'order'
                    ? shippingCode.selector_order_on
                    : shippingCode.selector_order
                }
                onClick={handleSelectorOrder}
              >
                결제완료 목록 (배송준비 중)
              </span>
              &nbsp;&nbsp;/&nbsp;&nbsp;
              <span
                className={
                  selector === 'retrieved'
                    ? shippingCode.selector_cancel_on
                    : shippingCode.selector_cancel
                }
                onClick={handleSelectorRetrieved}
              >
                상품회수 목록
              </span>
              &nbsp;&nbsp;/&nbsp;&nbsp;
              <span
                className={
                  selector === 'return'
                    ? shippingCode.selector_cancel_on
                    : shippingCode.selector_cancel
                }
                onClick={handleSelectorReturn}
              >
                교환상품배송 목록
              </span>
            </p>
            <p className={shippingCode.totalOrderCount}>
              Total :{' '}
              {selector === 'retrieved' &&
              orderData !== null &&
              retrievedData !== null ? (
                retrievedData.length
              ) : (
                <></>
              )}
            </p>
          </div>

          {/* 송장등록부분 -------------------------------- */}
          <ul className={shippingCode.list_ul_wrap}>
            <p className={shippingCode.index_desc}>
              <strong>Reci</strong> = 받는 이{' '}
            </p>
            <li className={shippingCode.listHeader}>
              <p>No.</p>
              <p>OrderID</p>
              <p>ShippingCode</p>
              <p>OrderName</p>
              <p>Amount</p>
              <p>User</p>
              <p>Reci</p>
              <p>Address</p>
              <p>P.H.</p>
              <p>Message</p>
              <p>Status</p>
            </li>
            <div className={shippingCode.listBox}>
              {retrievedData.map((el, index) => {
                return (
                  <div key={index}>
                    <li className={shippingCode.list_li}>
                      <p>{index}</p>
                      <p>{el.shippingCode}</p>
                      <p>{el.payments.orderId}</p>
                      <p>{el.payments.orderName}</p>
                      <p>{frontPriceComma(el.payments.totalAmount)}</p>
                      <p>{el.user}</p>
                      <p>{el.recipient.recipientName}</p>
                      <p>{`(${el.recipient.recipientZipcode}) ${el.recipient.recipientAddress} ${el.recipient.recipientAddressDetail}`}</p>
                      <p>{`${el.recipient.phoneCode}-${el.recipient.phoneMidNum}-${el.recipient.phoneLastNum}`}</p>
                      <p>{el.recipient.message}</p>
                      <p>
                        {el.payments.status !== 'DONE' &&
                        !el.isShipping &&
                        el.shippingCode === 0 &&
                        !el.isDelivered &&
                        !el.isCancel &&
                        !el.isReturn &&
                        !el.isRetrieved &&
                        !el.isRefund &&
                        !el.isReturnSubmit ? (
                          '결제 전'
                        ) : el.payments.status === 'DONE' &&
                          !el.isShipping &&
                          el.shippingCode === 0 &&
                          !el.isDelivered &&
                          !el.isCancel &&
                          !el.isReturn &&
                          !el.isRetrieved &&
                          !el.isRefund &&
                          !el.isReturnSubmit ? (
                          '결제완료 (배송 전)'
                        ) : el.payments.status === 'DONE' &&
                          el.isShipping &&
                          el.shippingCode !== 0 &&
                          !el.isDelivered &&
                          !el.isCancel &&
                          !el.isReturn &&
                          !el.isRetrieved &&
                          !el.isRefund &&
                          !el.isReturnSubmit ? (
                          '배송중'
                        ) : el.payments.status === 'DONE' &&
                          !el.isShipping &&
                          el.shippingCode !== 0 &&
                          el.isDelivered &&
                          !el.isCancel &&
                          !el.isReturn &&
                          !el.isRetrieved &&
                          !el.isRefund &&
                          !el.isReturnSubmit ? (
                          '배송완료'
                        ) : el.payments.status === 'DONE' &&
                          !el.isShipping &&
                          el.shippingCode !== 0 &&
                          el.isDelivered &&
                          !el.isCancel &&
                          !el.isReturn &&
                          !el.isRetrieved &&
                          !el.isRefund &&
                          el.isReturnSubmit ? (
                          '반품신청 중'
                        ) : el.payments.status === 'DONE' &&
                          !el.isShipping &&
                          el.shippingCode !== 0 &&
                          el.isDelivered &&
                          !el.isCancel &&
                          el.isReturn &&
                          !el.isRetrieved &&
                          !el.isRefund &&
                          el.isReturnSubmit ? (
                          '교환진행 신청'
                        ) : el.payments.status === 'DONE' &&
                          el.isShipping &&
                          el.shippingCode !== 0 &&
                          el.isDelivered &&
                          !el.isCancel &&
                          el.isReturn &&
                          !el.isRetrieved &&
                          !el.isRefund &&
                          el.isReturnSubmit ? (
                          '상품회수 중 (교환)'
                        ) : el.payments.status === 'DONE' &&
                          !el.isShipping &&
                          el.shippingCode !== 0 &&
                          !el.isDelivered &&
                          !el.isCancel &&
                          el.isReturn &&
                          el.isRetrieved &&
                          !el.isRefund &&
                          el.isReturnSubmit ? (
                          '상품회수 완료 (교환)'
                        ) : el.payments.status === 'DONE' &&
                          el.isShipping &&
                          el.shippingCode !== 0 &&
                          !el.isDelivered &&
                          !el.isCancel &&
                          el.isReturn &&
                          el.isRetrieved &&
                          !el.isRefund &&
                          el.isReturnSubmit ? (
                          '교환상품 배송 중'
                        ) : el.payments.status === 'DONE' &&
                          !el.isShipping &&
                          el.shippingCode !== 0 &&
                          el.isDelivered &&
                          !el.isCancel &&
                          el.isReturn &&
                          !el.isRetrieved &&
                          !el.isRefund &&
                          !el.isReturnSubmit ? (
                          '교환상품 배송 완료'
                        ) : el.payments.status === 'DONE' &&
                          !el.isShipping &&
                          el.shippingCode !== 0 &&
                          el.isDelivered &&
                          !el.isCancel &&
                          !el.isReturn &&
                          !el.isRetrieved &&
                          el.isRefund &&
                          el.isReturnSubmit ? (
                          '환불진행 신청'
                        ) : el.payments.status === 'DONE' &&
                          el.isShipping &&
                          el.shippingCode !== 0 &&
                          el.isDelivered &&
                          !el.isCancel &&
                          !el.isReturn &&
                          !el.isRetrieved &&
                          el.isRefund &&
                          el.isReturnSubmit ? (
                          '상품회수 중 (환불)'
                        ) : el.payments.status === 'DONE' &&
                          !el.isShipping &&
                          el.shippingCode !== 0 &&
                          !el.isDelivered &&
                          !el.isCancel &&
                          !el.isReturn &&
                          el.isRetrieved &&
                          el.isRefund &&
                          el.isReturnSubmit ? (
                          '상품회수 완료 (환불)'
                        ) : (
                          <></>
                        )}
                      </p>
                    </li>
                    <div className={shippingCode.orderInputWrap}>
                      <span
                        className={shippingCode.orderShippingCodeInput_title}
                      >
                        회수용 송장번호입력 :{' '}
                      </span>
                      <input
                        type="text"
                        placeholder="유효한 회수용 송장번호를 입력하십시오."
                        name="shippingCode"
                        className={shippingCode.orderShippingCodeInput}
                        ref={(el) =>
                          (shippingCodeValueRetrieved.current[index] = el)
                        }
                      />
                      <div
                        className={shippingCode.shippingCodeBtn}
                        onClick={() =>
                          registerShippingcode(
                            el.payments.orderId,
                            el.user,
                            el.recipient.recipientName,
                            el.recipient.recipientAddress,
                            index,
                          )
                        }
                      >
                        등록
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 등록완료된 목록 -------------------------------- */}
            <p className={shippingCode.completeTitle}>송장등록완료목록</p>
            <p className={shippingCode.completeTitle}>
              완료: {updateInfoRetrieved.length}
            </p>
            <li className={shippingCode.listHeader_complete}>
              <p>No.</p>
              <p>OrderID</p>
              <p>ShippingCode</p>
              <p>OrderName</p>
              <p>Amount</p>
              <p>User</p>
              <p>Reci</p>
              <p>Address</p>
              <p>P.H.</p>
              <p>Message</p>
              <p>Status</p>
            </li>
            <div className={shippingCode.listBox_complete}>
              {updateInfoRetrieved.length === 0 ? (
                <> </>
              ) : (
                updateInfoRetrieved.map((el, index) => {
                  return (
                    <div key={index}>
                      <li className={shippingCode.list_li}>
                        <p>{index}</p>
                        <p>{el.payments.orderId}</p>
                        <p>{el.shippingCode}</p>
                        <p>{el.payments.orderName}</p>
                        <p>{frontPriceComma(el.payments.totalAmount)}</p>
                        <p>{el.user}</p>
                        <p>{el.recipient.recipientName}</p>
                        <p>{`(${el.recipient.recipientZipcode}) ${el.recipient.recipientAddress} ${el.recipient.recipientAddressDetail}`}</p>
                        <p>{`${el.recipient.phoneCode}-${el.recipient.phoneMidNum}-${el.recipient.phoneLastNum}`}</p>
                        <p>{el.recipient.message}</p>
                        <p>
                          {el.payments.status !== 'DONE' &&
                          !el.isShipping &&
                          el.shippingCode === 0 &&
                          !el.isDelivered &&
                          !el.isCancel &&
                          !el.isReturn &&
                          !el.isRetrieved &&
                          !el.isRefund &&
                          !el.isReturnSubmit ? (
                            '결제 전'
                          ) : el.payments.status === 'DONE' &&
                            !el.isShipping &&
                            el.shippingCode === 0 &&
                            !el.isDelivered &&
                            !el.isCancel &&
                            !el.isReturn &&
                            !el.isRetrieved &&
                            !el.isRefund &&
                            !el.isReturnSubmit ? (
                            '결제완료 (배송 전)'
                          ) : el.payments.status === 'DONE' &&
                            el.isShipping &&
                            el.shippingCode !== 0 &&
                            !el.isDelivered &&
                            !el.isCancel &&
                            !el.isReturn &&
                            !el.isRetrieved &&
                            !el.isRefund &&
                            !el.isReturnSubmit ? (
                            '배송중'
                          ) : el.payments.status === 'DONE' &&
                            !el.isShipping &&
                            el.shippingCode !== 0 &&
                            el.isDelivered &&
                            !el.isCancel &&
                            !el.isReturn &&
                            !el.isRetrieved &&
                            !el.isRefund &&
                            !el.isReturnSubmit ? (
                            '배송완료'
                          ) : el.payments.status === 'DONE' &&
                            !el.isShipping &&
                            el.shippingCode !== 0 &&
                            el.isDelivered &&
                            !el.isCancel &&
                            !el.isReturn &&
                            !el.isRetrieved &&
                            !el.isRefund &&
                            el.isReturnSubmit ? (
                            '반품신청 중'
                          ) : el.payments.status === 'DONE' &&
                            !el.isShipping &&
                            el.shippingCode !== 0 &&
                            el.isDelivered &&
                            !el.isCancel &&
                            el.isReturn &&
                            !el.isRetrieved &&
                            !el.isRefund &&
                            el.isReturnSubmit ? (
                            '교환진행 신청'
                          ) : el.payments.status === 'DONE' &&
                            el.isShipping &&
                            el.shippingCode !== 0 &&
                            el.isDelivered &&
                            !el.isCancel &&
                            el.isReturn &&
                            !el.isRetrieved &&
                            !el.isRefund &&
                            el.isReturnSubmit ? (
                            '상품회수 중 (교환)'
                          ) : el.payments.status === 'DONE' &&
                            !el.isShipping &&
                            el.shippingCode !== 0 &&
                            !el.isDelivered &&
                            !el.isCancel &&
                            el.isReturn &&
                            el.isRetrieved &&
                            !el.isRefund &&
                            el.isReturnSubmit ? (
                            '상품회수 완료 (교환)'
                          ) : el.payments.status === 'DONE' &&
                            el.isShipping &&
                            el.shippingCode !== 0 &&
                            !el.isDelivered &&
                            !el.isCancel &&
                            el.isReturn &&
                            el.isRetrieved &&
                            !el.isRefund &&
                            el.isReturnSubmit ? (
                            '교환상품 배송 중'
                          ) : el.payments.status === 'DONE' &&
                            !el.isShipping &&
                            el.shippingCode !== 0 &&
                            el.isDelivered &&
                            !el.isCancel &&
                            el.isReturn &&
                            !el.isRetrieved &&
                            !el.isRefund &&
                            !el.isReturnSubmit ? (
                            '교환상품 배송 완료'
                          ) : el.payments.status === 'DONE' &&
                            !el.isShipping &&
                            el.shippingCode !== 0 &&
                            el.isDelivered &&
                            !el.isCancel &&
                            !el.isReturn &&
                            !el.isRetrieved &&
                            el.isRefund &&
                            el.isReturnSubmit ? (
                            '환불진행 신청'
                          ) : el.payments.status === 'DONE' &&
                            el.isShipping &&
                            el.shippingCode !== 0 &&
                            el.isDelivered &&
                            !el.isCancel &&
                            !el.isReturn &&
                            !el.isRetrieved &&
                            el.isRefund &&
                            el.isReturnSubmit ? (
                            '상품회수 중 (환불)'
                          ) : el.payments.status === 'DONE' &&
                            !el.isShipping &&
                            el.shippingCode !== 0 &&
                            !el.isDelivered &&
                            !el.isCancel &&
                            !el.isReturn &&
                            el.isRetrieved &&
                            el.isRefund &&
                            el.isReturnSubmit ? (
                            '상품회수 완료 (환불)'
                          ) : (
                            <></>
                          )}
                        </p>
                      </li>
                    </div>
                  );
                })
              )}
            </div>
          </ul>
        </>
      )}

      {selector === 'return' && (
        <>
          <div className={shippingCode.subMenu}>
            <p className={shippingCode.selector}>
              <span
                className={
                  selector === 'order'
                    ? shippingCode.selector_order_on
                    : shippingCode.selector_order
                }
                onClick={handleSelectorOrder}
              >
                결제완료 목록 (배송준비 중)
              </span>
              &nbsp;&nbsp;/&nbsp;&nbsp;
              <span
                className={
                  selector === 'retrieved'
                    ? shippingCode.selector_cancel_on
                    : shippingCode.selector_cancel
                }
                onClick={handleSelectorRetrieved}
              >
                상품회수 목록
              </span>
              &nbsp;&nbsp;/&nbsp;&nbsp;
              <span
                className={
                  selector === 'return'
                    ? shippingCode.selector_cancel_on
                    : shippingCode.selector_cancel
                }
                onClick={handleSelectorReturn}
              >
                교환상품배송 목록
              </span>
            </p>
            <p className={shippingCode.totalOrderCount}>
              Total :{' '}
              {selector === 'return' &&
              orderData !== null &&
              retrievedData !== null
                ? orderData.length
                : retrievedData.length}
            </p>
          </div>
          <p>기다려</p>
        </>
      )}
    </div>
  );
}
