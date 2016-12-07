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
import { Modal, message, Button } from 'antd';
// import OperationLogs from '../../components/OperationLogs';

class UserProfilePage extends PureComponent {

  state = {
    showLogs: false,
    showUserId: -1,
    selecting: false,
    selectedRowKeys: []
  };

  get columns() {
    const { showCompanyModal } = this.props;
    const { role_name } = this.props.location.query;

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
      filters: userRole.filters,
      filteredValue: role_name || [],
      filterMultiple: false,
      render: v => <span style={v == 'banned' ? { color: 'red' } : {}}>{userRole.text[v]}</span>
    }, {
      title: '操作',
      key: 'actions',
      render: (_, record, i) => this.renderAction(record, i)
    }]
  }

  get rowSelection() {
    const { selectedRowKeys } = this.state;
    return {
      selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({ selectedRowKeys })
      }
    }
  }

  handleRowClick = (record, index) => {
    this.props.showUserDetail(record.id);
  };

  handleModalCancel = () => {
    this.setState({
      showLogs: false
    })
  };

  handleSendNotification = () => {
    const { push } = this.props;
    const { selectedRowKeys } = this.state;
    if (selectedRowKeys.length > 0) {
      push({ pathname: '/m/ac/notifications', state: { selectedUsers: selectedRowKeys } })
    } else {
      message.warn('请至少选择一位用户')
    }
  };

  showLogs(user_id) {
    this.setState({
      showLogs: true,
      showUserId: user_id
    });
  }

  setRole(id, role, i) {
    Modal.confirm({
      title: role == 'banned' ? '你确定要封禁该用户？' : '你确定恢复该用户的权限？',
      onOk: () => easyPost(`${api.users}/${id}/role`, { role })
        .then(json => {
          this.table.setLocalData(i, json);
          message.success('操作成功');
        })
        .catch(() => {
        })
    })
  }

  renderAction(record, i) {
    const result = [
      // <Clickable key="op" onClick={e => {
      //   e.stopPropagation();
      //   this.showLogs(record.id)
      // }}>操作记录</Clickable>
    ];
    switch (record.role_name) {
      case 'user':
        result.push(
          // <span className="ant-divider" key="di"/>,
          <Clickable
            key="action"
            style={{ color: 'red' }}
            onClick={e => {
              e.stopPropagation();
              this.setRole(record.id, 'banned', i)
            }}>
            封禁
          </Clickable>
        );
        break;
      case 'banned':
        result.push(
          // <span className="ant-divider" key="di"/>,
          <Clickable
            key="action"
            onClick={e => {
              e.stopPropagation();
              this.setRole(record.id, 'user', i)
            }}>
            恢复
          </Clickable>
        );
        break;
    }

    return result;
  }

  renderOtherAction() {
    const { selecting, selectedRowKeys } = this.state;
    return (
      <div style={{ position: 'absolute', right: 0, top: 0 }}>
        {selecting ?
          <div>
            {`已选择了${selectedRowKeys.length}位用户`}
            <Button type="primary" style={{ marginLeft: 8, marginRight: 8 }} onClick={this.handleSendNotification}>发送通知</Button>
            <Button type="ghost" onClick={() => this.setState({ selecting: false, selectedRowKeys: [], selectedRows: [] })}>取消</Button>
          </div> :
          <Button type="primary" onClick={() => this.setState({ selecting: true })}>选择用户</Button>
        }
      </div>
    )
  }

  render() {
    const { location, push } = this.props;
    const { selecting } = this.state;

    return (
      <div style={{ margin: 16, position: 'relative' }}>
        <Filters style={{ marginBottom: 8 }} filters={['kw']}/>
        <WrapTable
          ref={r => this.table = r}
          columns={this.columns}
          dataUrl={api.users}
          params={location.query}
          location={location}
          onRowClick={this.handleRowClick}
          push={push}
          rowSelection={selecting ? this.rowSelection : null}
        />
        {this.renderOtherAction()}
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
