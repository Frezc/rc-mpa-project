/**
 * Created by Frezc on 2016/11/18.
 */
import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Tabs, Form, Input, Select, Button, message, Tooltip, Tag, Popover } from 'antd';
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
import { formItemLayout, tailFormItemLayout } from '../../configs/constants';
import { easyJsonPost, api } from '../../../network';
import WrapTable from '../../components/WrapTable';
import { push } from 'react-router-redux';
import ReadOnlyTextarea from '../../../components/ReadOnlyTextarea'
import Clickable from '../../../components/Clickable';

class NotificationsPage extends PureComponent {

  state = {
    sending: false
  };

  sendNotification = () => {
    const { state } = this.props.location;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const params = values;
        if (state && state.selectedUsers) {
          Object.assign(params, { target: state.selectedUsers });
        }
        console.log('validate', params);
        this.setState({ sending: true });
        easyJsonPost(api.notifications, params)
          .then(res => {
            message.success(res);
            this.props.form.resetFields();
          })
          .catch(() => {
          })
          .then(() => this.setState({ sending: false }));
      }
    })
  };

  changeTab = tab => {
    const { push, location } = this.props;
    const { query } = location;
    push({ ...location, query: Object.assign({}, query, { tab }) });
  };

  shouldRefresh = (currentProps, nextProps) => {
    return nextProps.params.tab == '2' && currentProps.params != nextProps.params;
  };

  componentDidMount() {
    const content = localStorage.getItem('notification_content');
    content && this.props.form.setFieldsValue({ content });
  }

  componentWillUnmount() {
    this.props.form.validateFields((err, { content }) => {
      localStorage.setItem('notification_content', content || '');
    });
  }

  renderSendForm() {
    const { push, form: { getFieldDecorator }, location } = this.props;
    const { state } = location;

    return (
      <Form style={{ maxWidth: 720 }}>
        <FormItem
          {...formItemLayout}
          label="发送者"
        >
          {getFieldDecorator('from', {
            initialValue: '2'
          })(
            <Select>
              <Option value="1">工作助手</Option>
              <Option value="2">通知助手</Option>
            </Select>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="内容"
        >
          {getFieldDecorator('content', {
            rules: [{ required: true, message: '不能为空！' }],
          })(
            <Input type="textarea" rows={10}/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="接受者"
        >
          {state && state.selectedUsers ?
            <Popover title={'用户ID'} content={<div style={{ maxWidth: 600, wordWrap: 'break-word' }}>{state.selectedUsers.join(',')}</div>}>
              <Tag closable
                   onClose={() => push({ ...location, state: {} })}>{`已选择的${state.selectedUsers.length}位用户`}</Tag>
            </Popover> :
            <span>
              <Tooltip title="可以在用户信息界面指定用户"><span>所有人</span></Tooltip>
              {' '}
              <Clickable onClick={() => push('/m/um/user_profiles')}>去指定用户</Clickable>
            </span>
          }
        </FormItem>
        <FormItem
          {...tailFormItemLayout}
          style={{ textAlign: 'center' }}
        >
          <Button
            type="primary"
            loading={this.state.sending}
            onClick={this.sendNotification}>
            发送
          </Button>
        </FormItem>
      </Form>
    )
  }

  renderSendHistory() {
    const { location, push } = this.props;
    const { query } = location;
    return (
      <WrapTable
        dataUrl={api.notiHistory}
        location={location}
        params={query}
        push={push}
        columns={columns}
        shouldRefresh={this.shouldRefresh}
      />
    )
  }

  render() {
    const { location } = this.props;
    const { tab } = location.query;

    return (
      <div style={{ margin: 16 }} className="card-container">
        <Tabs type="card" activeKey={tab || '1'} onChange={this.changeTab}>
          <TabPane tab="发送通知" key="1">{this.renderSendForm()}</TabPane>
          <TabPane tab="发送历史" key="2">{this.renderSendHistory()}</TabPane>
        </Tabs>
      </div>
    )
  }
}

const columns = [{
  title: 'id',
  dataIndex: 'id',
  key: 'id'
}, {
  title: '内容',
  dataIndex: 'content',
  key: 'content',
  width: 450,
  render: (v) => <ReadOnlyTextarea value={v}/>
}, {
  title: '操作者',
  dataIndex: 'user_name',
  key: 'user_name'
}, {
  title: '发送账号',
  dataIndex: 'from',
  key: 'from',
  render: value => {
    switch (value) {
      case '1':
        return '工作助手';
      default:
        return '通知助手';
    }
  }
}, {
  title: '接受者',
  dataIndex: 'target',
  key: 'target',
  render: value => value ?
    <Popover title={'用户ID'} content={<div style={{ maxWidth: 600, wordWrap: 'break-word' }}>{value.join(',')}</div>}>
      <span>{value.length}位用户</span>
    </Popover> :
    '所有人'
}, {
  title: '发送时间',
  dataIndex: 'created_at',
  key: 'created_at'
}]

function select(state, ownProps) {
  return {
    location: state.router.locationBeforeTransitions
  }
}

export default connect(select, { push })(Form.create()(NotificationsPage));
