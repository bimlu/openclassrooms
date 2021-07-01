/**
 * Actions types
 */
export const SET_DELETING = 'SET_DELETING';
export const CLEAR_DELETING = 'CLEAR_DELETING';

/**
 * Initial State
 */
export const deletingInitialState = {
  deleting: false,
};

/**
 * Uplading Reducer
 */
export const deletingReducer = (state = deletingInitialState, action) => {
  switch (action.type) {
    case SET_DELETING:
      return {
        ...state,
        deleting: action.payload,
      };
    case CLEAR_DELETING: {
      return {
        ...state,
        ...deletingInitialState,
      };
    }

    default:
      return state;
  }
};
