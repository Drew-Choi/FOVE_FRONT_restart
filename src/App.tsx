/* eslint-disable no-undef */
import React, { useEffect } from 'react';
import './App.css';
import { Route, Routes, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Admin_main from './components_pages/admin_components/Admin_main';
import ProductRegister_admin from './components_pages/admin_components/ProductRegister_admin';
import Client_main from './components_pages/client_components/Client_main';
import AboutUs_client from './components_pages/client_components/client_comp_AboutUs/AboutUs_client';
import Store_client from './components_pages/client_components/client_comp_Store/Store_client';
import Detail_client from './components_pages/client_components/client_comp_Detail/Detail_client';
import Mypage_client from './components_pages/client_components/client_comp_MyPage/Mypage_client';
import Login_client from './components_pages/client_components/client_comp_Kakao/Login_client';
import Order_client from './components_pages/client_components/client_comp_Order-Toss/Order_client';
import TossPay_Complete from './components_pages/client_components/client_comp_Order-Toss/TossPay_Complete';
import { Toss_CheckOut } from './components_pages/client_components/client_comp_Order-Toss/Toss_CheckOut';
import Error404 from './components_pages/client_components/Error404';
import axios from 'axios';
import { keepLogin } from './store/modules/user';
import ProductList_admin from './components_pages/admin_components/ProductList_admin';
import OrderList_client from './components_pages/client_components/client_comp_MyPage/OrderList-Toss/OrderList_client';
import OrderList_admin from './components_pages/admin_components/OrderList_admin';
import Kakao_Logout from './components_pages/client_components/client_comp_Kakao/Kakao_Logout';
import Kakao_final from './components_pages/client_components/client_comp_Kakao/Kakao_final';
import { openDB } from 'idb';
import getToken from './constant/getToken';
import OrderCancel_client from './components_pages/client_components/client_comp_MyPage/OrderList-Toss/OrderCancel_client';
import TossPay_Cancel_Complete from './components_pages/client_components/client_comp_MyPage/OrderList-Toss/TossPay_Cancel_Complete';
import OrderReturn_client from './components_pages/client_components/client_comp_MyPage/OrderList-Toss/OrderReturn_client';
import OrderReturnCheck_client from './components_pages/client_components/client_comp_MyPage/OrderList-Toss/OrderReturnCheck_client';
import OrderList_Indi_Admin from './components_pages/admin_components/OrderList_Indi_Admin';
import OrderCancel_client_onlyOrder from './components_pages/client_components/client_comp_MyPage/OrderList-Toss/OrderCancel_client_onlyOrder';
import TossPay_Cancel_Complete_onlyOrder from './components_pages/client_components/client_comp_MyPage/OrderList-Toss/TossPay_Cancel_Complete_onlyOrder';
import ShippingCode_admin from './components_pages/admin_components/ShippingCode_admin';
import FailPage from './components_pages/client_components/FailPage';
import ErrorPage from './components_pages/client_components/ErrorPage';
import Agreement_client from './components_pages/client_components/Agreement_client';
import Privacy_client from './components_pages/client_components/Privacy_client';
import ElectroTerms_client from './components_pages/client_components/ElectroTerms_client';
import Intro_clinet from './components_pages/client_components/client_comp_Intro/Intro_clinet';

const { REACT_APP_KEY_BACK } = process.env;

// constant
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
  const key = await store.getKey('t');

  if (!key) {
    await store
      .add('', 't')
      .then(() => {
        return;
      })
      .catch((error) => {
        return console.error(error);
      });
  }
  return;
};

