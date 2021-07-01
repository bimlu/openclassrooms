/**
 * Actions types
 */
export const SET_UPLOADING = 'SET_UPLOADING';
export const CLEAR_UPLOADING = 'CLEAR_UPLOADING';

/**
 * Initial State
 */
export const uploadingInitialState = {
  uploading: false,
};

/**
 * Uplading Reducer
 */
export const uploadingReducer = (state = uploadingInitialState, action) => {
  switch (action.type) {
    case SET_UPLOADING:
      return {
        ...state,
        uploading: action.payload,
      };
    case CLEAR_UPLOADING: {
      return {
        ...state,
        ...uploadingInitialState,
      };
    }

    default:
      return state;
  }
};
