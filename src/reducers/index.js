/** state tree
 {
   router,
   todoList: [{
     name: string,
     completed: bool
   }]
 }
 **/

import { combineReducers } from "redux";
import { routerReducer as router } from 'react-router-redux';

/** reducers **/
function todoList (state = [], action) {
  switch (action.type) {

  }
  return state
}

const rootRuducer = combineReducers({
  todoList,
  router
});

export default rootRuducer;