/* eslint-disable no-undef */
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import loginCss from '../../../styles/login_client.module.scss';
import Loading from '../Loading';

export default function Login_client() {
  const app = process.env.REACT_APP_KEY_API;
  const cb = process.env.REACT_APP_KEY_APICB;
  const [isVisible, setIsVisible] = useState(true);
  const { REACT_APP_KEY_BACK } = process.env;

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(false);
    }, 300);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  const getKey = async (key) => {
    try {
      const res = await axios.get(`${REACT_APP_KEY_BACK}/${app}`, {
        params: { key },
      });
      return res.data.key;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const kakoHandleClick = async () => {
    const REST_API_KEY = await getKey('REST_API_KEY');
    const SCOPE = await getKey('SCOPE');
    const REDIRECT_URI = `${REACT_APP_KEY_BACK}/${cb}`;
    const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${SCOPE}`;
    window.location.href = KAKAO_AUTH_URL;
  };

  return (
    <section className={loginCss.login_client}>
      {isVisible && <Loading />}
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
