// 로그인을 위한!

// 초기 상태 설정
const initState = {
  userName: '', // * 처리된 상태로 들어갈 예정
  userPoints: 0,
  isAdmin: false,
  isLogin: false, // 로그인 되어있는지 여부
  // 장바구니ID 넣어야 하나??
};

// 액션 타입(문자열) 설정. user는 밑에 정의된 리듀서.
const LOGIN = 'user/LOGIN';
const KEEPLOGIN = 'user/KEEPLOGIN';
const LOGOUT = 'user/LOGOUT';

// 액션 생성 함수. 바깥에서 사용하므로 export.
export function login() {
  // 바깥에서 정보를 받아와야.
  return {
    type: LOGIN,
  };
}

export function keepLogin(loginInfo: {
  nickName: string;
  points: number;
  isAdmin?: boolean;
  isLogin: boolean;
}) {
  return {
    type: KEEPLOGIN,
    payload: loginInfo,
  };
}

export function logout() {
  return {
    type: LOGOUT,
  };
}

// 리듀서. export default ; 이 파일을 import 하면 기본으로 나가는.
export default function user(state = initState, action: ReduxAction) {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        userName: '',
        userPoints: 0,
        isAdmin: false,
        isLogin: false,
      };
    case KEEPLOGIN:
      return {
        ...state,
        userName: action.payload.nickName,
        userPoints: action.payload.points,
        isAdmin: action.payload.isAdmin,
        isLogin: action.payload.isLogin,
      };
    case LOGOUT:
      return {
        ...state,
        userName: '',
        userPoints: 0,
        isAdmin: false,
        isLogin: false,
      };
    default:
      return state;
  }
}
