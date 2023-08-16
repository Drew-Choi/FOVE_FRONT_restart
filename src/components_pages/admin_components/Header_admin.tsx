import React from 'react';
import headerAdmin from '../../styles/header_admin.module.scss';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

const Emogy = styled.p`
  position: relative;
  margin-bottom: 0px;
  font-size: 30px;
  cursor: pointer;

  @media screen and (max-width: 280px) {
    font-size: 25px;
  }
`;

export default function Header_admin() {
  const navigate = useNavigate();
  const adminName = useSelector((state: { user: { userName: string } }) =>
    state.user.userName === '' ? '' : state.user.userName,
  );

  return (
    <>
      <header className={headerAdmin.header_admin}>
        <div className={headerAdmin.logo} onClick={() => navigate('/admin')}>
          <div className={headerAdmin.logoImgae}></div>Admin
        </div>
        <div className={headerAdmin.adminPage}>
          <p className={headerAdmin.adminName}>Manager: &nbsp;{adminName}</p>
          <Emogy onClick={() => navigate('/store')}>⇥</Emogy>
        </div>
      </header>
    </>
  );
}
