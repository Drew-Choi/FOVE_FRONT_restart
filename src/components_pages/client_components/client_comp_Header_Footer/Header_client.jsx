import React, { useEffect, useRef, useState } from 'react';
import '../../../styles/header_client.scss';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { importdb } from '../../../store/modules/cart';
import CartModal from '../CartModal';
import { offon, onlyoff } from '../../../store/modules/cartmodal';
import MenuAccount from '../MenuAccount';
import { clickMenu, menuClose } from '../../../store/modules/menuAccount';
import { searchinput } from '../../../store/modules/search';
import MediaQuery from 'react-responsive';
import getToken from '../../../store/modules/getToken';
import { invisible, visible } from '../../../store/modules/cartOrderLoading';
import { AiOutlineClose, AiOutlineShopping } from 'react-icons/ai';
import { MdOutlineLogin, MdOutlineAccountCircle } from 'react-icons/md';
import { GrSearch } from 'react-icons/gr';

export default function Header_client() {
  const [reactSearchModal, setReactSearchModal] = useState(false);
  const excludeRef = useRef(null);
  const searchBTN = useRef(null);
  const accountRef = useRef(null);
  const accountRef2 = useRef(null);
  const menuAccountRef = useRef(null);
  const cartModalRef = useRef(null);
  const cartModalRef2 = useRef(null);
  const cartModalMenu = useRef(null);
  const burgerBTNref = useRef(null);
  const burgerRef = useRef(null);

  //반응형 햄버거 메뉴 커서
  const [burger, setBurger] = useState('on');
  const [burgerClose, setBurgerClose] = useState('off');
  const burherHandler = () => {
    burger === 'on' && burgerClose === 'off'
      ? (setBurger((cur) => 'off'), setBurgerClose((cur) => 'on'))
      : (setBurger((cur) => 'on'), setBurgerClose((cur) => 'off'));
  };

  const navigate = useNavigate();
  const { productCode, category } = useParams();

  //리덕스 디스패치(액션함수 전달용)
  const dispatch = useDispatch();
  //모달을 위한 state
  const offonKey = useSelector((state) => state.cartmodal.offon);
  const menuClicked = useSelector((state) => state.menuAccount.clicked);
  //유저정보 state
  const userData = useSelector((state) => state.user);
  //상품정보 state
  const cartInfo = useSelector((state) => state.cart);
  const [isVisible, setIsVisible] = useState(true);

  const location = useLocation();
  const currentURL = location.pathname;

  const cartDataReq = async () => {
    dispatch(visible());
    if (!userData.isLogin) {
      let nullCart = {
        products: [],
        cartQuantity: 0,
      };
      dispatch(importdb(nullCart));
    } else {
      try {
        // indexedDB에서 토큰 받아오기
        const tokenValue = await getToken();

        let nullCart = {
          products: [],
          cartQuantity: 0,
        };
        dispatch(importdb(nullCart));

        const cartDataGet = await axios.post(
          `http://localhost:4000/cart/list`,
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
    dispatch(invisible());
  };

  useEffect(() => {
    if (
      currentURL === '/' ||
      currentURL === '/store' ||
      currentURL === `/store/${category}` ||
      currentURL === '/store/new' ||
      currentURL === `/store/detail/${productCode}` ||
      currentURL === '/store/cartorder'
    ) {
      cartDataReq();
    }
  }, [currentURL]);

  useEffect(() => {
    cartDataReq();
  }, [userData.userName] || cartInfo.cartProducts);

  // 장바구니 버튼(Shopping Bag) - 로그인 상태에서 사용 가능하게
  const clickShoppingBag = () => {
    if (!userData.isLogin) {
      alert('로그인이 필요한 서비스입니다.');
      return navigate(`/login`);
    }
    dispatch(offon());
  };

  useEffect(() => {
    setTimeout(() => {
      setIsVisible(false);
    }, 500);
  }, []);

  //서칭용 상태관리
  const [searchOnOff, setSearchOnOff] = useState('off');
  //검색창에 검색 안할떄
  const [empty, setEmpty] = useState('상품검색');

  //서칭용 엔터 핸들러
  const handleKeyPress = async (e) => {
    if (e.key === 'Enter') {
      // 검색 로직 실행
      if (currentURL !== '/store') {
        await dispatch(searchinput(e.target.value));
        navigate('store');
      } else {
        dispatch(searchinput(e.target.value));
      }
      if (!e.target.value) {
        setEmpty('검색어를 입력해주세요.');
      } else {
        searchBTN.current.click();
        e.target.value = '';
      }
    }
  };

  //반응형 서칭용 엔터 핸들러
  const handleKeyPress2 = async (e) => {
    if (e.key === 'Enter') {
      // 검색 로직 실행
      if (currentURL !== '/store') {
        await dispatch(searchinput(e.target.value));
        navigate('store');
      } else {
        dispatch(searchinput(e.target.value));
      }
      if (!e.target.value) {
        setEmpty('검색어를 입력해주세요.');
      } else {
        setReactSearchModal((cur) => false);
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
  }, [searchBTN]);

  const handleClick = () => {
    setSearchOnOff('on');
  };

  const handleClickOutside2 = (event) => {
    if (
      (accountRef.current &&
        !accountRef.current.contains(event.target) &&
        menuAccountRef.current &&
        !menuAccountRef.current.contains(event.target)) ||
      (accountRef2.current &&
        !accountRef2.current.contains(event.target) &&
        menuAccountRef.current &&
        !menuAccountRef.current.contains(event.target))
    ) {
      dispatch(menuClose());
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside2);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside2);
    };
  }, [accountRef || accountRef2]);

  const handleClickOutside3 = (event) => {
    if (
      (cartModalRef.current &&
        !cartModalRef.current.contains(event.target) &&
        cartModalMenu.current &&
        !cartModalMenu.current.contains(event.target)) ||
      (cartModalRef2.current &&
        !cartModalRef2.current.contains(event.target) &&
        cartModalMenu.current &&
        !cartModalMenu.current.contains(event.target))
    ) {
      dispatch(onlyoff());
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside3);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside3);
    };
  }, [cartModalRef] || [cartModalRef2]);

  // 버거 메뉴 외부 클릭 핸들러
  const handleOutsideBurger = (e) => {
    if (
      burgerBTNref.current &&
      !burgerBTNref.current.contains(e.target) &&
      burgerRef.current &&
      !burgerRef.current.contains(e.target)
    ) {
      burherHandler();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideBurger);

    return () => {
      document.addEventListener('mousedown', handleOutsideBurger);
    };
  }, [burgerBTNref]);

  return (
    <>
      <MediaQuery maxWidth={1327}>
        {/* 반응형 검색 모달 */}
        {reactSearchModal && (
          <div className="search_react_modal_container">
            <div
              className="search_react_modal_bg"
              onClick={() => setReactSearchModal((cur) => !cur)}
            ></div>
            <input
              className="search_react_modal_input"
              type="text"
              placeholder={empty}
              onKeyDown={(e) => handleKeyPress2(e)}
              // onClick={handleClick}
            />
            <p className="search_react_modal_desc">
              Enter keywords for searching
            </p>
          </div>
        )}
      </MediaQuery>

      <header className="header_client">
        <div className="logo" onClick={() => navigate('/')}></div>

        {/* 관리자 페이지 이동 버튼 */}
        <MediaQuery minWidth={829}>
          {userData.isAdmin && (
            <div className="adminBTN" onClick={() => navigate('/admin')}>
              👩‍💻 관리자 페이지
            </div>
          )}
        </MediaQuery>

        <MediaQuery maxWidth={828}>
          {userData.isAdmin && (
            <div className="adminBTN" onClick={() => navigate('/admin')}>
              👩‍💻
            </div>
          )}
        </MediaQuery>

        <MediaQuery minWidth={768}>
          <div id="cate">
            <p onClick={() => navigate('/aboutus')}>ABOUT US</p>
            <p
              onClick={() => {
                navigate('/store'), dispatch(searchinput(''));
              }}
            >
              STORE
            </p>
            {/* <p onClick={() => navigate('#')}>COLLECTION</p> */}
          </div>
        </MediaQuery>

        {/* 반응형 버거메뉴--------------------- */}
        <MediaQuery maxWidth={767}>
          {currentURL === '/' ? (
            <></>
          ) : (
            <div className="burger_menu_container">
              <span
                onClick={burherHandler}
                className={`material-symbols-sharp burgerIcon ${burger}`}
              >
                menu
              </span>
              <span
                ref={burgerBTNref}
                onClick={burherHandler}
                className={`material-symbols-sharp burgerClose ${burgerClose}`}
              >
                <AiOutlineClose />
              </span>
            </div>
          )}
        </MediaQuery>
        {/* 반응형 버거메뉴--------------------- */}

        <ul id="cate2">
          <MediaQuery minWidth={1328}>
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
                  <GrSearch />
                </span>
              )}
            </li>
          </MediaQuery>

          <MediaQuery maxWidth={1327}>
            <li id="search_container">
              {currentURL === '/' ? (
                <></>
              ) : (
                <span
                  ref={searchBTN}
                  className="material-symbols-outlined search"
                  onClick={() => setReactSearchModal((cur) => !cur)}
                >
                  <GrSearch />
                </span>
              )}
            </li>
          </MediaQuery>

          {/* <MediaQuery maxWidth={1327}>
            {currentURL === '/' ? (
              <></>
            ) : (
              <span
                className="material-symbols-outlined search_react"
           
              >
                <GrSearch />
              </span>
            )}
          </MediaQuery> */}

          <li id="cate_li2">
            {userData.isLogin ? (
              <>
                <MediaQuery minWidth={1145}>
                  {!menuClicked ? (
                    <p onClick={() => dispatch(clickMenu())}>ACCOUNT</p>
                  ) : (
                    <div className="account_close_container">
                      <p
                        ref={accountRef}
                        className="material-symbols-sharp account-close"
                        onClick={() => {
                          dispatch(clickMenu());
                        }}
                      >
                        <AiOutlineClose />
                      </p>
                    </div>
                  )}
                </MediaQuery>

                <MediaQuery maxWidth={1144}>
                  {!menuClicked ? (
                    <span
                      onClick={() => {
                        dispatch(clickMenu());
                      }}
                      className="material-symbols-sharp account_react"
                    >
                      <MdOutlineAccountCircle />
                    </span>
                  ) : (
                    <span
                      ref={accountRef2}
                      className="material-symbols-sharp account-close2"
                      onClick={() => {
                        dispatch(clickMenu());
                      }}
                    >
                      <AiOutlineClose />
                    </span>
                  )}
                </MediaQuery>
              </>
            ) : (
              <>
                <MediaQuery minWidth={1145}>
                  {isVisible && <p className="loading">Loading...</p>}
                  <p
                    onClick={() => {
                      navigate(`/login`);
                    }}
                  >
                    LOG IN
                  </p>
                </MediaQuery>
                <MediaQuery maxWidth={1144}>
                  {isVisible ? (
                    <p className="loading2">Loading...</p>
                  ) : (
                    <span
                      onClick={() => {
                        navigate(`/login`);
                      }}
                      className="material-symbols-outlined header_login_mediaQ"
                    >
                      <MdOutlineLogin />
                    </span>
                  )}
                </MediaQuery>
              </>
            )}
          </li>
          <li id="cate_li2_shopbag">
            <MediaQuery minWidth={1145}>
              {currentURL === '/' || currentURL === '/aboutus' ? (
                <></>
              ) : (
                <p onClick={clickShoppingBag} ref={cartModalRef}>
                  SHOPPING BAG /
                  {!cartInfo.cartProductsLength ||
                  cartInfo.cartProductsLength === 0
                    ? 0
                    : cartInfo.cartProductsLength}
                </p>
              )}
            </MediaQuery>

            <MediaQuery maxWidth={1144}>
              {currentURL === '/' || currentURL === '/aboutus' ? (
                <></>
              ) : (
                <div
                  className="header_beg_container_media"
                  onClick={clickShoppingBag}
                  ref={cartModalRef2}
                >
                  <span className="material-symbols-sharp header_beg_icon_media">
                    <AiOutlineShopping />
                  </span>
                  <div className="header_beg_count_media">
                    {!cartInfo.cartProductsLength ||
                    cartInfo.cartProductsLength === 0
                      ? 0
                      : cartInfo.cartProductsLength}
                  </div>
                </div>
              )}
            </MediaQuery>
            {/* 0 이라는 숫자 장바구니에 넣을 때 올라가야 함 */}
          </li>
        </ul>
      </header>

      <MediaQuery maxWidth={767}>
        {currentURL === '/' ? (
          <nav className="intro_nav_bar">
            <p onClick={() => navigate('/aboutus')}>ABOUT US</p>
            <p
              onClick={() => {
                navigate('/store'), dispatch(searchinput(''));
              }}
            >
              STORE
            </p>
            {/* <p onClick={() => navigate('#')}>COLLECTION</p> */}
          </nav>
        ) : (
          <></>
        )}
      </MediaQuery>

      {/* 반응형 버거 모달 */}
      {burger === 'off' ? (
        <ul ref={burgerRef} className="burger_menu_list">
          <li>
            <p
              onClick={() => {
                burherHandler(), navigate('/aboutus');
              }}
            >
              ABOUT US
            </p>
          </li>
          <li>
            <p
              onClick={() => {
                burherHandler(), navigate('/store'), dispatch(searchinput(''));
              }}
            >
              STORE
            </p>
          </li>
          {/* <li>
            <p
              onClick={() => {
                burherHandler(), navigate('#');
              }}
            >
              COLLECTION
            </p>
          </li> */}
        </ul>
      ) : (
        <></>
      )}

      {/* 카트 모달 임 */}
      <CartModal
        cartModalMenu={cartModalMenu}
        className={`cart_modal ${offonKey}`}
      />

      {/* ACCOUNT 메뉴 */}
      {menuClicked && <MenuAccount menuAccountRef={menuAccountRef} />}
    </>
  );
}
