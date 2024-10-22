import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
//router-dom 설정
import { BrowserRouter } from 'react-router-dom';
//redux 세팅
import { Provider } from 'react-redux';
import rootReducer from './store';
import { configureStore } from '@reduxjs/toolkit';
import React from 'react';

//리덕스 store 세팅, 스토어장소 설정 후 Provider에 넣어줘야하고 reducer: 에는 combin한 JS파일을 임폴트해준다.
const store = configureStore({
  reducer: rootReducer,
  // redux 도구 사용 세팅 // 개발환경에서만 활성화
  devTools: process.env.NODE_ENV === 'development' ? true : false,
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>,
);

reportWebVitals();
