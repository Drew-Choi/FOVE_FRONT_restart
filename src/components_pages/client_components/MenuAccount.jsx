import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import { logout } from '../../store/modules/user';
import { clickMenu } from '../../store/modules/menuAccount';
import { reset, update } from '../../store/modules/cart';
import axios from 'axios';

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

export default function MenuAccount({ menuAccountRef }) {
  //리덕스
  //유저정보 state
  const userID = useSelector((state) =>
    state.user.userID === 0 ? 0 : state.user.userID,
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userName = useSelector((state) => state.user.userName);
  const userPoints = useSelector((state) => state.user.userPoints);

  // eslint-disable-next-line no-undef
  const app = process.env.REACT_APP_KEY_API;

  const getKey = async (key) => {
    try {
      const res = await axios.get(`http://localhost:4000/${app}`, {
        params: { key },
      });
      return res.data.key;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  // 로그아웃
  const logoutUser = async () => {
    const YOUR_REST_API_KEY = await getKey('REST_API_KEY');
    const YOUR_LOGOUT_REDIRECT_URI = 'http://localhost:3000/kakao/logout';
    dispatch(clickMenu()); // MenuAccount 닫기
    window.location.href = `https://kauth.kakao.com/oauth/logout?client_id=${YOUR_REST_API_KEY}&logout_redirect_uri=${YOUR_LOGOUT_REDIRECT_URI}`;
  };

  return (
    <MenuAccountWrap ref={menuAccountRef}>
      <ContentTitle>{userName} 님, 환영합니다!</ContentTitle>
      <ContentTitle>Point : {userPoints} p</ContentTitle>
      <Content
        onClick={() => {
          dispatch(clickMenu());
          navigate(`/mypage`);
        }}
      >
        MY PAGE
      </Content>
      <Content
        onClick={() => {
          dispatch(clickMenu());
          navigate(`/mypage/orderlist`);
        }}
      >
        ORDER
      </Content>
      <Content onClick={logoutUser}>LOGOUT</Content>
    </MenuAccountWrap>
  );
}
