/**
 * Created by ypc on 2016/9/22.
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