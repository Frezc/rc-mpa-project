/**
 * Created by admin on 2016/10/13.
 */
import { easyPost, easyGet } from './index';
import { message } from 'antd';
import EventEmitter from 'events';

/**
 * events: ['fetched', 'needAuth']
 */
class Auth extends EventEmitter {

  user = {};

  urls = {};

  needRefresh = true;

  __tk__ = btoa('__TK__SIGNIFICANCE__').slice(8, 24);
  __uk__ = btoa('__UK__SIGNIFICANCE__').slice(0, 16);

  constructor({ auth, refresh, unauth }) {
    super();
    this.urls = { auth, refresh, unauth };
    this.loadAuthFromLocal();
  }

  async getAuth() {
    if (this.needRefresh) {
      return await this.refreshAuth();
    } else {
      return this.getAuthSync();
    }
  }

  getAuthSync() {
    const { user } = this;
    return { token: this.getToken(), user };
  }

  saveAuth({ token, user = this.user }) {
    this.user = user;
    localStorage.setItem(this.__uk__, btoa(encodeURIComponent(JSON.stringify(this.user))));
    return localStorage.setItem(this.__tk__, btoa(token));
  }

  loadAuthFromLocal() {
    const token = this.getToken();
    const user = localStorage.getItem(this.__uk__);
    if (token && user) {
      this.user = JSON.parse(decodeURIComponent(atob(user)));
    } else {
      this.toLogin();
    }
  }

  // get token from localStorage
  getToken() {
    const token = localStorage.getItem(this.__tk__);
    return token && atob(token);
  }

  check() {
    return !!this.getToken();
  }

  toLogin() {
    localStorage.removeItem(this.__tk__);
    localStorage.removeItem(this.__uk__);
    this.emit('needAuth');
  }

  authSuccess(json) {
    this.saveAuth(json);
    this.needRefresh = false;
    this.emit('fetched', json);
    return json;
  }

  fetchAuth(email, password) {
    const authUrl = this.urls.auth;
    if (authUrl) {
      return Promise.resolve(easyPost(authUrl, { email, password }, false))
        .then(json => this.authSuccess(json))
    } else {
      return Promise.reject({ message: 'Unset fetch url!' });
    }
  }

  refreshAuth() {
    const refreshUrl = this.urls.refresh;
    const token = this.getToken();
    if (!token) return Promise.reject({ message: '请先登录!' });
    if (!refreshUrl) return Promise.reject({ message: 'Unset refresh url!' });
    return Promise.resolve(easyGet(refreshUrl, { token }, false))
      .then(json => this.authSuccess(json))
      .catch(errorMsg => {
        if (errorMsg.status == 400) {
          message.error('身份验证已过期，请重新登录。');
          this.toLogin();
        }
        throw errorMsg;
      })
  }
}

export default Auth;
