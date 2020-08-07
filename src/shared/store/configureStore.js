import { applyMiddleware, compose, createStore } from 'redux';
import Reactotron from '../../ReactotronConfig';
import thunkMiddleware from 'redux-thunk';
import rootReducer from './reducers';

export default (preloadedState) => {
  const middlewares = [
    thunkMiddleware.withExtraArgument({
      serviceInjector: (Service) => new Service(store),
    }),
  ];
  const middlewareEnhancer = applyMiddleware(...middlewares);

  const enhancers = [middlewareEnhancer, Reactotron.createEnhancer()];
  const composedEnhancers = compose(...enhancers);

  const store = createStore(rootReducer, preloadedState, composedEnhancers);

  if (module.hot) {
    module.hot.accept('./reducers', () => store.replaceReducer(rootReducer));
  }

  return store;
};
