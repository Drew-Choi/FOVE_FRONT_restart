import React, { useEffect, useRef, useState } from 'react';
import '../../styles/header_client.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { importdb } from '../../store/modules/cart';
import CartModal from './CartModal';
import { offon } from '../../store/modules/cartmodal';
import MenuAccount from './MenuAccount';
import { clickMenu } from '../../store/modules/menuAccount';
import GoogleIcon from './GoogleIcon';
import { searchinput } from '../../store/modules/search';
import MediaQuery from 'react-responsive';

export default function Header_client() {
  const excludeRef = useRef(null);
  const searchBTN = useRef();

  //반응형 햄버거 메뉴 커서
  const [burger, setBurger] = useState('on');
  const [burgerClose, setBurgerClose] = useState('off');
  const burherHandler = () => {
    burger === 'on' && burgerClose === 'off'
      ? (setBurger((cur) => 'off'), setBurgerClose((cur) => 'on'))
      : (setBurger((cur) => 'on'), setBurgerClose((cur) => 'off'));
  };

  const navigate = useNavigate();

  //리덕스 디스패치(액션함수 전달용)
  const dispatch = useDispatch();
  //모달을 위한 state
  const offonKey = useSelector((state) => state.cartmodal.offon);
  const menuClicked = useSelector((state) => state.menuAccount.clicked);
  //유저정보 state
  const userData = useSelector((state) => (state.user === 0 ? 0 : state.user));
  //상품정보 state
  const cartInfo = useSelector((state) => (state.cart === 0 ? 0 : state.cart));

  const location = useLocation();
  const currentURL = location.pathname;

  const cartDataReq = async () => {
    if (!userData.userID) {
      let nullCart = {
        products: [],
        cartQuantity: 0,
      };
      dispatch(importdb(nullCart));
    } else {
      try {
        const cartDataGet = await axios.post(
          `http://localhost:4000/cart/list/${userData.userID}`,
        );
        if (cartDataGet.status === 200) {
          dispatch(importdb(cartDataGet.data));
        } else {
          console.error(cartDataGet.status);
          console.log(cartDataGet.data.message);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    cartDataReq();
  }, [userData.userID]);

  // 장바구니 버튼(Shopping Bag) - 로그인 상태에서 사용 가능하게
  const clickShoppingBag = () => {
    if (!userData.isLogin) {
      alert('로그인이 필요한 서비스입니다.');
      return navigate(`/login`);
    }
    dispatch(offon());
  };

  //서칭용 상태관리
  const [searchOnOff, setSearchOnOff] = useState('off');
  //검색창에 검색 안할떄
  const [empty, setEmpty] = useState('상품검색');

  //서칭용 엔터 핸들러
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      // 검색 로직 실행
      dispatch(searchinput(e.target.value));
      if (!e.target.value) {
        setEmpty('검색어를 입력해주세요.');
      } else {
        searchBTN.current.click();
        e.target.value = '';
      }
    }
  };

  //윈도우 클릭시 기능해제, 돋보기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchBTN.current &&
        !searchBTN.current.contains(event.target) &&
        excludeRef.current &&
        !excludeRef.current.contains(event.target)
      ) {
        setSearchOnOff('off');
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [searchBTN, excludeRef]);

  const handleClick = () => {
    setSearchOnOff('on');
  };

  return (
    <>
      <header className="header_client">
        <p className="logo" onClick={() => navigate('/')}>
          FOVE
        </p>

        {/* 관리자 페이지 이동 버튼 */}
        {userData.isAdmin && (
          <button className="adminBTN" onClick={() => navigate('/admin')}>
            👩‍💻 관리자 페이지
          </button>
        )}

        <div id="cate">
          <p onClick={() => navigate('/aboutus')}>ABOUT US</p>
          <p onClick={() => navigate('/store')}>STORE</p>
          <p onClick={() => navigate('#')}>COLLECTION</p>
        </div>

        {/* 반응형 버거메뉴--------------------- */}
        <div className="burger_menu_container">
          <span
            onClick={burherHandler}
            className={`material-symbols-sharp burgerIcon ${burger}`}
          >
            menu
          </span>
          <span
            onClick={burherHandler}
            className={`material-symbols-sharp burgerClose ${burgerClose}`}
          >
            close
          </span>
        </div>
        {/* 반응형 버거메뉴--------------------- */}

        <ul id="cate2">
          <li id="search_container">
            <input
              ref={excludeRef}
              className={`searchInput ${searchOnOff}`}
              type="text"
              placeholder={empty}
              onKeyDown={(e) => handleKeyPress(e)}
              onClick={handleClick}
            />
            {currentURL === '/' ? (
              <></>
            ) : (
              <span
                ref={searchBTN}
                className="material-symbols-outlined search"
                onClick={(cur) =>
                  searchOnOff === 'off'
                    ? setSearchOnOff('on')
                    : setSearchOnOff('off')
                }
              >
                search
              </span>
            )}
          </li>
          <li id="cate_li2">
            {userData.isLogin ? (
              <p
                onClick={() => {
                  dispatch(clickMenu());
                }}
              >
                ACCOUNT
              </p>
            ) : (
              <>
                <MediaQuery minWidth={1145}>
                  <p
                    onClick={() => {
                      navigate(`/login`);
                    }}
                  >
                    LOG IN
                  </p>
                </MediaQuery>
                <MediaQuery maxWidth={1144}>
                  <span
                    onClick={() => {
                      navigate(`/login`);
                    }}
                    className="material-symbols-outlined header_login_mediaQ"
                  >
                    login
                  </span>
                </MediaQuery>
              </>
            )}
          </li>
          <li id="cate_li2_shopbag">
            <MediaQuery minWidth={1145}>
              <p onClick={clickShoppingBag}>
                SHOPPING BAG /{' '}
                {!cartInfo.cartProductsLength ||
                cartInfo.cartProductsLength === 0
                  ? 0
                  : cartInfo.cartProductsLength}
              </p>
            </MediaQuery>

            <MediaQuery maxWidth={1144}>
              <div
                className="header_beg_container_media"
                onClick={clickShoppingBag}
              >
                <span className="material-symbols-sharp header_beg_icon_media">
                  shopping_bag
                  <span className="header_beg_count_media">
                    {!cartInfo.cartProductsLength ||
                    cartInfo.cartProductsLength === 0
                      ? 0
                      : cartInfo.cartProductsLength}
                  </span>
                </span>
              </div>
            </MediaQuery>
            {/* 0 이라는 숫자 장바구니에 넣을 때 올라가야 함 */}
          </li>
        </ul>
      </header>

      {/* 버거 모달 */}
      {burger === 'off' ? (
        <ul className="burger_menu_list">
          <li>
            <p onClick={() => navigate('/aboutus')}>ABOUT US</p>
          </li>
          <li>
            <p onClick={() => navigate('/store')}>STORE</p>
          </li>
          <li>
            <p onClick={() => navigate('#')}>COLLECTION</p>
          </li>
        </ul>
      ) : (
        <></>
      )}

      {/* 카트 모달 임 */}
      <CartModal className={`cart_modal ${offonKey}`} />

      {/* ACCOUNT 메뉴 */}
      {menuClicked && <MenuAccount />}
    </>
  );
}
