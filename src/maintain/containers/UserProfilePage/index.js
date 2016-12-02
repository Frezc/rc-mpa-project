/**
 * Created by Frezc on 2016/10/18.
 */
import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { api } from '../../../network';
import WrapTable from '../../components/WrapTable';
import { showUserDetail, showCompanyModal } from '../../actions/common';
import { push } from 'react-router-redux';
import Clickable from '../../../components/Clickable';
import Filters from '../../components/Filters';

class UserProfilePage extends PureComponent {

  get columns() {
    const { showCompanyModal } = this.props;

    return [{
      title: 'id',
      dataIndex: 'id',
      key: 'id',
      width: 64
    }, {
      title: '昵称',
      dataIndex: 'nickname',
      key: 'nickname'
    }, {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email'
    }, {
      title: '手机',
      dataIndex: 'phone',
      key: 'phone'
    }, {
      title: '性别',
      dataIndex: 'sex',
      key: 'sex',
      render(value) {
        return value ? '女' : '男'
      }
    }, {
      title: '公司',
      dataIndex: 'company_id',
      key: 'company_id',
      render: (v, record) => v ?
        <Clickable onClick={e => {
          e.stopPropagation();
          showCompanyModal(v);
        }}>{record.company_name}</Clickable> :
        '-'
    }, {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at'
    }]
  }

  handleRowClick = (record, index) => {
    this.props.showUserDetail(record.id);
  };

  render() {
    const { location, push } = this.props;

    return (
      <div style={{ margin: 16 }}>
        <Filters style={{ marginBottom: 8 }} filters={['kw']}/>
        <WrapTable
          columns={this.columns}
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

function select(state, ownProps) {
  return {
    location: state.router.locationBeforeTransitions
  }
}

export default connect(select, { showCompanyModal, showUserDetail, push })(UserProfilePage);
