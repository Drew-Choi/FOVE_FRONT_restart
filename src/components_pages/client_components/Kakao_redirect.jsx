import axios from 'axios';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { login } from '../../store/modules/user';

export default function Kakao_redirect() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();

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

  // 인가 코드(authorization code)를 받아온 후 실행되는 함수
  const handleCode = async () => {
    try {
      const REST_API_KEY = await getKey('REST_API_KEY');
      const REDIRECT_URI = 'http://localhost:3000/login/kakao/callback';
      //현재 URL에서 인가 코드 추출
      const code = await searchParams.get('code');

      //인가코드와 함께 액세스 토큰을 요청
      const response = await axios.post(
        'https://kauth.kakao.com/oauth/token',
        {
          grant_type: 'authorization_code',
          client_id: REST_API_KEY,
          redirect_uri: REDIRECT_URI,
          code,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
        },
      );
      if (response.status === 200) {
        //엑세스 토큰 추출
        const { access_token } = await response.data;
        //추출한 엑세스 토큰을 localStorage에 저장
        sessionStorage.setItem('access_token', access_token);
        navigate('/login/kakao/callback/success');
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    handleCode();
  }, []);

  return <div>카카오 로그인 중...</div>;
}
