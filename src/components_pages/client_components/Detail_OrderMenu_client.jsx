import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { add } from '../../store/modules/cart';
import { useNavigate } from 'react-router-dom';
import { single } from '../../store/modules/order';
import Shipping_client from './Shipping_client';
import ModalContainer_client from './ModalContainer_client';
import ModalContainer_client2 from './ModalContainer_client2';
import detailOrderMenu from '../../styles/detail_orderMenu.module.scss';
import { MdAddShoppingCart } from 'react-icons/md';
import getToken from '../../store/modules/getToken';

export default function Detail_OrderMenu_client({
  productName,
  size,
  price,
  detail,
  datas,
}) {
  // 필요한 훅
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //리덕스 state 모음
  // 로그인 여부 확인 - 장바구니 담기, 바로 구매 가능 여부 판단
  const isLogin = useSelector((state) => state.user.isLogin);
  const cartInfo = useSelector((state) => state.cart);

  //상품 사이즈 첵
  const [sizeCheck, setSizeCheck] = useState('');
  const [onOS, setOnOS] = useState(false);
  const [onS, setOnS] = useState(false);
  const [onM, setOnM] = useState(false);
  const [onL, setOnL] = useState(false);

  const handle = (e) => {
    if (e.target.value === 'OS') {
      setOnOS(true);
      setSizeCheck('OS');
    } else {
      setOnOS(false);
    }

    if (e.target.value === 'S') {
      setOnS(true);
      setSizeCheck('S');
    } else {
      setOnS(false);
    }

    if (e.target.value === 'M') {
      setOnM(true);
      setSizeCheck('M');
    } else {
      setOnM(false);
    }

    if (e.target.value === 'L') {
      setOnL(true);
      setSizeCheck('L');
    } else {
      setOnL(false);
    }
  };

  //상품재고에 따라 첫 사이즈 선택을 가능하게 하는 것
  const sizeFistChecked = async () => {
    const sizeArr = Object.entries(datas.size).map(([key, value]) => ({
      size: key,
      stock: value,
    }));
    const sizeFilter = await sizeArr.filter(
      (el) => el.stock !== -1 && el.stock !== 0,
    );
    if (sizeFilter.length === 0) {
      return;
    } else {
      // 아니라면,아래
      setSizeCheck((cur) => sizeFilter[0].size);
    }
  };

  //화면이 마운트되면 바로 초기 사이즈첵의 값을 재고에 따라 잡아준다.
  useEffect(() => {
    sizeFistChecked();
  }, []);

  //이후 UI의 초기 사이즈 값을 설정 할 수 있도록 잡아준다. 이건 sizeCheck이 변경할 때마다 값을 가지게 조건부를 준다.
  useEffect(() => {
    if (sizeCheck === 'OS') {
      setOnOS(true);
    } else {
      setOnOS(false);
    }

    if (sizeCheck === 'S') {
      setOnS(true);
    } else {
      setOnS(false);
    }

    if (sizeCheck === 'M') {
      setOnM(true);
    } else {
      setOnM(false);
    }

    if (sizeCheck === 'L') {
      setOnL(true);
    } else {
      setOnL(false);
    }

    if (sizeCheck === '') {
      setOnOS(false);
      setOnS(false);
      setOnM(false);
      setOnL(false);
    }
  }, [sizeCheck]);

  //카트에 추가하는 Post 요청
  const addToCart = async () => {
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
        const sumQuantity = finderItem.quantity + count;
        // 카트 수량과 count수량 합산이 상품 재고를 초과하는지 확인
        if (datas.size[sizeCheck] < sumQuantity)
          return (
            alert(
              `카트에 추가하려는 상품이\n기존 카트 수량과 합산하여 재고를 초과합니다.\n상품명: ${
                datas.productName
              }\n사이즈: ${sizeCheck}\n카트에 추가 가능한 수량: ${
                datas.size[sizeCheck] - finderItem.quantity < 0
                  ? 0
                  : datas.size[sizeCheck] - finderItem.quantity
              } 개`,
            ),
            alert('카트를 확인해주세요.')
          );
      }

      // 카트 기존 수량과 추가하려는 수량의 합산이 재고 수량보다 작거나 같다면 아래 추가 진행
      const reqData = await axios.post(`http://localhost:4000/cart/add`, {
        token: await getToken(),
        productName: datas.productName,
        productCode: datas.productCode,
        img: datas.img[0],
        price: datas.price,
        size: sizeCheck,
        quantity: count,
        unitSumPrice: datas.price * count,
      });
      if (reqData.status === 200) {
        // updateCart();
        const datasArr = reqData.data.userCart.products;
        const totalQuantity = datasArr.reduce(
          (sum, el) => sum + el.quantity,
          0,
        );
        dispatch(add(datasArr, totalQuantity));
      }
    } catch (err) {
      console.error(err);
    }
  };

  //주문으로 자료 넘기려는 용도
  const [count, setCount] = useState(1);

  //싱글상품 데이터
  const singleDataSum = (datas, count, sizeCheck) => {
    let sumData = {
      productName: datas.productName,
      productCode: datas.productCode,
      price: datas.price,
      quantity: count,
      size: sizeCheck,
      totalPrice: datas.price * count,
      img: datas.img[0],
      color: datas.color,
    };
    return sumData;
  };

  //콤마 찍기
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

  //배송정보 모달
  const [shipon, setShipon] = useState(false);
  const handleOpenModal = () => {
    setShipon(true);
  };
  const handleCloseModal = () => {
    setShipon(false);
  };

  //사이즈체크 모달
  const [beanieSizeOn, setBeanieSizeOn] = useState(false);
  const handleOpenModal2 = () => {
    setBeanieSizeOn(true);
  };
  const handleCloseModa2 = () => {
    setBeanieSizeOn(false);
  };

  // 바로 구매 시(Buy 버튼)
  const buyNow = async () => {
    // 로그인 상태가 아니면, 로그인 페이지로 이동
    if (!isLogin) {
      alert('로그인이 필요한 서비스입니다.');
      return navigate(`/login`);
    }
    await dispatch(single(singleDataSum(datas, count, sizeCheck)));
    navigate(`/store/order`);
  };

  return (
    <div className={detailOrderMenu.Detail_Order}>
      {/* 일단 SHIPPING만 불러오기 */}
      {shipon && <Shipping_client handleCloseModal={handleCloseModal} />}
      {beanieSizeOn && (
        <>
          <ModalContainer_client handleCloseModa2={handleCloseModa2} />
          <ModalContainer_client2 handleCloseModa2={handleCloseModa2} />
        </>
      )}

      <p className={detailOrderMenu.pdTitle}>{productName}</p>

      <p className={detailOrderMenu.sumPrice}>
        ₩ {frontPriceComma(count * price)}
      </p>
      <div className={detailOrderMenu.infoContain}>
        {datas.size.OS !== -1 && datas.size.OS !== 0 ? (
          <button
            className={`${detailOrderMenu.sizeBTN} ${
              onOS ? detailOrderMenu.on : ''
            }`}
            onClick={(e) => {
              handle(e);
              setCount((cur) => 1);
            }}
            value="OS"
          >
            OS
          </button>
        ) : datas.size.OS === 0 ? (
          <button className={detailOrderMenu.sizeBTN_soldOut}>
            <div className={detailOrderMenu.line}></div>
            <span>OS</span>
          </button>
        ) : (
          <></>
        )}
        {datas.size.S !== -1 && datas.size.S !== 0 ? (
          <button
            className={`${detailOrderMenu.sizeBTN} ${
              onS ? detailOrderMenu.on : ''
            }`}
            onClick={(e) => {
              handle(e);
              setCount((cur) => 1);
            }}
            value="S"
          >
            S
          </button>
        ) : datas.size.S === 0 ? (
          <button className={detailOrderMenu.sizeBTN_soldOut}>
            <div className={detailOrderMenu.line}></div>
            <span>S</span>
          </button>
        ) : (
          <></>
        )}
        {datas.size.M !== -1 && datas.size.M !== 0 ? (
          <button
            className={`${detailOrderMenu.sizeBTN} ${
              onM ? detailOrderMenu.on : ''
            }`}
            onClick={(e) => {
              handle(e);
              setCount((cur) => 1);
            }}
            value="M"
          >
            M
          </button>
        ) : datas.size.M === 0 ? (
          <button className={detailOrderMenu.sizeBTN_soldOut}>
            <div className={detailOrderMenu.line}></div>
            <span>M</span>
          </button>
        ) : (
          <></>
        )}
        {datas.size.L !== -1 && datas.size.L !== 0 ? (
          <button
            className={`${detailOrderMenu.sizeBTN} ${
              onL ? detailOrderMenu.on : ''
            }`}
            onClick={(e) => {
              handle(e);
              setCount((cur) => 1);
            }}
            value="L"
          >
            L
          </button>
        ) : datas.size.L === 0 ? (
          <button className={detailOrderMenu.sizeBTN_soldOut}>
            <div className={detailOrderMenu.line}></div>
            <span>L</span>
          </button>
        ) : (
          <></>
        )}
        <p style={{ marginBottom: '15px', fontSize: '13px' }}>
          재고: {datas.size[sizeCheck]}
        </p>

        <div className={detailOrderMenu.detailDesc}>{detail}</div>

        <p className={detailOrderMenu.sizeFitCheck}>
          {/* SIZE & FIT 모달창 '비니'만 만들어놨는데 카테고리 별로 다르게 떠야함 */}
          <span onClick={handleOpenModal2}>SIZE & FIT</span>
          <span className="material-symbols-outlined">open_in_new</span>
        </p>
        <p className={detailOrderMenu.sizeFitCheck}>
          {/* SIZE & FIT 모달창 '비니'만 만들어놨는데 카테고리 별로 다르게 떠야함 */}
          <span onClick={handleOpenModal}>SHIPPING</span>
          <span className="material-symbols-outlined">open_in_new</span>
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
                    if (datas.size[sizeCheck] === count) {
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
              <button className={detailOrderMenu.addCart} onClick={addToCart}>
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
