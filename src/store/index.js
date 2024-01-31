import { createStore, combineReducers, applyMiddleware } from 'redux';
import { withExtraArgument } from 'redux-thunk';
import { composeWithDevTools } from '@redux-devtools/extension';

import * as reducers from './reducers';
import * as actionCreators from './actions';

import * as tweets from '../pages/tweets/service';
import * as auth from '../pages/auth/service';

const composeEnhancers = composeWithDevTools({ actionCreators });

// const thunk = extraArgument => store => next => action => {
//   if (typeof action === 'function') {
//     return action(store.dispatch, store.getState, extraArgument);
//   }
//   next(action);
// };

const logger = store => next => action => {
  console.group(action.type);
  console.info('dispatching', action, store.getState());
  const result = next(action);
  console.log('final state', store.getState());
  console.groupEnd();
  return result;
};

const noAction = () => next => action => {
  if (action.type.endsWith('/no-throw')) {
    return;
  }
  return next(action);
};

const timestamp = () => next => action => {
  return next({
    ...action,
    meta: { ...action.meta, timestamp: new Date() },
  });
};

const failureRedirects = (router, redirectsMap) => store => next => action => {
  const result = next(action);

  if (action.error) {
    const redirect = redirectsMap[action.payload.status];
    if (redirect) {
      router.navigate(redirect);
    }
  }

  return result;
};

const historyReducer = reducer => {
  return function (state, action) {
    const { history, ...restState } = state;

    if (action.type === 'history/back') {
      return {
        ...history.last,
        history: {
          last: null,
          current: history.last,
        },
      };
    }

    const newState = reducer(restState, action);
    return {
      ...newState,
      history: {
        last: restState,
        current: newState,
      },
    };
  };
};

const rootReducer = historyReducer(combineReducers(reducers));

export default function configureStore(preloadedState, { router }) {
  const middleware = [
    withExtraArgument({ api: { auth, tweets }, router }),
    timestamp,
    failureRedirects(router, { 401: '/login', 404: '/404' }),
    logger,
    noAction,
  ];
  const store = createStore(
    rootReducer,
    preloadedState,
    composeEnhancers(applyMiddleware(...middleware)),
    // window.__REDUX_DEVTOOLS_EXTENSION__ &&
    //   window.__REDUX_DEVTOOLS_EXTENSION__(),
  );
  return store;
}