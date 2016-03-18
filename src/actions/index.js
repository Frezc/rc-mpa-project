import { TEXT_CHANGE } from '../constants/actionTypes';

/** action creator **/
export function textChange (text) {
	return {
		type: TEXT_CHANGE,
		text: text
	}
}