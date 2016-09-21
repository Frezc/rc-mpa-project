/**
 * Created by ypc on 2016/9/20.
 */
import React from "react";
import { connect } from 'react-redux';
import { Link } from 'react-router';
import './style.scss';

class AppList extends React.Component {

  renderList () {
    return (
      <ul>
        <li><Link to="/todo-app">Todo app</Link></li>
      </ul>
    )
  }

  render () {
    const { children, router } = this.props
    console.log(router)
    return (
      <div className="app-list">
        <h2>{router.locationBeforeTransitions.pathname.slice(1) || 'Index'}</h2>
        {children || this.renderList()}
      </div>
    )
  }
}

function select (state) {
  return {
    router: state.router
  }
}

export default connect(select)(AppList)