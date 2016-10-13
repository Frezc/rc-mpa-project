/**
 * Created by admin on 2016/10/13.
 */
import Auth from './Auth';
import api from '../configs/api'

export default new Auth({ auth: api.auth, refresh: api.refresh });
