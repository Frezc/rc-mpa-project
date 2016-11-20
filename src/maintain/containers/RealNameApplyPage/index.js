/**
 * Created by Frezc on 2016/11/14.
 */
import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { api } from '../../../network';
import WrapTable from '../../components/WrapTable';
import Filters from '../../components/Filters';
import { Button, Form, Input } from 'antd';
const FormItem = Form.Item;
import Clickable from '../../../components/Clickable';
import LinkImg from '../../../components/LinkImg';
import { push } from 'react-router-redux';
import { showUserDetail } from '../../actions/common';
import { formItemLayout, tailFormItemLayout, statusText, statusFilters } from '../../configs/constants';

import './style.scss';

class RealNameApplyPage extends PureComponent {

  columns = [{
    title: '用户id',
    dataIndex: 'user_id',
    key: 'user_id'
  }, {
    title: '用户名',
    dataIndex: 'user_name',
    key: 'user_name',
    render: (value, record) => <Clickable onClick={() => this.props.showUserDetail(record.user_id)}>{value}</Clickable>
  }, {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    filters: statusFilters,
    filterMultiple: false,
    render: (value) => statusText[value]
  }, {
    title: '申请时间',
    dataIndex: 'created_at',
    key: 'created_at'
  }, {
    title: '操作',
    key: 'action',
    width: 256,
    render: (_, record) => (
      <span>
        <Clickable>通过</Clickable>
        <span className="ant-divider"/>
        <Clickable style={{ color: 'red' }}>拒绝</Clickable>
      </span>
    )
  }];

  setTableFilter() {
    const { status } = this.props.location.query;
    this.columns[2].filteredValue = status ? status.split(',') : ['1']
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
          <FormItem
            {...formItemLayout}
            label="备注"
          >
            <Input type="textarea" rows={4} value={record.message}/>
          </FormItem>
          <FormItem
            {...tailFormItemLayout}
          >
            <Button type="primary">保存</Button>
          </FormItem>
        </Form>
      </div>
    )
  };

  render() {
    const { location, push } = this.props;
    this.setTableFilter();

    return (
      <div className="real-name-applies">
        <Filters style={{ marginBottom: 8 }}/>
        <WrapTable
          params={location.query}
          columns={this.columns}
          expandedRowRender={this.renderExpandedRow}
          dataUrl={api.realNameApplies}
          push={push}
          location={location}
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

export default connect(select, { push, showUserDetail })(RealNameApplyPage);
