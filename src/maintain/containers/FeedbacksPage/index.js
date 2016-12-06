/**
 * Created by Frezc on 2016/11/25.
 */
import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import WrapTable from '../../components/WrapTable';
import { push } from 'react-router-redux';
import { showUserDetail } from '../../actions/common';
import Clickable from '../../../components/Clickable';
import LinkImg from '../../../components/LinkImg';
import { feedbackType, feedbackStatus, formItemLayout, tailFormItemLayout } from '../../configs/constants';
import { Form, Input, Radio, Button, message } from 'antd';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
import { api, easyPost } from '../../../network';

class FeedbacksPage extends PureComponent {

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
      dataIndex: 'type',
      key: 'type',
      render: v => feedbackType.text[v],
      filters: feedbackType.filters,
      filterMultiple: false,
      filteredValue: query.type ? [query.type] : []
    }, {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: v => <span style={{ color: statusColor[v] }}>{feedbackStatus.text[v]}</span>,
      filters: feedbackStatus.filters,
      filterMultiple: false,
      filteredValue: query.status ? [query.status] : [feedbackType.filters[0].value]
    }, {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at'
    }];
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
          dataUrl={api.feedbacks}
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
        easyPost(`${api.feedbacks}/${id}`, value)
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
    const { content, p1, p2, p3, p4, p5, form, type, status, message: msg } = this.props;
    const { getFieldDecorator } = form;
    const pictures = [p1, p2, p3, p4, p5];

    return (
      <Form style={{ maxWidth: 760 }} onSubmit={this.postForm}>
        <FormItem
          {...formItemLayout}
          label="内容"
        >
          <Input value={content} readOnly type="textarea" rows={4}/>
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="图片"
        >
          <div>
            {pictures.map((p, i) => <LinkImg key={i} src={api.host + p} style={styles.img}/>)}
          </div>
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="类型"
        >
          {getFieldDecorator('type', {
            initialValue: String(type)
          })(
            <RadioGroup>
              {feedbackType.filters.map((filter) =>
                <RadioButton value={filter.value} key={filter.value}>{filter.text}</RadioButton>
              )}
            </RadioGroup>
          )}
        </FormItem>
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

export default connect(select, { push, showUserDetail })(FeedbacksPage);
