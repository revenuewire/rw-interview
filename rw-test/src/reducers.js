import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router'
import carReducer from './cars/duck/reducers';

const rootReducer = (history) => combineReducers({
  router: connectRouter(history),
  cars: carReducer,
});

export default rootReducer;
