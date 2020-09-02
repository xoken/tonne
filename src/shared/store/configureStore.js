import { applyMiddleware, compose, createStore } from 'redux';
import ReactotronConfig from '../configs/reactotronConfig';
import DebugConfig from '../configs/debugConfig';
import { persistStore, persistReducer } from 'redux-persist';
import ReduxPersistConfig from '../configs/reduxPersistConfig';
import thunkMiddleware from 'redux-thunk';
import rootReducer from './reducers';
import customMiddleware from './middleware';

const { storeConfig, active: shouldPersistStore } = ReduxPersistConfig;

export default preloadedState => {
  const middlewares = [
    ...customMiddleware,
    thunkMiddleware.withExtraArgument({
      serviceInjector: Service => new Service(store),
    }),
  ];
  const middlewareEnhancer = applyMiddleware(...middlewares);

  const enhancers = [
    middlewareEnhancer,
    DebugConfig.useReactotron && ReactotronConfig.createEnhancer(),
  ].filter(Boolean);

  const composedEnhancers = compose(...enhancers);

  const persistedReducer = shouldPersistStore
    ? persistReducer(storeConfig, rootReducer)
    : rootReducer;

  const store = createStore(persistedReducer, preloadedState, composedEnhancers);

  const persistor = shouldPersistStore ? persistStore(store) : undefined;

  if (module.hot) {
    module.hot.accept('./reducers', () => {
      const nextRootReducer = require('./reducers').default;
      store.replaceReducer(persistedReducer(storeConfig, nextRootReducer));
    });
  }

  return { store, persistor };
};
