/* eslint-disable no-undef */
import React, {
  CSSProperties,
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import DaumPostcode from 'react-daum-postcode';
import myPage from '../../../styles/mypage_client.module.scss';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import getToken from '../../../constant/getToken';
import axios from 'axios';
import Loading from '../Loading';
import { IoCloseCircleOutline } from 'react-icons/io5';

const { REACT_APP_KEY_BACK } = process.env;

// constant
// 다음 주소 위젯 스타일 지정
const postCodeStyle2: CSSProperties = {
  display: 'block',
  position: 'relative',
  height: '480px',
  margin: '0px auto',
  borderTop: '1px solid black',
};

export default function Mypage_client() {
  const navigate = useNavigate();
  const userNameEncoded = useSelector(
    (state: { user: { userName: string } }) => state.user.userName,
  );
  const [orderListArray, setOrderListArray] = useState<
    Order_Cancel_ListType[] | null
  >(null);
  const [cancelListArray, setCancelListArray] = useState<
    Order_Cancel_ListType[] | null
  >(null);
  const [redirect, setRedirect] = useState<boolean>(false);
  const [addressInfo, setAddressInfo] = useState<AddressDefault | null>(null);
  const [phoneSplitData, setPhoneSplitData] = useState<string[]>([]);
  const [disableCtr, setDisableCtr] = useState<boolean>(true);

  // 인풋 정보 담아서 모으기
  const recipient = useRef<HTMLInputElement | null>(null);
  const zipCode = useRef<HTMLInputElement | null>(null);
  const address = useRef<HTMLInputElement | null>(null);
  const detailAddress = useRef<HTMLInputElement | null>(null);
  const phoneZoneCode = useRef<HTMLSelectElement | null>(null);
  const message = useRef<HTMLTextAreaElement | null>(null);

  // 매개변수만 받으면되서 callback
  const phoneNumSplit = useCallback((num: string) => {
    if (!num || num === '') return;

    const splitNum = num.split('-');
    setPhoneSplitData(splitNum);
  }, []);

  // 전화번호 유효성 검사, 매개변수만 받으면되서 callback
  const checkPhoneCode = useCallback((phoneData: string, index: number) => {
    const splitData = phoneData.split('-');
    return splitData[index];
  }, []);

  // 전화번호 유효성검사
  const [regexValue_num1, setRegexValue_num1] = useState<string>('');
  const [regexValue_num2, setRegexValue_num2] = useState<string>('');

  // 유효성검사용 핸들
  const regexValue_num1_handle = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const regex = /^\d+$/;

    if (regex.test(value) || value === '') {
      setRegexValue_num1(value);
    }
  };

  // 유효성검사용 핸들
  const regexValue_num2_handle = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const regex = /^\d+$/;

    if (regex.test(value) || value === '') {
      setRegexValue_num2(value);
    }
  };

  // 취소시 리셋
  const resetInput = () => {
    recipient.current!.value = '';
    phoneZoneCode.current!.value = checkPhoneCode(
      addressInfo!.recipientPhone,
      0,
    );
    setRegexValue_num1('');
    setRegexValue_num2('');
    message.current!.value = '';
    addressData!.zonecode = '';
    addressData!.address = '';
    addressData!.buildingName = '';
  };

  const resetInput2 = () => {
    recipient.current!.value = '';
    setRegexValue_num1('');
    setRegexValue_num2('');
    message.current!.value = '';
    addressData!.zonecode = '';
    addressData!.address = '';
    addressData!.buildingName = '';
  };

  // 주소 업데이트 백엔드 요청
  const submitAddress = async () => {
    try {
      if (
        (regexValue_num1.length < 3 && regexValue_num1 !== '') ||
        (regexValue_num2.length < 4 && regexValue_num2 !== '')
      )
        return alert('전화번호가 잘못 입력되었습니다.');

      // 아니라면 다음,
      const tokenValue = await getToken();

      const newAddress = {
        recipient:
          recipient.current?.value === ''
            ? addressInfo?.recipient
            : recipient.current?.value,
        address:
          address.current?.value === ''
            ? addressInfo?.address
            : address.current?.value,
        addressDetail:
          detailAddress.current?.value === ''
            ? addressInfo?.addressDetail
            : detailAddress.current?.value,
        zipCode:
          zipCode.current?.value === ''
            ? addressInfo?.zipCode
            : zipCode.current?.value,

        recipientPhone:
          phoneZoneCode.current?.value ===
            checkPhoneCode(addressInfo!.recipientPhone, 0) &&
          regexValue_num1 === '' &&
          regexValue_num2 === ''
            ? addressInfo?.recipientPhone
            : phoneZoneCode.current?.value !==
                checkPhoneCode(addressInfo!.recipientPhone, 0) &&
              regexValue_num1 === '' &&
              regexValue_num2 === ''
            ? `${phoneZoneCode.current?.value}-${checkPhoneCode(
                addressInfo!.recipientPhone,
                1,
              )}-${checkPhoneCode(addressInfo!.recipientPhone, 2)}`
            : phoneZoneCode.current?.value ===
                checkPhoneCode(addressInfo!.recipientPhone, 0) &&
              regexValue_num1 !== '' &&
              regexValue_num2 === ''
            ? `${checkPhoneCode(
                addressInfo!.recipientPhone,
                0,
              )}-${regexValue_num1}-${checkPhoneCode(
                addressInfo!.recipientPhone,
                2,
              )}`
            : phoneZoneCode.current?.value ===
                checkPhoneCode(addressInfo!.recipientPhone, 0) &&
              regexValue_num1 === '' &&
              regexValue_num2 !== ''
            ? `${checkPhoneCode(
                addressInfo!.recipientPhone,
                0,
              )}-${checkPhoneCode(
                addressInfo!.recipientPhone,
                1,
              )}-${regexValue_num2}`
            : phoneZoneCode.current?.value !==
                checkPhoneCode(addressInfo!.recipientPhone, 0) &&
              regexValue_num1 !== '' &&
              regexValue_num2 === ''
            ? `${
                phoneZoneCode.current?.value
              }-${regexValue_num1}-${checkPhoneCode(
                addressInfo!.recipientPhone,
                2,
              )}`
            : phoneZoneCode.current?.value !==
                checkPhoneCode(addressInfo!.recipientPhone, 0) &&
              regexValue_num1 === '' &&
              regexValue_num2 !== ''
            ? `${phoneZoneCode.current?.value}-${checkPhoneCode(
                addressInfo!.recipientPhone,
                1,
              )}-${regexValue_num2}`
            : phoneZoneCode.current?.value ===
                checkPhoneCode(addressInfo!.recipientPhone, 0) &&
              regexValue_num1 !== '' &&
              regexValue_num2 !== ''
            ? `${checkPhoneCode(
                addressInfo!.recipientPhone,
                0,
              )}-${regexValue_num1}-${regexValue_num2}`
            : `${phoneZoneCode.current?.value}-${regexValue_num1}-${regexValue_num2}`,
        message_ad:
          message.current?.value === ''
            ? addressInfo?.message_ad
            : message.current?.value,
        isDefault: true,
      };

      const response = await axios.post(
        `${REACT_APP_KEY_BACK}/mypage/editAddress`,
        {
          token: tokenValue,
          newAddress,
        },
      );
      if (response.status !== 200) return alert('오류\n등록실패');
      // 200번대 성공이면
      alert('기본배송주소 등록 성공');
      setRedirect((cur) => !cur);
      resetInput2();
      phoneZoneCode.current!.value = checkPhoneCode(
        response.data.recipientPhone,
        0,
      );
      setDisableCtr(true);
      return;
    } catch (err) {
      alert('오류\n등록실패');
      console.error(err);
      return;
    }
  };

  //다음주소 불러오기 기능 ----------------------------------------------
  const [openPostcode, setOpenPostcode] = useState<boolean>(false);
  const [addressData, setAdressData] = useState<DaumPostInfo | null>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setAdressData((cur) => {
      if (cur === null) {
        return null;
      }
      const copy: DaumPostInfo = { ...cur };
      copy.buildingName = event.target.value;
      return copy;
    });
  };

  const handle = {
    // 버튼 클릭 이벤트
    clickButton: () => {
      setOpenPostcode((current) => {
        if (current === false) return true;
        return true;
      });
    },
    clickButton_close: () => {
      setOpenPostcode((cur) => {
        if (cur === true) return false;
        return false;
      });
    },

    // 주소 선택 이벤트
    selectAddress: (data: DaumPostInfo) => {
      setAdressData(data);
      setOpenPostcode(false);
    },
  };
  //------------------------------------------------------

  useEffect(() => {
    // 주문내역 불러오기
    const getOrderList = async () => {
      try {
        const tokenValue = await getToken();
        const getOrderListData = await axios.post(
          `${REACT_APP_KEY_BACK}/order_list/getMemberOrderList`,
          { token: tokenValue },
        );
        if (
          getOrderListData.status === 200 &&
          getOrderListData.data.length > 0
        ) {
          return setOrderListArray(getOrderListData.data);
        } else {
          return setOrderListArray([]);
        }
      } catch (err: any) {
        navigate(
          `/error?errorMessage=${err.response.data}&errorCode=${err.response.status}`,
        );
        console.error(err);
      }
    };

    // 취소내역 불러오기
    const getCancelList = async () => {
      try {
        const tokenValue = await getToken();
        const getCancelListData = await axios.post(
          `${REACT_APP_KEY_BACK}/order_list/getCancelList`,
          {
            token: tokenValue,
          },
        );
        if (
          getCancelListData.status === 200 &&
          getCancelListData.data.length > 0
        ) {
          return setCancelListArray(getCancelListData.data);
        } else {
          return setCancelListArray([]);
        }
      } catch (err: any) {
        navigate(
          `/error?errorMessage=${err.response.data}&errorCode=${err.response.status}`,
        );
        console.error(err);
      }
    };

    // 주소정보 불러오기
    const getAddressInfo = async () => {
      try {
        const tokenValue = await getToken();

        const response = await axios.post(
          `${REACT_APP_KEY_BACK}/mypage/getAddress`,
          {
            token: tokenValue,
          },
        );

        if (response.status !== 200) return alert('오류');
        // 200번대 성공이라면,
        setAddressInfo(response.data);
        phoneNumSplit(response.data.recipientPhone);
        return;
      } catch (err: any) {
        navigate(
          `/error?errorMessage=${err.response.data}&errorCode=${err.response.status}`,
        );
        console.error(err);
        return;
      }
    };

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
                    value={addressData === null ? '' : addressData.zonecode}
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
                    <div className={myPage.daum_post_box}>
                      <span
                        className={myPage.ad_closeIconBox}
                        onClick={() => handle.clickButton_close()}
                      >
                        <IoCloseCircleOutline className={myPage.ad_closeIcon} />
                      </span>

                      <DaumPostcode
                        style={postCodeStyle2}
                        className={myPage.kakaoadd}
                        onComplete={handle.selectAddress} // 값을 선택할 경우 실행되는 이벤트
                        autoClose={false} // 값을 선택할 경우 사용되는 DOM을 제거하여 자동 닫힘 설정
                        defaultQuery="" // 팝업을 열때 기본적으로 입력되는 검색어
                      />
                    </div>
                  )}
                </div>

                <input
                  type="text"
                  placeholder={
                    addressInfo.address ? addressInfo.address : '주소 없음'
                  }
                  value={addressData === null ? '' : addressData.address}
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
                  value={addressData === null ? '' : addressData.buildingName}
                  onChange={(e) => handleChange(e)}
                  disabled={disableCtr}
                />
                <div className={myPage.phoneWrap}>
                  <select
                    defaultValue={
                      phoneSplitData && phoneSplitData.length !== 0
                        ? phoneSplitData[0]
                        : '010'
                    }
                    ref={phoneZoneCode}
                    disabled={disableCtr}
                  >
                    <option value="010">010</option>
                    <option value="011">011</option>
                    <option value="016">016</option>
                    <option value="017">017</option>
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
                    maxLength={4}
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
                    maxLength={4}
                  />
                </div>
                <textarea
                  ref={message}
                  maxLength={50}
                  rows={3}
                  cols={100}
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
                    onClick={() => setDisableCtr(false)}
                  >
                    수정
                  </span>
                ) : (
                  <span
                    className={myPage.registerBTN_white}
                    onClick={() => {
                      setDisableCtr(true);
                      resetInput();
                    }}
                  >
                    취소
                  </span>
                )}
                {!disableCtr && (
                  <span
                    className={myPage.registerBTN_black}
                    onClick={submitAddress}
                  >
                    등록
                  </span>
                )}
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
