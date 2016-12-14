/** state tree
 {
   router,
   logonUser: {},
   jobTypes: [],
   userDetailModal: {
     visible: false,
     userId: -1
   },
   companyModal: {
     visible: false,
     id: -1
   },
   jobModal: {
     visible: false,
     id: -1
   },
   expectJobModal: {
     visible: false,
     id: -1
   },
   orderModal: {
     visible: false,
     id: -1
   }
 }
 **/

import { combineReducers } from "redux";
import { routerReducer as router } from 'react-router-redux';
import {
  SET_LOGON_USER, SHOW_USER_DETAIL, CLOSE_USER_DETAIL, LOGOUT, SHOW_COMPANY_MODAL, CLOSE_COMPANY_MODAL,
  SHOW_JOB_MODAL, CLOSE_JOB_MODAL, SHOW_EXPECT_JOB_MODAL, CLOSE_EXPECT_JOB_MODAL, SHOW_ORDER_MODAL,
  CLOSE_ORDER_MODAL, LOADED_JOB_TYPES
} from '../actions/common';
import auth from '../configs/jwtAuth';

/** reducers **/
function logonUser(state = auth.getAuthSync().user, action) {
  switch (action.type) {
    case SET_LOGON_USER:
      return action.payload;
    case LOGOUT:
      return {}
  }

  return state;
}

function userDetailModal(state = { visible: false, userId: -1 }, action) {
  switch (action.type) {
    case SHOW_USER_DETAIL:
      return {
        visible: true,
        userId: action.payload
      };
    case CLOSE_USER_DETAIL:
      return Object.assign({}, state, {
        visible: false
      });
    case LOGOUT:
      return { visible: false, userId: -1 };
  }

  return state;
}

function companyModal(state = { visible: false, id: -1 }, action) {
  switch (action.type) {
    case SHOW_COMPANY_MODAL:
      return {
        visible: true,
        id: action.payload
      };
    case CLOSE_COMPANY_MODAL:
      return Object.assign({}, state, {
        visible: false
      });
    case LOGOUT:
      return { visible: false, id: -1 };
  }

  return state;
}

function jobModal(state = { visible: false, id: -1 }, action) {
  switch (action.type) {
    case SHOW_JOB_MODAL:
      return {
        visible: true,
        id: action.payload
      };
    case CLOSE_JOB_MODAL:
      return Object.assign({}, state, {
        visible: false
      });
    case LOGOUT:
      return { visible: false, id: -1 };
  }

  return state;
}

function expectJobModal(state = { visible: false, id: -1 }, action) {
  switch (action.type) {
    case SHOW_EXPECT_JOB_MODAL:
      return {
        visible: true,
        id: action.payload
      };
    case CLOSE_EXPECT_JOB_MODAL:
      return Object.assign({}, state, {
        visible: false
      });
    case LOGOUT:
      return { visible: false, id: -1 };
  }

  return state;
}

function orderModal(state = { visible: false, id: -1 }, action) {
  switch (action.type) {
    case SHOW_ORDER_MODAL:
      return {
        visible: true,
        id: action.payload
      };
    case CLOSE_ORDER_MODAL:
      return Object.assign({}, state, {
        visible: false
      });
    case LOGOUT:
      return { visible: false, id: -1 };
  }

  return state;
}

function jobTypes(state = [], action) {
  switch (action.type) {
    case LOADED_JOB_TYPES:
      return action.payload;
  }
  return state;
}

const rootRuducer = combineReducers({
  logonUser,
  jobTypes,
  userDetailModal,
  companyModal,
  jobModal,
  expectJobModal,
  orderModal,
  router
});

export default rootRuducer;