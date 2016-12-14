/**
 * Created by Frezc on 2016/11/21.
 */
import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { easyGet, api, easyPost } from '../../../network';
import { Modal, message, Spin, Form, Input, Radio, Collapse, Switch, Select } from 'antd';
import { closeJobModal, loadJobTypes } from '../../actions/common';
import { Link } from 'react-router';
import { formItemLayout } from '../../configs/constants';

const FormItem = Form.Item;
const Panel = Collapse.Panel;
const { Group: RadioGroup, Button: RadioButton } = Radio;

import './style.scss';

class JobModal extends PureComponent {

  static propTypes = {
    visible: PropTypes.bool,
    id: PropTypes.number
  };

  static defaultProps = {
    visible: false,
    id: -1
  };

  state = {
    loading: false,
    confirmLoading: false,
    data: {}
  };

  handleSave = () => {
    const { form, id } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        this.setState({ confirmLoading: true });
        easyPost(`${api.jobs}/${id}`, values)
          .then(json => {
            message.success('保存成功');
          })
          .catch(() => {})
          .then(() => this.setState({ confirmLoading: false }))
      }
    });
  };

  componentWillMount() {
    const { types, loadJobTypes } = this.props;
    if (types.length == 0) loadJobTypes();
  }

  componentWillReceiveProps({ visible, id }) {
    if (visible && id > 0 && id != this.props.id) {
      this.setState({ loading: true });
      easyGet(`${api.jobs}/${id}`)
        .then(json => {
          this.setState({ data: json });
          this.props.form.resetFields();
        })
        .catch(() => {})
        .then(() => this.setState({ loading: false }))
    }
  }

  render() {
    const { visible, closeJobModal, form, id, types } = this.props;
    const { data, loading, confirmLoading } = this.state;
    const { name, pay_way, description, active, contact, type, city, address, contact_person } = data;
    const { getFieldDecorator } = form;

    return (
      <Modal
        title={`岗位信息（id: ${id}）`}
        visible={visible}
        onCancel={closeJobModal}
        wrapClassName="job-modal"
        okText="保存"
        onOk={this.handleSave}
        confirmLoading={confirmLoading}
      >
        <Spin spinning={loading}>
          <Form>
            <FormItem
              {...formItemLayout}
              label="名称"
              hasFeedback
            >
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '不能为空！' }],
                initialValue: name
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="类型"
            >
              {getFieldDecorator('type', {
                initialValue: type
              })(
                <Select style={{ width: 120 }}>
                  {types.map(type =>
                    <Option value={type} key={type}>{type}</Option>
                  )}
                </Select>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="城市"
            >
              {city}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="地址"
              hasFeedback
            >
              {getFieldDecorator('address', {
                initialValue: address
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="支付方式"
            >
              {getFieldDecorator('pay_way', {
                initialValue: String(pay_way)
              })(
                <RadioGroup>
                  <RadioButton value="1">线下支付</RadioButton>
                  <RadioButton value="2">在线支付</RadioButton>
                </RadioGroup>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="联系方式"
              hasFeedback
            >
              {getFieldDecorator('contact', {
                initialValue: contact
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="联系人"
              hasFeedback
            >
              {getFieldDecorator('contact_person', {
                initialValue: contact_person
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="描述"
              hasFeedback
            >
              {getFieldDecorator('description', {
                initialValue: description
              })(
                <Input type="textarea" rows={4}/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="是否活跃"
            >
              {getFieldDecorator('active', {
                valuePropName: 'checked',
                initialValue: active
              })(
                <Switch />
              )}
            </FormItem>
          </Form>
        </Spin>
        <Collapse bordered={true}>
          <Panel header="其他" key="1">
            <Link to={{ pathname: '/m/um/orders', query: { job_id: id } }} target="_blank">
              查看该岗位的订单信息
            </Link>
            {'，'}
            <Link to={{ pathname: '/m/um/job_evaluates', query: { job_id: id } }} target="_blank">
              查看该岗位的评价
            </Link>
          </Panel>
        </Collapse>
      </Modal>
    )
  }
}

function select(state, ownProps) {
  return {
    ...state.jobModal,
    types: state.jobTypes
  };
}

export default connect(select, { closeJobModal, loadJobTypes })(Form.create()(JobModal));
