import { combineReducers } from 'redux';
import user from './modules/user';
import cart from './modules/cart';
import cartmodal from './modules/cartmodal';
import order from './modules/order';
import payment from './modules/payment';
import menuAccount from './modules/menuAccount';
import search from './modules/search';
import admin_orderList from './modules/admin_orderList';
import cartOrderLoading from './modules/cartOrderLoading';

export default combineReducers({
  cart,
  user,
  cartmodal,
  order,
  payment,
  menuAccount,
  search,
  admin_orderList,
  cartOrderLoading,
});
