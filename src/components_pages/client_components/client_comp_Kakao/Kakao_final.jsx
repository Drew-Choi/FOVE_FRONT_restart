import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { openDB } from 'idb';
import Loading from '../Loading';

export default function Kakao_final() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // indexedDB 생성 함수
    const saveToIndexedDB = async (token) => {
      if (token) {
        const db = await openDB('db', 1);
        const transaction = db.transaction(['store'], 'readwrite');
        const store = transaction.objectStore('store');
        store.put(token, 't');
        await transaction.done;
      }
    };

    // 토큰 받아오기
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('key');

    // indexedDB 등록
    saveToIndexedDB(token);
    navigate('/store');
  }, []);

  return <Loading />;
}
