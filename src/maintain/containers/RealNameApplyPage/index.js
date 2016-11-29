/**
 * Created by Frezc on 2016/11/14.
 */
import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { api, easyPost } from '../../../network';
import WrapTable from '../../components/WrapTable';
import Filters from '../../components/Filters';
import { Form, Input, Modal } from 'antd';
const FormItem = Form.Item;
const confirm = Modal.confirm;
import Clickable from '../../../components/Clickable';
import LinkImg from '../../../components/LinkImg';
import { push } from 'react-router-redux';
import { showUserDetail } from '../../actions/common';
import { formItemLayout, statusText, statusFilters } from '../../configs/constants';
import RejModal from '../../components/RejectModal';

import './style.scss';

class RealNameApplyPage extends PureComponent {

  state = {
    reason: ''
  };

  get columns() {
    const { status } = this.props.location.query;

    return [{
      title: '用户id',
      dataIndex: 'user_id',
      key: 'user_id'
    }, {
      title: '用户名',
      dataIndex: 'user_name',
      key: 'user_name',
      render: (value, record) => <Clickable
        onClick={() => this.props.showUserDetail(record.user_id)}>{value}</Clickable>
    }, {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      filteredValue: status ? status.split(',') : ['1'],
      filters: statusFilters,
      filterMultiple: false,
      render: (value) => <span style={{ color: statusColor[value] }}>{statusText[value]}</span>
    }, {
      title: '申请时间',
      dataIndex: 'created_at',
      key: 'created_at'
    }, {
      title: '操作',
      key: 'action',
      render: (_, record, index) => (
        record.status == 1 ?
          <span>
            <Clickable onClick={() => this.acceptApply(record.id, index)}>通过</Clickable>
            <span className="ant-divider"/>
            <Clickable style={{ color: 'red' }} onClick={() => this.rejectApply(record.id, index)}>拒绝</Clickable>
          </span> :
          '-'
      )
    }];
  }

  acceptApply(id, index) {
    confirm({
      title: '确定要通过该申请？',
      onOk: () => easyPost(`${api.realNameApplies}/${id}`, {
        action: 'acc'
      }).then(json => this.table.setLocalData(index, json))
        .catch(() => {
        })
    })
  }

  rejectApply(id, index) {
    this.rejModal.show({
      onOk: (reason) => easyPost(`${api.realNameApplies}/${id}`, {
        action: 'rej',
        reason: reason
      }).then(json => this.table.setLocalData(index, json))
    });
  }

  renderExpandedRow = (record) => {

    return (
      <div className="expanded-row">
        <LinkImg src={api.host + record.verifi_pic} alt="验证照片" className="picture"/>
        <Form className="detail-form">
          <FormItem
            {...formItemLayout}
            label="姓名"
          >
            <Input value={record.real_name} readOnly/>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="身份证号"
          >
            <Input value={record.id_number} readOnly/>
          </FormItem>
        </Form>
      </div>
    )
  };

  render() {
    const { location, push } = this.props;

    return (
      <div className="real-name-applies">
        <Filters style={{ marginBottom: 8 }}/>
        <WrapTable
          ref={r => this.table = r}
          params={location.query}
          columns={this.columns}
          expandedRowRender={this.renderExpandedRow}
          dataUrl={api.realNameApplies}
          push={push}
          location={location}
        />
        <RejModal ref={r => this.rejModal = r}/>
      </div>
    )
  }
}

const statusColor = {
  1: 'red',
  2: 'green',
  3: 'gray'
};

function select(state, ownProps) {
  return {
    location: state.router.locationBeforeTransitions
  }
}

export default connect(select, { push, showUserDetail })(RealNameApplyPage);
