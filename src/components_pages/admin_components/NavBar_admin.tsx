import React, { useEffect, useRef, useState } from 'react';
import navBarAdmin from '../../styles/navBar_admin.module.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import MediaQuery from 'react-responsive';
import { useDispatch, useSelector } from 'react-redux';
import { CiMenuBurger } from 'react-icons/ci';
import { AiOutlineClose } from 'react-icons/ai';
import { orderFilter } from '../../store/modules/admin_orderList';

export default function NavBar_admin() {
  const location = useLocation();
  const currentURL = location.pathname;
  // 파라미터를 위한 주소
  const hasOrderId = currentURL.includes('/admin/orderlist/detail/');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const adminName = useSelector((state: { user: { userName: string } }) =>
    state.user.userName === '' ? '' : state.user.userName,
  );

  // 버거 핸들러 생성
  // 버거 온오프
  const [burgerOnOff, setBurgerOnOff] = useState<'on' | 'off'>('off');
  const handleBurger = () => {
    burgerOnOff === 'off' ? setBurgerOnOff('on') : setBurgerOnOff('off');
  };
  // 버거 팝업 컨트롤 외부 화면 클릭시 사라지게
  const burgerRef = useRef<HTMLUListElement | null>(null);
  const burgerBTNref = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const handleWindowBurger = (event: MouseEvent) => {
      if (
        burgerRef.current &&
        !burgerRef.current.contains(event.target as Node) &&
        burgerBTNref.current &&
        !burgerBTNref.current.contains(event.target as Node)
      ) {
        setBurgerOnOff('off');
      }
    };

    document.addEventListener('mousedown', handleWindowBurger);

    return () => {
      document.addEventListener('mousedown', handleWindowBurger);
    };
  }, [burgerRef]);

  return (
    <>
      <MediaQuery minWidth={668}>
        <nav className={navBarAdmin.navbar_admin}>
          <ul>
            <li
              className={currentURL === '/admin' ? navBarAdmin.on : ''}
              onClick={() => navigate('/admin')}
            >
              송장입력
            </li>
            <li
              className={
                currentURL === '/admin/orderlist' || hasOrderId
                  ? navBarAdmin.on
                  : ''
              }
              onClick={() => {
                dispatch(orderFilter('allIndex')), navigate('/admin/orderlist');
              }}
            >
              주문관리
            </li>
            <li
              className={currentURL === '/admin/register' ? navBarAdmin.on : ''}
              onClick={() => navigate('/admin/register')}
            >
              상품등록
            </li>
            <li
              className={currentURL === '/admin/list' ? navBarAdmin.on : ''}
              onClick={() => navigate('/admin/list')}
            >
              등록상품 조회
            </li>
          </ul>
        </nav>
      </MediaQuery>

      <MediaQuery maxWidth={667} minWidth={426}>
        <nav className={navBarAdmin.navbar_admin_react}>
          <ul>
            <li
              className={currentURL === '/admin' ? navBarAdmin.on : ''}
              onClick={() => navigate('/admin')}
            >
              송장입력
            </li>
            <li
              className={
                currentURL === '/admin/orderlist' || hasOrderId
                  ? navBarAdmin.on
                  : ''
              }
              onClick={() => {
                dispatch(orderFilter('allIndex')), navigate('/admin/orderlist');
              }}
            >
              주문관리
            </li>
            <li
              className={currentURL === '/admin/register' ? navBarAdmin.on : ''}
              onClick={() => navigate('/admin/register')}
            >
              상품등록
            </li>
            <li
              className={currentURL === '/admin/list' ? navBarAdmin.on : ''}
              onClick={() => navigate('/admin/list')}
            >
              등록상품 조회
            </li>
          </ul>

          <MediaQuery maxWidth={525}>
            <p className={navBarAdmin.adminName}>Manager: &nbsp;{adminName}</p>
          </MediaQuery>
        </nav>
      </MediaQuery>

      <MediaQuery maxWidth={425}>
        <nav className={navBarAdmin.navbar_admin_react}>
          <div className={navBarAdmin.burger_menu_container}>
            {burgerOnOff === 'off' ? (
              <CiMenuBurger
                onClick={handleBurger}
                className={navBarAdmin.burger_icon}
              />
            ) : (
              <div ref={burgerBTNref}>
                <AiOutlineClose
                  onClick={handleBurger}
                  className={navBarAdmin.close_icon}
                />
              </div>
            )}
          </div>
          <p className={navBarAdmin.adminName}>Manager: &nbsp;{adminName}</p>

          {/* 버거 모달 메뉴바*/}
          {burgerOnOff === 'off' ? (
            <></>
          ) : (
            <ul className={navBarAdmin.burger_modal_container} ref={burgerRef}>
              <li
                className={currentURL === '/admin' ? navBarAdmin.on : ''}
                onClick={() => {
                  handleBurger(), navigate('/admin');
                }}
              >
                송장입력
              </li>
              <li
                className={
                  currentURL === '/admin/orderlist' || hasOrderId
                    ? navBarAdmin.on
                    : ''
                }
                onClick={() => {
                  handleBurger(),
                    dispatch(orderFilter('allIndex')),
                    navigate('/admin/orderlist');
                }}
              >
                주문관리
              </li>
              <li
                className={
                  currentURL === '/admin/register' ? navBarAdmin.on : ''
                }
                onClick={() => {
                  handleBurger(), navigate('/admin/register');
                }}
              >
                상품등록
              </li>
              <li
                className={currentURL === '/admin/list' ? navBarAdmin.on : ''}
                onClick={() => {
                  handleBurger(), navigate('/admin/list');
                }}
              >
                등록상품 조회
              </li>
            </ul>
          )}
        </nav>
      </MediaQuery>
    </>
  );
}
