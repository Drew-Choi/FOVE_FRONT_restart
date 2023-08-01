/* eslint-disable no-undef */
import React, { useEffect, useRef, useState } from 'react';
import orderClient from '../../../styles/order_client.module.scss';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import BTN_black_nomal_comp from '../../../styles/BTN_black_nomal_comp';
import { useLocation, useNavigate } from 'react-router-dom';
import Select_Custom from '../../../components_elements/Select_Custom';
import TextArea_Custom from '../../../components_elements/TextArea_Custom';
import DaumPostcode from 'react-daum-postcode';
import Error404 from '../Error404';
import LoadingCartOrder from '../LoadingCartOrder';
import getToken from '../../../store/modules/getToken';
import axios from 'axios';
import { IoCloseCircleOutline } from 'react-icons/io5';
import Loading_Spinner from '../Loading_Spinner';
const { REACT_APP_KEY_IMAGE } = process.env;

const Pd_order_IMG = styled.div`
  ${(props) =>
    props.img && `background-image: url('${REACT_APP_KEY_IMAGE}${props.img}')`}
`;

export default function Order_client() {
  // 스피너
  const [spinner, setSpinner] = useState(false);

  // 화면전환 로딩용 리덕스 state
  const isVisible = useSelector((state) => state.cartOrderLoading.isVisible);
  //카트에 담긴 상품들을 주문해 보자
  //일단, 현재 페이지의 url주소를 분석해서 싱글인지, 카트 상품인지 파악하자
  const location = useLocation();
  const currentURL = location.pathname;
  const navigate = useNavigate();

  const { REACT_APP_KEY_BACK } = process.env;

  // 로그인관련
  const isLogin = useSelector((state) => state.user.isLogin);

  //천단위 컴마
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

  //리덕스 state ---------------------------
  //오더메뉴에서 넘어오는 정보들(리덕스)
  const singleOrder = useSelector((state) => state.order);
  const cartOrderData = useSelector((state) => state.cart);

  //----------------------------------------------------------------

  //주문 정보 담기
  //1. 받는 분 성함
  const [recipientName, setRecipientName] = useState('');
  //핸들
  const recipientName_handle = (e) => {
    setRecipientName((cur) => e.target.value);
  };
  //2. 받는 분 우편번호
  const [recipientZipcode, setRecipientZipcode] = useState('');

  //3. 받는 분 기본 주소
  const [recipientAddress, setRecipientAddress] = useState('');

  //4. 받는 분 상세주소
  const [recipientAddressDetail, setRecipientAddressDetail] = useState('');
  //상세주소 추가 입력 핸들
  const recipientAddressDetail_handle = (e) => {
    setRecipientAddressDetail((cur) => e.target.value);
  };

  //------------휴대폰 번호는 합치는 작업 필요--------------

  //5. 받는 분 전화번호의 지역번호
  const [phoneCode, setPhoneCode] = useState('010');
  const phoneCode_handle = (e) => {
    setPhoneCode((cur) => e.target.value);
  };

  //6. 받는 분 전화번호의 중간번호
  const [phoneMidNum, setPhoneMidNum] = useState('');
  const phoneMidNum_handle = (e) => {
    const value = e.target.value;
    const regex = /^\d+$/;

    if (regex.test(value) || value === '') {
      setPhoneMidNum((cur) => value);
    }
  };
  //7. 받는 분 전화번호의 마지막 번호
  const [phoneLastNum, setPhoneLastNum] = useState('');
  const phoneLastNum_handle = (e) => {
    const value = e.target.value;
    const regex = /^\d+$/;

    if (regex.test(value) || value === '') {
      setPhoneLastNum((cur) => value);
    }
  };
  //-------------------------------------------------

  //기본 배송지 불러올때 합쳐진거 분리해서 뿌려주기
  const phoneNumSplit = (num) => {
    if (!num || num === '') return;
    //
    const splitNum = num.split('-');
    setPhoneCode((cur) => splitNum[0]);
    setPhoneMidNum((cur) => splitNum[1]);
    setPhoneLastNum((cur) => splitNum[2]);
  };

  //14. 기타 배송 메모
  const [message, setMessage] = useState('');
  const message_handle = (e) => {
    setMessage((cur) => e.target.value);
  };
  //-------------------------------------------------

  // 기본배송지 주소 불러오기
  // 체크박스 컨트롤
  const [isChecked, setIsChecked] = useState(true);

  const isChecked_handle = (e) => {
    setIsChecked((cur) => e.target.checked);
  };

  const getAddress = async () => {
    try {
      const tokenValue = await getToken();

      const response = await axios.post(
        `${REACT_APP_KEY_BACK}/mypage/getAddress`,
        { token: tokenValue },
      );

      if (response.status !== 200) return alert('오류');
      // 200번대 성공이라면,
      setRecipientName((cur) => response.data.recipient);
      setRecipientZipcode((cur) => response.data.zipCode);
      setRecipientAddress((cur) => response.data.address);
      setRecipientAddressDetail((cur) => response.data.addressDetail);
      phoneNumSplit(response.data.recipientPhone);
      setMessage((cur) => response.data.message_ad);
      return;
    } catch (err) {
      console.error(err);
      return;
    }
  };

  const orderListLocalSave = async () => {
    // 저장 전에 주문서 유효성 검사
    setSpinner((cur) => true);
    if (
      recipientName === '' ||
      recipientZipcode === '' ||
      recipientAddress === '' ||
      recipientAddressDetail === '' ||
      phoneCode === '' ||
      phoneMidNum === '' ||
      phoneLastNum === ''
    )
      return setSpinner((cur) => false), alert('필수정보를 모두 입력해주세요.');

    // 유효성 통과되면 전화번호 재대로 들어왔는지 검사
    if (
      (phoneMidNum !== '' && phoneLastNum === '') ||
      (phoneMidNum === '' && phoneLastNum !== '') ||
      phoneMidNum.length < 3 ||
      phoneLastNum.length < 4
    )
      return setSpinner((cur) => false), alert('연락처가 잘못 입력되었습니다.');

    //--------싱글아이템과 멀티아이템 추리는 작업 그리고 products키로 로컬스토리지에 JSON화 저장
    const products = [];
    if (currentURL === '/store/order') {
      products.push({
        productName: singleOrder.productName,
        productCode: singleOrder.productCode,
        price: singleOrder.price,
        img: singleOrder.img,
        size: singleOrder.size,
        color: singleOrder.color,
        quantity: singleOrder.quantity,
        unitSumPrice: singleOrder.quantity * singleOrder.price,
      });
    } else if (currentURL === '/store/cartorder') {
      cartOrderData.cartProducts.map((el) => {
        if (el.quantity > 0) {
          products.push(el);
        }
      });
    }

    //받는 사람(recipien) 정보, recipien키로 JSON화 해서 통으로 넣기
    const recipien = {
      message: message,
      recipientName: recipientName,
      recipientZipcode: recipientZipcode,
      recipientAddress: recipientAddress,
      recipientAddressDetail: recipientAddressDetail,
      phoneCode: phoneCode,
      phoneMidNum: phoneMidNum,
      phoneLastNum: phoneLastNum,
    };

    //결제 전 2개 객체 products, recipien, payments
    localStorage.setItem('products', JSON.stringify(products));
    localStorage.setItem('recipien', JSON.stringify(recipien));

    setSpinner((cur) => false);
    navigate('/store/order/checkout');
  };

  const selectList_celPhone = ['010', '011', '016', '017', '019'];

  const postCodeStyle2 = {
    display: 'block',
    position: 'relative',
    height: '480px',
    margin: '0px auto',
    borderTop: '1px solid black',
  };

  //카트데이터 계산할때 총 합계값을 반환해주는 함수
  const cartItemPriceSum = () => {
    let sum = 0;

    cartOrderData.cartProducts.map((el) => {
      if (el.quantity > 0) {
        sum += el.unitSumPrice;
      }
    });
    return sum;
  };

  //결제 동의 결과값
  const checkoutRef = useRef(false);
  const [agreement, setAgreement] = useState();
  const [toggleModal, setToggleModal] = useState(false);
  const [on, setOn] = useState('');

  //agreement 모달 스크롤기능
  const [scrollPosition, setScrollPosition] = useState(0);
  useEffect(() => {
    if (toggleModal) {
      setScrollPosition(window.pageYOffset);
      document.body.style.overflow = 'hidden';
      setOn('On');
    } else {
      document.body.style.overflow = 'auto';
      window.scrollTo(0, scrollPosition);
      setOn('');
    }
  }, [toggleModal]);

  useEffect(() => {
    if (isChecked) {
      getAddress();
    } else {
      setRecipientName((cur) => '');
      setRecipientZipcode((cur) => '');
      setRecipientAddress((cur) => '');
      setRecipientAddressDetail((cur) => '');
      setPhoneCode((cur) => '010');
      setPhoneMidNum((cur) => '');
      setPhoneLastNum((cur) => '');
      setMessage((cur) => '');
    }
  }, [isChecked]);

  //다음주소 불러오기 기능 ----------------------------------------------
  const [openPostcode, setOpenPostcode] = useState(false);

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
    selectAddress: (data) => {
      // console.log(typeof data); object
      setRecipientZipcode((cur) => data.zonecode);
      setRecipientAddress((cur) => data.address);
      setRecipientAddressDetail((cur) => data.buildingName);
      setOpenPostcode(false);
    },
  };
  //------------------------------------------------------

  return (
    <div className={orderClient.order_main}>
      {spinner && <Loading_Spinner />}
      <div
        className={`${orderClient.orderModalOff} ${
          on === 'On' ? orderClient.On : ''
        }`}
      >
        <p>결제정보 확인 및 구매진행에 동의하셔야 주문이 가능합니다.</p>
        <BTN_black_nomal_comp
          onClickEvent={() => setToggleModal(false)}
          className={orderClient.model_checkout}
        >
          확인
        </BTN_black_nomal_comp>
      </div>

      <p className={orderClient.order_title}>ORDER</p>

      {/* <div className={orderClient.memeber_info_contain}>
      <p className={orderClient.memeber_info_membership}>
        {userName}님은, <strong>{'[STANDARD]'}</strong> 회원이십니다.
      </p>
      <p className={orderClient.memeber_info_event1}>
        KRW 10,000 이상 구매시 <strong>5%</strong>를 추가할인 받으실 수
        있습니다. (최대 KDW 9,999,999)
      </p>
      <p className={orderClient.memeber_info_event2}>
        KRW 10,000 이상 구매시 <strong>5%</strong>를 추가할인 받으실 수
        있습니다. (최대 KDW 9,999,999)
      </p>
      <div className={orderClient.wrap}>
        <div className={orderClient.point_text1_wrap}>
          <span className={orderClient.point_text1}>가용적립금:</span>
          <span className={orderClient.member_point}>{userPoints} 원</span>
        </div>
        <div className={orderClient.point_text2_wrap}>
          <span className={orderClient.point_text2}>예치금:</span>
          <span className={orderClient.member_deposit}>{'0'} 원</span>
        </div>
        <div className={orderClient.point_text3_wrap}>
          <span className={orderClient.point_text3}>쿠폰:</span>
          <span className={orderClient.member_coupon}>{'0'} 개</span>
        </div>
      </div>
    </div> */}

      {singleOrder.productName === '' &&
      singleOrder.price === 0 &&
      currentURL === '/store/order' ? (
        <p className={orderClient.resetMessage}>
          선택하신 상품이 초기화 되었습니다. 상품을 다시 선택해주세요.
        </p>
      ) : (
        <div className={orderClient.orderDetail_wrap}>
          <p className={orderClient.order_product_title}>상품 정보</p>
          <div className={orderClient.ordermenu_product_contianer}>
            {/* 싱글 오더와 카트오더를 url로 구분 각각 다른 데이터 바인딩 페이지를 보여줘야함*/}

            {/* 현재 URL주소가 /store/order라면~ */}
            {currentURL === '/store/order' ? (
              // 아래 싱글데이터를 바인딩한걸 보여줘
              <div className={orderClient.individualCopy_layout}>
                <Pd_order_IMG
                  img={singleOrder.img}
                  className={orderClient.order_pdIMG}
                ></Pd_order_IMG>
                <div className={orderClient.order_pd_info}>
                  <p className={orderClient.order_product_Name}>
                    {singleOrder.productName}
                  </p>
                  <p className={orderClient.order_product_price}>
                    ₩ {frontPriceComma(singleOrder.price)}
                  </p>
                  <p className={orderClient.order_product_size}>
                    SIZE: {singleOrder.size}
                  </p>
                  <p className={orderClient.order_product_color}>
                    {singleOrder.color}
                  </p>
                  <p className={orderClient.order_product_quantity}>
                    <strong>QTY</strong> :
                    {frontPriceComma(singleOrder.quantity)}
                  </p>
                  <p className={orderClient.order_product_unitSumPrice}>
                    <strong>Total : ₩</strong>{' '}
                    <span>{frontPriceComma(singleOrder.totalPrice)}</span>
                  </p>
                </div>
              </div>
            ) : isVisible ? (
              <LoadingCartOrder />
            ) : //만약 아니라면, /store/cartorder 인지 확인해봐
            currentURL === '/store/cartorder' &&
              cartOrderData.cartProductsLength !== 0 ? (
              //만약 2번째 조건이 맞다면, 아래 카트데이터로 들어오는 걸 바인딩해줘
              //카트아이템은 어레이로 들어오기 때문에 map으로 죠진다
              cartOrderData.cartProducts.map((el, index) => {
                if (el.quantity > 0)
                  return (
                    <div
                      key={index}
                      className={orderClient.individualCopy_layout}
                    >
                      <Pd_order_IMG
                        img={el.img}
                        className={orderClient.order_pdIMG}
                      ></Pd_order_IMG>
                      <div className={orderClient.order_pd_info}>
                        <p className={orderClient.order_product_Name}>
                          {el.productName}
                        </p>
                        <p className={orderClient.order_product_price}>
                          ₩ {frontPriceComma(el.price)}
                        </p>
                        <p className={orderClient.order_product_size}>
                          size: {el.size}
                        </p>
                        <p className={orderClient.order_product_color}>
                          {el.color}
                        </p>
                        <p className={orderClient.order_product_quantity}>
                          <strong>QTY</strong> : {frontPriceComma(el.quantity)}
                        </p>
                        <p className={orderClient.order_product_unitSumPrice}>
                          <strong>Total : ₩</strong>{' '}
                          <span>{frontPriceComma(el.quantity * el.price)}</span>
                        </p>
                      </div>
                    </div>
                  );
              })
            ) : (
              <Error404 />
            )}
          </div>
          <div className={orderClient.sangAh}>
            <p className={orderClient.ship_input_title}>배송 정보</p>
            <div className={orderClient.ship_info_input_container}>
              <div className={orderClient.adressCheck}>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={isChecked_handle}
                />
                <label>기본배송지 사용</label>
              </div>
              <p>*필수입력사항</p>
            </div>

            {/* 주소록 관리 등록 제목 위치 */}
            <div className={orderClient.information_contain}>
              <input
                value={recipientName}
                className={orderClient.b}
                type="text"
                placeholder="받으시는 분"
                onChange={(e) => recipientName_handle(e)}
              />
              <div>
                <div>
                  <div className={orderClient.code_btn_container}>
                    <input
                      className={`${orderClient.address} ${orderClient.b}`}
                      type="text"
                      value={recipientZipcode}
                      placeholder="우편번호*"
                      disabled
                    />
                    <button
                      onClick={() => handle.clickButton()}
                      className={orderClient.postCode}
                    >
                      주소 찾기
                    </button>
                    {openPostcode && (
                      <div className={orderClient.daum_post_box}>
                        <span
                          className={orderClient.ad_closeIconBox}
                          onClick={() => handle.clickButton_close()}
                        >
                          <IoCloseCircleOutline
                            className={orderClient.ad_closeIcon}
                          />
                        </span>

                        <DaumPostcode
                          style={postCodeStyle2}
                          className={orderClient.kakaoadd}
                          onComplete={handle.selectAddress} // 값을 선택할 경우 실행되는 이벤트
                          autoClose={false} // 값을 선택할 경우 사용되는 DOM을 제거하여 자동 닫힘 설정
                          defaultQuery="" // 팝업을 열때 기본적으로 입력되는 검색어
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <input
                      className={orderClient.b}
                      type="text"
                      value={recipientAddress}
                      placeholder="주소*"
                      disabled
                    />
                  </div>

                  <div>
                    <input
                      className={orderClient.b}
                      type="text"
                      value={recipientAddressDetail}
                      placeholder="나머지주소 (선택입력)"
                      onChange={recipientAddressDetail_handle}
                    />
                  </div>
                </div>

                <div className={orderClient.phonNum_contain}>
                  <Select_Custom
                    value={phoneCode}
                    onChangeEvent={phoneCode_handle}
                    classNameSelect={`${orderClient.select_group2} ${orderClient.phonNum}`}
                    selectList={selectList_celPhone}
                  />
                  <p className={orderClient.numMiners}>-</p>
                  <input
                    value={phoneMidNum}
                    onChange={phoneMidNum_handle}
                    className={`${orderClient.phonNum} ${orderClient.mid} ${orderClient.b}`}
                    type="tel"
                    placeholder="휴대폰"
                    maxLength="4"
                    pattern="[0-9]{4}"
                  />
                  <p className={orderClient.numMiners}>-</p>
                  <input
                    value={phoneLastNum}
                    onChange={phoneLastNum_handle}
                    className={`${orderClient.phonNum} ${orderClient.last} ${orderClient.b}`}
                    type="tel"
                    maxLength="4"
                    pattern="[0-9]{4}"
                  />
                </div>

                <TextArea_Custom
                  value={message}
                  onChangeEvent={message_handle}
                  styleArea={{ resize: 'none' }}
                  maxLength="50"
                  rows="3"
                  cols="100"
                  type="text"
                  textAreaClassName={orderClient.textAreaClassName}
                  placeholder="배송 메세지"
                />

                {/* 결제영역 */}
                <div className={orderClient.payment_contain}>
                  {/* 할인코드
                <p className={orderClient.discount_title}>할인</p>
                <p className={orderClient.discount_apply}>할인코드 적용</p>
                <div className={orderClient.discount_area}>
                  <input
                    type="text"
                    className={`${orderClient.discount_code} ${orderClient.b}`}
                  />
                  <button className={orderClient.diicount_code_btn}>
                    적용
                  </button>
                  <div className={orderClient.discount_price}>
                    추가할인금액: -
                  </div>
                </div>
                포인트
                <p className={orderClient.point_title}>포인트</p>
                <div className={orderClient.point}>
                  <input
                    type="text"
                    className={`${orderClient.point_apply} ${orderClient.b}`}
                  />
                  <button className={orderClient.diicount_code_btn}>
                    적용
                  </button>
                  <div className={orderClient.preview_point}>
                    사용가능 포인트: {userPoints} p
                  </div>
                  <div className={orderClient.point_price_apply}>
                    포인트 사용: -{' '}
                  </div>
                </div>
                예치금
                <p
                  className={`${orderClient.point_title} ${orderClient.deposit}`}
                >
                  예치금
                </p>
                <div className={orderClient.point}>
                  <input
                    type="text"
                    className={`${orderClient.point_apply} ${orderClient.b}`}
                  />
                  <button className={orderClient.diicount_code_btn}>
                    적용
                  </button>
                  <div className={orderClient.preview_point}>
                    사용가능 예치금:
                  </div>
                  <div className={orderClient.point_price_apply}>
                    예치금 사용: -
                  </div>
                </div> */}

                  {/* 결제하기 */}
                  <p
                    className={`${orderClient.point_title} ${orderClient.deposit}`}
                  >
                    총 합계
                  </p>
                  <div className={orderClient.final_checkout_contain}>
                    <div
                      className={`${orderClient.unit_sum_price} ${orderClient.a}`}
                    >
                      <p>상품금액</p>
                      <p>
                        KRW
                        {currentURL === '/store/order'
                          ? frontPriceComma(singleOrder.totalPrice)
                          : currentURL === '/store/cartorder'
                          ? frontPriceComma(cartItemPriceSum())
                          : null}
                      </p>
                    </div>
                    <div
                      className={`${orderClient.ship_price} ${orderClient.a}`}
                    >
                      <p>배송비</p>
                      <p>+ KRW {'0'}</p>
                    </div>
                    <div
                      className={`${orderClient.extra_ship_price} ${orderClient.a}`}
                    >
                      <p>지역별 배송비</p>
                      <p>+ KRW {'0'}</p>
                    </div>
                    {/* <div
                    className={`${orderClient.total_discount} ${orderClient.a}`}
                  >
                    <p>총 할인</p>
                    <p>- KRW {'0'}</p>
                  </div> */}
                    <div
                      className={`${orderClient.final_sum} ${orderClient.a}`}
                    >
                      <p>최종 결제 금액</p>
                      <p>
                        = KRW{' '}
                        {currentURL === '/store/order'
                          ? frontPriceComma(singleOrder.totalPrice)
                          : currentURL === '/store/cartorder'
                          ? frontPriceComma(cartItemPriceSum())
                          : null}
                      </p>
                    </div>
                    <div
                      className={`${orderClient.rest_point} ${orderClient.a}`}
                    >
                      <p>
                        총 적립예정금액{' '}
                        {currentURL === '/store/order'
                          ? frontPriceComma(
                              Math.floor(singleOrder.totalPrice * 0.01),
                            )
                          : currentURL === '/store/cartorder'
                          ? frontPriceComma(
                              Math.floor(cartItemPriceSum() * 0.01),
                            )
                          : null}
                      </p>
                    </div>

                    <label
                      htmlFor="agree_check"
                      className={orderClient.checkTitle}
                    >
                      <input
                        onClick={() =>
                          setAgreement((cur) => checkoutRef.current.checked)
                        }
                        ref={checkoutRef}
                        className={orderClient.checkcheck}
                        type="checkbox"
                        name="agree"
                        value="agreement"
                        id="agree_check"
                      />
                      결제정보를 확인하였으며, 구매진행에 동의합니다.
                    </label>
                    <div className={orderClient.btn_order}>
                      <BTN_black_nomal_comp
                        fontSize="18px"
                        className={orderClient.order_btn}
                        padding="10px 0px"
                        onClickEvent={() => {
                          if (isLogin) {
                            !agreement
                              ? setToggleModal((cur) => true)
                              : orderListLocalSave();
                          } else {
                            alert('로그인이 필요한 서비스입니다.');
                            return navigate(`/login`);
                          }
                        }}
                      >
                        결제하기
                      </BTN_black_nomal_comp>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
