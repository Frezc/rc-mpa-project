/**
 * Created by Frezc on 2016/11/2.
 */
import React from "react";
import { render } from "react-dom";
import { Router, hashHistory } from 'react-router';
import { routes } from './configs/routes';
import 'normalize.css';
import './index.css';

render(
  <Router history={hashHistory}>
    {routes}
  </Router>,
  document.getElementById('main')
);