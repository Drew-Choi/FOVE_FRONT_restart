import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { add } from '../../store/modules/cart';
import { useNavigate, useParams } from 'react-router-dom';
import { single } from '../../store/modules/order';
import Shipping_client from './Shipping_client';
import ModalContainer_client from './ModalContainer_client';
import ModalContainer_client2 from './ModalContainer_client2';
import detailOrderMunu from '../../styles/detail_orderMenu.module.scss';
import { MdAddShoppingCart } from 'react-icons/md';

export default function Detail_OrderMenu_client({
  productName,
  size,
  price,
  detail,
  datas,
}) {
  //리덕스 state 모음
  //유저정보 state
  const userID = useSelector((state) =>
    state.user.userID === 0 ? 0 : state.user.userID,
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 로그인 여부 확인 - 장바구니 담기, 바로 구매 가능 여부 판단
  const isLogin = useSelector((state) => state.user.isLogin);

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
    const sizeFilter = await sizeArr.filter((el) => el.stock !== 0);
    setSizeCheck((cur) => sizeFilter[0].size);
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
  }, [sizeCheck]);

  //카트에 추가하는 Post 요청
  const addToCart = async () => {
    // 로그인 상태가 아니면, 로그인 페이지로 이동
    if (!isLogin) {
      alert('로그인이 필요한 서비스입니다.');
      return navigate(`/login`);
    }

    try {
      const reqData = await axios.post(
        `http://localhost:4000/cart/add/${userID}`,
        {
          productName: datas.productName,
          img: datas.img[0],
          price: datas.price,
          size: sizeCheck,
          color: datas.color,
          quantity: count,
          unitSumPrice: datas.price * count,
          _id: datas._id,
        },
      );
      if (reqData.status === 200) {
        // updateCart();
        const datasArr = reqData.data.userCart.products;
        const totalQuantity = datasArr.reduce(
          (sum, el) => sum + el.quantity,
          0,
        );
        dispatch(add(datasArr, totalQuantity));
      } else {
        console.log(reqData.data.message);
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
    <div className={detailOrderMunu.Detail_Order}>
      {/* 일단 SHIPPING만 불러오기 */}
      {shipon && <Shipping_client handleCloseModal={handleCloseModal} />}
      {beanieSizeOn && (
        <>
          <ModalContainer_client handleCloseModa2={handleCloseModa2} />
          <ModalContainer_client2 handleCloseModa2={handleCloseModa2} />
        </>
      )}

      <p className={detailOrderMunu.pdTitle}>{productName}</p>

      <p className={detailOrderMunu.sumPrice}>
        ₩ {frontPriceComma(count * price)}
      </p>
      <div className={detailOrderMunu.infoContain}>
        {datas.size.OS > 0 ? (
          <button
            className={`${detailOrderMunu.sizeBTN} ${
              onOS ? detailOrderMunu.on : ''
            }`}
            onClick={(e) => handle(e)}
            value="OS"
          >
            OS
          </button>
        ) : null}
        {datas.size.S > 0 ? (
          <button
            className={`${detailOrderMunu.sizeBTN} ${
              onS ? detailOrderMunu.on : ''
            }`}
            onClick={(e) => handle(e)}
            value="S"
          >
            S
          </button>
        ) : null}
        {datas.size.M > 0 ? (
          <button
            className={`${detailOrderMunu.sizeBTN} ${
              onM ? detailOrderMunu.on : ''
            }`}
            onClick={(e) => handle(e)}
            value="M"
          >
            M
          </button>
        ) : null}
        {datas.size.L > 0 ? (
          <button
            className={`${detailOrderMunu.sizeBTN} ${
              onL ? detailOrderMunu.on : ''
            }`}
            onClick={(e) => handle(e)}
            value="L"
          >
            L
          </button>
        ) : null}

        <div className={detailOrderMunu.detailDesc}>{detail}</div>

        <p className={detailOrderMunu.sizeFitCheck}>
          {/* SIZE & FIT 모달창 '비니'만 만들어놨는데 카테고리 별로 다르게 떠야함 */}
          <span onClick={handleOpenModal2}>SIZE & FIT</span>
          <span className="material-symbols-outlined">open_in_new</span>
        </p>
        <p className={detailOrderMunu.sizeFitCheck}>
          {/* SIZE & FIT 모달창 '비니'만 만들어놨는데 카테고리 별로 다르게 떠야함 */}
          <span onClick={handleOpenModal}>SHIPPING</span>
          <span className="material-symbols-outlined">open_in_new</span>
        </p>

        <div className={detailOrderMunu.downInfoContain}>
          <div className={detailOrderMunu.countContainer}>
            <span
              className={detailOrderMunu.miners}
              onClick={() =>
                count <= 1 ? setCount((cur) => 1) : setCount((cur) => cur - 1)
              }
            >
              -
            </span>

            <span className={detailOrderMunu.countNumber}>{count}</span>

            <span
              className={detailOrderMunu.plus}
              onClick={() => setCount((cur) => cur + 1)}
            >
              {' '}
              +{' '}
            </span>
          </div>

          <div className={detailOrderMunu.catIcon}>
            <MdAddShoppingCart />
          </div>

          <button className={detailOrderMunu.addCart} onClick={addToCart}>
            Add Cart
          </button>
          <br></br>
          <button className={detailOrderMunu.buy} onClick={buyNow}>
            Buy
          </button>
        </div>
      </div>
    </div>
  );
}
