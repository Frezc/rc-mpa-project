/**
 * Created by ypc on 2016/9/20.
 */
import React from 'react'
import { Route, IndexRedirect } from 'react-router'
import AppList from '../containers/AppList'
import TodoApp from '../containers/TodoApp'

export const routes = (
  <Route
    path="/"
    component={AppList}
  >
    <Route
      path="todo-app"
      component={TodoApp}
    />
  </Route>
)