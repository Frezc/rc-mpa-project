/**
 * Created by Frezc on 2016/10/18.
 */
import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { api } from '../../../network';
import WrapTable from '../../components/WrapTable';
import { showUserDetail } from '../../actions/common';
import { push } from 'react-router-redux';

class UserProfilePage extends PureComponent {

  handleRowClick = (record, index) => {
    this.props.showUserDetail(record.id);
  };

  render() {
    const { location, push } = this.props;

    return (
      <div style={{ margin: 16 }}>
        <WrapTable
          columns={columns}
          dataUrl={api.users}
          params={location.query}
          location={location}
          onRowClick={this.handleRowClick}
          push={push}
        />
      </div>
    )
  }
}

const columns = [{
  title: 'id',
  dataIndex: 'id',
  key: 'id',
  width: 64
}, {
  title: 'Nickname',
  dataIndex: 'nickname',
  key: 'nickname'
}, {
  title: 'Email',
  dataIndex: 'email',
  key: 'email'
}, {
  title: 'Phone',
  dataIndex: 'phone',
  key: 'phone'
}, {
  title: 'Sex',
  dataIndex: 'sex',
  key: 'sex',
  render(value) {
    return value ? '女' : '男'
  }
}, {
  title: 'Created at',
  dataIndex: 'created_at',
  key: 'created_at'
}]

function select(state, ownProps) {
  return {
    location: state.router.locationBeforeTransitions
  }
}

export default connect(select, { showUserDetail, push })(UserProfilePage);
