/**
 * Created by ypc on 2016/9/20.
 */
import { bindAfter } from '../helpers'

export const TODO_ADD = 'TODO_ADD'
export const TODO_SET = 'TODO_SET'
export const TODO_DELETE = 'TODO_DELETE'
export const TODO_CLEAR = 'TODO_CLEAR'
export const TODO_LOAD = 'TODO_LOAD'

export const addTodo = bindAfter(name => ({
  type: TODO_ADD,
  payload: {
    name
  }
}), storageLocal)

export const setTodoStatus = bindAfter((index, completed) => ({
  type: TODO_SET,
  payload: {
    index,
    completed
  }
}), storageLocal)

export const deleteTodo = bindAfter(index => ({
  type: TODO_DELETE,
  payload: {
    index
  }
}), storageLocal)

export const clearTodo = bindAfter(() => ({
  type: TODO_CLEAR,
  payload: {
    completed: true
  }
}), storageLocal)

function storageLocal () {
  return (dispatch, getState) => {
    localStorage.setItem('todoList', JSON.stringify(getState().todoList))
  }
}

export function loadLocal () {
  return (dispatch) => {
    let todoList = localStorage.getItem('todoList')
    if (todoList) {
      todoList = JSON.parse(todoList)
      dispatch({
        type: TODO_LOAD,
        payload: {
          todoList
        }
      })
    }
  }
}