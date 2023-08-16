/* eslint-disable no-undef */
import axios from 'axios';
import { useCallback, useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { add } from '../../../store/modules/cart';
import { useNavigate } from 'react-router-dom';
import { single } from '../../../store/modules/order';
import detailOrderMenu from '../../../styles/detail_orderMenu.module.scss';
import { MdAddShoppingCart } from 'react-icons/md';
import getToken from '../../../constant/getToken';
import Shipping_info_modal_client from './Shipping_info_modal_client';
import Size_Modal_client from './Size_Modal_client';
import { isMobile } from 'react-device-detect';
import React from 'react';

const { REACT_APP_KEY_BACK } = process.env;

export default function Detail_OrderMenu_client({
  datas,
}: {
  datas: ProductsType;
}) {
  // 필요한 훅
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //주문으로 수량 자료 넘기려는 용도
  const [count, setCount] = useState<number>(1);

  //리덕스 state 모음
  // 로그인 여부 확인 - 장바구니 담기, 바로 구매 가능 여부 판단
  const isLogin = useSelector((state: IsLoginState) => state.user.isLogin);
  const cartInfo = useSelector((state: CartState) => state.cart);

  //상품 사이즈 첵
  const [sizeCheck, setSizeCheck] = useState<string>('');
  const [onOS, setOnOS] = useState<boolean>(false);
  const [onS, setOnS] = useState<boolean>(false);
  const [onM, setOnM] = useState<boolean>(false);
  const [onL, setOnL] = useState<boolean>(false);

  // 인스턴스 재생성을 막기 위해 useCallback
  const handle = useCallback((e: React.MouseEvent) => {
    const target = e.currentTarget as HTMLButtonElement;

    if (target.value === 'OS') {
      setOnOS(true);
      setSizeCheck('OS');
    } else {
      setOnOS(false);
    }

    if (target.value === 'S') {
      setOnS(true);
      setSizeCheck('S');
    } else {
      setOnS(false);
    }

    if (target.value === 'M') {
      setOnM(true);
      setSizeCheck('M');
    } else {
      setOnM(false);
    }

    if (target.value === 'L') {
      setOnL(true);
      setSizeCheck('L');
    } else {
      setOnL(false);
    }
  }, []);

  // 초기 사이즈 잡혀야 랜더링 완료 되도록 useLayoutEffect사용
  useLayoutEffect(() => {
    //상품재고에 따라 첫 사이즈 선택을 가능하게 하는 것
    const sizeFistChecked = async () => {
      const sizeArr = Object.keys(datas.size!).filter(
        (key: string) =>
          datas.size![key as keyof typeof datas.size] !== -1 &&
          datas.size![key as keyof typeof datas.size] !== 0,
      );
      if (sizeArr.length === 0) {
        return;
      } else {
        // 아니라면,아래
        switch (sizeArr[0]) {
          case 'OS':
            setOnOS(true);
            setSizeCheck('OS');
            break;
          case 'S':
            setOnS(true);
            setSizeCheck('S');
            break;
          case 'M':
            setOnM(true);
            setSizeCheck('M');
            break;
          case 'L':
            setOnL(true);
            setSizeCheck('L');
            break;
          default:
            break;
        }
      }
    };
    sizeFistChecked();
  }, []);

  // 카트에 추가하는 Post 요청
  // 요청 과정이 복잡하므로 useCallback으로 리랜더링 방지하고, 의존성 배열에 관련 데이터 변경에 따르게 설정
  const addToCart = useCallback(async () => {
    // 로그인 상태가 아니면, 로그인 페이지로 이동
    if (!isLogin) {
      alert('로그인이 필요한 서비스입니다.');
      return navigate(`/login`);
    }
    try {
      // 카트 정보에서 해당 상품 분류하기
      const finderItem = cartInfo.cartProducts.find(
        (item) =>
          item.productName === datas.productName &&
          item.productCode === datas.productCode &&
          item.size === sizeCheck,
      );

      // 상품이 있다면 진행
      if (finderItem) {
        // 카트수량과 추가하려는 수량 합산
        const sumQuantity = finderItem.quantity! + count;
        // 카트 수량과 count수량 합산이 상품 재고를 초과하는지 확인
        if (datas.size![sizeCheck as keyof typeof datas.size] < sumQuantity)
          return (
            alert(
              `카트에 추가하려는 상품이\n기존 카트 수량과 합산하여 재고를 초과합니다.\n상품명: ${
                datas.productName
              }\n사이즈: ${sizeCheck}\n카트에 추가 가능한 수량: ${
                datas.size![sizeCheck as keyof typeof datas.size] -
                  finderItem.quantity! <
                0
                  ? 0
                  : datas.size![sizeCheck as keyof typeof datas.size] -
                    finderItem.quantity!
              } 개`,
            ),
            alert('카트를 확인해주세요.')
          );
      }
      // 카트 기존 수량과 추가하려는 수량의 합산이 재고 수량보다 작거나 같다면 아래 추가 진행
      const reqData = await axios.post(`${REACT_APP_KEY_BACK}/cart/add`, {
        token: await getToken(),
        productName: datas.productName,
        productCode: datas.productCode,
        img: datas.img![0],
        price: datas.price,
        size: sizeCheck,
        quantity: count,
        unitSumPrice: datas.price! * count,
      });
      if (reqData.status === 200) {
        const datasArr = reqData.data.userCart.products;
        const totalQuantity = datasArr.reduce(
          (sum: number, el: { quantity: number }) =>
            sum + (el.quantity < 0 ? el.quantity - el.quantity : el.quantity),
          0,
        );
        dispatch(add(datasArr, totalQuantity));
      }
    } catch (err: any) {
      navigate(
        `/error?errorMessage=${err.response.data}&errorCode=${err.response.status}`,
      );
      console.error(err);
    }
  }, [sizeCheck, count, isLogin, datas]);

  //싱글상품 데이터, 매개변수만 받으면 되니 useCallback
  const singleDataSum = useCallback(
    (datas: ProductsType, count: number, sizeCheck: string): sumDataType => {
      const sumData = {
        productName: datas.productName,
        productCode: datas.productCode,
        price: datas.price!,
        quantity: count,
        size: sizeCheck,
        totalPrice: datas.price! * count,
        img: datas.img![0],
        color: datas.color,
      };
      return sumData;
    },
    [],
  );

  //배송정보 모달
  const [shipon, setShipon] = useState(false);
  const handleOpenModal = () => setShipon(true);
  // 자식 컴포넌트 리랜더링방지 useCallback
  const handleCloseModal = useCallback(() => setShipon(false), []);

  //사이즈체크 모달
  const [beanieSizeOn, setBeanieSizeOn] = useState(false);
  const handleOpenModal2 = () => setBeanieSizeOn(true);
  // 자식 컴포넌트 리랜더링방지 useCallback
  const handleCloseModal2 = useCallback(() => setBeanieSizeOn(false), []);

  // 바로 구매 시(Buy 버튼)
  const buyNow = () => {
    // 로그인 상태가 아니면, 로그인 페이지로 이동
    if (!isLogin) {
      alert('로그인이 필요한 서비스입니다.');
      return navigate(`/login`);
    }
    dispatch(single(singleDataSum(datas, count, sizeCheck)));
    navigate(`/store/order`);
  };

  return (
    <div className={detailOrderMenu.Detail_Order}>
      {/* 일단 SHIPPING만 불러오기 */}
      {shipon && (
        <Shipping_info_modal_client handleCloseModal={handleCloseModal} />
      )}
      {beanieSizeOn && (
        <>
          <Size_Modal_client handleCloseModal={handleCloseModal2} />
        </>
      )}

      <p className={detailOrderMenu.pdTitle}>{datas.productName}</p>

      <p className={detailOrderMenu.sumPrice}>
        ₩ {(count * datas.price!).toLocaleString('ko-KR')}
      </p>
      <div className={detailOrderMenu.infoContain}>
        {datas.size!.OS !== -1 && datas.size!.OS !== 0 ? (
          <button
            className={`${detailOrderMenu.sizeBTN} ${
              onOS ? detailOrderMenu.on : ''
            }`}
            onClick={(e) => {
              handle(e);
              setCount(1);
            }}
            value="OS"
          >
            OS
          </button>
        ) : datas.size!.OS === 0 ? (
          <button className={detailOrderMenu.sizeBTN_soldOut}>
            <div className={detailOrderMenu.line}></div>
            <span>OS</span>
          </button>
        ) : (
          <></>
        )}
        {datas.size!.S !== -1 && datas.size!.S !== 0 ? (
          <button
            className={`${detailOrderMenu.sizeBTN} ${
              onS ? detailOrderMenu.on : ''
            }`}
            onClick={(e) => {
              handle(e);
              setCount(1);
            }}
            value="S"
          >
            S
          </button>
        ) : datas.size!.S === 0 ? (
          <button className={detailOrderMenu.sizeBTN_soldOut}>
            <div className={detailOrderMenu.line}></div>
            <span>S</span>
          </button>
        ) : (
          <></>
        )}
        {datas.size!.M !== -1 && datas.size!.M !== 0 ? (
          <button
            className={`${detailOrderMenu.sizeBTN} ${
              onM ? detailOrderMenu.on : ''
            }`}
            onClick={(e) => {
              handle(e);
              setCount(1);
            }}
            value="M"
          >
            M
          </button>
        ) : datas.size!.M === 0 ? (
          <button className={detailOrderMenu.sizeBTN_soldOut}>
            <div className={detailOrderMenu.line}></div>
            <span>M</span>
          </button>
        ) : (
          <></>
        )}
        {datas.size!.L !== -1 && datas.size!.L !== 0 ? (
          <button
            className={`${detailOrderMenu.sizeBTN} ${
              onL ? detailOrderMenu.on : ''
            }`}
            onClick={(e) => {
              handle(e);
              setCount(1);
            }}
            value="L"
          >
            L
          </button>
        ) : datas.size!.L === 0 ? (
          <button className={detailOrderMenu.sizeBTN_soldOut}>
            <div className={detailOrderMenu.line}></div>
            <span>L</span>
          </button>
        ) : (
          <></>
        )}
        <p style={{ marginBottom: '15px', fontSize: '13px' }}>
          재고: {datas.size![sizeCheck as keyof typeof datas.size]}
        </p>

        <div className={detailOrderMenu.detailDesc}>{datas.detail}</div>

        <p className={detailOrderMenu.sizeFitCheck} onClick={handleOpenModal2}>
          {/* SIZE & FIT 모달창 '비니'만 만들어놨는데 카테고리 별로 다르게 떠야함 */}
          <span>SIZE & FIT</span>
          <span
            className="material-symbols-outlined"
            style={{ fontSize: '18px', fontWeight: 500, marginLeft: '5px' }}
          >
            open_in_new
          </span>
        </p>
        <p className={detailOrderMenu.sizeFitCheck} onClick={handleOpenModal}>
          {/* SIZE & FIT 모달창 '비니'만 만들어놨는데 카테고리 별로 다르게 떠야함 */}
          <span>SHIPPING</span>
          <span
            className="material-symbols-outlined"
            style={{ fontSize: '18px', fontWeight: 500, marginLeft: '5px' }}
          >
            open_in_new
          </span>
        </p>

        <div className={detailOrderMenu.downInfoContain}>
          <div className={detailOrderMenu.countContainer}>
            {sizeCheck === '' ? (
              <></>
            ) : (
              <>
                <span
                  className={detailOrderMenu.miners}
                  onClick={() => {
                    if (count > 1) {
                      setCount((cur) => cur - 1);
                    }
                  }}
                >
                  -
                </span>

                <span className={detailOrderMenu.countNumber}>{count}</span>

                <span
                  className={detailOrderMenu.plus}
                  onClick={() => {
                    if (
                      datas.size![sizeCheck as keyof typeof datas.size] ===
                      count
                    ) {
                      return alert('재고초과');
                    } else {
                      setCount((cur) => cur + 1);
                    }
                  }}
                >
                  {' '}
                  +{' '}
                </span>
              </>
            )}
          </div>

          {sizeCheck === '' ? (
            <></>
          ) : (
            <>
              <div className={detailOrderMenu.catIcon}>
                <MdAddShoppingCart />
              </div>
              <button
                className={
                  !isMobile
                    ? detailOrderMenu.addCart
                    : detailOrderMenu.addCart_mobile
                }
                onClick={addToCart}
              >
                Add Cart
              </button>
            </>
          )}

          <br></br>
          {sizeCheck === '' ? (
            <button className={detailOrderMenu.buy_soldout}>Sold-Out</button>
          ) : (
            <button className={detailOrderMenu.buy} onClick={buyNow}>
              BUY
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
