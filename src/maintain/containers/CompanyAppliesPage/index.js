/**
 * Created by Frezc on 2016/11/19.
 */
import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { api, easyPost } from '../../../network';
import WrapTable from '../../components/WrapTable';
import { push } from 'react-router-redux';
import Clickable from '../../../components/Clickable';
import { showUserDetail } from '../../actions/common';
import { formItemLayout, statusText, statusFilters } from '../../configs/constants';
import LinkImg from '../../../components/LinkImg';
import { Form, Input, Modal } from 'antd';
const FormItem = Form.Item;
const confirm = Modal.confirm;
import Filters from '../../components/Filters';
import RejModal from '../../components/RejectModal';

import './style.scss';

class CompanyAppliesPage extends PureComponent {

  get columns() {
    const { status } = this.props.location.query;

    return [{
      title: 'id',
      dataIndex: 'id',
      key: 'id'
    }, {
      title: '公司名',
      dataIndex: 'name',
      key: 'name',
      render: (value, record) => <a href={record.url} target="_blank">{value}</a>
    }, {
      title: '地址',
      dataIndex: 'address',
      key: 'address'
    }, {
      title: '申请者',
      dataIndex: 'user_name',
      key: 'user_name',
      render: (value, record) => <Clickable onClick={() => this.props.showUserDetail(record.user_id)}>{value}</Clickable>
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
      onOk: () => easyPost(`${api.companyApplies}/${id}`, {
        action: 'acc'
      }).then(json => this.table.setLocalData(index, json))
        .catch(() => {})
    })
  }

  rejectApply(id, index) {
    this.rejModal.show({
      onOk: (reason) => easyPost(`${api.companyApplies}/${id}`, {
        action: 'rej',
        reason: reason
      }).then(json => this.table.setLocalData(index, json))
    });
  }

  renderExpandedRow = record => {

    return (
      <div className="expanded-row">
        <LinkImg src={api.host + record.business_license} alt="营业执照" className="picture"/>
        <Form className="detail-form">
          <FormItem
            {...formItemLayout}
            label="企业名"
          >
            <Input value={record.name} readOnly/>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="企业主页"
          >
            <Input value={record.url} readOnly/>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="地址"
          >
            <Input value={record.address} readOnly/>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="联系人"
          >
            <Input value={record.contact_person} readOnly/>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="联系方式"
          >
            <Input value={record.contact} readOnly/>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="描述"
          >
            <Input type="textarea" rows={4} value={record.description}/>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="logo"
          >
            <LinkImg src={api.host + record.logo} className="company-logo"/>
          </FormItem>
        </Form>
      </div>
    )
  };

  render() {
    const { location, push } = this.props;

    return (
      <div className="company-applies">
        <Filters style={{ marginBottom: 8 }}/>
        <WrapTable
          ref={r => this.table = r}
          dataUrl={api.companyApplies}
          location={location}
          params={location.query}
          push={push}
          columns={this.columns}
          expandedRowRender={this.renderExpandedRow}
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

export default connect(select, { push, showUserDetail })(CompanyAppliesPage);
