/**
 * Created by admin on 2016/10/13.
 */
import { easyGet, api } from '../../network';

export const SET_LOGON_USER = 'SET_LOGON_USER';
export const LOGOUT = 'LOGOUT';
export const SHOW_USER_DETAIL = 'SHOW_USER_DETAIL';
export const CLOSE_USER_DETAIL = 'CLOSE_USER_DETAIL';
export const SHOW_COMPANY_MODAL = 'SHOW_COMPANY_MODAL';
export const CLOSE_COMPANY_MODAL = 'CLOSE_COMPANY_MODAL';
export const SHOW_JOB_MODAL = 'SHOW_JOB_MODAL';
export const CLOSE_JOB_MODAL = 'CLOSE_JOB_MODAL';
export const SHOW_EXPECT_JOB_MODAL = 'SHOW_EXPECT_JOB_MODAL';
export const CLOSE_EXPECT_JOB_MODAL = 'CLOSE_EXPECT_JOB_MODAL';
export const SHOW_ORDER_MODAL = 'SHOW_ORDER_MODAL';
export const CLOSE_ORDER_MODAL = 'CLOSE_ORDER_MODAL';
export const LOADED_JOB_TYPES = 'LOADED_JOB_TYPES';

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

export function showCompanyModal(id) {
  return {
    type: SHOW_COMPANY_MODAL,
    payload: id
  }
}

export function closeCompanyModal() {
  return {
    type: CLOSE_COMPANY_MODAL
  }
}

export function showJobModal(id) {
  return {
    type: SHOW_JOB_MODAL,
    payload: id
  }
}

export function closeJobModal() {
  return {
    type: CLOSE_JOB_MODAL
  }
}

export function showExpectJobModal(id) {
  return {
    type: SHOW_EXPECT_JOB_MODAL,
    payload: id
  }
}

export function closeExpectJobModal() {
  return {
    type: CLOSE_EXPECT_JOB_MODAL
  }
}

export function showOrderModal(id) {
  return {
    type: SHOW_ORDER_MODAL,
    payload: id
  }
}

export function closeOrderModal() {
  return {
    type: CLOSE_ORDER_MODAL
  }
}

export function loadJobTypes() {
  return (dispatch) =>
    easyGet(api.job_types, null, false)
      .then(types => {
        dispatch({
          type: LOADED_JOB_TYPES,
          payload: types
        });
      });
}