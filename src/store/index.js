    
/*
 * Npm import
 */
import { createStore } from 'redux';

/*
 * Local import
 */
// Reducer
import reducer from './reducer';
/*
 * Code
 */
const devTools = [];
if (window.__REDUX_DEVTOOLS_EXTENSION__) {
  devTools.push(window.__REDUX_DEVTOOLS_EXTENSION__());
}


// createStore
const store = createStore(reducer);

/*
 * Export
 */
export default store;