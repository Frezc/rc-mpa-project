/** state tree
	{
		text: 'Hello World!'
	}
**/

import { combineReducers } from 'redux';
import { TEXT_CHANGE } from '../constants/actionTypes';

/** reducers **/
function text (state='Hello World!', action) {
	switch(action.type) {
		case TEXT_CHANGE:
			return action.text;
		default:
			return state;
	}
}

const rootRuducer = combineReducers({
	text
});

export default rootRuducer;