function App() {
  const isLogin = useSelector((state: IsLoginState) => state.user.isLogin);
  const dispatch = useDispatch();
  const location = useLocation();
  const currentURL = location.pathname;

  // 리액트 앱이 시작 되면 바로 토큰 검증 로직 실행 -> 토큰 로그인 수행
  useEffect(() => {
    if (
      currentURL !== '/store/order_success' &&
      currentURL !== '/store/order/checkout/fail' &&
      currentURL !== '/login' &&
      currentURL !== '/login/kakao/callback' &&
      currentURL !== '/kakao/logout'
    ) {
      // indexedDB에 저장 되어 있는 토큰이 있는지를 확인 후,
      // 해당 토큰을 백엔드에 검증. 검증이 되면 바로 로그인 처리 / 인증 안되면 아무 반응 안함
      const tokenLoginCheck = async () => {
        // 홈페이지가 뜨면 indexedDB와 트랜젝션을 바로 생성해서 토큰 받을 준비를 한다.
        // 키값도 빈값으로 추가해 놓음
        await createDatabase();

        //이후 토큰이 있으면 로그인 유지 작업을, 토큰이 없다면 토큰인증실패로 비로그인상태 유지
        try {
          const valueKey = await getToken();

          if (valueKey) {
            const userInfo = await axios.post(`${REACT_APP_KEY_BACK}/islogin`, {
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
          }
        } catch (err) {
          const db = await openDB('db', 1);
          const transaction = db.transaction(['store'], 'readwrite');
          const store = transaction.objectStore('store');
          await store
            .put('', 't')
            .then(() => {
              dispatch(
                keepLogin({
                  nickName: '',
                  points: 0,
                  isAdmin: false,
                  isLogin: false,
                }),
              );
            })
            .catch((error) => {
              console.error(error);
            });
          console.error(err);
        }
      };

      tokenLoginCheck();
    }
  }, [currentURL]);

  const isAdmin = useSelector((state: IsAdminState) => state.user.isAdmin);

  return (
    <>
      <Routes>
        {/* Client 영역 */}
        <Route path="/" element={<Client_main />}>
          {/* 인트로 */}
          <Route path="" element={<Intro_clinet />} />
          {/* 브랜드소개 */}
          <Route path="/aboutus" element={<AboutUs_client />} />
          {/* 이용약관 */}
          <Route path="/agreement" element={<Agreement_client />} />
          {/* 개인정보방침 */}
          <Route path="/privacy" element={<Privacy_client />} />
          {/* 전자금융거래약관 */}
          <Route path="/electronic" element={<ElectroTerms_client />} />
          {/* 상품진열 */}
          <Route path="/store" element={<Store_client />} />
          {/* 카테고리별 아이템 분리 */}
          <Route path="/store/:category" element={<Store_client />} />
          {/* 상품상세페이지 */}
          <Route
            path="/store/detail/:productCode"
            element={<Detail_client />}
          />
          {/* 주문서작성 영역 */}
          {/* 1. 싱글상품 */}
          <Route
            path="/store/order"
            element={isLogin ? <Order_client /> : <Login_client />}
          />
          {/* 2. 카트에 담긴 여러 개 상품 */}
          <Route
            path="/store/cartorder"
            element={isLogin ? <Order_client /> : <Login_client />}
          />
          {/* 토스페이먼츠 완성 */}
          <Route
            path="/store/order/checkout"
            element={isLogin ? <Toss_CheckOut /> : <Login_client />}
          />
          {/* 토스페이먼츠 결제 성공 페이지 */}
          <Route path="store/order_success" element={<TossPay_Complete />} />
          {/* 토스페이먼츠 결제실패시 페이지 */}
          <Route path="/store/order/checkout/fail" element={<FailPage />} />
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

          {/* 주문내역만 삭제 */}
          <Route
            path="/mypage/orderlist/cancel_onlyOrder/:orderId"
            element={
              isLogin ? <OrderCancel_client_onlyOrder /> : <Login_client />
            }
          />

          {/* 주문내역만 삭제 완료 후 */}
          <Route
            path="/mypage/orderlist/cancel_onlyOrder/complete"
            element={
              isLogin ? <TossPay_Cancel_Complete_onlyOrder /> : <Login_client />
            }
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
          <Route path="*" element={<Error404 />} />
          <Route path="/error" element={<ErrorPage />} />
        </Route>

        {/* admin 영역 */}

        <Route
          path="/admin"
          element={!isAdmin ? <Login_client /> : isAdmin && <Admin_main />}
        >
          <Route
            path=""
            element={
              !isAdmin ? <Login_client /> : isAdmin && <ShippingCode_admin />
            }
          />
          <Route
            path="/admin/register"
            element={
              !isAdmin ? <Login_client /> : isAdmin && <ProductRegister_admin />
            }
          />
          <Route
            path="/admin/list"
            element={
              !isAdmin ? <Login_client /> : isAdmin && <ProductList_admin />
            }
          />
          <Route
            path="/admin/orderlist"
            element={
              !isAdmin ? <Login_client /> : isAdmin && <OrderList_admin />
            }
          />
          <Route
            path="/admin/orderlist/detail/:orderId"
            element={
              !isAdmin ? <Login_client /> : isAdmin && <OrderList_Indi_Admin />
            }
          />
        </Route>
        <Route path="*" element={<Login_client />} />
      </Routes>
    </>
  );
}
//완료

export default App;
