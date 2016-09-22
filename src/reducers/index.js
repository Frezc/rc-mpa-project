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
import { TODO_ADD, TODO_SET, TODO_DELETE, TODO_CLEAR, TODO_LOAD } from '../actions/todoApp'

/** reducers **/
function todoList (state = [], action) {
  const { index, completed, name, todoList } = action.payload || {}

  switch (action.type) {
    case TODO_ADD:
      return state.concat({
        name,
        completed: false
      })
    case TODO_SET:
      return state.slice(0, index)
        .concat(Object.assign({}, state[index], { completed }))
        .concat(state.slice(index + 1))
    case TODO_DELETE:
      return state.filter((todo, i) => i != index)
    case TODO_CLEAR:
      return state.filter((todo, i) => todo.completed != completed)
    case TODO_LOAD:
      return todoList
  }
  return state
}

const rootRuducer = combineReducers({
  todoList,
  router
});

export default rootRuducer;