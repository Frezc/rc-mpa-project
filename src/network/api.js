/**
 * Created by Frezc on 2016/10/12.
 */

const host = '/api_proxy/';

const api = {
  auth: host + 'auth',
  refresh: host + 'refresh',
  users: host + 'users',
  notifications: host + 'notifications',
  messages: host + 'messages',
  self: host + 'self',
  conversations: host + 'conversations'
};

export default api;
