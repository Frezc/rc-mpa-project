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