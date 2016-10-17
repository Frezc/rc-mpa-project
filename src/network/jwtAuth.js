/**
 * Created by admin on 2016/10/13.
 */
import Auth from './Auth';
import api from '../configs/api'

const jwtAuth = new Auth({ auth: api.auth, refresh: api.refresh });
export default jwtAuth;
