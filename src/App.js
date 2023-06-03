import './App.css';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Admin_main from './components_pages/admin_components/Admin_main';
import ProductRegister_admin from './components_pages/admin_components/ProductRegister_admin';
import Agreement_client from './components_pages/client_components/Agreement_client';
import Privacy_client from './components_pages/client_components/Privacy_client';
import Client_main from './components_pages/client_components/Client_main';
import AboutUs_client from './components_pages/client_components/AboutUs_client';
import Store_client from './components_pages/client_components/client_comp_store/Store_client';
import Guide_client from './components_pages/client_components/Guide_client';
import Detail_client from './components_pages/client_components/Detail_client';
import Intro_movie_client from './components_pages/client_components/Intro_movie_clinet';
import Mypage_client from './components_pages/client_components/Mypage_client';
import AdSubmit_client from './components_pages/client_components/AdSubmit_client';
import Adwrite_client from './components_pages/client_components/Adwrite_client';
import Login_client from './components_pages/client_components/Login_client';
import Order_client from './components_pages/client_components/Order_client';
import Store_Categorys from './components_pages/client_components/client_comp_store/Store_Categorys';
import Error404 from './components_pages/client_components/Error404';
import TossPay_Complete from './components_pages/client_components/TossPay_Complete';
import { Toss_CheckOut } from './components_pages/client_components/Toss_CheckOut';
import React, { useEffect } from 'react';
import axios from 'axios';
import { keepLogin } from './store/modules/user';
import EditInfo_client from './components_pages/client_components/EditInfo_client';
import ProductList_admin from './components_pages/admin_components/ProductList_admin';
import OrderList_client from './components_pages/client_components/OrderList_client';
import Store_NewItems from './components_pages/client_components/client_comp_store/Store_NewItems';
import OrderList_admin from './components_pages/admin_components/OrderList_admin';
import Kakao_Logout from './components_pages/client_components/Kakao_Logout';
import Kakao_final from './components_pages/client_components/Kakao_final';
import { openDB } from 'idb';
import getToken from './store/modules/getToken';
import OrderCancel_client from './components_pages/client_components/OrderCancel_client';
import TossPay_Cancel_Complete from './components_pages/client_components/TossPay_Cancel_Complete';
import OrderReturn_client from './components_pages/client_components/OrderReturn_client';
import OrderReturnCheck_client from './components_pages/client_components/OrderReturnCheck_client';
import OrderList_Indi_Admin from './components_pages/admin_components/OrderList_Indi_Admin';

