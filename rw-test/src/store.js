import { createStore, applyMiddleware, compose, Store as ReduxStore } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
/* eslint-disable import/no-extraneous-dependencies */
import { createBrowserHistory } from 'history'

import rootReducer from './reducers';

export const history = createBrowserHistory()

const initialState = {};
const enhancers = [];
const middleware = [thunk, routerMiddleware(history)];

if (process.env.NODE_ENV === 'development') {
  const devToolsExtension = window.devToolsExtension;

  if (typeof devToolsExtension === 'function') {
    enhancers.push(devToolsExtension());
  }
  middleware.push(createLogger());
}

const composedEnhancers = compose(applyMiddleware(...middleware), ...enhancers);

const store: ReduxStore = createStore(rootReducer(history), initialState, composedEnhancers);

export default store;
