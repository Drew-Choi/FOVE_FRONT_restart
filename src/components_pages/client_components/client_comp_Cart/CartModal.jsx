/* eslint-disable no-undef */
import axios from 'axios';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { update } from '../../../store/modules/cart';
import '../../../styles/cartModal.scss';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import getToken from '../../../store/modules/getToken';
import { importdb } from '../../../store/modules/cart';
import BTN_black_nomal_comp from '../../../styles/BTN_black_nomal_comp';

const { REACT_APP_KEY_IMAGE } = process.env;

const CartModal_Layout = styled.div`
  position: fixed;
  background-color: white;
  top: 69.5px;
  width: 350px;
  height: 77.5%;
  z-index: 999;
  right: 0px;
  border: 0.5px solid black;
  padding: 10px;
  overflow: scroll;
`;

const CartTitle = styled.span`
  position: relative;
  font-size: 12px;
  font-weight: 700;
  padding: 20px;
`;

const ExtraTextContainer = styled.div`
  position: relative;
  /* background-color: aqua; */
  display: block;
  width: 270px;
  height: 10px;
`;

const UnitSum = styled.span`
  position: relative;
  display: inline-block;
  top: -5px;
  left: 20px;
  font-size: 11px;
  font-weight: 500;
  margin-right: 5px;
`;

const UnitSumNum = styled.span`
  position: relative;
  top: -5px;
  left: 20px;
  font-size: 11px;
  font-weight: 600;
  margin-right: 5px;
`;

const AllRemove = styled.p`
  position: absolute;
  display: inline-block;
  top: 20px;
  left: 21px;
  font-size: 10px;
  font-weight: 500;
  margin-right: 5px;
  cursor: pointer;
  &:hover {
    color: #ff5858;
  }
  &:active {
    color: #ffe0e0;
  }
`;

const CloseIcon = styled.span`
  top: 12px;
  position: relative;
  display: inline-block;
  font-size: 30px;
  left: 145px;
  cursor: pointer;
`;

const ContentContainer = styled.div`
  top: 10px;
  position: relative;
  /* background-color: beige; */
  width: 300px;
  height: 120px;
  padding: 10px;
  margin-top: 40px;
  margin-left: auto;
  margin-right: auto;
`;

const Img = styled.div`
  position: absolute;
  margin-top: auto;
  margin-bottom: auto;
  left: 0px;
  width: 100px;
  height: 100px;
  ${(props) =>
    props.imgURL &&
    `background-image: url('${REACT_APP_KEY_IMAGE}${props.imgURL}');`};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

const Pd_name = styled.p`
  position: relative;
  width: 200px;
  left: 100px;
  font-weight: 600;
  font-size: 13px;
  letter-spacing: 2px;
  margin-bottom: 3px;
`;
const Pd_color = styled.p`
  width: 200px;
  position: relative;
  left: 100px;
  font-weight: 500;
  font-size: 12px;
  letter-spacing: 2px;
  margin-bottom: 0px;
`;

const Pd_size = styled.p`
  width: 200px;
  position: relative;
  left: 100px;
  font-weight: 500;
  font-size: 12px;
  letter-spacing: 2px;
  margin-bottom: 3px;
`;

const Pd_price = styled.p`
  width: 200px;
  position: relative;
  left: 100px;
  font-weight: 500;
  font-size: 13px;
  top: 45px;
  letter-spacing: 2px;
  margin-bottom: 3px;
`;

const Pd_quantity_contain = styled.div`
  position: relative;
  display: grid;
  grid-template-areas: 'plus count miners';
  bottom: 10px;
  left: 100px;
  width: 90px;
  height: 20px;
  /* background-color: #ffaeae; */
  /* border: 0.5px solid black; */
`;

const Pd_miners = styled.span`
  font-size: 18px;
  font-weight: 550;
  grid-column: 1/1;
  transform: translateY(0px);
  grid-row: 1/1;
  justify-self: center;
  align-self: center;
  cursor: pointer;
  &:active {
    color: #b4b4b4;
  }
`;

const Pd_plus = styled.span`
  font-size: 15px;
  justify-self: center;
  align-self: center;
  grid-column: 3/3;
  grid-row: 1/1;
  cursor: pointer;
  &:active {
    color: #b4b4b4;
  }
`;

const Pd_count = styled.span`
  justify-self: center;
  align-self: center;
  grid-column: 2/2;
  grid-row: 1/1;
  font-size: 15px;
  transform: translateY(-1px);
`;

const Line1 = styled.div`
  grid-area: miners;
  border: 0.5px solid black;
`;

const Line2 = styled.div`
  grid-area: plus;
  border: 0.5px solid black;
`;

const Line3 = styled.div`
  grid-area: count;
  border: 0.5px solid black;
