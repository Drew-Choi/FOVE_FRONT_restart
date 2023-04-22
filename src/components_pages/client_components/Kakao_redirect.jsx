import axios from 'axios';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { login } from '../../store/modules/user';

export default function Kakao_redirect() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();

  const REST_API_KEY = '1702fb0670a754fbcf00088a79157ad0';
  const REDIRECT_URI = 'http://localhost:3000/login/kakao/callback';

  // 인가 코드(authorization code)를 받아온 후 실행되는 함수
  const handleCode = async () => {
    try {
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
        localStorage.setItem('access_token', access_token);
        navigate('/login/kakao/callback/success');
        console.log(response.data);
      } else {
        console.log(response.data);
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
