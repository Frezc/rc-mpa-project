/**
 * Created by Frezc on 2016/10/12.
 */

module.exports = {
  pages: {
    maintain: {
      name: 'maintain',
      vendor: 'vendor_web'
    },
    messages: {
      name: 'messages',
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
      'validator'
    ],
    vendor_lite: [
      'react',
      'react-dom',
      'react-router'
    ]
  }
}