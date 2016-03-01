import { TEXT_CHANGE } from './actionTypes';

/** action creator **/
export function textChange (text) {
	return {
		type: TEXT_CHANGE,
		text: text
	}
}