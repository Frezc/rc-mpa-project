/**
 * Created by admin on 2016/10/13.
 */
import { easyPost, easyGet } from './index';
import { message } from 'antd';
import store from '../configs/store';
import { push } from 'react-router-redux';

class Auth {

  token = null;
  user = {};

  urls = {};

  needRefresh = true;

  __tk__ = btoa('__TK__SIGNIFICANCE__').slice(8, 24);
  __uk__ = btoa('__UK__SIGNIFICANCE__').slice(0, 16);

  constructor({ auth, refresh, unauth }) {
    this.urls = { auth, refresh, unauth };
    this.loadAuthFromLocal();
  }

  async getAuth() {
    if (this.needRefresh) {
      return await this.refreshAuth();
    } else {
      const { token, user } = this;
      return { token, user };
    }
  }

  saveAuth({ token = this.token, user = this.user }) {
    this.user = user;
    this.token = token;
    localStorage.setItem(this.__uk__, btoa(encodeURIComponent(JSON.stringify(this.user))));
    return localStorage.setItem(this.__tk__, btoa(this.token));
  }

  loadAuthFromLocal() {
    const token = localStorage.getItem(this.__tk__);
    const user = localStorage.getItem(this.__uk__);
    if (token && user) {
      this.token = atob(token);
      this.user = JSON.parse(decodeURIComponent(atob(user)));
    } else {
      store.dispatch(push('/login'));
    }
  }

  check() {
    return !!this.token;
  }

  fetchAuth(email, password) {
    const authUrl = this.urls.auth;
    if (authUrl) {
      return Promise.resolve(easyPost(authUrl, { email, password }, false))
        .then(json => {
          this.saveAuth(json);
          this.needRefresh = false;
          return json;
        })
    } else {
      return Promise.reject({ message: 'Unset fetch url!' });
    }
  }

  refreshAuth() {
    const refreshUrl = this.urls.refresh;
    if (!this.token) return Promise.reject({ message: '请先登录!' });
    if (!refreshUrl) return Promise.reject({ message: 'Unset refresh url!' });
    return Promise.resolve(easyGet(refreshUrl, { token: this.token }, false))
      .then(json => {
        this.saveAuth(json.token);
        this.needRefresh = false;
        return json;
      })
      .catch(errorMsg => {
        if (errorMsg.status == 400) {
          message.error('身份验证已过期，请重新登录。');
          localStorage.removeItem(this.__tk__);
          localStorage.removeItem(this.__uk__);
          store.dispatch(push('/login'));
        }
        throw errorMsg;
      })
  }
}

export default Auth;
