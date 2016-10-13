/**
 * Created by Frezc on 2016/10/12.
 */
import React from 'react';
import AppHeader from '../../components/AppHeader';
import { Menu, Icon } from 'antd';
import auth from '../../helpers/jwtAuth';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';

class NavContainer extends React.Component {

  componentWillMount() {
    if (!auth.check()) {
      this.props.dispatch(replace('/login'));
    }
  }

  render() {
    return (
      <div>
        <AppHeader

        />
        <Icon name="email"/>
      </div>
    )
  }
}

function select(state) {
  return {}
}

export default connect(select)(NavContainer);
