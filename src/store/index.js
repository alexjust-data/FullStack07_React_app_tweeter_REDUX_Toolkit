import { configureStore as rtkConfigureStore } from '@reduxjs/toolkit';

import * as reducers from './reducers';
import * as actionCreators from './actions';

import * as tweets from '../pages/tweets/service';
import * as auth from '../pages/auth/service';

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

const historyEnhancer = createStore => (reducer, preloadedState, enhancer) => {
  function historyReducer(state, action) {
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
  }

  return createStore(historyReducer, preloadedState, enhancer);
};

export default function configureStore(preloadedState, { router }) {
  const extraMiddleware = [
    timestamp,
    failureRedirects(router, { 401: '/login', 404: '/404' }),
    logger,
    // noAction,
  ];
  const store = rtkConfigureStore({
    reducer: reducers,
    preloadedState,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
        thunk: { extraArgument: { api: { auth, tweets }, router } },
        serializableCheck: false,
      }).concat(extraMiddleware),
    devTools: {
      actionCreators,
    },
    enhancers: getDefaultEnhancers =>
      getDefaultEnhancers().concat(historyEnhancer),
  });
  return store;
}