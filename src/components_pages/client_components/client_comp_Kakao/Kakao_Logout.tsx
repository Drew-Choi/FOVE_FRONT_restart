import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../../store/modules/user';
import { reset } from '../../../store/modules/cart';
import { deleteDB } from 'idb';
import Loading from '../Loading';

export default function Kakao_Logout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // db닫기 및 삭제
    const deleteIndex = async () => {
      await deleteDB('db');
    };

    deleteIndex();
    dispatch(logout()); // 로그아웃 처리
    dispatch(reset());
    alert('정상적으로 로그아웃 되었습니다!');
    navigate(`/store`); // 로그인 페이지로 이동
  }, []);

  return <Loading />;
}
