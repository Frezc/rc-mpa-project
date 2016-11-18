/**
 * Created by ypc on 2016/9/20.
 */
import React from 'react';
import { Route, IndexRedirect } from 'react-router';
import NavContainer from '../containers/NavContainer';
import LoginPage from '../containers/LoginPage';
import IndexPage from '../containers/IndexPage';
import UserProfilePage from '../containers/UserProfilePage';
import RealNameApplyPage from '../containers/RealNameApplyPage';

export const routes = (
  <Route
    path="/"
  >
    <IndexRedirect to="m"/>
    <Route
      path="login"
      component={LoginPage}
    />
    <Route
      path="m"
      component={NavContainer}
    >
      <IndexRedirect to="index"/>
      <Route
        path="index"
        component={IndexPage}
      />
      <Route
        path="um/user_profiles"
        component={UserProfilePage}
      />
      <Route
        path="am/real_name"
        component={RealNameApplyPage}
      />
    </Route>
  </Route>
)