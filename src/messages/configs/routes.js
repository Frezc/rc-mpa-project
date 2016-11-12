/**
 * Created by Frezc on 2016/11/2.
 */
import React from 'react';
import { Route, IndexRedirect } from 'react-router';
import MessagesPage from '../containers/MessagesPage';
import NotificationPage from '../containers/NotificationPage';
import ConversationPage from '../containers/ConversationPage';

export const routes = (
  <Route
    path="/"
    component={MessagesPage}
  >
    <Route
      path="notifications/:id"
      component={NotificationPage}
    />
    <Route
      path="conversations/:id"
      component={ConversationPage}
    />
  </Route>
)