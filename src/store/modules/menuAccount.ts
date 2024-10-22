// 초기 상태 설정
const initState = {
  clicked: false,
};

// 액션 타입(문자열) 설정.
const CLICKED = 'menuAccount/CLICKED';
const MENUCLOSE = 'menuAccount/MENUCLOSE';

// 액션 생성 함수.
export function clickMenu() {
  return {
    type: CLICKED,
  };
}

export function menuClose() {
  return {
    type: MENUCLOSE,
  };
}

// 리듀서
export default function menuAccount(state = initState, action: ReduxAction) {
  switch (action.type) {
    case CLICKED:
      if (state.clicked) {
        return {
          ...state,
          clicked: false,
        };
      } else {
        return {
          ...state,
          clicked: true,
        };
      }
    case MENUCLOSE:
      return {
        ...state,
        clicked: false,
      };
    default:
      return state;
  }
}
