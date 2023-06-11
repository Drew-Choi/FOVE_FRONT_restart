// 초기 상태 설정
const initState = {
  orderFilterValue: 'allIndex',
};

// 액션 타입(문자열) 설정. user는 밑에 정의된 리듀서.
const ORDERFILTER = 'admin_orderList/ORDERFILTER';

// 액션 생성 함수. 바깥에서 사용하므로 export.
export function orderFilter(data) {
  // 바깥에서 정보를 받아와야.
  return {
    type: ORDERFILTER,
    payload: data,
  };
}

// 리듀서 일해라. export default ; 이 파일을 import 하면 기본으로 나가는.
export default function admin_orderList(state = initState, action) {
  switch (action.type) {
    case ORDERFILTER:
      return {
        ...state,
        orderFilterValue: action.payload,
      };
    default:
      return state;
  }
}
