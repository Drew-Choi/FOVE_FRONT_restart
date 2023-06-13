// 초기 상태 설정
const initState = {
  isVisible: false,
};

// 액션 타입(문자열) 설정.
const VISIBLE = 'cartOrderLoading/VISIBLE';
const INVISIBLE = 'cartOrderLoading/INVISIBLE';

// 액션 생성 함수.
export function visible() {
  return {
    type: VISIBLE,
  };
}

export function invisible() {
  return {
    type: INVISIBLE,
  };
}

// 리듀서
export default function cartOrderLoading(state = initState, action) {
  switch (action.type) {
    case VISIBLE:
      return {
        ...state,
        isVisible: true,
      };
    case INVISIBLE:
      return {
        ...state,
        isVisible: false,
      };

    default:
      return state;
  }
}
