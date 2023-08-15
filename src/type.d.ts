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
    cartProducts: [ProductsType];
    cartProductsLength: number;
  };
}

type ReduxAction = {
  type?: string;
  payload?: any;
};
// ------

interface ProductsType {
  productName: string;
  productCode: string;
  img?: [string] | string;
  price?: number;
  size?: { [key: string]: number } | string;
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
