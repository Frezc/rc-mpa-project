/**
 * Created by Frezc on 2016/10/12.
 */

const host = process.env.NODE_ENV == 'production' ? 'http://tjz.frezc.com' : '/api_proxy';

const api = {
  host,
  auth: host + '/auth',
  refresh: host + '/refresh',
  users: host + '/users',
  notifications: host + '/notifications',
  messages: host + '/messages',
  self: host + '/self',
  conversations: host + '/conversations',
  realNameApplies: host + '/real_name_applies',
  imgUpload: host + '/upload/image',
  notiHistory: host + '/notifications/history',
  companyApplies: host + '/company_applies',
  companies: host + '/companies',
  jobs: host + '/jobs',
  orders: host + '/orders',
  expectJobs: host + '/expect_jobs',
  feedbacks: host + '/feedbacks',
  banners: host + '/banners',
  data: host + '/data'
};

export default api;
