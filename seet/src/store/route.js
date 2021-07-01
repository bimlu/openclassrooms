/**
 * Actions types
 */
export const SET_EXPLORE_ROUTE = 'SET_EXPLORE_ROUTE';
export const CLEAR_EXPLORE_ROUTE = 'CLEAR_EXPLORE_ROUTE';
export const SET_PEOPLE_ROUTE = 'SET_PEOPLE_ROUTE';
export const CLEAR_PEOPLE_ROUTE = 'CLEAR_PEOPLE_ROUTE';

import * as Routes from 'routes';

/**
 * Initial State
 */
export const routeInitialState = {
  explore: Routes.EXPLORE,
  people: Routes.PEOPLE,
};

/**
 * Route Reducer
 */
export const routeReducer = (state = routeInitialState, action) => {
  switch (action.type) {
    case SET_EXPLORE_ROUTE:
      return {
        ...state,
        explore: action.payload,
      };
    case CLEAR_EXPLORE_ROUTE: {
      return {
        ...state,
        ...{ explore: Routes.EXPLORE },
      };
    }
    case SET_PEOPLE_ROUTE:
      return {
        ...state,
        people: action.payload,
      };
    case CLEAR_PEOPLE_ROUTE: {
      return {
        ...state,
        ...{ people: Routes.PEOPLE },
      };
    }

    default:
      return state;
  }
};