function App() {
  const isLogin = useSelector((state) => state.user.isLogin);
  const dispatch = useDispatch();

  // 트랜젝션 생성 함수 (빈 키를 하나 만들어서 로그인 과정에서 키에 업데이트 하도록 초기값 세팅)
  const createDatabase = async () => {
    const db = await openDB('db', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('store')) {
          db.createObjectStore('store');
        }
      },
    });
    const transaction = db.transaction(['store'], 'readwrite');
    const store = transaction.objectStore('store');
    // 여기서 부터는 Key값의 존재 여부에 따라 초긱값 설정을 할지 아니면 그냥 리턴할지 정하는 곳
    const key = await store.get('t');
    if (!key) {
      store.add('', 't');
      await transaction.done;
    } else {
      return;
    }
  };

  // indexedDB에 저장 되어 있는 토큰이 있는지를 확인 후,
  // 해당 토큰을 백엔드에 검증. 검증이 되면 바로 로그인 처리 / 인증 안되면 아무 반응 안함
  const tokenLoginCheck = async () => {
    // 홈페이지가 뜨면 indexedDB와 트랜젝션을 바로 생성해서 토큰 받을 준비를 한다.
    // 키값도 빈값으로 추가해 놓음
    createDatabase();

    //이후 토큰이 있으면 로그인 유지 작업을, 토큰이 없다면 토큰인증실패로 비로그인상태 유지
    try {
      const valueKey = await getToken();

      if (valueKey) {
        const userInfo = await axios.post('http://localhost:4000/islogin', {
          token: valueKey,
        });
        if (userInfo.status === 200) {
          dispatch(
            keepLogin({
              nickName: userInfo.data.nickName,
              points: userInfo.data.points,
              isAdmin: userInfo.data.isAdmin,
              isLogin: userInfo.data.isLogin,
            }),
          );
        }
      } else {
        dispatch(
          keepLogin({
            nickName: '',
            points: 0,
            isAdmin: false,
            isLogin: false,
          }),
        );
      }
    } catch (err) {
      const db = await openDB('db', 1);
      const transaction = db.transaction(['store'], 'readwrite');
      const store = transaction.objectStore('store');
      store.put('', 't');
      dispatch(
        keepLogin({
          nickName: '',
          points: 0,
          isAdmin: false,
          isLogin: false,
        }),
      );
      console.error;
    }
  };

  // 리액트 앱이 시작 되면 바로 토큰 검증 로직 실행 -> 토큰 로그인 수행
  useEffect(() => {
    tokenLoginCheck();
  }, []);

  const isAdmin = useSelector((state) => state.user.isAdmin);

  return (
    <>
      <Routes>
        {/* Client 영역 */}
        <Route path="/" element={<Client_main />}>
          {/* 인트로 무비 */}
          <Route path="" element={<Intro_movie_client />} />
          {/* 브랜드소개 */}
          <Route path="/aboutus" element={<AboutUs_client />} />
          {/* 상품진열 */}
          <Route path="/store" element={<Store_client />} />
          {/* 카테고리별 아이템 분리 */}
          <Route path="/store/:category" element={<Store_Categorys />} />
          {/* 신상품 */}
          <Route path="/store/new" element={<Store_NewItems />} />
          {/* 상품상세페이지 */}
          <Route
            path="/store/detail/:productCode"
            element={<Detail_client />}
          />
          {/* 주문서작성 영역 */}
          {/* 1. 싱글상품 */}
          <Route path="/store/order" element={<Order_client />} />
          {/* 2. 카트에 담긴 여러 개 상품 */}
          <Route path="/store/cartorder" element={<Order_client />} />
          {/* 토스페이먼츠 완성 */}
          <Route path="/store/order/checkout" element={<Toss_CheckOut />} />
          {/* 토스페이먼츠 결제성공페이지 */}
          <Route path="store/order_success" element={<TossPay_Complete />} />
          {/* account쪽 */}
          <Route path="/agreement" element={<Agreement_client />} />
          <Route path="/privacy" element={<Privacy_client />} />
          <Route path="/guide" element={<Guide_client />} />

          {/* <Route path="/store/order/checkout/fail" element={<FailPage />} /> */}

          {/* 로그인 */}
          <Route path="/login" element={<Login_client />} />
          <Route path="/login/kakao/callback" element={<Kakao_final />} />
          <Route path="/kakao/logout" element={<Kakao_Logout />} />

          {/* 로그인 상태여야 이동 가능한 페이지들 */}
          {/* 마이페이지 메인 */}
          <Route
            path="/mypage"
            element={isLogin ? <Mypage_client /> : <Login_client />}
          />
          {/* 회원정보 수정 */}
          <Route
            path="/mypage/editInfo"
            element={isLogin ? <EditInfo_client /> : <Login_client />}
          />

          {/* 주문조회 */}
          <Route
            path="/mypage/orderlist"
            element={isLogin ? <OrderList_client /> : <Login_client />}
          />

          {/* 취소 */}
          <Route
            path="/mypage/orderlist/cancel/:orderId"
            element={isLogin ? <OrderCancel_client /> : <Login_client />}
          />

          {/* 반품신청 */}
          <Route
            path="/mypage/orderlist/return/:orderId"
            element={isLogin ? <OrderReturn_client /> : <Login_client />}
          />

          {/* 반품내역확인 */}
          <Route
            path="/mypage/orderlist/return_check/:orderId"
            element={isLogin ? <OrderReturnCheck_client /> : <Login_client />}
          />

          {/* 취소완료 */}
          <Route
            path="/mypage/orderlist/cancel/:orderId/:reason/complete"
            element={isLogin ? <TossPay_Cancel_Complete /> : <Login_client />}
          />

          {/* 배송 주소록 목록 */}
          <Route
            path="/mypage/checkAddress"
            element={isLogin ? <AdSubmit_client /> : <Login_client />}
          />

          {/* 배송 주소지 수정 */}
          <Route
            path="/mypage/editAddress"
            element={isLogin ? <Adwrite_client /> : <Login_client />}
          />
          <Route path="*" element={<Error404 />} />
        </Route>

        {/* admin 영역 */}

        <Route
          path="/admin"
          element={!isAdmin ? <Error404 /> : isAdmin && <Admin_main />}
        >
          <Route
            path=""
            element={
              !isAdmin ? <Error404 /> : isAdmin && <ProductRegister_admin />
            }
          />
          <Route
            path="/admin/list"
            element={!isAdmin ? <Error404 /> : isAdmin && <ProductList_admin />}
          />
          <Route
            path="/admin/orderlist"
            element={!isAdmin ? <Error404 /> : isAdmin && <OrderList_admin />}
          />
          <Route
            path="/admin/orderlist/detali/:orderId"
            element={
              !isAdmin ? <Error404 /> : isAdmin && <OrderList_Indi_Admin />
            }
          />
        </Route>
        <Route path="*" element={<Error404 />} />
      </Routes>
    </>
  );
}

export default App;
