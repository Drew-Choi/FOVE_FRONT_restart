import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clickMenu } from '../../store/modules/menuAccount';
import { logout } from '../../store/modules/user';
import { reset } from '../../store/modules/cart';

export default function Kakao_Logout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    window.sessionStorage.clear(); // 스토리지의 로그인 토큰 삭제
    dispatch(logout()); // 로그아웃 처리
    dispatch(reset());
    alert('정상적으로 로그아웃 되었습니다!');
    navigate(`/login`); // 로그인 페이지로 이동
  }, []);

  return <></>;
}
