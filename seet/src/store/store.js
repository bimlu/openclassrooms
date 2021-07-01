import React, { createContext, useContext, useReducer } from 'react';
import { messageReducer, messageInitialState } from './message';
import { authReducer, authInitialState } from './auth';
import { uploadingReducer, uploadingInitialState } from './uploading';
import { deletingInitialState, deletingReducer } from './deleting';
import { datatreeInitialState, datatreeReducer } from './datatree';
import { statusInitialState, statusReducer } from './status';
import { routeInitialState, routeReducer } from './route';
import { collegeTreeInitialState, collegeTreeReducer } from './collegeTree';

/**
 * React context for store
 */
const StoreContext = createContext();

/**
 * Combine initial states
 */
const store = {
  message: messageInitialState,
  auth: authInitialState,
  uploading: uploadingInitialState,
  deleting: deletingInitialState,
  datatree: datatreeInitialState,
  status: statusInitialState,
  route: routeInitialState,
  collegeTree: collegeTreeInitialState,
};

/**
 * Combine reducers
 */
const reducers = (store, action) => ({
  message: messageReducer(store.message, action),
  auth: authReducer(store.auth, action),
  uploading: uploadingReducer(store.uploading, action),
  deleting: deletingReducer(store.deleting, action),
  datatree: datatreeReducer(store.datatree, action),
  status: statusReducer(store.status, action),
  route: routeReducer(store.route, action),
  collegeTree: collegeTreeReducer(store.collegeTree, action),
});

/**
 * Store context provider
 */
export const StoreProvider = ({ children }) => (
  <StoreContext.Provider value={useReducer(reducers, store)}>{children}</StoreContext.Provider>
);

/**
 * React hook for consuming store
 */
export const useStore = () => useContext(StoreContext);
