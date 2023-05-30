import React from 'react';
import navBarAdmin from '../../styles/navBar_admin.module.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import MediaQuery from 'react-responsive';

export default function NavBar_admin() {
  const location = useLocation();
  const currentURL = location.pathname;
  const navigate = useNavigate();

  return (
    <>
      <MediaQuery minWidth={668}>
        <nav className={navBarAdmin.navbar_admin}>
          <ul>
            <li
              className={currentURL === '/admin' ? navBarAdmin.on : <></>}
              onClick={() => navigate('/admin')}
            >
              상품등록
            </li>
            <li
              className={currentURL === '/admin/list' ? navBarAdmin.on : <></>}
              onClick={() => navigate('/admin/list')}
            >
              등록상품 조회
            </li>
            <li
              className={
                currentURL === '/admin/orderlist' ? navBarAdmin.on : <></>
              }
              onClick={() => navigate('/admin/orderlist')}
            >
              주문내역
            </li>
          </ul>
        </nav>
      </MediaQuery>

      <MediaQuery maxWidth={667}>
        <nav className={navBarAdmin.navbar_admin_react}></nav>
      </MediaQuery>
    </>
  );
}
