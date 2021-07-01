/**
 * Actions types
 */
export const SET_DATA_TREE = 'SET_DATA_TREE';
export const CLEAR_DATA_TREE = 'CLEAR_DATA_TREE';

/**
 * Initial State
 */
export const datatreeInitialState = {
  colleges: null,
};

/**
 * User Reducer
 */
export const datatreeReducer = (state = datatreeInitialState, action) => {
  switch (action.type) {
    case SET_DATA_TREE:
      return {
        ...state,
        colleges: action.payload,
      };
    case CLEAR_DATA_TREE: {
      return {
        ...state,
        ...datatreeInitialState,
      };
    }

    default:
      return state;
  }
};
