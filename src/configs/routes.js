/**
 * Created by ypc on 2016/9/20.
 */
import React from 'react'
import { Route, IndexRedirect } from 'react-router'
import NavContainer from '../containers/NavContainer'
import LoginPage from '../containers/LoginPage'

export const routes = (
  <Route
    path="/"
  >
    <IndexRedirect to="maintain" />
    <Route 
      path="login"
      component={LoginPage}
    />
    <Route
      path="maintain"
      component={NavContainer}
    >
    </Route>
  </Route>
)