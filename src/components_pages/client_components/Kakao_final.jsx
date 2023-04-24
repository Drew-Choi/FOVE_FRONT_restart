import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../../store/modules/user';

export default function Kakao_final() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [info, setInfo] = useState({});

  const getUserInfo = async () => {
    const access_token = localStorage.getItem('access_token');
    if (!access_token) {
      //로그인 되어 있지 않다면, 다시 로그인 페이지로
      navigate('/login');
      return;
    } else {
      try {
        // 액세스 토큰을 사용해서 사용자 정보를 가져오는 API 호출
        const response = await axios.get('https://kapi.kakao.com/v2/user/me', {
          headers: {
            Authorization: `Bearer ${access_token}`,
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
        });
        // API 호출 결과에서 사용자 정보 추출
        setInfo(response.data);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const sendDBKakaoMember = async () => {
    console.log(info.kakao_account.email);

    try {
      const resCheckId = await axios.post(
        'http://localhost:4000/register/checkId',
        {
          id: info.kakao_account.email,
        },
      );
      console.log(resCheckId.status);

      if (resCheckId.status === 200) {
        const resKakaoRegister = await axios.post(
          'http://localhost:4000/register',
          {
            id: info.kakao_account.email,
            password: 'none',
            name: info.properties.nickname,
            phone: '',
            addresses: {
              destination: info.properties.nickname,
              recipient: info.properties.nickname,
              address: '',
              addressDetail: '',
              zipCode: '',
              recipientPhone: '',
              isDefault: true,
            },
          },
        );
        dispatch(login({ id: info.kakao_account.email }));
        navigate('/store');
      }
    } catch (error) {
      if (
        error.response.status === 400 &&
        error.response.data === '동일한 ID를 가진 회원이 존재합니다.'
      ) {
        dispatch(login({ id: info.kakao_account.email }));
        navigate('/store');
      }
    }
  };
  useEffect(() => {
    getUserInfo();
  }, []);

  useEffect(() => {
    if (info.kakao_account) {
      sendDBKakaoMember();
    }
  }, [info]);

  return <></>;
}
