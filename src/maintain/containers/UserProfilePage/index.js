/**
 * Created by Frezc on 2016/10/18.
 */
import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Table } from 'antd';
import { api, easyGet } from '../../../network';

class UserProfilePage extends PureComponent {

  static pageSize = 20;

  state = {
    loading: false,
    total: 0,
    list: []
  };

  fetchData(page = 0) {
    this.setState({ loading: true });
    const { pageSize } = UserProfilePage;
    easyGet(api.users, {
      off: page * pageSize,
      siz: pageSize
    }).then(json => this.setState(json))
      .catch(() => {})
      .then(() => this.setState({ loading: false }));
  }

  onPageChange = (page) => {
    this.fetchData(page - 1);
  }

  componentWillMount() {
    this.fetchData();
  }

  componentWillUnmount() {
    console.log('user unmount', this.props.router);
  }

  render() {
    const { loading, list, total } = this.state;

    return (
      <div style={{ margin: 16 }}>
        <Table
          columns={columns}
          loading={loading}
          rowKey={user => user.id}
          dataSource={list}
          expandedRowRender={(record) => <p>{'1123'}</p>}
          onExpandedRowsChange={expandedRows => console.log(expandedRows)}
          pagination={{
            total,
            pageSize: 20,
            showQuickJumper: true,
            onChange: this.onPageChange
          }}
        />
      </div>
    )
  }
}

const columns = [{
  title: 'Id',
  dataIndex: 'id',
  key: 'id',
  width: 64
}, {
  title: 'Avatar',
  dataIndex: 'avatar',
  key: 'avatar',
  render(value, row, index) {
    return value;
  }
}, {
  title: 'Email',
  dataIndex: 'email',
  key: 'email'
}, {
  title: 'Phone',
  dataIndex: 'phone',
  key: 'phone'
}, {
  title: 'Nickname',
  dataIndex: 'nickname',
  key: 'nickname'
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

export default connect(select)(UserProfilePage);
