import {applyMiddleware, createStore} from 'redux';
import {IStoreState} from '../types';
import rootReducer from './../reducers';
import {composeWithDevTools} from "redux-devtools-extension";

export const INITIAL_STATE: IStoreState = {
};

export default(middlewares: any[], initialState: any = {...INITIAL_STATE}, reducers = rootReducer) => {

  const enhancer = composeWithDevTools(
    applyMiddleware(...middlewares),
    // other store enhancers if any
  );

  return createStore(reducers, initialState, enhancer);
}
