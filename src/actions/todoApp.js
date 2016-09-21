/**
 * Created by ypc on 2016/9/20.
 */
export const TODO_ADD = 'TODO_ADD'
export const TODO_SET = 'TODO_SET'
export const TODO_DELETE = 'TODO_DELETE'
export const TODO_CLEAR = 'TODO_CLEAR'

export function addTodo (name) {
  return {
    type: TODO_ADD,
    payload: {
      name
    }
  }
}

export function setTodoStatus (index, completed) {
  return {
    type: TODO_SET,
    payload: {
      index,
      completed
    }
  }
}

export function deleteTodo (index) {
  return {
    type: TODO_DELETE,
    payload: {
      index
    }
  }
}

export function clearTodo () {
  return {
    type: TODO_CLEAR,
    payload: {
      completed: true
    }
  }
}