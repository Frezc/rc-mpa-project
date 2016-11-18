/** state tree
 {
   router,
   logonUser: {},
   userDetailModl: {
     visible: false,
     userId: -1
   }
 }
 **/

import { combineReducers } from "redux";
import { routerReducer as router } from 'react-router-redux';
import { SET_LOGON_USER, SHOW_USER_DETAIL, CLOSE_USER_DETAIL, LOGOUT } from '../actions/common';
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

const rootRuducer = combineReducers({
  logonUser,
  userDetailModal,
  router
});

export default rootRuducer;