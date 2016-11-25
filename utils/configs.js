/**
 * Created by Frezc on 2016/10/12.
 */

var configs = {
  pages: {
    maintain: {
      name: 'maintain',
      vendor: 'vendor_web'
    },
    msg_center: {
      name: 'msg_center',
      vendor: 'vendor_lite'
    }
  },
  libs: {
    vendor_web: [
      'react',
      'react-dom',
      'react-router',
      'babel-polyfill',
      'react-redux',
      'react-router-redux',
      'redux',
      'redux-logger',
      'redux-thunk',
      'validator',
      'moment'
    ],
    vendor_lite: [
      'react',
      'react-dom',
      'react-router'
    ]
  }
};

configs.defaultPage = configs.pages.maintain;

module.exports = configs;
