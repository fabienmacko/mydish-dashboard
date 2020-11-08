/**
 * Initial State
 */
const initialState = {
  foods: [],
  dishs: [],
  commands: [],
};

/**
 * Types
 */
export const UPDATE_FOODS = 'UPDATE_FOODS';



/**
 * Traitements
 */

/**
 * Reducer
 */
const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case UPDATE_FOODS:
      return {
        ...state,
        foods: action.foods,
      };

    default:
      return state;
  }
};

/**
 * Action Creators
 */


export const updateFoods = foods => ({
  type: UPDATE_FOODS,
  foods
})




/**
 * Selectors
 */

/**
 * Export
 */
export default reducer;