import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../store/modules/user';
import '../../styles/login_client.scss';
import styled from 'styled-components';

const KakaoBTN = styled.img`
  width: 400px;
  padding: 20px;
  cursor: pointer;
  &:hover {
    opacity: 0.7;
  }
  &:active {
    opacity: 0.2;
  }
`;

export default function Login_client() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const REST_API_KEY = '1702fb0670a754fbcf00088a79157ad0';
  const REDIRECT_URI = 'http://localhost:3000/login/kakao/callback';
  const SCOPE =
    'profile_nickname, profile_image, account_email, gender, age_range, birthday, talk_message, openid';
  const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${SCOPE}`;

  const kakoHandleClick = () => {
    window.location.href = KAKAO_AUTH_URL;
  };

  const loginbtn = useRef();

  const handleKeyPress1 = (e) => {
    if (e.key === 'Enter') {
      loginbtn.current?.click();
    }
  };

  const handleKeyPress2 = (e) => {
    if (e.key === 'Enter') {
      loginbtn.current?.click();
    }
  };

  //유저정보 state
  const userID = useSelector((state) =>
    state.user.userID === 0 ? 0 : state.user.userID,
  );

  const loginIdInput = useRef();
  const loginPwInput = useRef();

  // LOG IN 버튼
  const loginUser = async () => {
    try {
      // 아이디, 비밀번호 값 입력 여부 확인. 없으면 alert 창 뜨게.
      if (!loginIdInput.current.value) {
        loginIdInput.current.focus();
        return alert('아이디를 입력해 주세요.');
      }

      if (!loginPwInput.current.value) {
        loginPwInput.current.focus();
        return alert('비밀번호를 입력해 주세요.');
      }

      // axios 로 보내기
      const resLogin = await axios.post('http://localhost:4000/login', {
        id: loginIdInput.current.value,
        password: loginPwInput.current.value,
      });

      // 회원이 아닐 때, 비밀번호가 틀렸을 때 뜨는 에러 메시지 처리
      if (resLogin.status === 400) alert(resLogin.response.data.message);
      // 로그인 성공 시, 메시지 처리
      alert(resLogin.data.message);

      // 로그인이 성공하면 응답 데이터 token 프로퍼티에 accessToken 이 전달 되어 오므로
      // 로컬 스토리지에 로그인 정보가 저장 된 토큰을 저장
      // 해당 정보를 통하여 리액트 실행 시, 토큰을 백엔드 서버에 검증하여 자동 로그인을 처리
      window.localStorage.setItem('token', resLogin.data.token);
      dispatch(
        login({
          id: loginIdInput.current.value,
        }),
      );
      // cartDataReq(loginIdInput.current.value);
      navigate('/store'); // 로그인 후 이전 페이지로 이동
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  return (
    <div className="login_client">
      <p className="login_title">LOG IN or CREATE ACCOUNT</p>
      <br />
      <input
        type="text"
        ref={loginIdInput}
        placeholder="ID (Email Address)"
        required
        className="login_input"
        onKeyDown={(e) => handleKeyPress1(e)}
      />
      <br />
      <input
        type="password"
        ref={loginPwInput}
        placeholder="PW"
        required
        className="login_input"
        onKeyDown={(e) => handleKeyPress2(e)}
      />
      <br />
      <button ref={loginbtn} onClick={loginUser} className="login_btn">
        LOG IN
      </button>
      <br />
      <button className="login_btn white" onClick={() => navigate(`/register`)}>
        <Link to="/register" style={{ textDecoration: 'none', color: 'black' }}>
          Create Account
        </Link>
      </button>
      <br />
      <a>
        <KakaoBTN
          onClick={kakoHandleClick}
          src="/images/kakao_login_large_wide.png"
          alt="카카오버튼"
        />
      </a>
    </div>
  );
}
