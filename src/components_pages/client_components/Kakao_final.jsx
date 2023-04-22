import axios from 'axios';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../../store/modules/user';

export default function Kakao_final() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getUserInfo = async () => {
    const access_token = localStorage.getItem('access_token');
    if (!access_token) {
      //로그인 되어 있지 않다면, 다시 로그인 페이지로
      navigate('/login');
      return;
    }

    try {
      // 액세스 토큰을 사용해서 사용자 정보를 가져오는 API 호출
      const response = await axios.get('https://kapi.kakao.com/v2/user/me', {
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
      });

      // API 호출 결과에서 사용자 정보 추출
      const { kakao_account, properties } = response.data;
      sendDBKakaoMember(kakao_account, properties);
      navigate('/store');
    } catch (err) {
      console.error(err);
    }
  };

  const sendDBKakaoMember = async (kakao_account, properties) => {
    const resCheckId = await axios.post(
      'http://localhost:4000/register/checkId',
      {
        id: kakao_account.email,
      },
    );
    if (resCheckId.data.status === 400) {
      const loginData = {
        id: kakao_account.email,
      };
      await dispatch(login(loginData));
      navigate('/store');
      return;
    } else {
      const resKakaoRegister = axios.post('http://localhost:4000/register', {
        id: kakao_account.email,
        password: 'none',
        name: properties.nickname,
        phone: '',
        addresses: {
          destination: properties.nickname,
          recipient: properties.nickname,
          address: '',
          addressDetail: '',
          zipCode: '',
          recipientPhone: '',
          isDefault: true,
        },
      });
      const loginData = {
        id: kakao_account.email,
      };
      await dispatch(login(loginData));
      navigate('/store');
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  return <></>;
}
