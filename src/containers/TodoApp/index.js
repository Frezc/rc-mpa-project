import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import './style.scss';

import TodoCheck from '../../components/TodoCheck';
import { addTodo, setTodoStatus, deleteTodo, clearTodo } from '../../actions/todoApp'

const FILTER_STATUS = [{
  text: 'All',
  code: -1
}, {
  code: 0,
  text: 'Active'
}, {
  code: 1,
  text: 'Completed'
}]

class TodoApp extends React.Component {

  state = {
    newTodo: '',
    activeFilter: FILTER_STATUS[0].code
  }

  getFilteredList = () => {
    return this.props.todoList.filter(todo => {
      switch (this.state.activeFilter) {
        case 0:
          return !todo.completed
        case 1:
          return todo.completed
      }
      return true;
    })
  }

  render () {
  	const { dispatch, todoList } = this.props;
    const { newTodo, activeFilter } = this.state

    return (
    	<div className="todo-app">
	    	<input 
	    		type="text"
          className="new-todo"
          placeholder="What needs to be done?"
          value={newTodo}
	    		onChange={e => this.setState({ newTodo: e.target.value })}
          onKeyDown={e => {
            if (e.which === 13) {
              dispatch(addTodo(newTodo))
              this.setState({ newTodo: '' })
            }
          }}
        />
        <section className="todo-list">
          <ul>
            {this.getFilteredList().map((item, index) =>
              <li key={index}>
                <TodoCheck
                  style={{ position: 'absolute', left: 12, marginTop: -2 }}
                  checked={item.completed}
                  onChange={checked => dispatch(setTodoStatus(index, checked))}
                />
                <label
                  style={item.completed ? { color: '#d9d9d9', textDecoration: 'line-through' } : {}}
                >
                  {item.name}
                </label>
              </li>
            )}
          </ul>
        </section>
        {todoList.length > 0 &&
          <footer className="menu">
            <span className="left-text">{todoList.filter(todo => !todo.completed).length} item left</span>
            <div className="filter">
              {FILTER_STATUS.map(filter =>
                <span
                  key={filter.code}
                  className={`${activeFilter == filter.code ? 'selected' : ''}`}
                  onClick={() => this.setState({ activeFilter: filter.code })}
                >
                  {filter.text}
                </span>
              )}
            </div>
            <span className="right-text">Clear completed</span>
          </footer>
        }
    	</div>
    );
  }
}

function select (state) {
	return {
	  todoList: state.todoList
	};
}

export default connect(select)(TodoApp);