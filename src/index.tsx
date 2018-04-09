import * as React from 'react';
import registerServiceWorker from './registerServiceWorker';
import * as ReactDOM from 'react-dom';
import PageHome from './containers/PageHome';
import PageWord from './containers/PageWord';
import PageLogin from './containers/PageLogin';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';

import configureStore from './store/configureStore';

import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';
import './index.css';

// redux-observable epics
import {rootEpic} from './epics';
import {createEpicMiddleware} from 'redux-observable';

const epicMiddleware = createEpicMiddleware(rootEpic);

// Build the middleware for intercepting and dispatching navigation actions
const middlewares = [
  thunk,
  epicMiddleware,
];

// console.log('ENVIRONMENT = ', process.env.NODE_ENV);
if (process.env.NODE_ENV === `development`) {
  const reduxLogger = require('redux-logger');
  const logger = reduxLogger.createLogger({
    collapsed: true,
  });
  middlewares.push(logger);
}

const store = configureStore(middlewares);

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <div>
        <Route exact path="/" component={PageHome}/>
        <Route path="/login" component={PageLogin}/>
        <Route path="/word" component={PageWord}/>
      </div>
    </Router>
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
