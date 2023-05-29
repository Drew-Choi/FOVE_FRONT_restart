import React from 'react';
import headerAdmin from '../../styles/header_admin.module.scss';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

const Home = styled.span`
  position: relative;
  font-size: 13px;
  cursor: pointer;
  &:hover {
    color: darkgray;
  }
  &:active {
    color: white;
  }
`;

const Emogy = styled.p`
  position: relative;
  margin-bottom: 0px;
  font-size: 30px;
  cursor: pointer;
`;

export default function Header_admin() {
  const navigate = useNavigate();
  const adminName = useSelector((state) =>
    state.user.userName === '' ? '' : state.user.userName,
  );

  return (
    <header className={headerAdmin.header_admin}>
      <p className={headerAdmin.logo} onClick={() => navigate('/admin')}>
        FOVE Admin
      </p>
      <div className={headerAdmin.adminPage}>
        <p className={headerAdmin.adminName}>Manager: &nbsp;{adminName}</p>
        <Emogy>⇥</Emogy>
      </div>
    </header>
  );
}
