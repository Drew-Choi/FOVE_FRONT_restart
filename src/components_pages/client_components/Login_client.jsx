import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../store/modules/user';
import styled from 'styled-components';
import loginCss from '../../styles/login_client.module.scss';

export default function Login_client() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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

  const kakoHandleClick = async () => {
    try {
      const REST_API_KEY = await getKey('REST_API_KEY');
      const SCOPE = await getKey('SCOPE');
      const REDIRECT_URI = 'http://localhost:4000/kakaocb';

      const res = await axios.get('https://kauth.kakao.com/oauth/authorize', {
        client_id: REST_API_KEY,
        redirect_uri: REDIRECT_URI,
        response_type: 'code',
        scope: SCOPE,
      });

      const {
        data: { code },
      } = res;
      console.log(res);
      await axios.post('http://localhost:4000/', { code });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className={loginCss.login_client}>
      <div className={loginCss.login_client_container}>
        <p className={loginCss.login_title}>LOG IN</p>
        <p className={loginCss.login_desc}>
          *별도 가입서 작성없이 간편하게 로그인 하세요.
        </p>
        <a>
          <img
            className={loginCss.kakaoBTN}
            onClick={kakoHandleClick}
            src="/images/kakao_login_large_wide.png"
            alt="카카오버튼"
          />
        </a>
      </div>
    </section>
  );
}
