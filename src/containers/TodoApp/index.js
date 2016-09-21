import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import './style.scss';

import Checkbox from '../../components/TodoCheck'

class TodoApp extends React.Component {

  state = {
    newTodo: ''
  }

  render () {
  	const { dispatch, todoList } = this.props;
    const { newTodo } = this.state

    const dataSource = [{
      name: '123', checked: false
    }, {
      name: '长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本长文本', checked: true
    }];

    return (
    	<div className="todo-app">
	    	<input 
	    		type="text"
          className="new-todo"
          placeholder="What needs to be done?"
          value={newTodo}
	    		onChange={e => this.setState({ newTodo: e.target.value })}
        />
        <section className="todo-list">
          <ul>
            {dataSource.map((item, index) =>
              <li key={index}>
                <Checkbox style={{ position: 'absolute', left: 12, marginTop: -2 }} />
                {item.name}
              </li>
            )}
          </ul>
        </section>
        <footer className="menu">
          <span className="left-text">1 item left</span>
          <div className="filter">
            <span>All</span>
            <span>Active</span>
            <span>Completed</span>
          </div>
          <span className="right-text">Clear completed</span>
        </footer>
        {dataSource.map((item, index) =>
          <div key={index}>

          </div>
        )}
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