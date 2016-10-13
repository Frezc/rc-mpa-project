/**
 * Created by admin on 2016/10/13.
 */
import { easyPost, easyGet } from './index'

class Auth {

  token = null;

  urls = {};

  constructor({ auth, refresh, unauth }) {
    this.urls = { auth, refresh, unauth };
    this.loadAuthFromLocal();
  }

  saveAuth(token = this.token) {
    this.token = token;
    return localStorage.setItem('token', btoa(this.token));
  }

  loadAuthFromLocal() {
    const token = localStorage.getItem('token');
    if (token) {
      this.token = atob(token);
    }
  }

  check() {
    return !!this.token;
  }

  fetchAuth(email, password) {
    const authUrl = this.urls.auth;
    if (authUrl) {
      return Promise.resolve(easyPost(authUrl, { email, password }))
        .then(json => {
          this.saveAuth(json.token);
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
    return Promise.resolve(easyGet(refreshUrl, { token: this.token }))
      .then(json => {
        this.saveAuth(json.token);
        return json;
      })
  }
}

export default Auth;
