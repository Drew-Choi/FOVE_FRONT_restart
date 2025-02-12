// 초기 상태 설정
const initState = {
  cartProducts: [],
  cartProductsLength: 0,
};

// 액션 타입(문자열) 설정. user는 밑에 정의된 리듀서.
const IMPORTDB = 'cart/IMPORTDB';
const ADD = 'cart/ADD';
const UPDATE = 'cart/UPDATE';
const RESET = 'cart/RESET';

// 액션 생성 함수. 바깥에서 사용하므로 export.
export function importdb(data: { products: []; cartQuantity: number }) {
  // 바깥에서 정보를 받아와야.
  return {
    type: IMPORTDB,
    payload: data,
  };
}

export function add(data: ProductsType, total: number) {
  // 바깥에서 정보를 받아와야.
  return {
    type: ADD,
    payload: { data, total },
  };
}

export function update(data: ProductsType, total: number) {
  // 바깥에서 정보를 받아와야.
  return {
    type: UPDATE,
    payload: { data, total },
  };
}

export function reset() {
  // 바깥에서 정보를 받아와야.
  return {
    type: RESET,
  };
}

// 리듀서 일해라. export default ; 이 파일을 import 하면 기본으로 나가는.
export default function cart(state = initState, action: ReduxAction) {
  switch (action.type) {
    case IMPORTDB:
      return {
        ...state,
        cartProducts: action.payload.products,
        cartProductsLength: action.payload.cartQuantity,
      };
    case ADD:
      return {
        ...state,
        cartProducts: action.payload.data,
        cartProductsLength: action.payload.total,
      };
    case UPDATE:
      return {
        ...state,
        cartProducts: action.payload.data,
        cartProductsLength: action.payload.total,
      };
    case RESET:
      return {
        ...state,
        cartProducts: [],
        cartProductsLength: 0,
      };
    default:
      return state;
  }
}
