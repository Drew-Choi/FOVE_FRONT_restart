import React from 'react';
import navBarAdmin from '../../styles/navBar_admin.module.scss';
import { useLocation, useNavigate } from 'react-router-dom';

export default function NavBar_admin() {
  const location = useLocation();
  const currentURL = location.pathname;
  const navigate = useNavigate();
  return (
    <nav className={navBarAdmin.navbar_admin}>
      <ul>
        <li onClick={() => navigate('/admin')}>상품등록</li>
        <li onClick={() => navigate('/admin/list')}>등록상품 조회</li>
        <li onClick={() => navigate('/admin/orderlist')}>주문내역</li>
      </ul>
    </nav>
  );
}
