/**
 * Actions types
 */
export const SET_COLLEGE_TREE = 'SET_COLLEGE_TREE';
export const CLEAR_COLLEGE_TREE = 'CLEAR_COLLEGE_TREE';

/**
 * Initial State
 */
export const collegeTreeInitialState = {
  defaultExpanded: ['allColleges', '605a4638198e3f5b2e715c8c'], // colleges and IGNOU
};

/**
 * CollegeTree Reducer
 */
export const collegeTreeReducer = (state = collegeTreeInitialState, action) => {
  switch (action.type) {
    case SET_COLLEGE_TREE:
      return {
        ...state,
        defaultExpanded: action.payload,
      };
    case CLEAR_COLLEGE_TREE: {
      return {
        ...state,
        ...collegeTreeInitialState,
      };
    }

    default:
      return state;
  }
};
