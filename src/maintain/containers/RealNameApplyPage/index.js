/**
 * Created by Frezc on 2016/11/14.
 */
import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { api } from '../../../network';
import WrapTable from '../../components/WrapTable';
import { Button, Form, Input } from 'antd';
const FormItem = Form.Item;
import Clickable from '../../../components/Clickable';
import LinkImg from '../../../components/LinkImg';
import { push } from 'react-router-redux';
import { showUserDetail } from '../../actions/common';
import { objectFilter } from '../../../helpers';

import './style.scss';

class RealNameApplyPage extends PureComponent {

  state = {
    filters: {
      user_id: ''
    }
  };

  columns = [{
    title: '用户id',
    dataIndex: 'user_id',
    key: 'user_id',
    filterType: 'InputNumber'
  }, {
    title: '用户名',
    dataIndex: 'user_name',
    key: 'user_name',
    render: (value, record) => <Clickable onClick={() => this.props.showUserDetail(record.user_id)}>{value}</Clickable>
  }, {
    title: '状态',
    dataIndex: 'is_examined',
    key: 'is_examined',
    filters: [{
      text: '未审核',
      value: '0'
    }, {
      text: '已通过',
      value: '1'
    }, {
      text: '已拒绝',
      value: '2'
    }],
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
    const { is_examined } = this.props.location.query;
    this.columns[2].filteredValue = is_examined ? is_examined.split(',') : ['0']
  }

  setFilter(obj) {
    this.setState((prevState) => ({
      filters: Object.assign({}, prevState.filters, obj)
    }))
  }

  handleSubmit = e => {
    e.preventDefault();
    const { push, location } = this.props;
    const { pathname, query } = location;
    console.log(this.state);
    push({
      pathname, query: objectFilter(Object.assign({}, query, this.state.filters), (_, v) => v)
    });
  };

  setOtherFilter(props = this.props) {
    const { user_id } = props.location.query;
    this.setFilter({ user_id });
  }

  componentWillMount() {
    this.setOtherFilter();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.location != nextProps.location) {
      this.setOtherFilter(nextProps)
    }
  }

  renderExpandedRow = (record) => {

    return (
      <div className="expanded-row">
        <LinkImg src={api.host + record.verifi_pic} alt="验证照片" className="picture"/>
        <Form horizontal className="detail-form">
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
            <Input type="textarea" rows={4}/>
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
    const { user_id } = this.state.filters;
    this.setTableFilter();

    return (
      <div className="real-name-applies">
        <Form inline style={{ marginBottom: 16 }} onSubmit={this.handleSubmit}>
          <FormItem
            label="用户id"
          >
            <Input
              size="default"
              value={user_id}
              onChange={e => {
                console.log('change', e);
                this.setFilter({ user_id: e.target.value.replace(/[^0-9]*/g, '') })
              }}
            />
          </FormItem>
        </Form>
        <WrapTable
          params={location.query}
          columns={this.columns}
          expandedRowRender={this.renderExpandedRow}
          dataUrl={api.realNameApplies}
          push={push}
          pathname={location.pathname}
        />
      </div>
    )
  }
}

const statusText = {
  0: '未审核',
  1: '已通过',
  2: '已拒绝',
  3: '已取消'
};

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};
const tailFormItemLayout = {
  wrapperCol: {
    span: 14,
    offset: 6,
  },
};

function select(state, ownProps) {
  return {
    location: state.router.locationBeforeTransitions
  }
}

export default connect(select, { push, showUserDetail })(RealNameApplyPage);
