import React, { useEffect, useState } from 'react';
import shippingCode from '../../styles/shippingCode_admin.module.scss';
import axios from 'axios';
import LoadingAdmin from '../client_components/LoadingAdmin';
import { useNavigate } from 'react-router-dom';
import MediaQuery from 'react-responsive';

export default function ShippingCode_admin() {
  const [orderData, setOrderData] = useState(null);
  const [retrievedData, setRetrievedData] = useState(null);
  const [returnData, setReturnData] = useState(null);
  const [selector, setSelector] = useState('order');
  const navigate = useNavigate();

  const getDoneListInfo = async () => {
    try {
      const adminDoneListInfo = await axios.get(
        'http://localhost:4000/admin/orderlist/shippingcode',
      );

      if (adminDoneListInfo.status !== 200) return alert('데이터 오류');
      // status 200이면,
      console.log('결제완료리스트', adminDoneListInfo.data);
      setOrderData((cur) => adminDoneListInfo.data);
      return;
    } catch (err) {
      console.error(err);
      return;
    }
  };

  const getRetrievedList = async () => {
    try {
      const adminRetrievedInfo = await axios.get(
        'http://localhost:4000/admin/orderlist/retrieved',
      );

      if (adminRetrievedInfo.status !== 200) return alert('데이터 오류');
      // status 200이면,
      console.log('회수리스트', adminRetrievedInfo.data);
      setRetrievedData((cur) => adminRetrievedInfo.data);
      return;
    } catch (err) {
      console.error(err);
      return;
    }
  };

  useEffect(() => {
    getDoneListInfo();
    getRetrievedList();
  }, []);

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
                    selector === 'cancel'
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
                    selector === 'retrieved'
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
            <ul className={shippingCode.list_ul_wrap}>
              <li className={shippingCode.listHeader}>
                <MediaQuery minWidth={491}>
                  <p>No.</p>
                </MediaQuery>
                <MediaQuery maxWidth={490}>
                  <p>#</p>
                </MediaQuery>
                <p>OrderID</p>
                <p>OrderName</p>
                <p>User</p>
                <MediaQuery minWidth={281}>
                  <p>Recipient</p>
                </MediaQuery>
                <MediaQuery maxWidth={280}>
                  <p>Recip</p>
                </MediaQuery>
                <p>Status</p>
              </li>
              {orderData.map((el, index) => {
                return (
                  <li
                    className={shippingCode.list_li}
                    key={index}
                    onClick={() =>
                      navigate(`/admin/orderlist/detail/${el.payments.orderId}`)
                    }
                  >
                    <p>{index}</p>
                    <p>{el.payments.orderId}</p>
                    <p>{el.payments.orderName}</p>
                    <p>{el.user}</p>
                    <p>{el.recipient.recipientName}</p>
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
                );
              })}
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
                  selector === 'cancel'
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
                  selector === 'cancel'
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
          <ul className={shippingCode.list_ul_wrap_Cancel}>
            <li className={shippingCode.listHeader_cancel}>
              <MediaQuery minWidth={491}>
                <p>No.</p>
              </MediaQuery>
              <MediaQuery maxWidth={490}>
                <p>#</p>
              </MediaQuery>
              <p>OrderID</p>
              <p>OrderName</p>
              <p>User</p>
              <MediaQuery minWidth={281}>
                <p>Recipient</p>
              </MediaQuery>
              <MediaQuery maxWidth={280}>
                <p>Recip</p>
              </MediaQuery>
              <p>Status</p>
            </li>
            {retrievedData.map((el, index) => {
              return (
                <li
                  className={shippingCode.list_li}
                  key={index}
                  // onClick={() =>
                  //   navigate(
                  //     `/admin/orderlist/detaliCancel/${el.payments.orderId}`,
                  //   )
                  // }
                >
                  <p>No. {index}</p>
                  <p>OrderID : {el.payments.orderId}</p>
                  <p>OrderName : {el.payments.orderName}</p>
                  <p>User : {el.user}</p>
                  <p>
                    Status :{' '}
                    {el.payments.status === 'CANCELED' &&
                    !el.isOrdered &&
                    !el.isShipping &&
                    el.shippingCode !== 0 &&
                    !el.isDelivered &&
                    el.isCancel &&
                    !el.isReturn &&
                    el.isRetrieved &&
                    el.isRefund &&
                    el.isReturnSubmit ? (
                      '환불완료'
                    ) : el.payments.status === 'CANCELED' &&
                      !el.isOrdered &&
                      !el.isShipping &&
                      el.shippingCode === 0 &&
                      !el.isDelivered &&
                      el.isCancel &&
                      !el.isReturn &&
                      !el.isRetrieved &&
                      !el.isRefund &&
                      !el.isReturnSubmit ? (
                      '결제취소'
                    ) : (
                      <></>
                    )}
                  </p>
                  <p>Reason : {el.cancels.cancelReason}</p>
                </li>
              );
            })}
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
                  selector === 'cancel'
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
                  selector === 'retrieved'
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
