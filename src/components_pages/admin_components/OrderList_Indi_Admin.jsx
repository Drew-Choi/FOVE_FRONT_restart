import React, { useEffect, useRef, useState } from 'react';
import orderListIndi from '../../styles/orderList_Indi_Admin.module.scss';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import LoadingAdmin from '../client_components/LoadingAdmin';

const Pd_Images = styled.div`
  ${(props) =>
    props.img &&
    `background-image: url('http://localhost:4000/uploads/${props.img}')`}
`;

const Preview = styled.img`
  position: relative;
  display: block;
  box-sizing: content-box;
  width: 40vw;
  height: auto;
  padding: 10px;
  margin: 0px 0px 10px 0px;
  border-bottom: 0.5px solid black;

  @media screen and (max-width: 1000px) {
    width: 65vw;
  }

  @media screen and (max-width: 510px) {
    width: 80vw;
  }

  @media screen and (max-width: 280px) {
    width: 85vw;
    padding: 10px 0px;
  }
`;

export default function OrderList_Indi_Admin() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [status, setStatus] = useState(null);
  const [redirect, setRedirect] = useState(true);

  // 라디오 박스 useState - 관리자 컨트롤 부분 - 배송상태
  const [adminShippingCondition, setAdminShippingCondition] = useState(null);
  // 라디오 박스 활성화 - 배송상태
  const [disableShipping, setDisableShipping] = useState(true);
  // 라디오 박스 체크시 상태값 변경 - 배송상태
  const handleAdminShippingCondition = (e) => {
    setAdminShippingCondition((cur) => e.target.value);
  };
  // 송장번호 입력
  const [shippingCodeChange, setShippingCodeChange] = useState(0);
  // 송장번호 수정 핸들
  const handleShippingCode = (e) => {
    setShippingCodeChange((cur) => e.target.value);
  };

  // 배송상태 백엔드 요청
  const req_AdminShippingCondition = async () => {
    const updateConfirm = confirm(
      `주문번호: ${orderId}\n배송상태변경을 진행하시겠습니까?`,
    );

    if (!updateConfirm) return alert('변경 취소');
    // true라면 아래 진행
    try {
      const response = await axios.post(
        'http://localhost:4000/admin/orderlist/detail/shippingCondition',
        {
          adminShippingCondition,
          orderId,
          shippingCode: shippingCodeChange,
        },
      );

      if (response.status === 200) {
        // 200번대 성공이라면,
        setRedirect((cur) => !cur);
        setDisableShipping((cur) => true);
        alert('변경성공');
        return;
      } else if (response.status === 404) {
        // 404번대 오류라면,
        setRedirect((cur) => !cur);
        alert(response.data);
        return;
      } else {
        return alert('변경실패');
      }
    } catch (err) {
      if (err.response.status === 404) {
        setRedirect((cur) => !cur);
        alert(err.response.data);
      }
      return;
    }
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

  const statusCheck = (data) => {
    if (
      data.payments.status !== 'DONE' &&
      !data.isShipping &&
      data.shippingCode === 0 &&
      !data.isDelivered &&
      !data.isCancel &&
      !data.isReturn &&
      !data.isRetrieved &&
      !data.isRefund &&
      !data.isReturnSubmit
    ) {
      setStatus((cur) => '결제 전');
      setAdminShippingCondition((cur) => '결제 전');
      return;
    } else if (
      data.payments.status === 'DONE' &&
      !data.isShipping &&
      data.shippingCode === 0 &&
      !data.isDelivered &&
      !data.isCancel &&
      !data.isReturn &&
      !data.isRetrieved &&
      !data.isRefund &&
      !data.isReturnSubmit
    ) {
      setStatus((cur) => '결제완료 (배송 전)');
      setAdminShippingCondition((cur) => '결제완료 (배송 전)');
      return;
    } else if (
      data.payments.status === 'DONE' &&
      data.isShipping &&
      data.shippingCode !== 0 &&
      !data.isDelivered &&
      !data.isCancel &&
      !data.isReturn &&
      !data.isRetrieved &&
      !data.isRefund &&
      !data.isReturnSubmit
    ) {
      setStatus((cur) => '배송 중');
      setAdminShippingCondition((cur) => '배송 중');
      return;
    } else if (
      data.payments.status === 'DONE' &&
      !data.isShipping &&
      data.shippingCode !== 0 &&
      data.isDelivered &&
      !data.isCancel &&
      !data.isReturn &&
      !data.isRetrieved &&
      !data.isRefund &&
      !data.isReturnSubmit
    ) {
      setStatus((cur) => '배송완료');
      setAdminShippingCondition((cur) => '배송완료');
      return;
    } else if (
      data.payments.status === 'DONE' &&
      !data.isShipping &&
      data.shippingCode !== 0 &&
      data.isDelivered &&
      !data.isCancel &&
      !data.isReturn &&
      !data.isRetrieved &&
      !data.isRefund &&
      data.isReturnSubmit
    ) {
      setStatus((cur) => '반품신청 중');
      setAdminShippingCondition((cur) => '배송완료');
      return;
    } else if (
      data.payments.status === 'DONE' &&
      !data.isShipping &&
      data.shippingCode !== 0 &&
      data.isDelivered &&
      !data.isCancel &&
      !data.isReturn &&
      !data.isRetrieved &&
      data.isRefund &&
      data.isReturnSubmit
    ) {
      setStatus((cur) => '환불진행 신청');
      return;
    } else if (
      data.payments.status === 'DONE' &&
      !data.isShipping &&
      !data.isDelivered &&
      data.isCancel &&
      !data.isReturn &&
      !data.isReturnSubmit &&
      data.shippingCode !== 0
    ) {
      return setStatus((cur) => '결제취소');
    }
  };

  const getOrderIdInfo = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/admin/orderlist/detail/${orderId}`,
        {},
      );

      if (response.status !== 200) return alert('데이터오류');
      // 200번대 성공이면
      statusCheck(response.data);
      setShippingCodeChange((cur) => response.data.shippingCode);
      return setData((cur) => response.data);
    } catch (err) {
      console.error(err);
    }
  };

  // 배송 전 결제 취소
  const pdCancel = async () => {
    const updateConfirm = confirm(
      `상품코드: ${orderId}\n관리자권환으로 결제취소(환불)를 진행하시겠습니까?`,
    );

    if (!updateConfirm) return setRedirect((cur) => !cur), alert('실행 취소');

    // confirm이 true이면
    try {
      const cancelInfo = await axios.post(
        'http://localhost:4000/admin/orderlist/detail/cancel',
        { orderId },
      );

      if (cancelInfo.status !== 200) return alert('결제취소 실패');
      // 200번대 성공이면,
      alert(`상품코드: ${orderId}\n결제취소(환불) 완료`);
      navigate('/admin/orderlist');
      return;
    } catch (err) {
      console.error(err);
      return;
    }
  };

  // 상품 수령 전 환불 진행 신청
  const submitRefund = async () => {
    const updateConfirm = confirm(
      `주문번호: ${orderId}\n환불진행을 신청하시겠습니까?`,
    );

    if (!updateConfirm) return alert('환불 진행 취소');
    //true 라면 아래
    try {
      const cancelInfo = await axios.post(
        'http://localhost:4000/admin//orderlist/detail/cancelRefund',
        { orderId },
      );

      if (cancelInfo.status !== 200) return alert('환불 실패');
      // 200번대 성공이면,
      setRedirect((cur) => !cur);
      alert(
        `주문번호: ${orderId}\n환불을 완료했습니다.\n'상품회수 목록'을 통해 상품회수를 진행하십시오.`,
      );
      return;
    } catch (err) {
      console.error(err);
      return;
    }
  };

  // 상품 수령 후 결제취소
  const pdCancelRefund = async () => {
    const updateConfirm1 = confirm(
      `주문번호: ${orderId}\n상품을 회수하셨습니까?`,
    );

    if (!updateConfirm1) return alert('상품 회수 후\n진행바랍니다.');
    // true라면,

    const updateConfirm2 = confirm(
      `상품코드: ${orderId}\n관리자권환으로 환불을 진행하시겠습니까?`,
    );
    if (!updateConfirm2)
      return setRedirect((cur) => !cur), alert('환불진행 취소');

    // confirm이 true이면
    try {
      const cancelInfo = await axios.post(
        'http://localhost:4000/admin/orderlist/detail/cancelRefund/complete',
        { orderId },
      );

      if (cancelInfo.status !== 200) return alert('환불 실패');
      // 200번대 성공이면,
      alert(
        `상품코드: ${orderId}\n환불을 완료했습니다.\n환불목록을 통해 상품을 회수하십시오.`,
      );
      navigate('/admin/orderlist');
      return;
    } catch (err) {
      console.error(err);
      return;
    }
  };

  // 반품신청 취소
  const cancelSubmit = async () => {
    const updateConfirm = confirm(
      `상품코드: ${orderId}\n반품신청 철회를 진행하시겠습니까?`,
    );

    if (!updateConfirm) return alert('철회진행 취소');
    // true이면 아래 진행
    try {
      const response = await axios.post(
        'http://localhost:4000/admin/orderlist/detail/cancel_return_submit',
        { orderId },
      );

      if (response.status !== 200) return alert('철회진행 실패');
      // 200번대 성공이면
      alert(`상품코드: ${orderId}\n반품신청철회 완료`);
      setRedirect((cur) => !cur);
      return;
    } catch (err) {
      console.error(err);
    }
  };

  // 강제주문취소
  const forceDelete = async () => {
    const updateConfirm = confirm('입금 전, 강제주문취소를 진행하시겠습니까?');

    if (!updateConfirm) return alert('주문내역 삭제 진행 취소');
    //true라면,
    try {
      const response = await axios.get(
        `http://localhost:4000/admin/orderlist/detail/order_delete/${orderId}`,
      );

      if (response.status !== 200) return alert('진행 오류');
      //200번대 잘 들어온다면,
      alert(`상품코드: ${orderId}\n입금 전 강제주문취소 완료`);
      navigate('/admin/orderlist');
      return;
    } catch (err) {
      console.error(err);
    }
  };

  // 교환신청
  const adminPdChange = async () => {
    const updateConfirm = confirm(
      `상품코드: ${orderId}\n상품교환을 진행하시겠습니까?`,
    );

    if (!updateConfirm) return alert('교환진행 취소');
    // true라면,
    try {
      const response = await axios.get(
        `http://localhost:4000/admin/orderlist/detail/order_return/${orderId}`,
      );

      if (response.status !== 200) return alert('교환신청 실패');
      // 200번대 성공이라면,
      alert(`상품코드: ${orderId}\n교환진행 완료`);
      setRedirect((cur) => !cur);
      return;
    } catch (err) {
      console.error(err);
      return;
    }
  };

  // 교환철회 관리자만 가능
  const adminPdChangeCancel = async () => {
    const updateConfirm = confirm(
      `상품코드: ${orderId}\n상품교환신청을 철회하시겠습니까?`,
    );

    if (!updateConfirm) return alert('교환신청철회 취소');
    // true라면,
    try {
      const response = await axios.get(
        `http://localhost:4000/admin/orderlist/detail/order_return/cancel/${orderId}`,
      );

      if (response.status !== 200) return alert('철회신청 실패');
      // 200번대 성공이라면,
      alert(`상품코드: ${orderId}\n교환 철회 완료`);
      setRedirect((cur) => !cur);
      return;
    } catch (err) {
      console.error(err);
      return;
    }
  };

  useEffect(() => {
    getOrderIdInfo();
  }, [redirect]);

  const dateSplit = (date) => {
    const splitData = date.split(/[T+]/);
    const dataSum = `${splitData[0]}  /  ${splitData[1]}`;
    return dataSum;
  };

  return (
    <div className={orderListIndi.wholContainer}>
      <p className={orderListIndi.mainTitle}>
        ORDER DETAILS &nbsp;
        <span style={{ fontSize: '15px', fontWeight: '400' }}>Admin</span>
      </p>
      <p className={orderListIndi.status}>
        status : <span style={{ fontWeight: '600' }}>{status}</span>
      </p>
      {!data ? (
        <LoadingAdmin />
      ) : (
        <div className={orderListIndi.order_info_wrap}>
          <div className={orderListIndi.orderlist_Check_wrap}>
            <p className={orderListIndi.older_date}>
              주문번호: <strong>{data.payments.orderId}</strong>
            </p>
            {/* 상품영역 */}
            {data.products.map((el, index) => {
              return (
                <div key={index} className={orderListIndi.older_image_info}>
                  <Pd_Images
                    img={el.img}
                    className={orderListIndi.older_image}
                  ></Pd_Images>
                  <div className={orderListIndi.pdnameprice}>
                    <p className={orderListIndi.pdname}>{el.productName}</p>
                    <p className={orderListIndi.pdprice}>
                      <strong style={{ fontSize: '15px' }}>
                        {frontPriceComma(el.unitSumPrice)}
                      </strong>
                      KRW /{' '}
                      <strong style={{ fontSize: '15px' }}>
                        {frontPriceComma(el.quantity)}
                      </strong>{' '}
                      ea
                    </p>
                    <p className={orderListIndi.pdprice}>
                      SIZE{' '}
                      <strong style={{ fontSize: '15px' }}>{el.size}</strong>
                    </p>
                  </div>
                </div>
              );
            })}
            <p className={orderListIndi.older_detail_info}>
              total ={' '}
              <strong style={{ fontSize: '17px' }}>
                {frontPriceComma(data.payments.totalAmount)}{' '}
              </strong>
              KRW /{' '}
              <strong style={{ fontSize: '17px' }}>
                {frontPriceComma(
                  data.products.reduce((acc, cur) => acc + cur.quantity, 0),
                )}
              </strong>{' '}
              ea
            </p>
            {status === '반품신청 중' ? (
              <>
                <p className={orderListIndi.return_title}>반품신청내역</p>
                <p className={orderListIndi.return_reason}>
                  reason:{' '}
                  <span className={orderListIndi.reason_text}>
                    {data.submitReturn.reason}
                  </span>
                </p>
                <p className={orderListIndi.return_etc}>
                  message:{' '}
                  <span className={orderListIndi.reason_etc_text}>
                    {data.submitReturn.return_message}
                  </span>
                </p>
              </>
            ) : (
              <></>
            )}

            <p className={orderListIndi.return_reason}>
              stage: <span className={orderListIndi.reason_text}>{status}</span>
            </p>
            <div className={orderListIndi.infoCancelContainer}>
              <div className={orderListIndi.line}></div>
              {status === '반품신청 중' ? (
                data.submitReturn.return_img.map((el, index) => {
                  return (
                    <Preview
                      key={index}
                      src={`http://localhost:4000/uploads/${data.payments.orderId}/${el}`}
                    ></Preview>
                  );
                })
              ) : (
                <></>
              )}
              <div className={orderListIndi.detailInfoWrap}>
                <p className={orderListIndi.cashTitle}>결제정보</p>
                <div className={orderListIndi.cashInfo}>
                  <p className={orderListIndi.payments_date}>
                    주문일시: {dateSplit(data.payments.approvedAt)}
                  </p>
                  <p className={orderListIndi.payments_status}>
                    결제여부:{' '}
                    {data.payments.status !== 'DONE' ? (
                      '결제전'
                    ) : data.payments.status === 'DONE' ? (
                      '결제완료'
                    ) : data.payments.status !== 'CANCELED' ? (
                      '결제취소'
                    ) : (
                      <></>
                    )}
                  </p>
                  <p className={orderListIndi.payments_method}>
                    결제수단: {data.payments.method}
                  </p>
                  <p className={orderListIndi.payments_discount}>
                    할인:{' '}
                    {!data.payments.discount
                      ? '0 ₩'
                      : `${frontPriceComma(data.payments.discount)} ₩`}
                  </p>
                  <p className={orderListIndi.payments_totalAmount}>
                    결제금액:{' '}
                    {!data.payments.totalAmount
                      ? '0 ₩'
                      : `${frontPriceComma(data.payments.totalAmount)} ₩`}
                  </p>
                </div>
                <div className={orderListIndi.line}></div>

                <p className={orderListIndi.cashTitle}>주문정보</p>
                <div className={orderListIndi.cashInfo}>
                  <p className={orderListIndi.userId}>회원ID: {data.user}</p>

                  <p className={orderListIndi.recipient_Name}>
                    받는 분: {data.recipient.recipientName}
                  </p>

                  <p className={orderListIndi.recipient_zipcode}>
                    배송우편번호: {data.recipient.recipientZipcode}
                  </p>

                  <p className={orderListIndi.recipient_address}>
                    배송주소: {data.recipient.recipientAddress}{' '}
                    {data.recipient.recipientAddressDetail}
                  </p>

                  <p className={orderListIndi.recipient_phone}>
                    연락처: {data.recipient.phoneCode} -{' '}
                    {data.recipient.phoneMidNum} - {data.recipient.phoneLastNum}
                  </p>

                  <p className={orderListIndi.recipient_message}>
                    배송메시지: {data.recipient.message}
                  </p>

                  <p className={orderListIndi.shipping_code}>
                    송장번호: {data.shippingCode} (한진)
                  </p>
                </div>
                <div className={orderListIndi.line}></div>

                <p className={orderListIndi.adminAreaTitle}>관리자 영역</p>
                <div className={orderListIndi.adminAreaBox}>
                  <div className={orderListIndi.adminShippingCondition}>
                    <div
                      className={orderListIndi.adminShippingCondition_titleBox}
                    >
                      주문진행사항 &nbsp;&nbsp;
                      {status === '반품신청 중' ||
                      status === '환불진행 신청' ? (
                        <></>
                      ) : disableShipping ? (
                        <button
                          className={orderListIndi.adminShippingConditionBTN}
                          onClick={() =>
                            setDisableShipping((cur) =>
                              cur === true ? false : true,
                            )
                          }
                        >
                          변경하기
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setDisableShipping((cur) =>
                                cur === true ? false : true,
                              );
                              setAdminShippingCondition((cur) => status);
                            }}
                            className={orderListIndi.adminShippingConditionBTN2}
                          >
                            취소
                          </button>
                          <button
                            className={orderListIndi.adminShippingConditionBTN}
                            onClick={req_AdminShippingCondition}
                          >
                            등록
                          </button>
                        </>
                      )}
                    </div>
                    <label>결제 전</label>
                    <input
                      type="radio"
                      name="adminShippingCondition"
                      value="결제 전"
                      checked={adminShippingCondition === '결제 전'}
                      onChange={handleAdminShippingCondition}
                      disabled={disableShipping}
                    />
                    <label>결제완료 / 배송 전</label>
                    <input
                      type="radio"
                      name="adminShippingCondition"
                      value="결제완료 (배송 전)"
                      checked={adminShippingCondition === '결제완료 (배송 전)'}
                      onChange={handleAdminShippingCondition}
                      disabled={disableShipping}
                    />
                    <label>배송 중</label>
                    <input
                      type="radio"
                      name="adminShippingCondition"
                      value="배송 중"
                      checked={adminShippingCondition === '배송 중'}
                      onChange={handleAdminShippingCondition}
                      disabled={disableShipping}
                    />
                    <label>배송완료</label>
                    <input
                      type="radio"
                      name="adminShippingCondition"
                      value="배송완료"
                      checked={adminShippingCondition === '배송완료'}
                      onChange={handleAdminShippingCondition}
                      disabled={disableShipping}
                    />
                  </div>
                  <div
                    className={
                      adminShippingCondition === '배송 중'
                        ? orderListIndi.shippingCodeBox
                        : orderListIndi.shippingCodeBox_Off
                    }
                  >
                    <span>송장번호입력 : </span>
                    <input
                      className={orderListIndi.shippingCode_input}
                      value={shippingCodeChange}
                      type="text"
                      onChange={handleShippingCode}
                      disabled={disableShipping}
                    />
                  </div>
                </div>
                <div className={orderListIndi.line}></div>
              </div>
              <button
                className={orderListIndi.orderBack}
                onClick={() => navigate(-1)}
              >
                뒤로가기
              </button>
              {status === '반품신청 중' ? (
                <button
                  className={orderListIndi.cancelSubmit}
                  onClick={() => cancelSubmit()}
                >
                  반품철회 *
                </button>
              ) : (
                <></>
              )}
              {status === '교환 중' ? (
                <button
                  className={orderListIndi.orderChange}
                  onClick={() => adminPdChangeCancel()}
                >
                  교환신청 철회 (관리자권한)
                </button>
              ) : (
                <></>
              )}
              {status === '배송완료' || status === '반품신청 중' ? (
                <button
                  className={orderListIndi.orderChange}
                  onClick={() => adminPdChange()}
                >
                  교환신청*
                </button>
              ) : (
                <></>
              )}
              {status === '결제 전' ? (
                <button
                  className={orderListIndi.orderCancel}
                  onClick={() => forceDelete()}
                >
                  주문강제취소
                </button>
              ) : (
                <></>
              )}
              {status === '결제완료 (배송 전)' || status === '배송 중' ? (
                <button
                  className={orderListIndi.orderChange}
                  onClick={() => pdCancel()}
                >
                  결제취소(배송 전)
                </button>
              ) : (
                <></>
              )}
              {status === '배송 중' ||
              status === '배송완료' ||
              status === '반품신청 중' ||
              status === '교환 중' ? (
                <button
                  className={orderListIndi.orderCancel}
                  onClick={() => submitRefund()}
                >
                  환불진행신청 (배송 후)
                </button>
              ) : (
                <></>
              )}
              <p className={orderListIndi.caution}>
                *검토 후 전산처리 또는 연락드리기
                <br /> *버튼은 신중히 클릭할 것
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
