/* eslint-disable no-undef */
import React, {
  ChangeEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import shippingCode from '../../styles/shippingCode_admin.module.scss';
import axios from 'axios';
import LoadingAdmin from '../client_components/LoadingAdmin';
import { useNavigate } from 'react-router-dom';
import MediaQuery from 'react-responsive';

const { REACT_APP_KEY_BACK } = process.env;

export default function ShippingCode_admin() {
  // 전체목록 불러오기
  const [orderData, setOrderData] = useState<Order_Cancel_ListType[] | null>(
    null,
  );
  const [retrievedData, setRetrievedData] = useState<
    Order_Cancel_ListType[] | null
  >(null);
  const [returnData, setReturnData] = useState<Order_Cancel_ListType[] | null>(
    null,
  );

  // 업데이트된목록-결제완료 -> 배송중으로
  const [updateInfo, setUpdateInfo] = useState<Order_Cancel_ListType[]>([]);
  // 업데이트된목록-상품회수목록 -> 배송중으로
  const [updateInfoRetrieved, setUpdateInfoRetrieved] = useState<
    Order_Cancel_ListType[]
  >([]);
  // 업데이트된목록-교환상품배송준비중 -> 배송중으로
  const [updateInfoReturn, setUpdateInfoReturn] = useState<
    Order_Cancel_ListType[]
  >([]);

  // 화면전환용
  const [selector, setSelector] = useState<'order' | 'retrieved' | 'return'>(
    'order',
  );
  // useEffect 재랜더링용
  const [orderRedirect, setOrderRedirect] = useState<boolean>(true);
  const [retrievedRedirect, setRetrievedRedirect] = useState<boolean>(true);
  const [returnRedirect, setReturnRedirect] = useState<boolean>(true);

  const navigate = useNavigate();

  // 엔터키 구성
  // onClick 버튼 컨트롤 - 일반배송
  const shippingCodeClick = useRef<HTMLDivElement[]>([]);
  // 인풋에 엔터 입력하기
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    e.key === 'Enter' ? shippingCodeClick.current[index].click() : null;
  };
  // onClick 버튼 컨트롤 - 회수용
  const shippingCodeClickRetrieved = useRef<HTMLDivElement[]>([]);
  // 인풋에 엔터 입력하기
  const handleKeyDownRetrieved = (
    e: KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    e.key === 'Enter'
      ? shippingCodeClickRetrieved.current[index].click()
      : null;
  };
  // onClick 버튼 컨트롤 - 교환용
  const shippingCodeClickReturn = useRef<HTMLDivElement[]>([]);
  // 인풋에 엔터 입력하기
  const handleKeyDownReturn = (
    e: KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    e.key === 'Enter' ? shippingCodeClickReturn.current[index].click() : null;
  };

  // 송장 입력 칸 유효성 검사 - 일반송장입력
  const [inputValue, setInputValue] = useState<string[]>([]);
  const handleInput = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    // 숫자만 입력하는 정규식
    const regex = /^\d+$/;

    if (regex.test(value) || value === '') {
      const newInputValue = [...inputValue];
      newInputValue[index] = value;
      setInputValue(newInputValue);
    }
  };

  // 송장 입력 칸 유효성 검사 - 회수목록
  const [inputValueRetrieved, setInputValueRetrieved] = useState<string[]>([]);
  const handleInputRetrieved = (
    e: ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const value = e.target.value;
    // 숫자만 입력하는 정규식
    const regex = /^\d+$/;

    if (regex.test(value) || value === '') {
      const newInputValue = [...inputValueRetrieved];
      newInputValue[index] = value;
      setInputValueRetrieved(newInputValue);
    }
  };

  // 송장 입력 칸 유효성 검사 - 교환상품목록
  const [inputValueReturn, setInputValueReturn] = useState<string[]>([]);
  const handleInputReturn = (
    e: ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const value = e.target.value;
    // 숫자만 입력하는 정규식
    const regex = /^\d+$/;

    if (regex.test(value) || value === '') {
      const newInputValue = [...inputValueReturn];
      newInputValue[index] = value;
      setInputValueReturn(newInputValue);
    }
  };

  // 결제완료된 목록
  useEffect(() => {
    const getDoneListInfo = async () => {
      try {
        const adminDoneListInfo = await axios.get(
          `${REACT_APP_KEY_BACK}/admin/orderlist/shippingcode`,
        );

        if (adminDoneListInfo.status === 200) {
          // status 200이면,
          setOrderData(adminDoneListInfo.data);
          setInputValue(Array(adminDoneListInfo.data.length).fill(''));
          return;
        }
      } catch (err: any) {
        navigate(
          `/error?errorMessage=${err.response.data}&errorCode=${err.response.status}`,
        );
        console.error(err);
        return;
      }
    };

    getDoneListInfo();
  }, [orderRedirect]);

  // 회수목록 불러오기 (교환 + 환불)
  useEffect(() => {
    const getRetrievedList = async () => {
      try {
        const adminRetrievedInfo = await axios.get(
          `${REACT_APP_KEY_BACK}/admin/orderlist/retrieved`,
        );

        if (adminRetrievedInfo.status === 200) {
          // status 200이면,
          setRetrievedData(adminRetrievedInfo.data);
          setInputValueRetrieved(
            Array(adminRetrievedInfo.data.length).fill(''),
          );
          return;
        }
      } catch (err: any) {
        navigate(
          `/error?errorMessage=${err.response.data}&errorCode=${err.response.status}`,
        );
        console.error(err);
        return;
      }
    };

    getRetrievedList();
  }, [retrievedRedirect]);

  // 상품 회수 후 교환상품 배송해야하는 목록 불러오기
  useEffect(() => {
    const getReturnList = async () => {
      try {
        const adminReturnInfo = await axios.get(
          `${REACT_APP_KEY_BACK}/admin/orderlist/return`,
        );

        if (adminReturnInfo.status === 200) {
          // status 200이면,
          setReturnData(adminReturnInfo.data);
          setInputValueReturn(Array(adminReturnInfo.data.length).fill(''));
          return;
        }
      } catch (err: any) {
        navigate(
          `/error?errorMessage=${err.response.data}&errorCode=${err.response.status}`,
        );
        console.error(err);
        return;
      }
    };

    getReturnList();
  }, [returnRedirect]);

  // 핸들모음
  // 입금완료 목록
  const handleSelectorOrder = () => {
    setSelector('order');
  };

  // 상품회수 목록
  const handleSelectorRetrieved = () => {
    setSelector('retrieved');
  };

  // 교환상품배송 목록
  const handleSelectorReturn = () => {
    setSelector('return');
  };

  // 송장번호 등록하기 // 등록시에만 세팅하도록callback
  const registerShippingcode = async (
    orderId: string,
    user: string,
    recipientName: string,
    recipientAddress: string,
    index: number,
  ) => {
    try {
      if (!inputValue[index]) return alert('송장번호를 입력해주세요.');

      if (inputValue[index].length < 10)
        return alert('유효한 송장번호는 10자 이상입니다.');

      // 아니라면 아래 진행
      const response = await axios.post(
        `${REACT_APP_KEY_BACK}/admin/orderlist/register_shippingCode`,
        {
          orderId,
          user,
          recipientName,
          recipientAddress,
          shippingCode: inputValue[index],
        },
      );

      if (response.status === 200) {
        // 200번대 성공이면,
        setUpdateInfo((cur) => {
          const copy = [...cur];
          copy.push(response.data);
          return copy;
        });
        inputValue[index] = '';
        setOrderRedirect((cur) => !cur);
        return;
      }
    } catch (err) {
      console.error(err);
      return setOrderRedirect((cur) => !cur), alert('등록실패');
    }
  };

  // 회수용 송장번호 등록하기 // 등록시에만 세팅하도록callback
  const registerShippingcodeRetrieved = async (
    orderId: string,
    user: string,
    recipientName: string,
    recipientAddress: string,
    index: number,
  ) => {
    try {
      if (!inputValueRetrieved[index]) return alert('송장번호를 입력해주세요.');

      if (inputValueRetrieved[index].length < 10)
        return alert('유효한 송장번호는 10자 이상입니다.');

      const response = await axios.post(
        `${REACT_APP_KEY_BACK}/admin/orderlist/register_shippingCode_retrieved`,
        {
          orderId,
          user,
          recipientName,
          recipientAddress,
          newShippingCode: inputValueRetrieved[index],
        },
      );

      if (response.status === 200) {
        // 200번대 성공이면,
        setUpdateInfoRetrieved((cur) => {
          const copy = [...cur];
          copy.push(response.data);
          return copy;
        });
        inputValueRetrieved[index] = '';
        setRetrievedRedirect((cur) => !cur);
        return;
      }
    } catch (err: any) {
      if (err.response.status === 400) {
        setRetrievedRedirect((cur) => !cur);
        alert(err.response.data);
      } else {
        console.error(err);
        return setRetrievedRedirect((cur) => !cur), alert('등록실패');
      }
    }
  };

  // 교환상품배송을 위한 송장등록 // 등록시에만 세팅하도록callback
  const registerShippingcodeReturn = async (
    orderId: string,
    user: string,
    recipientName: string,
    recipientAddress: string,
    index: number,
  ) => {
    try {
      if (!inputValueReturn[index]) return alert('송장번호를 입력해주세요.');

      if (inputValueReturn[index].length < 10)
        return alert('유효한 송장번호는 10자 이상입니다.');

      const response = await axios.post(
        `${REACT_APP_KEY_BACK}/admin/orderlist/register_shippingCode_return`,
        {
          orderId,
          user,
          recipientName,
          recipientAddress,
          newShippingCode: inputValueReturn[index],
        },
      );

      if (response.status !== 200) {
        // 200번대 성공이면,
        setUpdateInfoReturn((cur) => {
          const copy = [...cur];
          copy.push(response.data);
          return copy;
        });
        inputValueReturn[index] = '';
        setReturnRedirect((cur) => !cur);
        return;
      }
    } catch (err: any) {
      if (err.response.status === 400) {
        setReturnRedirect((cur) => !cur);
        alert(err.response.data);
      } else {
        console.error(err);
        return setReturnRedirect((cur) => !cur), alert('등록실패');
      }
    }
  };

  // 랜더링 부분
  return (
    <div className={shippingCode.whol_Container}>
      <p className={shippingCode.mainTitle}>
        SHIPPING CODE REGISTER &nbsp;{' '}
        <span style={{ fontSize: '15px', fontWeight: '400' }}>Admin</span>
      </p>

      {orderData === null || retrievedData === null || returnData === null ? (
        <LoadingAdmin />
      ) : (
        selector === 'order' && (
          <>
            <div className={shippingCode.subMenu}>
              <MediaQuery minWidth={412}>
                <p className={shippingCode.selector}>
                  <span
                    className={shippingCode.selector_order_on}
                    onClick={handleSelectorOrder}
                  >
                    결제완료 목록 (배송준비 중)
                  </span>
                  &nbsp;&nbsp;/&nbsp;&nbsp;
                  <span
                    className={shippingCode.selector_cancel}
                    onClick={handleSelectorRetrieved}
                  >
                    상품회수 목록
                  </span>
                  &nbsp;&nbsp;/&nbsp;&nbsp;
                  <span
                    className={shippingCode.selector_cancel}
                    onClick={handleSelectorReturn}
                  >
                    교환상품배송 목록
                  </span>
                </p>
              </MediaQuery>
              <MediaQuery maxWidth={411}>
                <div className={shippingCode.selector}>
                  <p
                    className={shippingCode.selector_order_on}
                    onClick={handleSelectorOrder}
                  >
                    결제완료 목록 (배송준비 중)
                  </p>
                  <p
                    className={shippingCode.selector_cancel}
                    onClick={handleSelectorRetrieved}
                  >
                    상품회수 목록
                  </p>
                  <p
                    className={shippingCode.selector_cancel}
                    onClick={handleSelectorReturn}
                  >
                    교환상품배송 목록
                  </p>
                </div>
              </MediaQuery>

              <p className={shippingCode.totalOrderCount}>
                Total :{' '}
                {selector === 'order' &&
                orderData !== null &&
                retrievedData !== null &&
                returnData !== null ? (
                  orderData.length
                ) : (
                  <></>
                )}
              </p>
            </div>

            {/* 송장등록부분 -------------------------------- */}
            <ul className={shippingCode.list_ul_wrap}>
              <p className={shippingCode.index_desc}>
                <MediaQuery minWidth={1251}>
                  <strong>Reci</strong> = 받는 이{' '}
                </MediaQuery>
                <MediaQuery maxWidth={1250} minWidth={780}>
                  <strong>SC</strong> = 송장번호 &nbsp;&nbsp;&nbsp;
                  <strong>Am</strong> = 결제금액 &nbsp;&nbsp;&nbsp;
                  <strong>Re</strong> = 받는 이
                </MediaQuery>
                <MediaQuery maxWidth={779} minWidth={491}>
                  <strong>SC</strong> = 송장번호 &nbsp;&nbsp;&nbsp;
                  <strong>O.N.</strong> = 상품이름&nbsp;&nbsp;&nbsp;
                  <strong>Am</strong> = 결제금액&nbsp;&nbsp;&nbsp;
                  <strong>Re</strong> = 받는 이&nbsp;&nbsp;&nbsp;
                  <strong>Ms</strong> = 배송메세지&nbsp;&nbsp;&nbsp;
                </MediaQuery>
                <MediaQuery maxWidth={490}>
                  <strong>OI</strong> = 주문번호 &nbsp;&nbsp;&nbsp;
                  <strong>SC</strong> = 송장번호 &nbsp;&nbsp;&nbsp;
                  <strong>O.N.</strong> = 상품이름&nbsp;&nbsp;&nbsp;
                </MediaQuery>
              </p>
              <MediaQuery maxWidth={490} minWidth={281}>
                <p className={shippingCode.index_desc}>
                  <strong>Am</strong> = 결제금액&nbsp;&nbsp;&nbsp;
                  <strong>Re</strong> = 받는 이&nbsp;&nbsp;&nbsp;
                  <strong>Ms</strong> = 배송메세지&nbsp;&nbsp;&nbsp;
                  <strong>St</strong> = 배송상태&nbsp;&nbsp;&nbsp;
                </p>
              </MediaQuery>
              <MediaQuery maxWidth={280}>
                <p className={shippingCode.index_desc}>
                  <strong>Am</strong> = 결제금액&nbsp;&nbsp;&nbsp;
                  <strong>Re</strong> = 받는 이&nbsp;&nbsp;&nbsp;
                </p>
              </MediaQuery>
              <MediaQuery maxWidth={280}>
                <p className={shippingCode.index_desc}>
                  <strong>Ms</strong> = 배송메세지&nbsp;&nbsp;&nbsp;
                  <strong>St</strong> = 배송상태&nbsp;&nbsp;&nbsp;
                </p>
              </MediaQuery>
              <li className={shippingCode.listHeader}>
                <MediaQuery minWidth={1081}>
                  <p>No.</p>
                </MediaQuery>
                <MediaQuery maxWidth={1080}>
                  <p>#</p>
                </MediaQuery>
                <MediaQuery minWidth={491}>
                  <p>OrderID</p>
                </MediaQuery>
                <MediaQuery maxWidth={490}>
                  <p>OI</p>
                </MediaQuery>
                <MediaQuery minWidth={1251}>
                  <p>ShippingCode</p>
                </MediaQuery>
                <MediaQuery maxWidth={1250}>
                  <p>SC</p>
                </MediaQuery>
                <MediaQuery minWidth={780}>
                  <p>OrderName</p>
                </MediaQuery>
                <MediaQuery maxWidth={779}>
                  <p>O.N.</p>
                </MediaQuery>
                <MediaQuery minWidth={1251}>
                  <p>Amount</p>
                </MediaQuery>
                <MediaQuery maxWidth={1250}>
                  <p>Am</p>
                </MediaQuery>
                <p>User</p>
                <MediaQuery minWidth={1251}>
                  <p>Reci</p>
                </MediaQuery>
                <MediaQuery maxWidth={1250}>
                  <p>Rc</p>
                </MediaQuery>
                <p>Address</p>
                <p>P.H.</p>
                <MediaQuery minWidth={780}>
                  <p>Message</p>
                </MediaQuery>
                <MediaQuery maxWidth={779}>
                  <p>Ms</p>
                </MediaQuery>
                <MediaQuery minWidth={491}>
                  <p>Status</p>
                </MediaQuery>
                <MediaQuery maxWidth={490}>
                  <p>St</p>
                </MediaQuery>
              </li>
              <div className={shippingCode.listBox}>
                {orderData.map((el, index) => {
                  return (
                    <div key={index}>
                      <li className={shippingCode.list_li}>
                        <p>{index}</p>
                        <p>{el.payments.orderId}</p>
                        <p>{el.shippingCode}</p>
                        <p>{el.payments.orderName}</p>
                        <p>{el.payments.totalAmount.toLocaleString('ko-KR')}</p>
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
                          placeholder="송장번호입력"
                          value={inputValue[index]}
                          name="shippingCode"
                          onChange={(e) => handleInput(e, index)}
                          onKeyDown={(e) => handleKeyDown(e, index)}
                          className={shippingCode.orderShippingCodeInput}
                        />

                        <div
                          className={shippingCode.shippingCodeBtn}
                          ref={(el) => {
                            if (el) {
                              shippingCodeClick.current[index] = el;
                            }
                          }}
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
                <MediaQuery minWidth={1081}>
                  <p>No.</p>
                </MediaQuery>
                <MediaQuery maxWidth={1080}>
                  <p>#</p>
                </MediaQuery>
                <MediaQuery minWidth={491}>
                  <p>OrderID</p>
                </MediaQuery>
                <MediaQuery maxWidth={490}>
                  <p>OI</p>
                </MediaQuery>
                <MediaQuery minWidth={1251}>
                  <p>ShippingCode</p>
                </MediaQuery>
                <MediaQuery maxWidth={1250}>
                  <p>SC</p>
                </MediaQuery>
                <MediaQuery minWidth={780}>
                  <p>OrderName</p>
                </MediaQuery>
                <MediaQuery maxWidth={779}>
                  <p>O.N.</p>
                </MediaQuery>
                <MediaQuery minWidth={1251}>
                  <p>Amount</p>
                </MediaQuery>
                <MediaQuery maxWidth={1250}>
                  <p>Am</p>
                </MediaQuery>
                <p>User</p>
                <MediaQuery minWidth={1251}>
                  <p>Reci</p>
                </MediaQuery>
                <MediaQuery maxWidth={1250}>
                  <p>Rc</p>
                </MediaQuery>
                <p>Address</p>
                <p>P.H.</p>
                <MediaQuery minWidth={780}>
                  <p>Message</p>
                </MediaQuery>
                <MediaQuery maxWidth={779}>
                  <p>Ms</p>
                </MediaQuery>
                <MediaQuery minWidth={491}>
                  <p>Status</p>
                </MediaQuery>
                <MediaQuery maxWidth={490}>
                  <p>St</p>
                </MediaQuery>
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
                          <p>
                            {el.payments.totalAmount.toLocaleString('ko-KR')}
                          </p>
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
            <MediaQuery minWidth={412}>
              <p className={shippingCode.selector}>
                <span
                  className={shippingCode.selector_order}
                  onClick={handleSelectorOrder}
                >
                  결제완료 목록 (배송준비 중)
                </span>
                &nbsp;&nbsp;/&nbsp;&nbsp;
                <span
                  className={shippingCode.selector_cancel_on}
                  onClick={handleSelectorRetrieved}
                >
                  상품회수 목록
                </span>
                &nbsp;&nbsp;/&nbsp;&nbsp;
                <span
                  className={shippingCode.selector_cancel}
                  onClick={handleSelectorReturn}
                >
                  교환상품배송 목록
                </span>
              </p>
            </MediaQuery>
            <MediaQuery maxWidth={411}>
              <div className={shippingCode.selector}>
                <p
                  className={shippingCode.selector_order}
                  onClick={handleSelectorOrder}
                >
                  결제완료 목록 (배송준비 중)
                </p>
                <p
                  className={shippingCode.selector_cancel_on}
                  onClick={handleSelectorRetrieved}
                >
                  상품회수 목록
                </p>
                <p
                  className={shippingCode.selector_cancel}
                  onClick={handleSelectorReturn}
                >
                  교환상품배송 목록
                </p>
              </div>
            </MediaQuery>

            <p className={shippingCode.totalOrderCount}>
              Total :{' '}
              {selector === 'retrieved' &&
              orderData !== null &&
              retrievedData !== null &&
              returnData !== null ? (
                retrievedData.length
              ) : (
                <></>
              )}
            </p>
          </div>

          {/* 송장등록부분 -------------------------------- */}
          <ul className={shippingCode.list_ul_wrap}>
            <p className={shippingCode.index_desc}>
              <MediaQuery minWidth={1251}>
                <strong>Reci</strong> = 받는 이{' '}
              </MediaQuery>
              <MediaQuery maxWidth={1250} minWidth={780}>
                <strong>SC</strong> = 송장번호 &nbsp;&nbsp;&nbsp;
                <strong>Am</strong> = 결제금액 &nbsp;&nbsp;&nbsp;
                <strong>Re</strong> = 받는 이
              </MediaQuery>
              <MediaQuery maxWidth={779} minWidth={491}>
                <strong>SC</strong> = 송장번호 &nbsp;&nbsp;&nbsp;
                <strong>O.N.</strong> = 상품이름&nbsp;&nbsp;&nbsp;
                <strong>Am</strong> = 결제금액&nbsp;&nbsp;&nbsp;
                <strong>Re</strong> = 받는 이&nbsp;&nbsp;&nbsp;
                <strong>Ms</strong> = 배송메세지&nbsp;&nbsp;&nbsp;
              </MediaQuery>
              <MediaQuery maxWidth={490}>
                <strong>OI</strong> = 주문번호 &nbsp;&nbsp;&nbsp;
                <strong>SC</strong> = 송장번호 &nbsp;&nbsp;&nbsp;
                <strong>O.N.</strong> = 상품이름&nbsp;&nbsp;&nbsp;
              </MediaQuery>
            </p>
            <MediaQuery maxWidth={490} minWidth={281}>
              <p className={shippingCode.index_desc}>
                <strong>Am</strong> = 결제금액&nbsp;&nbsp;&nbsp;
                <strong>Re</strong> = 받는 이&nbsp;&nbsp;&nbsp;
                <strong>Ms</strong> = 배송메세지&nbsp;&nbsp;&nbsp;
                <strong>St</strong> = 배송상태&nbsp;&nbsp;&nbsp;
              </p>
            </MediaQuery>
            <MediaQuery maxWidth={280}>
              <p className={shippingCode.index_desc}>
                <strong>Am</strong> = 결제금액&nbsp;&nbsp;&nbsp;
                <strong>Re</strong> = 받는 이&nbsp;&nbsp;&nbsp;
              </p>
            </MediaQuery>
            <MediaQuery maxWidth={280}>
              <p className={shippingCode.index_desc}>
                <strong>Ms</strong> = 배송메세지&nbsp;&nbsp;&nbsp;
                <strong>St</strong> = 배송상태&nbsp;&nbsp;&nbsp;
              </p>
            </MediaQuery>
            <li className={shippingCode.listHeader}>
              <MediaQuery minWidth={1081}>
                <p>No.</p>
              </MediaQuery>
              <MediaQuery maxWidth={1080}>
                <p>#</p>
              </MediaQuery>
              <MediaQuery minWidth={491}>
                <p>OrderID</p>
              </MediaQuery>
              <MediaQuery maxWidth={490}>
                <p>OI</p>
              </MediaQuery>
              <MediaQuery minWidth={1251}>
                <p>ShippingCode</p>
              </MediaQuery>
              <MediaQuery maxWidth={1250}>
                <p>SC</p>
              </MediaQuery>
              <MediaQuery minWidth={780}>
                <p>OrderName</p>
              </MediaQuery>
              <MediaQuery maxWidth={779}>
                <p>O.N.</p>
              </MediaQuery>
              <MediaQuery minWidth={1251}>
                <p>Amount</p>
              </MediaQuery>
              <MediaQuery maxWidth={1250}>
                <p>Am</p>
              </MediaQuery>
              <p>User</p>
              <MediaQuery minWidth={1251}>
                <p>Reci</p>
              </MediaQuery>
              <MediaQuery maxWidth={1250}>
                <p>Rc</p>
              </MediaQuery>
              <p>Address</p>
              <p>P.H.</p>
              <MediaQuery minWidth={780}>
                <p>Message</p>
              </MediaQuery>
              <MediaQuery maxWidth={779}>
                <p>Ms</p>
              </MediaQuery>
              <MediaQuery minWidth={491}>
                <p>Status</p>
              </MediaQuery>
              <MediaQuery maxWidth={490}>
                <p>St</p>
              </MediaQuery>
            </li>
            <div className={shippingCode.listBox}>
              {retrievedData?.map((el, index) => {
                return (
                  <div key={index}>
                    <li className={shippingCode.list_li}>
                      <p>{index}</p>
                      <p>{el.payments.orderId}</p>
                      <p>{el.shippingCode}</p>
                      <p>{el.payments.orderName}</p>
                      <p>{el.payments.totalAmount.toLocaleString('ko-KR')}</p>
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
                      <MediaQuery minWidth={913}>
                        <span
                          className={shippingCode.orderShippingCodeInput_title}
                        >
                          회수용 송장번호입력 :{' '}
                        </span>
                      </MediaQuery>
                      <MediaQuery maxWidth={912}>
                        <span
                          className={shippingCode.orderShippingCodeInput_title}
                          style={{ fontSize: '11px' }}
                        >
                          회수용 송장번호입력 :
                        </span>
                      </MediaQuery>
                      <input
                        type="text"
                        placeholder="회수송장번호입력"
                        name="shippingCode"
                        value={inputValueRetrieved[index]}
                        className={shippingCode.orderShippingCodeInput}
                        onChange={(e) => handleInputRetrieved(e, index)}
                        onKeyDown={(e) => handleKeyDownRetrieved(e, index)}
                      />
                      <div
                        className={shippingCode.shippingCodeBtn}
                        ref={(el) => {
                          if (el) {
                            shippingCodeClickRetrieved.current[index] = el;
                          }
                        }}
                        onClick={() =>
                          registerShippingcodeRetrieved(
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
              <MediaQuery minWidth={1081}>
                <p>No.</p>
              </MediaQuery>
              <MediaQuery maxWidth={1080}>
                <p>#</p>
              </MediaQuery>
              <MediaQuery minWidth={491}>
                <p>OrderID</p>
              </MediaQuery>
              <MediaQuery maxWidth={490}>
                <p>OI</p>
              </MediaQuery>
              <MediaQuery minWidth={1251}>
                <p>ShippingCode</p>
              </MediaQuery>
              <MediaQuery maxWidth={1250}>
                <p>SC</p>
              </MediaQuery>
              <MediaQuery minWidth={780}>
                <p>OrderName</p>
              </MediaQuery>
              <MediaQuery maxWidth={779}>
                <p>O.N.</p>
              </MediaQuery>
              <MediaQuery minWidth={1251}>
                <p>Amount</p>
              </MediaQuery>
              <MediaQuery maxWidth={1250}>
                <p>Am</p>
              </MediaQuery>
              <p>User</p>
              <MediaQuery minWidth={1251}>
                <p>Reci</p>
              </MediaQuery>
              <MediaQuery maxWidth={1250}>
                <p>Rc</p>
              </MediaQuery>
              <p>Address</p>
              <p>P.H.</p>
              <MediaQuery minWidth={780}>
                <p>Message</p>
              </MediaQuery>
              <MediaQuery maxWidth={779}>
                <p>Ms</p>
              </MediaQuery>
              <MediaQuery minWidth={491}>
                <p>Status</p>
              </MediaQuery>
              <MediaQuery maxWidth={490}>
                <p>St</p>
              </MediaQuery>
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
                        <p>{el.payments.totalAmount.toLocaleString('ko-KR')}</p>
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
            <MediaQuery minWidth={412}>
              <p className={shippingCode.selector}>
                <span
                  className={shippingCode.selector_order}
                  onClick={handleSelectorOrder}
                >
                  결제완료 목록 (배송준비 중)
                </span>
                &nbsp;&nbsp;/&nbsp;&nbsp;
                <span
                  className={shippingCode.selector_cancel}
                  onClick={handleSelectorRetrieved}
                >
                  상품회수 목록
                </span>
                &nbsp;&nbsp;/&nbsp;&nbsp;
                <span
                  className={shippingCode.selector_cancel_on}
                  onClick={handleSelectorReturn}
                >
                  교환상품배송 목록
                </span>
              </p>
            </MediaQuery>
            <MediaQuery maxWidth={411}>
              <div className={shippingCode.selector}>
                <p
                  className={shippingCode.selector_order}
                  onClick={handleSelectorOrder}
                >
                  결제완료 목록 (배송준비 중)
                </p>
                <p
                  className={shippingCode.selector_cancel}
                  onClick={handleSelectorRetrieved}
                >
                  상품회수 목록
                </p>
                <p
                  className={shippingCode.selector_cancel_on}
                  onClick={handleSelectorReturn}
                >
                  교환상품배송 목록
                </p>
              </div>
            </MediaQuery>

            <p className={shippingCode.totalOrderCount}>
              Total :{' '}
              {selector === 'return' &&
              orderData !== null &&
              retrievedData !== null &&
              returnData !== null ? (
                returnData.length
              ) : (
                <></>
              )}
            </p>
          </div>

          {/* 송장등록부분 -------------------------------- */}
          <ul className={shippingCode.list_ul_wrap}>
            <p className={shippingCode.index_desc}>
              <MediaQuery minWidth={1251}>
                <strong>Reci</strong> = 받는 이{' '}
              </MediaQuery>
              <MediaQuery maxWidth={1250} minWidth={780}>
                <strong>SC</strong> = 송장번호 &nbsp;&nbsp;&nbsp;
                <strong>Am</strong> = 결제금액 &nbsp;&nbsp;&nbsp;
                <strong>Re</strong> = 받는 이
              </MediaQuery>
              <MediaQuery maxWidth={779} minWidth={491}>
                <strong>SC</strong> = 송장번호 &nbsp;&nbsp;&nbsp;
                <strong>O.N.</strong> = 상품이름&nbsp;&nbsp;&nbsp;
                <strong>Am</strong> = 결제금액&nbsp;&nbsp;&nbsp;
                <strong>Re</strong> = 받는 이&nbsp;&nbsp;&nbsp;
                <strong>Ms</strong> = 배송메세지&nbsp;&nbsp;&nbsp;
              </MediaQuery>
              <MediaQuery maxWidth={490}>
                <strong>OI</strong> = 주문번호 &nbsp;&nbsp;&nbsp;
                <strong>SC</strong> = 송장번호 &nbsp;&nbsp;&nbsp;
                <strong>O.N.</strong> = 상품이름&nbsp;&nbsp;&nbsp;
              </MediaQuery>
            </p>
            <MediaQuery maxWidth={490} minWidth={281}>
              <p className={shippingCode.index_desc}>
                <strong>Am</strong> = 결제금액&nbsp;&nbsp;&nbsp;
                <strong>Re</strong> = 받는 이&nbsp;&nbsp;&nbsp;
                <strong>Ms</strong> = 배송메세지&nbsp;&nbsp;&nbsp;
                <strong>St</strong> = 배송상태&nbsp;&nbsp;&nbsp;
              </p>
            </MediaQuery>
            <MediaQuery maxWidth={280}>
              <p className={shippingCode.index_desc}>
                <strong>Am</strong> = 결제금액&nbsp;&nbsp;&nbsp;
                <strong>Re</strong> = 받는 이&nbsp;&nbsp;&nbsp;
              </p>
            </MediaQuery>
            <MediaQuery maxWidth={280}>
              <p className={shippingCode.index_desc}>
                <strong>Ms</strong> = 배송메세지&nbsp;&nbsp;&nbsp;
                <strong>St</strong> = 배송상태&nbsp;&nbsp;&nbsp;
              </p>
            </MediaQuery>
            <li className={shippingCode.listHeader}>
              <MediaQuery minWidth={1081}>
                <p>No.</p>
              </MediaQuery>
              <MediaQuery maxWidth={1080}>
                <p>#</p>
              </MediaQuery>
              <MediaQuery minWidth={491}>
                <p>OrderID</p>
              </MediaQuery>
              <MediaQuery maxWidth={490}>
                <p>OI</p>
              </MediaQuery>
              <MediaQuery minWidth={1251}>
                <p>ShippingCode</p>
              </MediaQuery>
              <MediaQuery maxWidth={1250}>
                <p>SC</p>
              </MediaQuery>
              <MediaQuery minWidth={780}>
                <p>OrderName</p>
              </MediaQuery>
              <MediaQuery maxWidth={779}>
                <p>O.N.</p>
              </MediaQuery>
              <MediaQuery minWidth={1251}>
                <p>Amount</p>
              </MediaQuery>
              <MediaQuery maxWidth={1250}>
                <p>Am</p>
              </MediaQuery>
              <p>User</p>
              <MediaQuery minWidth={1251}>
                <p>Reci</p>
              </MediaQuery>
              <MediaQuery maxWidth={1250}>
                <p>Rc</p>
              </MediaQuery>
              <p>Address</p>
              <p>P.H.</p>
              <MediaQuery minWidth={780}>
                <p>Message</p>
              </MediaQuery>
              <MediaQuery maxWidth={779}>
                <p>Ms</p>
              </MediaQuery>
              <MediaQuery minWidth={491}>
                <p>Status</p>
              </MediaQuery>
              <MediaQuery maxWidth={490}>
                <p>St</p>
              </MediaQuery>
            </li>
            <div className={shippingCode.listBox}>
              {returnData?.map((el, index) => {
                return (
                  <div key={index}>
                    <li className={shippingCode.list_li}>
                      <p>{index}</p>
                      <p>{el.payments.orderId}</p>
                      <p>{el.shippingCode}</p>
                      <p>{el.payments.orderName}</p>
                      <p>{el.payments.totalAmount.toLocaleString('ko-KR')}</p>
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
                      <MediaQuery minWidth={855}>
                        <span
                          className={shippingCode.orderShippingCodeInput_title}
                        >
                          new송장번호입력 :{' '}
                        </span>
                      </MediaQuery>
                      <MediaQuery maxWidth={854}>
                        <span
                          style={{ fontSize: '12px' }}
                          className={shippingCode.orderShippingCodeInput_title}
                        >
                          new송장번호입력 :{' '}
                        </span>
                      </MediaQuery>

                      <input
                        type="text"
                        placeholder="송장번호입력"
                        name="shippingCode"
                        value={inputValueReturn[index]}
                        className={shippingCode.orderShippingCodeInput}
                        onChange={(e) => handleInputReturn(e, index)}
                        onKeyDown={(e) => handleKeyDownReturn(e, index)}
                      />

                      <div
                        className={shippingCode.shippingCodeBtn}
                        ref={(el) => {
                          if (el) {
                            shippingCodeClickReturn.current[index] = el;
                          }
                        }}
                        onClick={() =>
                          registerShippingcodeReturn(
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
              완료: {updateInfoReturn.length}
            </p>
            <li className={shippingCode.listHeader_complete}>
              <MediaQuery minWidth={1081}>
                <p>No.</p>
              </MediaQuery>
              <MediaQuery maxWidth={1080}>
                <p>#</p>
              </MediaQuery>
              <MediaQuery minWidth={491}>
                <p>OrderID</p>
              </MediaQuery>
              <MediaQuery maxWidth={490}>
                <p>OI</p>
              </MediaQuery>
              <MediaQuery minWidth={1251}>
                <p>ShippingCode</p>
              </MediaQuery>
              <MediaQuery maxWidth={1250}>
                <p>SC</p>
              </MediaQuery>
              <MediaQuery minWidth={780}>
                <p>OrderName</p>
              </MediaQuery>
              <MediaQuery maxWidth={779}>
                <p>O.N.</p>
              </MediaQuery>
              <MediaQuery minWidth={1251}>
                <p>Amount</p>
              </MediaQuery>
              <MediaQuery maxWidth={1250}>
                <p>Am</p>
              </MediaQuery>
              <p>User</p>
              <MediaQuery minWidth={1251}>
                <p>Reci</p>
              </MediaQuery>
              <MediaQuery maxWidth={1250}>
                <p>Rc</p>
              </MediaQuery>
              <p>Address</p>
              <p>P.H.</p>
              <MediaQuery minWidth={780}>
                <p>Message</p>
              </MediaQuery>
              <MediaQuery maxWidth={779}>
                <p>Ms</p>
              </MediaQuery>
              <MediaQuery minWidth={491}>
                <p>Status</p>
              </MediaQuery>
              <MediaQuery maxWidth={490}>
                <p>St</p>
              </MediaQuery>
            </li>
            <div className={shippingCode.listBox_complete}>
              {updateInfoReturn.length === 0 ? (
                <> </>
              ) : (
                updateInfoReturn.map((el, index) => {
                  return (
                    <div key={index}>
                      <li className={shippingCode.list_li}>
                        <p>{index}</p>
                        <p>{el.payments.orderId}</p>
                        <p>{el.shippingCode}</p>
                        <p>{el.payments.orderName}</p>
                        <p>{el.payments.totalAmount.toLocaleString('ko-KR')}</p>
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
    </div>
  );
}
