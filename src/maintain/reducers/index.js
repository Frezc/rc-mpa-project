/** state tree
 {
   router,
   logonUser: {}
 }
 **/

import { combineReducers } from "redux";
import { routerReducer as router } from 'react-router-redux';
import { SET_LOGON_USER } from '../actions/user';
import auth from '../configs/jwtAuth';

/** reducers **/
function logonUser(state = auth.getAuthSync().user, action) {
  switch (action.type) {
    case SET_LOGON_USER:
      return action.payload;
  }

  return state;
}

const rootRuducer = combineReducers({
  logonUser,
  router
});

export default rootRuducer;