`;

const RemoveIcon = styled.span`
  font-size: 25px;
  position: relative;
  left: 260px;
  bottom: 130px;
  cursor: pointer;
  &:hover {
    color: #ff5858;
  }
  &:active {
    color: #b4b4b4;
  }
`;

const CartModal = ({ className, cartModalMenuRef, isLogin, closeOnClick }) => {
  // 백엔드 주소
  const { REACT_APP_KEY_BACK } = process.env;
  // 현재 URI 담기
  const location = useLocation();
  const currentURL = location.pathname;
  // 현재 URI의 쿼리나 파람스 담기
  const { productCode, category } = useParams();
  // 이동용
  const navigate = useNavigate();

  // 리덕스 디스패치
  const dispatch = useDispatch();
  // 카트 정보 리덕스state
  const cartInfo = useSelector((state) => state.cart);

  // 카트 정보 불러오키 API
  const cartDataReq = async () => {
    if (!isLogin) {
      let nullCart = {
        products: [],
        cartQuantity: 0,
      };
      dispatch(importdb(nullCart));
    } else {
      try {
        // indexedDB에서 토큰 받아오기
        const tokenValue = await getToken();
        const cartDataGet = await axios.post(
          `${REACT_APP_KEY_BACK}/cart/list`,
          {
            token: tokenValue,
          },
        );

        if (cartDataGet.status === 200) {
          dispatch(importdb(cartDataGet.data));
        }
      } catch (err) {
        if (err.response.status === 404) {
          let nullCart = {
            products: [],
            cartQuantity: 0,
          };
          dispatch(importdb(nullCart));
          return;
        }
        console.error(err);
      }
    }
  };

  useEffect(() => {
    if (
      currentURL !== '/store/order_success' &&
      currentURL !== '/store/order/checkout/fail' &&
      currentURL !== '/login' &&
      currentURL !== '/login/kakao/callback' &&
      currentURL !== '/kakao/logout'
    ) {
      cartDataReq();
    }
  }, [currentURL, isLogin]);

  //카트 상품 수량 빼기
  const minersCartItem = async (index) => {
    if (!isLogin) {
      alert('로그인이 필요한 서비스입니다.');
      return navigate(`/login`);
    }
    try {
      const tokenValue = await getToken();
      const downData = await axios.post(`${REACT_APP_KEY_BACK}/cart/qtyminus`, {
        token: tokenValue,
        index,
      });
      if (downData.status === 200) {
        if (downData.data && downData.data.userCart) {
          // 'cartObj' 객체가 null이 아니고 'products' 속성이 존재하는 경우에만 실행
          // 이곳에서 'products' 속성을 사용하는 코드 작성
          const datas = downData.data.userCart.products;
          const totalQuantity = datas.reduce(
            (sum, el) =>
              sum + (el.quantity < 0 ? el.quantity - el.quantity : el.quantity),
            0,
          );
          dispatch(update(datas, totalQuantity));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  //카트 상품 수량 추가
  const plusCartItem = async (index) => {
    if (!isLogin) {
      alert('로그인이 필요한 서비스입니다.');
      return navigate(`/login`);
    }
    try {
      const tokenValue = await getToken();
      const upData = await axios.post(`${REACT_APP_KEY_BACK}/cart/qtyplus`, {
        token: tokenValue,
        index,
      });
      if (upData.status === 200) {
        if (upData.data && upData.data.userCart) {
          // 'cartObj' 객체가 null이 아니고 'products' 속성이 존재하는 경우에만 실행
          // 이곳에서 'products' 속성을 사용하는 코드 작성
          const datas = upData.data.userCart.products;
          const totalQuantity = datas.reduce(
            (sum, el) =>
              sum + (el.quantity < 0 ? el.quantity - el.quantity : el.quantity),
            0,
          );
          dispatch(update(datas, totalQuantity));
        }
      } else {
        alert(upData.data);
        return;
      }
    } catch (err) {
      if (err.response.status === 400) return alert(err.response.data);
      console.error(err);
    }
  };

  //개별 상품 삭제
  const deletePD = async (index) => {
    if (!isLogin) {
      alert('로그인이 필요한 서비스입니다.');
      return navigate(`/login`);
    }
    try {
      const tokenValue = await getToken();
      const deleteID = await axios.post(`${REACT_APP_KEY_BACK}/cart/remove`, {
        token: tokenValue,
        index,
      });
      if (deleteID.status === 200) {
        if (deleteID.data && deleteID.data.updatedCart) {
          // 'cartObj' 객체가 null이 아니고 'products' 속성이 존재하는 경우에만 실행
          // 이곳에서 'products' 속성을 사용하는 코드 작성
          const datas = deleteID.data.updatedCart.products;
          const totalQuantity = datas.reduce((sum, el) => sum + el.quantity, 0);
          await dispatch(update(datas, totalQuantity));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  //전체 삭제(카트 비움)
  const allRemove = async () => {
    if (!isLogin) {
      alert('로그인이 필요한 서비스입니다.');
      return navigate(`/login`);
    }
    try {
      const tokenValue = await getToken();
      const allRemoveCart = await axios.post(
        `${REACT_APP_KEY_BACK}/cart/clean`,
        {
          token: tokenValue,
        },
      );
      if (allRemoveCart.status === 200) {
        if (allRemoveCart.data && allRemoveCart.data.userCart) {
          // 'cartObj' 객체가 null이 아니고 'products' 속성이 존재하는 경우에만 실행
          // 이곳에서 'products' 속성을 사용하는 코드 작성
          const datas = allRemoveCart.data.userCart.products;
          const totalQuantity = datas.reduce((sum, el) => sum + el.quantity, 0);
          dispatch(update(datas, totalQuantity));
        }
        allRemoveCart.data.message;
      } else {
        allRemoveCart.data.message;
      }
    } catch (err) {
      console.error(err);
    }
  };

  //카트 함에 담긴 물품들 합산
  const unitSum = (el) => {
    if (!el) {
      return <></>;
    } else {
      let sum = 0;
      for (let i = 0; i < el.length; i += 1) {
        if (el[i].quantity > 0) {
          sum += el[i].unitSumPrice;
        }
      }
      return sum;
    }
  };

  return (
    <>
      <CartModal_Layout ref={cartModalMenuRef} className={className}>
        <CartTitle>ORDER SUMMERY</CartTitle>

        <CloseIcon
          onClick={() => closeOnClick((cur) => (cur === 'on' ? 'off' : 'on'))}
          className="material-symbols-outlined"
        >
          close
        </CloseIcon>
        <ExtraTextContainer>
          <UnitSum>Total:&nbsp;&nbsp;&nbsp;₩</UnitSum>
          <UnitSumNum>
            {cartInfo.cartProducts.length !== 0
              ? unitSum(cartInfo.cartProducts).toLocaleString('ko-KR')
              : 0}
          </UnitSumNum>
          <UnitSum>/ {cartInfo.cartProductsLength} ea</UnitSum>
          <AllRemove
            onClick={() => {
              allRemove();
            }}
          >
            All Remove
          </AllRemove>
          <BTN_black_nomal_comp
            className="cart_Btn"
            fontSize="12px"
            transFontSize="10px"
            padding="7px 30px"
            onClickEvent={() => {
              if (isLogin) {
                if (cartInfo.cartProducts.length !== 0) {
                  navigate(`/store/cartorder`);
                  closeOnClick((cur) => (cur === 'on' ? 'off' : 'on'));
                } else {
                  alert('카트오류');
                  return navigate(`/store`);
                }
              } else {
                alert('로그인이 필요한 서비스입니다.');
                return navigate(`/login`);
              }
            }}
          >
            Buy
          </BTN_black_nomal_comp>
        </ExtraTextContainer>

        {/* 카트에 담긴 상품 뿌려주는 곳 */}
        {cartInfo.cartProducts.length !== 0 ? (
          cartInfo.cartProducts.map((el, index) => (
            <ContentContainer key={index}>
              <Img imgURL={el.img}></Img>
              <Pd_name>{el.productName}</Pd_name>
              <Pd_color>{el.color}</Pd_color>
              <Pd_size>size {el.size}</Pd_size>
              {el.quantity < 0 ? (
                <Pd_price>₩ 0</Pd_price>
              ) : (
                <Pd_price>₩ {el.unitSumPrice.toLocaleString('ko-KR')}</Pd_price>
              )}
              <Pd_quantity_contain>
                <Line1></Line1>
                <Line2></Line2>
                <Line3></Line3>
                {el.quantity < 0 ? (
                  <></>
                ) : (
                  <Pd_miners
                    onClick={() => {
                      minersCartItem(index);
                    }}
                  >
                    -
                  </Pd_miners>
                )}

                <Pd_count>
                  {el.quantity < 0 ? 'sold-out' : el.quantity}
                </Pd_count>
                {el.quantity < 0 ? (
                  <></>
                ) : (
                  <Pd_plus
                    onClick={() => {
                      plusCartItem(index);
                    }}
                  >
                    +
                  </Pd_plus>
                )}
              </Pd_quantity_contain>
              <RemoveIcon
                onClick={() => {
                  deletePD(index);
                }}
                className="material-symbols-outlined"
              >
                remove
              </RemoveIcon>
            </ContentContainer>
          ))
        ) : (
          <></>
        )}
      </CartModal_Layout>
    </>
  );
};

export default React.memo(CartModal);
