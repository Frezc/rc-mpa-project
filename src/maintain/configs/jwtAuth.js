/**
 * Created by admin on 2016/10/13.
 */
import Auth from '../../network/Auth';
import api from '../../network/api';
import store from './store';
import { push } from 'react-router-redux';
import { setLogonUser, logout } from '../actions/common';
import { message } from 'antd';

const jwtAuth = new Auth({ auth: api.auth, refresh: api.refresh });
jwtAuth.on('fetched', json => {
  if (json.user.role_name == 'admin') {
    store.dispatch(setLogonUser(json.user));
  } else {
    message.warn('你没有管理员权限');
    jwtAuth.toLogin();
  }
});
jwtAuth.on('needAuth', () => {
  store.dispatch(push('/login'));
  store.dispatch(logout());
});
export default jwtAuth;
