/**
 * Created by Frezc on 2016/10/18.
 */
import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { api, easyPost } from '../../../network';
import WrapTable from '../../components/WrapTable';
import { showUserDetail, showCompanyModal } from '../../actions/common';
import { push } from 'react-router-redux';
import Clickable from '../../../components/Clickable';
import Filters from '../../components/Filters';
import { userRole } from '../../configs/constants';
import { Modal, message } from 'antd';

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
    }, {
      title: '权限',
      dataIndex: 'role_name',
      key: 'role_name',
      render: v => <span style={v == 'banned' ? { color: 'red' } : {}}>{userRole.text[v]}</span>
    }, {
      title: '操作',
      key: 'actions',
      render: (_, record, i) => this.renderAction(record, i)
    }]
  }

  handleRowClick = (record, index) => {
    this.props.showUserDetail(record.id);
  };

  setRole(id, role, i) {
    Modal.confirm({
      title: role == 'banned' ? '你确定要封禁该用户？' : '你确定恢复该用户的权限？',
      onOk: () => easyPost(`${api.users}/${id}/role`, { role })
        .then(json => {
          this.table.setLocalData(i, json);
          message.success('操作成功');
        })
        .catch(() => {})
    })
  }

  renderAction(record, i) {
    switch (record.role_name) {
      case 'user':
        return (
          <Clickable onClick={e => {
            e.stopPropagation();
            this.setRole(record.id, 'banned', i)
          }}>封禁</Clickable>
        );
      case 'banned':
        return (
          <Clickable onClick={e => {
            e.stopPropagation();
            this.setRole(record.id, 'user', i)
          }}>恢复</Clickable>
        );
    }
  }

  render() {
    const { location, push } = this.props;

    return (
      <div style={{ margin: 16 }}>
        <Filters style={{ marginBottom: 8 }} filters={['kw']}/>
        <WrapTable
          ref={r => this.table = r}
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
