/**
 * Created by admin on 2016/10/13.
 */
import Auth from '../../network/Auth';
import api from '../../network/api';
import store from './store';
import { push } from 'react-router-redux';
import { setLogonUser } from '../actions/user';

const jwtAuth = new Auth({ auth: api.auth, refresh: api.refresh });
jwtAuth.on('fetched', json => store.dispatch(setLogonUser(json.user)));
jwtAuth.on('needAuth', () => store.dispatch(push('/login')));
export default jwtAuth;
