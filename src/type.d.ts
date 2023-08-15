interface Window {
  __REDUX_DEVTOOLS_EXTENSION__: any;
}

// redux store
interface IsAdminState {
  user: { isAdmin: boolean };
}

interface IsLoginState {
  user: { isLogin: boolean };
}

interface CartState {
  cart: {
    cartProducts: [
      {
        productName: string;
        productCode: string;
        img: string;
        price: number;
        size: string;
        quantity: number;
        unitSumPrice: number;
        _id: string;
      },
    ];
    cartProductsLength: number;
  };
}

type ReduxAction = {
  type?: string;
  payload?: any;
};

// 싱글 주문 redux 타입
interface sumDataType {
  productName: string;
  productCode: string;
  price: number;
  quantity: number;
  size: string;
  totalPrice: number;
  img: string;
  color: string | undefined;
}
// ------

interface ProductsType {
  productName: string;
  productCode: string;
  img?: string[];
  price?: number;
  size?: { OS: number; S: number; M: number; L: number };
  quantity?: number;
  unitSumPrice?: number;
  detail?: string;
  totalPrice?: number;
  color?: string | undefined;
  __v?: number;
  _id?: string;
  category?: string;
  createAt?: string;
}
