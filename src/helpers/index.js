/**
 * Created by ypc on 2016/9/22.
 */
import fetch from 'isomorphic-fetch';
import { message } from 'antd';
import store from '../configs/store'

export function bindAfter (actionCreator, afterAction) {
  return (...params) => dispatch => {
    dispatch(actionCreator(...params))
    afterAction instanceof Array
      ? afterAction.map(actionCreator => dispatch(actionCreator()))
      : dispatch(afterAction())
  }
}

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
 * @param url
 * @param params
 * @returns {Promise} then(json) catch({ status, message })
 */
export function easyFetch(url, params) {
  return new Promise((res, rej) => {
    fetchR(url, params)
      .then(response => {
        if (response.ok) {
          return response.json().then(json => {
            res(json);
          })
        } else {
          return response.json().then(json => {
            const errorMsg = { status: response.status, message: json.error };
            if (errorMsg.status == 400) {
              Object.keys(json.error)
              errorMsg.error = resolveInputError(json.error);
              errorMsg.message = 'Invalid parameters!';
            }
            message.error(`Error[${errorMsg.status}]: ${errorMsg.message}`);
            rej(errorMsg);
          })
        }
      })
      .catch(error => {
        message.error(`Unexpected error!`);
        rej({ message: 'Unexpected error!' });
      });
  })
}

/**
 * @param error obj { [name]: ['error1', 'error2'], ... }
 * @returns obj { [name]: { validateStatus: 'error', help: 'error1 error2' }, ... }
 */
function resolveInputError(error) {
  return Object.entries(error).reduce((obj, entry) => {
    obj[entry[0]] = {
      validateStatus: 'error',
      help: entry[1].join(' ')
    };
    return obj;
  }, {});
}

/**
 * http get
 * @param url only path
 * @param params query params
 */
export function easyGet(url, params) {
  params = Object.assign({
    _: Date.now()
  }, params)
  return easyFetch(`${url}?${constructQuery(params)}`)
}

/**
 * http post
 * @param url path and query (use constructQuery)
 * @param params body params
 */
export function easyPost(url, params) {
  return easyFetch(url, {
    method: 'POST',
    mode: 'cors',
    body: constructFormData(params)
  })
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