/**
 * Created by Frezc on 2016/11/19.
 */
import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { api } from '../../../network';
import WrapTable from '../../components/WrapTable';
import { push } from 'react-router-redux';
import Clickable from '../../../components/Clickable';
import { showUserDetail } from '../../actions/common';
import { formItemLayout, tailFormItemLayout, statusText, statusFilters } from '../../configs/constants';
import LinkImg from '../../../components/LinkImg';
import { Form, Input, Button } from 'antd';
const FormItem = Form.Item;
import EasyImgUpload from '../../../components/EasyImgUpload';
import auth from '../../configs/jwtAuth';
import Filters from '../../components/Filters';

import './style.scss';

class CompanyAppliesPage extends PureComponent {

  columns = [{
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
    this.columns[4].filteredValue = status ? status.split(',') : ['1']
  }

  renderExpandedRow = record => {
    const token = auth.getToken();

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
            label="备注"
          >
            <Input type="textarea" rows={4} value={record.message}/>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="logo"
          >
            <EasyImgUpload
              name="file"
              action={api.imgUpload}
              token={token}
              imgUrl={record.logo}
            />
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
      <div className="company-applies">
        <Filters style={{ marginBottom: 8 }}/>
        <WrapTable
          dataUrl={api.companyApplies}
          location={location}
          params={location.query}
          push={push}
          columns={this.columns}
          expandedRowRender={this.renderExpandedRow}
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

export default connect(select, { push, showUserDetail })(CompanyAppliesPage);
