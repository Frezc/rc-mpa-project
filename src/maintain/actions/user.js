/**
 * Created by admin on 2016/10/13.
 */

export const SET_LOGON_USER = 'SET_LOGON_USER';

export function setLogonUser(user) {
  return {
    type: SET_LOGON_USER,
    payload: user
  }
}
