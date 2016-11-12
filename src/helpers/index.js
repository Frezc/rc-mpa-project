/**
 * Created by ypc on 2016/9/22.
 */
import fetch from 'isomorphic-fetch';

/**
 * fetch with auto retry
 * @param url request url
 * @param params fetch params with { retry(int, default 3), deltaTime(int, default 1000(ms)) }
 */
export function fetchR(url, params) {
  params = Object.assign({
    retry: 3,
    deltaTime: 1000
  }, params);

  return new Promise((resolve, reject) => {
    const wrappedFetch = (retry) => {
      fetch(url, params)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          if (retry > 1) {
            setTimeout(() => {
              wrappedFetch(retry - 1);
            }, params.deltaTime);
          } else {
            reject(error);
          }
        })
    };
    wrappedFetch(params.retry);
  });
}

/**
 * read response body to json or text
 * @param response
 */
export function readData(response) {
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.indexOf("application/json") !== -1) {
    return response.json();
  } else {
    return response.text();
  }
}

export function bindAfter (actionCreator, afterAction) {
  return (...params) => dispatch => {
    dispatch(actionCreator(...params))
    afterAction instanceof Array
      ? afterAction.map(actionCreator => dispatch(actionCreator()))
      : dispatch(afterAction())
  }
}

/**
 * @param params obj { param1: value, param2: value }
 */
export function constructQuery(params = {}) {
  return Object.keys(params).map(key => `${key}=${params[key]}`).join('&')
}

/**
 * @param params obj
 */
export function constructFormData(params = {}) {
  return Object.keys(params).reduce((formData, key) => {
    formData.append(key, params[key]);
    return formData;
  }, new FormData())
}

/**
 * format date like wechat and qq
 */
export function formatTime(date) {
  const now = new Date();
  if (now.getFullYear() != date.getFullYear()) {
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  }
  if (now.getMonth() != date.getMonth() || now.getDate() != date.getDate()) {
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  }
  return `${date.getHours()}:${date.getMinutes()}`
}