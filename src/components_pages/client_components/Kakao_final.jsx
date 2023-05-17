import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { deleteDB, openDB } from 'idb';
import { useDispatch } from 'react-redux';
import { login } from '../../store/modules/user';

export default function Kakao_final() {
  const location = useLocation();
  const navigate = useNavigate();

  // 트랜젝션 생성 함수
  const createDatabase = async () => {
    const db = await openDB('db', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('store')) {
          db.createObjectStore('store');
        }
      },
    });
  };

  // indexedDB 생성 함수
  const saveToIndexedDB = async (token) => {
    if (token) {
      await deleteDB('db');
      await createDatabase();
      const db = await openDB('db', 1);
      const transaction = db.transaction(['store'], 'readwrite');
      const store = transaction.objectStore('store');
      store.put(token, 't');
      await transaction.done;
    }
  };

  useEffect(() => {
    // 토큰 받아오기
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('key');
    // indexedDB 등록
    saveToIndexedDB(token);
    navigate('/store');
  }, []);

  return <></>;
}
