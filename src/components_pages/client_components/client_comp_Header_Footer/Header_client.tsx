/* eslint-disable no-undef */
import React, {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import '../../../styles/header_client.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { searchinput } from '../../../store/modules/search';
import MediaQuery from 'react-responsive';
import { AiOutlineClose, AiOutlineShopping } from 'react-icons/ai';
import { MdOutlineLogin, MdOutlineAccountCircle } from 'react-icons/md';
import { GrSearch } from 'react-icons/gr';
import styled from 'styled-components';
import { clickMenu } from '../../../store/modules/menuAccount';
import axios from 'axios';
import CartModal from './CartModal';

const { REACT_APP_KEY_API } = process.env;
const { REACT_APP_KEY_BACK } = process.env;
const { REACT_APP_KEY_FRONT } = process.env;

//--------------------------------------
// 메인 Header 컴포넌트

export default function Header_client() {
  //리덕스 디스패치(액션함수 전달용)
  const dispatch = useDispatch();
  // 이동용
  const navigate = useNavigate();
  // 현재 URI주소 얻어오는 용
  const location = useLocation();
  const currentURL = location.pathname;

  // 유저정보 리덕스state
  const userData = useSelector(
    (state: { user: { isLogin: IsLoginState; isAdmin: IsAdminState } }) =>
      state.user,
  );
  // 카트 정보 리덕스state
  const cartInfo = useSelector((state: CartState) => state.cart);

  // dom컨트롤용 useRef 모음
  const excludeRef = useRef<HTMLInputElement | null>(null);
  const searchBTN = useRef<HTMLInputElement | null>(null);
  const accountRef = useRef<HTMLInputElement | null>(null);
  const accountRef2 = useRef<HTMLInputElement | null>(null);
  const menuAccountRef = useRef<HTMLDivElement | null>(null);
  const cartModalRef = useRef<HTMLInputElement | null>(null);
  const cartModalRef2 = useRef<HTMLInputElement | null>(null);
  const cartModalMenu = useRef<HTMLInputElement | null>(null);
  const burgerBTNref = useRef<HTMLInputElement | null>(null);
  const burgerRef = useRef<HTMLUListElement | null>(null);

  // 모달용 state와 handler모음 ------------

  //
  // 카트 모달용 state와 handler
  const [cartOnOff, setCartOnOff] = useState<'on' | 'off'>('off');

  // 장바구니 버튼(Shopping Bag) - 로그인 상태에서 사용 가능하게
  const clickShoppingBag = () => {
    if (!userData.isLogin) {
      alert('로그인이 필요한 서비스입니다.');
      return navigate(`/login`);
    }
    setCartOnOff((cur) => (cur === 'off' ? 'on' : 'off'));
  };

  //윈도우 클릭시 기능해제, Cart메뉴
  useEffect(() => {
    const handleClickOutside3 = (event: MouseEvent) => {
      if (
        cartOnOff === 'on' &&
        ((cartModalRef.current &&
          !cartModalRef.current.contains(event.target as Node) &&
          cartModalMenu.current &&
          !cartModalMenu.current.contains(event.target as Node)) ||
          (cartModalRef2.current &&
            !cartModalRef2.current.contains(event.target as Node) &&
            cartModalMenu.current &&
            !cartModalMenu.current.contains(event.target as Node)))
      ) {
        setCartOnOff('off');
      }
      return;
    };

    document.addEventListener('mousedown', handleClickOutside3);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside3);
    };
  }, [cartOnOff]);

  //
  // account메뉴 모달용
  const [accountMenuOnOff, setAccountMenuOnOff] = useState<boolean>(false);

  //윈도우 클릭시 기능해제, Account메뉴
  useEffect(() => {
    const handleClickOutside2 = (event: MouseEvent) => {
      if (
        accountMenuOnOff &&
        ((accountRef.current &&
          !accountRef.current.contains(event.target as Node) &&
          menuAccountRef.current &&
          !menuAccountRef.current.contains(event.target as Node)) ||
          (accountRef2.current &&
            !accountRef2.current.contains(event.target as Node) &&
            menuAccountRef.current &&
            !menuAccountRef.current.contains(event.target as Node)))
      ) {
        setAccountMenuOnOff(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside2);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside2);
    };
  }, [accountMenuOnOff]);

  //
  //로그인 로딩스피너
  const [isVisible, setIsVisible] = useState<boolean>(true);

  // 로그인 버튼 로딩화면
  useEffect(() => {
    const time = setTimeout(() => {
      setIsVisible(false);
    }, 500);

    return () => {
      clearTimeout(time);
    };
  }, []);

  //
  // 서칭용 모음
  const [searchOnOff, setSearchOnOff] = useState<'on' | 'off'>('off');

  // 서치용 검색창 컨트롤
  const handleClick = () => {
    setSearchOnOff('on');
  };

  //검색창에 검색 안할떄
  const [empty, setEmpty] = useState<
    '상품검색' | '검색어를 입력해주세요.' | string
  >('상품검색');

  //서칭용 엔터 핸들러
  const handleKeyPress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // 검색 로직 실행
      if (currentURL !== '/store') {
        navigate('store');
        dispatch(searchinput(e.currentTarget.value));
      } else {
        dispatch(searchinput(e.currentTarget.value));
      }

      if (!e.currentTarget.value) {
        setEmpty('검색어를 입력해주세요.');
      } else {
        searchBTN.current?.click();
        e.currentTarget.value = '';
        setEmpty('상품검색');
      }
    }
  };

  //윈도우 클릭시 기능해제, 서치용 돋보기 기능해제
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchOnOff === 'on' &&
        searchBTN.current &&
        !searchBTN.current.contains(event.target as Node) &&
        excludeRef.current &&
        !excludeRef.current.contains(event.target as Node)
      ) {
        setSearchOnOff('off');
        setEmpty('상품검색');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchOnOff]);

  // 반응형 사용하는 검색창용
  const [reactSearchModal, setReactSearchModal] = useState<boolean>(false);

  const handlerBgTouch = () => {
    setReactSearchModal((cur) => !cur);
    setEmpty('상품검색');
  };

  // 반응형 서칭용 엔터 핸들러
  const handleKeyPress2 = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // 검색 로직 실행
      if (currentURL !== '/store') {
        dispatch(searchinput(e.currentTarget.value));
        navigate('store');
      } else {
        dispatch(searchinput(e.currentTarget.value));
      }
      if (!e.currentTarget.value) {
        setEmpty('검색어를 입력해주세요.');
      } else {
        setReactSearchModal(false);
        e.currentTarget.value = '';
        setEmpty('상품검색');
      }
    }
  };

  //
  //반응형 햄버거 메뉴용 state와 handler
  const [burger, setBurger] = useState<'on' | 'off'>('off');
  const burherHandler = () => {
    setBurger((cur) => (cur === 'off' ? 'on' : 'off'));
  };

  //윈도우 클릭시 기능해제, Burger메뉴
  useEffect(() => {
    const handleOutsideBurger = (e: MouseEvent) => {
      if (
        burger === 'on' &&
        burgerBTNref.current &&
        !burgerBTNref.current.contains(e.target as Node) &&
        burgerRef.current &&
        !burgerRef.current.contains(e.target as Node)
      ) {
        burherHandler();
      }
    };
    document.addEventListener('mousedown', handleOutsideBurger);

    return () => {
      document.addEventListener('mousedown', handleOutsideBurger);
    };
  }, [burger]);

  // ------------------------

  return (
    <>
      <MediaQuery maxWidth={1327}>
        {/* 반응형 검색 모달 */}
        {reactSearchModal && (
          <div className="search_react_modal_container">
            <div
              className="search_react_modal_bg"
              onClick={handlerBgTouch}
            ></div>
            <input
              className="search_react_modal_input"
              type="text"
              placeholder={empty}
              onKeyDown={(e) => handleKeyPress2(e)}
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
                className={`material-symbols-sharp burgerClose ${burger}`}
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
                  onClick={() =>
                    setSearchOnOff((cur) => (cur === 'on' ? 'off' : 'on'))
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
                  className="material-symbols-outlined search"
                  onClick={() => setReactSearchModal((cur) => !cur)}
                >
                  <GrSearch />
                </span>
              )}
            </li>
          </MediaQuery>

          <li id="cate_li2">
            {userData.isLogin ? (
              <>
                <MediaQuery minWidth={1145}>
                  {!accountMenuOnOff ? (
                    <p
                      onClick={() =>
                        setAccountMenuOnOff((cur) => (!cur ? true : false))
                      }
                    >
                      ACCOUNT
                    </p>
                  ) : (
                    <div className="account_close_container">
                      <p
                        ref={accountRef}
                        className="material-symbols-sharp account-close"
                        onClick={() =>
                          setAccountMenuOnOff((cur) => (!cur ? true : false))
                        }
                      >
                        <AiOutlineClose />
                      </p>
                    </div>
                  )}
                </MediaQuery>

                <MediaQuery maxWidth={1144}>
                  {!accountMenuOnOff ? (
                    <span
                      onClick={() => {
                        setAccountMenuOnOff(true);
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
                        setAccountMenuOnOff(false);
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
      {burger === 'on' ? (
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
        closeOnClick={setCartOnOff}
        isLogin={userData.isLogin}
        cartModalMenuRef={cartModalMenu}
        className={`cart_modal ${cartOnOff}`}
      />

      {/* ACCOUNT 메뉴 */}
      {accountMenuOnOff && (
        <MenuAccount
          closeOnClick={setAccountMenuOnOff}
          menuAccountRef={menuAccountRef}
        />
      )}
    </>
  );
}
// -------------------------------------

// ------------------------------------
// MenuAccount 컴포넌트 영역
const MenuAccountWrap = styled.div`
  position: absolute;
  top: 69px;
  right: 130px;
  z-index: 999; // 장바구니보다 위에 위치
  width: 200px;
  height: 140px;
  border-left: 0.5px solid black;
  border-right: 0.5px solid black;
  border-bottom: 0.5px solid black;
  background-color: white;
  padding: 15px;

  @media screen and (max-width: 1144px) {
    right: 25px;
  }

  @media screen and (max-width: 767px) {
    right: 0px;
  }

  @media screen and (max-width: 400px) {
    right: 0px;
    width: 150px;
    height: 120px;
  }
`;

const MenuAccountWrap2 = styled.div`
  position: absolute;
  top: 69px;
  right: -1px;
  z-index: 999; // 장바구니보다 위에 위치
  width: 200px;
  height: 140px;
  border-left: 0.5px solid black;
  border-right: 0.5px solid black;
  border-bottom: 0.5px solid black;
  background-color: white;
  padding: 15px;
  @media screen and (max-width: 400px) {
    right: 0px;
    width: 150px;
    height: 120px;
  }
`;

const ContentTitle = styled.p`
  margin: 0;
  font-size: 15px;
  font-weight: 800;

  @media screen and (max-width: 400px) {
    font-size: 13px;
  }
`;

const Content = styled.p`
  margin: 0;
  font-size: 15px;
  cursor: pointer;
  &:hover {
    font-weight: 900;
    border-bottom: 2px solid black;
    /* background-color: #e9e9e9; */
  }

  @media screen and (max-width: 400px) {
    font-size: 13px;
  }
`;

// 컴포넌트 영역

function MenuAccount({
  menuAccountRef,
  closeOnClick,
}: {
  menuAccountRef: MutableRefObject<HTMLDivElement | null>;
  closeOnClick: Dispatch<SetStateAction<boolean>>;
}) {
  const location = useLocation();
  const currentURL = location.pathname;

  //리덕스
  //유저정보 state
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userName = useSelector(
    (state: { user: { userName: string } }) => state.user.userName,
  );
  const userPoints = useSelector(
    (state: { user: { userPoints: number } }) => state.user.userPoints,
  );

  const getKey = async (key: string) => {
    try {
      const res = await axios.get(
        `${REACT_APP_KEY_BACK}/${REACT_APP_KEY_API}`,
        {
          params: { key },
        },
      );
      return res.data.key;
    } catch (err: any) {
      navigate(
        `/error?errorMessage=${err.response.data}&errorCode=${err.response.status}`,
      );
      console.error(err);
      return null;
    }
  };

  // 로그아웃
  const logoutUser = async () => {
    try {
      const YOUR_REST_API_KEY = await getKey('REST_API_KEY');
      const YOUR_LOGOUT_REDIRECT_URI = `${REACT_APP_KEY_FRONT}/kakao/logout`;
      dispatch(clickMenu()); // MenuAccount 닫기
      window.location.href = `https://kauth.kakao.com/oauth/logout?client_id=${YOUR_REST_API_KEY}&logout_redirect_uri=${YOUR_LOGOUT_REDIRECT_URI}`;
    } catch (err: any) {
      navigate(
        `/error?errorMessage=${err.response.data}&errorCode=${err.response.status}`,
      );
      console.error(err);
    }
  };

  return (
    <>
      {currentURL === '/' ? (
        <MenuAccountWrap2 ref={menuAccountRef}>
          <ContentTitle>{userName} 님, 환영합니다!</ContentTitle>
          <ContentTitle>Point : {userPoints} p</ContentTitle>
          <Content
            onClick={() => {
              closeOnClick((cur) => (cur ? false : true));
              navigate(`/mypage`);
            }}
          >
            MY PAGE
          </Content>
          <Content
            onClick={() => {
              closeOnClick((cur) => (cur ? false : true));
              navigate(`/mypage/orderlist`);
            }}
          >
            ORDER
          </Content>
          <Content onClick={logoutUser}>LOGOUT</Content>
        </MenuAccountWrap2>
      ) : (
        <MenuAccountWrap ref={menuAccountRef}>
          <ContentTitle>{userName} 님, 환영합니다!</ContentTitle>
          <ContentTitle>Point : {userPoints} p</ContentTitle>
          <Content
            onClick={() => {
              closeOnClick((cur) => (cur ? false : true));
              navigate(`/mypage`);
            }}
          >
            MY PAGE
          </Content>
          <Content
            onClick={() => {
              closeOnClick((cur) => (cur ? false : true));
              navigate(`/mypage/orderlist`);
            }}
          >
            ORDER
          </Content>
          <Content onClick={logoutUser}>LOGOUT</Content>
        </MenuAccountWrap>
      )}
    </>
  );
}
