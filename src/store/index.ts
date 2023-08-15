import { combineReducers } from 'redux';
import user from './modules/user';
import cart from './modules/cart';
import cartmodal from './modules/cartmodal';
import order from './modules/order';
import menuAccount from './modules/menuAccount';
import search from './modules/search';
import admin_orderList from './modules/admin_orderList';

export default combineReducers({
  cart,
  user,
  cartmodal,
  order,
  menuAccount,
  search,
  admin_orderList,
});
