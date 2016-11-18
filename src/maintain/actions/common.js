/**
 * Created by admin on 2016/10/13.
 */

export const SET_LOGON_USER = 'SET_LOGON_USER';
export const LOGOUT = 'LOGOUT';
export const SHOW_USER_DETAIL = 'SHOW_USER_DETAIL';
export const CLOSE_USER_DETAIL = 'CLOSE_USER_DETAIL';

export function setLogonUser(user) {
  return {
    type: SET_LOGON_USER,
    payload: user
  }
}

export function logout() {
  return {
    type: LOGOUT
  }
}

export function showUserDetail(id) {
  return {
    type: SHOW_USER_DETAIL,
    payload: id
  }
}

export function closeUserDetail() {
  return {
    type: CLOSE_USER_DETAIL
  }
}
