/**
 * Created by Frezc on 2016/11/7.
 */
import { fetchR, readData } from '../helpers';
import { constructQuery, constructFormData } from '../helpers';
import api from '../network/api';

export function mobileFetch(url, params) {
  const token = getToken();
  if (!token) return tokenInvalid();
  const headers = params.headers || new Headers();
  headers.set('Authorization', `Bearer ${token}`);
  params.headers = headers;

  return new Promise((res, rej) => {
    fetchR(url, params)
      .then(response => {
        if (response.ok) {
          return response.json().then(json => {
            res(json);
          })
        } else {
          return readData(response)
            .then(data => {
              const errorMsg = {
                status: response.status,
                message: typeof data === 'object' ? data.error : data
              };

              if (errorMsg.status == 400 && typeof errorMsg.message === 'object') {
                errorMsg.message = '参数错误！';
              }
              if (errorMsg.status == 429) {
                errorMsg.message = '请求过于频繁，喝杯咖啡休息一分钟吧。';
              }
              if (errorMsg.status == 401) {
                if (errorMsg.message == 'token_expired') {
                  return tokenExpired();
                } else {
                  return tokenInvalid();
                }
              }

              toast(`Error[${errorMsg.status}]: ${errorMsg.message}`);
              rej(errorMsg);
            })
        }
      })
      .catch(error => {
        console.log(error)
        toast(`Unexpected error!`);
        rej({ message: 'Unexpected error!' });
      });
  })
}

export function mobileGet(url, params) {
  params = Object.assign({
    _: Date.now()
  }, params);
  return mobileFetch(`${url}?${constructQuery(params)}`, {
    method: 'GET',
    mode: 'cors'
  });
}

export function mobilePost(url, params) {
  return mobileFetch(url, {
    method: 'POST',
    mode: 'cors',
    body: constructFormData(params)
  });
}

export function getParams(key) {
  const re = location.search.match(new RegExp(`${key}=([\\w.]+)&?`, 'i'));
  if (re) {
    return re[1];
  }
  return null;
}

let currentUser = null;
export function getSelf() {
  if (currentUser) return Promise.resolve(currentUser);
  else return mobileGet(api.self).then(user => currentUser = user);
}

export function getSelfSync() {
  return currentUser;
}

export function getToken() {
  return getParams('token');
}

function tokenInvalid() {
  if (nativeInterface) nativeInterface.tokenInvalid();
  alert('token invalid');
}

function tokenExpired() {
  if (nativeInterface) nativeInterface.tokenExpired();
  alert('token expired');
}

export function toast(msg) {
  if (nativeInterface) nativeInterface.showToast(msg);
  alert(msg);
}