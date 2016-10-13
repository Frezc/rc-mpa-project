import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { Router, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
// import configureStore from "./configs/configureStore";
import store from './configs/store'
import { routes } from './configs/routes';

// const store = configureStore();
const history = syncHistoryWithStore(hashHistory, store, {
  selectLocationState: state => state.router
});

render(
  <Provider store={store}>
    <Router history={history}>
      {routes}
    </Router>
  </Provider>,
  document.getElementById('main')
);