import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import rootReducer from '../reducers';
import { hashHistory } from 'react-router';
import { routerMiddleware } from 'react-router-redux';
const router = routerMiddleware(hashHistory);

const isProd = process.env.NODE_ENV === 'production';

const loggerMiddleware = createLogger();

let middleware;
if (isProd) {
  middleware = [
    thunkMiddleware,
    router
  ]
} else {
  middleware = [
    thunkMiddleware,
    loggerMiddleware,    // redux的日志输出
    router
  ]
}

export default function configureStore(initialState) {
  return createStore(rootReducer, initialState, compose(
    applyMiddleware(...middleware),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  ));
}