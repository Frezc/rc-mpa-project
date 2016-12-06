/**
 * Created by Frezc on 2016/11/25.
 */
import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import WrapTable from '../../components/WrapTable';
import { push } from 'react-router-redux';
import { showUserDetail, showCompanyModal, showExpectJobModal, showJobModal, showOrderModal } from '../../actions/common';
import Clickable from '../../../components/Clickable';
import LinkImg from '../../../components/LinkImg';
import { reportType, feedbackStatus, formItemLayout, tailFormItemLayout } from '../../configs/constants';
import { Form, Input, Radio, Button, message } from 'antd';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
import { api, easyPost } from '../../../network';

class ReportsPage extends PureComponent {

  get columns() {
    const { showUserDetail, location: { query } } = this.props;
    return [{
      title: '内容',
      dataIndex: 'content',
      key: 'content',
      render: (v, record) => (
        <div>{v}</div>
      )
    }, {
      title: '发布者',
      dataIndex: 'user_name',
      key: 'user_name',
      render: (v, record) => (
        <Clickable onClick={e => {
          e.stopPropagation();
          showUserDetail(record.user_id)
        }}
        >
          {v}
        </Clickable>
      )
    }, {
      title: '类型',
      dataIndex: 'target_type',
      key: 'target_type',
      render: v => reportType.text[v],
      filters: reportType.filters,
      filterMultiple: false,
      filteredValue: query.target_type ? [query.target_type] : []
    }, {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: v => <span style={{ color: statusColor[v] }}>{feedbackStatus.text[v]}</span>,
      filters: feedbackStatus.filters,
      filterMultiple: false,
      filteredValue: query.status ? [query.status] : [feedbackStatus.filters[0].value]
    }, {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at'
    }, {
      title: '操作',
      key: 'actions',
      render: (_, record) => <Clickable onClick={() => this.showTarget(record.target_type, record.target_id)}>查看举报对象</Clickable>
    }];
  }

  showTarget(type, id) {
    const { showUserDetail, showCompanyModal, showExpectJobModal, showJobModal, showOrderModal } = this.props;
    switch (type) {
      case 'order':
        return showOrderModal(id);
      case 'user':
        return showUserDetail(id);
      case 'company':
        return showCompanyModal(id);
      case 'job':
        return showJobModal(id);
      case 'expect_job':
        return showExpectJobModal(id);
    }
  }

  renderExpandedRow = (record, i) => {
    return <ExpandForm {...record} onUpdated={newRecord => this.table.setLocalData(i, newRecord)}/>
  };

  render() {
    const { location, push } = this.props;

    return (
      <div style={{ margin: 16 }}>
        <WrapTable
          ref={r => this.table = r}
          columns={this.columns}
          dataUrl={api.reports}
          params={location.query}
          location={location}
          push={push}
          expandedRowRender={this.renderExpandedRow}
        />
      </div>
    )
  }
}

class ExpandRow extends PureComponent {

  state = {
    loading: false
  };

  postForm = (e) => {
    e.preventDefault();
    const { form, id, onUpdated } = this.props;

    form.validateFields((err, value) => {
      if (!err) {
        this.setState({ loading: true });
        easyPost(`${api.reports}/${id}`, value)
          .then(json => {
            onUpdated && onUpdated(json);
            message.success('保存成功');
          })
          .catch(() => {})
          .then(() => this.setState({ loading: false }))
      }
    })
  };

  render() {
    const { content, pictures, form, status, message: msg } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Form style={{ maxWidth: 760 }} onSubmit={this.postForm}>
        <FormItem
          {...formItemLayout}
          label="内容"
        >
          <Input value={content} readOnly type="textarea" rows={4}/>
        </FormItem>
        {pictures &&
          <FormItem
            {...formItemLayout}
            label="图片"
          >
            <div>
              {pictures.split(',').map((p, i) => <LinkImg key={i} src={api.host + p} style={styles.img}/>)}
            </div>
          </FormItem>
        }
        <FormItem
          {...formItemLayout}
          label="状态"
        >
          {getFieldDecorator('status', {
            initialValue: String(status)
          })(
            <RadioGroup>
              {feedbackStatus.filters.map((filter) =>
                <RadioButton value={filter.value} key={filter.value}>{filter.text}</RadioButton>
              )}
            </RadioGroup>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="留言"
        >
          {getFieldDecorator('message', {
            initialValue: msg
          })(
            <Input type="textarea" rows={4}/>
          )}
        </FormItem>
        <FormItem
          {...tailFormItemLayout}
        >
          <Button type="primary" htmlType="submit" loading={this.state.loading}>保存</Button>
        </FormItem>
      </Form>
    )
  }
}

const ExpandForm = Form.create()(ExpandRow);

const styles = {
  img: {
    maxWidth: 100,
    maxHeight: 100,
    marginRight: 8
  }
};

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

export default connect(select, { push, showUserDetail, showCompanyModal, showExpectJobModal, showJobModal, showOrderModal })(ReportsPage);
