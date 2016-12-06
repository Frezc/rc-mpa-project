/**
 * Created by ypc on 2016/9/22.
 */
import fetch from 'isomorphic-fetch';

/**
 * fetch with auto retry
 * 自动重试的ajax
 * @param url request url
 * @param params fetch params with { retry(int, default 3), deltaTime(int, default 1000(ms)) }
 */
export function fetchR(url, params) {
  params = {
    retry: 3,
    deltaTime: 1000,
    ...params
  };

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

/**
 * 将多个action creator绑定到某个action creator后dispatch的方法
 */
export function bindAfter (actionCreator, afterAction) {
  return (...params) => dispatch => {
    dispatch(actionCreator(...params))
    afterAction instanceof Array
      ? afterAction.map(actionCreator => dispatch(actionCreator()))
      : dispatch(afterAction())
  }
}

/**
 * 将对象转换为query字符串
 * @param params obj { param1: value, param2: value }
 */
export function constructQuery(params = {}) {
  return Object.keys(params).map(key => `${key}=${params[key]}`).join('&')
}

/**
 * 将对象转换为FormData对象
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

/**
 * 对象的filter方法
 * @param obj
 * @param cbOrArray function (key, value) => bool or [key, ..]
 * @return obj
 */
export function objectFilter(obj, cbOrArray) {
  return Object.keys(obj).reduce((newObj, key) => {
    if (typeof cbOrArray === 'function' && cbOrArray(key, obj[key])
      || Array.isArray(cbOrArray) && cbOrArray.indexOf(key) != -1)
      newObj[key] = obj[key];
    return newObj;
  }, {});
}

/**
 * { 'key' => v1, 'key2' => v2 } => [{ text: v1, value: 'key' }, { text: v2, value: 'key2' }]
 * @param obj
 */
export function mapToFilters(obj) {
  return Object.keys(obj).map(key => ({ text: obj[key], value: key }));
}

/**
 * 在数组每项中间插入一项
 */
export function arrayDivider(array, dividerEl) {
  if (array.length > 1) {
    const newArr = [array[0]];
    for (let i = 1; i < array.length; i++) {
      newArr.push(dividerEl, array[i]);
    }
    return newArr;
  }
  return array;
}