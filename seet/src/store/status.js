/**
 * Actions types
 */
export const SET_UPLOADING = 'SET_UPLOADING';
export const CLEAR_UPLOADING = 'CLEAR_UPLOADING';
export const SET_DELETING = 'SET_DELETING';
export const CLEAR_DELETING = 'CLEAR_DELETING';

/**
 * Initial State
 */
export const statusInitialState = {
  uploading: null,
  deleting: null,
};

/**
 * Status Reducer
 */
export const statusReducer = (state = statusInitialState, action) => {
  switch (action.type) {
    case SET_UPLOADING:
      return {
        ...state,
        uploading: action.payload,
      };
    case CLEAR_UPLOADING: {
      return {
        ...state,
        ...{ uploading: null },
      };
    }
    case SET_DELETING:
      return {
        ...state,
        deleting: action.payload,
      };
    case CLEAR_DELETING: {
      return {
        ...state,
        ...{ deleting: null },
      };
    }

    default:
      return state;
  }
};
