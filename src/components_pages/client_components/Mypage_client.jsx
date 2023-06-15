import React, { useEffect, useRef, useState } from 'react';
import DaumPostcode from 'react-daum-postcode';
import myPage from '../../styles/mypage_client.module.scss';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import getToken from '../../store/modules/getToken';
import axios from 'axios';
import Loading from './Loading';

export default function Mypage_client() {
  const navigate = useNavigate();
  const userNameEncoded = useSelector((state) => state.user.userName);
  const [orderListArray, setOrderListArray] = useState(null);
  const [cancelListArray, setCancelListArray] = useState(null);
  const [redirect, setRedirect] = useState(false);
  const [addressInfo, setAddressInfo] = useState(null);
  const [phoneSplitData, setPhoneSplitData] = useState([]);
  const [disableCtr, setDisableCtr] = useState(true);

  const phoneNumSplit = (num) => {
    if (!num || num === '') return;
    //
    const splitNum = num.split('-');
    setPhoneSplitData((cur) => splitNum);
  };

  // 인풋 정보 담아서 모으기
  const recipient = useRef();
  const zipCode = useRef();
  const address = useRef();
  const detailAddress = useRef();
  const phoneZoneCode = useRef();
  const message = useRef();

  // 전화번호 유효성검사
  const [regexValue_num1, setRegexValue_num1] = useState('');
  const [regexValue_num2, setRegexValue_num2] = useState('');
  // 유효성검사용 핸들
  const regexValue_num1_handle = (e) => {
    const value = e.target.value;
    const regex = /^\d+$/;

    if (regex.test(value) || value === '') {
      setRegexValue_num1((cur) => value);
    }
  };

  // 유효성검사용 핸들
  const regexValue_num2_handle = (e) => {
    const value = e.target.value;
    const regex = /^\d+$/;

    if (regex.test(value) || value === '') {
      setRegexValue_num2((cur) => value);
    }
  };

  // 취소시 리셋
  const resetInput = () => {
    recipient.current.value = '';
    phoneZoneCode.current.value = '010';
    setRegexValue_num1((cur) => '');
    setRegexValue_num2((cur) => '');
    message.current.value = '';
    addressData.zonecode = '';
    addressData.address = '';
    addressData.buildingName = '';
  };

  // 주소 업데이트 백엔드 요청
  const submitAddress = async () => {
    try {
      if (
        (regexValue_num1.length < 3 && regexValue_num1 !== '') ||
        (regexValue_num2.length < 4 && regexValue_num2 !== '') ||
        (regexValue_num1 !== '' && regexValue_num2 === '') ||
        (regexValue_num1 === '' && regexValue_num2 !== '')
      )
        return alert('전화번호가 잘못 입력되었습니다.');

      // 아니라면 다음,

      const tokenValue = await getToken();

      const newAddress = {
        recipient:
          recipient.current.value === ''
            ? addressInfo.recipient
            : recipient.current.value,
        address:
          address.current.value === ''
            ? addressInfo.address
            : address.current.value,
        addressDetail:
          detailAddress.current.value === ''
            ? addressInfo.addressDetail
            : detailAddress.current.value,
        zipCode:
          zipCode.current.value === ''
            ? addressInfo.zipCode
            : zipCode.current.value,

        recipientPhone:
          regexValue_num1 === '' || regexValue_num2 === ''
            ? addressInfo.recipientPhone
            : `${phoneZoneCode.current.value}-${regexValue_num1}-${regexValue_num2}`,
        message_ad:
          message.current.value === ''
            ? addressInfo.message_ad
            : message.current.value,
        isDefault: true,
      };

      const response = await axios.post(
        'http://localhost:4000/mypage/editAddress',
        {
          token: tokenValue,
          newAddress,
        },
      );

      if (response.status !== 200) return alert('오류\n등록실패');
      // 200번대 성공이면
      alert('기본배송주소 등록 성공');
      setRedirect((cur) => !cur);
      setDisableCtr((cur) => true);
      return;
    } catch (err) {
      alert('오류\n등록실패');
      console.error(err);
      return;
    }
  };

  const getAddressInfo = async () => {
    try {
      const tokenValue = await getToken();

      const response = await axios.post(
        'http://localhost:4000/mypage/getAddress',
        {
          token: tokenValue,
        },
      );

      if (response.status !== 200) return alert('오류');
      // 200번대 성공이라면,
      setAddressInfo((cur) => response.data);
      phoneNumSplit(response.data.recipientPhone);
      return;
    } catch (err) {
      alert('오류');
      console.error(err);
      return;
    }
  };

  //다음주소 불러오기 기능 ----------------------------------------------
  const [openPostcode, setOpenPostcode] = useState(false);
  const [addressData, setAdressData] = useState({});
  const handleChange = (event) => {
    setAdressData((cur) => {
      let copy = { ...cur };
      copy.buildingName = event.target.value;
      return copy;
    });
  };

  const postCodeStyle2 = {
    display: 'block',
    position: 'absolute',
    top: '-50px',
    left: '0',
    right: '0',
    margin: '50px',
    width: '30vw',
    height: '400px',
    zIndex: 100,
    border: '1px solid black',
    boxShadow: '0 0 8px rgba(0, 0, 0, 0.5)',
  };

  const handle = {
    // 버튼 클릭 이벤트
    clickButton: () => {
      setOpenPostcode((current) => !current);
    },

    // 주소 선택 이벤트
    selectAddress: (data) => {
      // console.log(typeof data); object
      setAdressData(data);
      setOpenPostcode(false);
    },
  };
  //------------------------------------------------------

  const getOrderList = async () => {
    try {
      const tokenValue = await getToken();
      const getOrderListData = await axios.post(
        'http://localhost:4000/order_list/getMemberOrderList',
        { token: tokenValue },
      );
      if (getOrderListData.status === 200 && getOrderListData.data.length > 0) {
        return setOrderListArray((cur) => getOrderListData.data);
      } else {
        return setOrderListArray((cur) => []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getCancelList = async () => {
    try {
      const tokenValue = await getToken();
      const getCancelListData = await axios.post(
        'http://localhost:4000/order_list/getCancelList',
        {
          token: tokenValue,
        },
      );
      if (
        getCancelListData.status === 200 &&
        getCancelListData.data.length > 0
      ) {
        return setCancelListArray((cur) => getCancelListData.data);
      } else {
        return setCancelListArray((cur) => []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getOrderList();
    getCancelList();
    getAddressInfo();
  }, [redirect]);

  return (
    <section className={myPage.myPage_container}>
      {addressInfo !== null &&
      orderListArray !== null &&
      cancelListArray !== null ? (
        <>
          {/* ACCOUNT 제목 위치 */}
          <div className={myPage.titleArea}>
            <h5 className={myPage.subtitle}>MY PAGE</h5>
          </div>
          <div className={myPage.account_info_container}>
            {/* 회원 등급 박스 */}
            <div className={myPage.informations}>
              <p className={myPage.info_grade}>STANDARD</p>
              <div className={myPage.info_description}>
                <span>
                  저희 쇼핑몰을 이용해주셔서 감사합니다.
                  <br />
                  <span className={myPage.info_bold}>
                    {userNameEncoded}
                  </span>{' '}
                  님은
                  <span className={myPage.info_bold}> STANDARD </span>
                  회원이십니다.
                </span>
              </div>
            </div>
            {/* 나의 주문처리 현황 박스 */}

            <div className={myPage.orderstate_box}>
              <p className={myPage.shipping_info_title}>
                나의 주문처리 현황
                <span>
                  (최근 <span className={myPage.threeMonth}>3개월</span> 기준)
                </span>
              </p>

              <div className={myPage.row2_wrap}>
                <a
                  className={myPage.beforeAcount}
                  onClick={() => navigate('/mypage/orderlist')}
                >
                  <p>입금전</p>
                  <p>
                    {orderListArray.reduce((acc, cur) => {
                      if (
                        cur.payments.status !== 'DONE' &&
                        !cur.isShipping &&
                        cur.shippingCode === 0 &&
                        !cur.isDelivered &&
                        !cur.isCancel &&
                        !cur.isReturn &&
                        !cur.isRetrieved &&
                        !cur.isRefund &&
                        !cur.isReturnSubmit
                      ) {
                        return acc + 1;
                      }
                      return acc;
                    }, 0)}
                  </p>
                </a>

                <a
                  className={myPage.ready}
                  onClick={() => navigate('/mypage/orderlist')}
                >
                  <p>배송준비중</p>
                  <p>
                    {orderListArray.reduce((acc, cur) => {
                      if (
                        cur.payments.status === 'DONE' &&
                        !cur.isShipping &&
                        cur.shippingCode === 0 &&
                        !cur.isDelivered &&
                        !cur.isCancel &&
                        !cur.isReturn &&
                        !cur.isRetrieved &&
                        !cur.isRefund &&
                        !cur.isReturnSubmit
                      ) {
                        return acc + 1;
                      }
                      return acc;
                    }, 0)}
                  </p>
                </a>

                <a
                  className={myPage.shipping}
                  onClick={() => navigate('/mypage/orderlist')}
                >
                  <p>배송중</p>
                  <p>
                    {orderListArray.reduce((acc, cur) => {
                      if (
                        (cur.payments.status === 'DONE' &&
                          cur.isShipping &&
                          cur.shippingCode !== 0 &&
                          !cur.isDelivered &&
                          !cur.isCancel &&
                          !cur.isReturn &&
                          !cur.isRetrieved &&
                          !cur.isRefund &&
                          !cur.isReturnSubmit) ||
                        (cur.payments.status === 'DONE' &&
                          cur.isShipping &&
                          cur.shippingCode !== 0 &&
                          !cur.isDelivered &&
                          !cur.isCancel &&
                          cur.isReturn &&
                          cur.isRetrieved &&
                          !cur.isRefund &&
                          cur.isReturnSubmit)
                      ) {
                        return acc + 1;
                      }
                      return acc;
                    }, 0)}
                  </p>
                </a>

                <a
                  className={myPage.complete}
                  onClick={() => navigate('/mypage/orderlist')}
                >
                  <p>배송완료</p>
                  <p>
                    {orderListArray.reduce((acc, cur) => {
                      if (
                        (cur.payments.status === 'DONE' &&
                          !cur.isShipping &&
                          cur.shippingCode !== 0 &&
                          cur.isDelivered &&
                          !cur.isCancel &&
                          !cur.isReturn &&
                          !cur.isRetrieved &&
                          !cur.isRefund &&
                          !cur.isReturnSubmit) ||
                        (cur.payments.status === 'DONE' &&
                          !cur.isShipping &&
                          cur.shippingCode !== 0 &&
                          cur.isDelivered &&
                          !cur.isCancel &&
                          cur.isReturn &&
                          !cur.isRetrieved &&
                          !cur.isRefund &&
                          !cur.isReturnSubmit)
                      ) {
                        return acc + 1;
                      }
                      return acc;
                    }, 0)}
                  </p>
                </a>
              </div>

              <div className={myPage.row3_wrap}>
                <a
                  className={myPage.cancle}
                  onClick={() => navigate('/mypage/orderlist')}
                >
                  <p>취소 :</p>
                  <p>
                    {cancelListArray.reduce((acc, cur) => {
                      if (cur.isCancel) {
                        return acc + 1;
                      }
                      return acc;
                    }, 0)}
                  </p>
                </a>

                <a
                  className={myPage.change}
                  onClick={() => navigate('/mypage/orderlist')}
                >
                  <p>교환 중 :</p>
                  <p>
                    {orderListArray.reduce((acc, cur) => {
                      if (
                        (cur.payments.status === 'DONE' &&
                          !cur.isShipping &&
                          cur.shippingCode !== 0 &&
                          cur.isDelivered &&
                          !cur.isCancel &&
                          cur.isReturn &&
                          !cur.isRetrieved &&
                          !cur.isRefund &&
                          cur.isReturnSubmit) ||
                        (cur.payments.status === 'DONE' &&
                          cur.isShipping &&
                          cur.shippingCode !== 0 &&
                          cur.isDelivered &&
                          !cur.isCancel &&
                          cur.isReturn &&
                          !cur.isRetrieved &&
                          !cur.isRefund &&
                          cur.isReturnSubmit) ||
                        (cur.payments.status === 'DONE' &&
                          !cur.isShipping &&
                          cur.shippingCode !== 0 &&
                          !cur.isDelivered &&
                          !cur.isCancel &&
                          cur.isReturn &&
                          cur.isRetrieved &&
                          !cur.isRefund &&
                          cur.isReturnSubmit)
                      ) {
                        return acc + 1;
                      }
                      return acc;
                    }, 0)}
                  </p>
                </a>

                <a
                  className={myPage.refund}
                  onClick={() => navigate('/mypage/orderlist')}
                >
                  <p>반품신청 :</p>
                  <p>
                    {orderListArray.reduce((acc, cur) => {
                      if (
                        (cur.payments.status === 'DONE' &&
                          !cur.isShipping &&
                          cur.shippingCode !== 0 &&
                          cur.isDelivered &&
                          !cur.isCancel &&
                          !cur.isReturn &&
                          !cur.isRetrieved &&
                          !cur.isRefund &&
                          cur.isReturnSubmit) ||
                        (cur.payments.status === 'DONE' &&
                          !cur.isShipping &&
                          cur.shippingCode !== 0 &&
                          cur.isDelivered &&
                          !cur.isCancel &&
                          !cur.isReturn &&
                          !cur.isRetrieved &&
                          cur.isRefund &&
                          cur.isReturnSubmit) ||
                        (cur.payments.status === 'DONE' &&
                          cur.isShipping &&
                          cur.shippingCode !== 0 &&
                          cur.isDelivered &&
                          !cur.isCancel &&
                          !cur.isReturn &&
                          !cur.isRetrieved &&
                          cur.isRefund &&
                          cur.isReturnSubmit) ||
                        (cur.payments.status === 'DONE' &&
                          !cur.isShipping &&
                          cur.shippingCode !== 0 &&
                          !cur.isDelivered &&
                          !cur.isCancel &&
                          !cur.isReturn &&
                          cur.isRetrieved &&
                          cur.isRefund &&
                          cur.isReturnSubmit)
                      ) {
                        return acc + 1;
                      }
                      return acc;
                    }, 0)}
                  </p>
                </a>
              </div>
            </div>

            <div className={myPage.addressRegister_container}>
              <div className={myPage.shopmain_address}>
                <span className="material-symbols-outlined">home</span>
                <p>기본배송지 등록</p>
              </div>
              <div className={myPage.addressInput_box}>
                <input
                  type="text"
                  placeholder={
                    addressInfo.recipient
                      ? addressInfo.recipient
                      : '받는 분 성명 없음'
                  }
                  ref={recipient}
                  disabled={disableCtr}
                />
                <div className={myPage.postCode_box}>
                  <input
                    ref={zipCode}
                    className={myPage.postCode_input}
                    type="text"
                    placeholder={
                      addressInfo.zipCode
                        ? addressInfo.zipCode
                        : '우편번호 없음'
                    }
                    value={addressData === {} ? '' : addressData.zonecode}
                    onChange={(e) => handleChange(e)}
                    disabled
                  />
                  <button
                    onClick={() => handle.clickButton()}
                    className={myPage.postCode}
                    disabled={disableCtr}
                  >
                    주소 찾기
                  </button>
                  {openPostcode && (
                    <DaumPostcode
                      style={postCodeStyle2}
                      className={myPage.kakaoadd}
                      onComplete={handle.selectAddress} // 값을 선택할 경우 실행되는 이벤트
                      autoClose={false} // 값을 선택할 경우 사용되는 DOM을 제거하여 자동 닫힘 설정
                      defaultQuery="" // 팝업을 열때 기본적으로 입력되는 검색어
                    />
                  )}
                </div>

                <input
                  type="text"
                  placeholder={
                    addressInfo.address ? addressInfo.address : '주소 없음'
                  }
                  value={addressData === {} ? '' : addressData.address}
                  ref={address}
                  onChange={(e) => handleChange(e)}
                  disabled
                />
                <input
                  type="text"
                  ref={detailAddress}
                  placeholder={
                    addressInfo.addressDetail
                      ? addressInfo.addressDetail
                      : '나머지 주소 없음'
                  }
                  value={addressData === {} ? '' : addressData.buildingName}
                  onChange={(e) => handleChange(e)}
                  disabled={disableCtr}
                />
                <div className={myPage.phoneWrap}>
                  <select
                    defaultValue={
                      phoneSplitData && phoneSplitData !== []
                        ? phoneSplitData[0]
                        : '010'
                    }
                    ref={phoneZoneCode}
                    disabled={disableCtr}
                  >
                    <option value="010">010</option>
                    <option value="011">011</option>
                    <option value="016">016</option>
                    <option value="019">019</option>
                  </select>
                  <input
                    type="text"
                    placeholder={
                      phoneSplitData && phoneSplitData.length !== 0
                        ? phoneSplitData[1]
                        : '연락처 없음'
                    }
                    disabled={disableCtr}
                    value={regexValue_num1}
                    onChange={(e) => regexValue_num1_handle(e)}
                    maxLength="4"
                  />
                  <input
                    type="text"
                    placeholder={
                      phoneSplitData && phoneSplitData.length !== 0
                        ? phoneSplitData[2]
                        : ''
                    }
                    disabled={disableCtr}
                    value={regexValue_num2}
                    onChange={(e) => regexValue_num2_handle(e)}
                    maxLength="4"
                  />
                </div>
                <textarea
                  ref={message}
                  maxLength="50"
                  rows="3"
                  cols="100"
                  type="text"
                  className={myPage.textArea}
                  placeholder={
                    addressInfo.message_ad
                      ? addressInfo.message_ad
                      : '배송 메세지 없음'
                  }
                  disabled={disableCtr}
                ></textarea>
              </div>
              <div className={myPage.registerBTN_box}>
                {disableCtr ? (
                  <span
                    className={myPage.registerBTN_white}
                    onClick={() => setDisableCtr((cur) => false)}
                  >
                    수정
                  </span>
                ) : (
                  <span
                    className={myPage.registerBTN_white}
                    onClick={() => {
                      setDisableCtr((cur) => true);
                      resetInput();
                    }}
                  >
                    취소
                  </span>
                )}

                <span
                  className={myPage.registerBTN_black}
                  onClick={submitAddress}
                >
                  등록
                </span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <Loading />
      )}
    </section>
  );
}
