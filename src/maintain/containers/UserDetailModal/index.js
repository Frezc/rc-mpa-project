/**
 * Created by Frezc on 2016/11/16.
 */
import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { easyGet, api, easyPost } from '../../../network';
import { Modal, message, Spin, Form, Input, Radio, Collapse } from 'antd';
const FormItem = Form.Item;
const { Group: RadioGroup, Button: RadioButton } = Radio;
const Panel = Collapse.Panel;
import EasyImgUpload from '../../../components/EasyImgUpload';
import { closeUserDetail } from '../../actions/common';
import auth from '../../configs/jwtAuth';
import { Link } from 'react-router';
import { formItemLayout } from '../../configs/constants';

import './style.scss';

class UserDetailModal extends PureComponent {

  static propTypes = {
    visible: PropTypes.bool,
    userId: PropTypes.number
  };

  static defaultProps = {
    visible: false,
    userId: -1
  };

  state = {
    loading: false,
    confirmLoading: false,
    user: {}
  };

  handleSave = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({ confirmLoading: true });
        easyPost(`${api.users}/${this.props.userId}`, values)
          .then(json => {
            message.success('保存成功');
          })
          .catch(() => {
          })
          .then(() => this.setState({ confirmLoading: false }))
      }
    });
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible && nextProps.userId > 0 && nextProps.userId != this.props.userId) {
      this.setState({ loading: true });
      easyGet(`${api.users}/${nextProps.userId}`)
        .then(json => {
          this.setState({ user: json });
          this.props.form.resetFields();
        })
        .catch(() => {
        })
        .then(() => this.setState({ loading: false }))
    }
  }

  render() {
    const { visible, closeUserDetail, form, userId } = this.props;
    const { user, loading, confirmLoading } = this.state;
    const { email, phone, nickname, sign, sex, avatar } = user;
    const { getFieldDecorator } = form;

    const token = auth.getAuthSync().token;
    return (
      <Modal
        title="用户信息"
        visible={visible}
        onCancel={closeUserDetail}
        wrapClassName="user-detail-modal"
        okText="保存"
        onOk={this.handleSave}
        confirmLoading={confirmLoading}
      >
        <Spin spinning={loading}>
          <Form>
            <FormItem
              {...formItemLayout}
              label="Email"
            >
              <Input value={email} readOnly/>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="手机号"
            >
              <Input value={phone} readOnly/>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="昵称"
              hasFeedback
            >
              {getFieldDecorator('nickname', {
                rules: [{ required: true, message: '不能为空！' }],
                initialValue: nickname
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="签名"
              hasFeedback
            >
              {getFieldDecorator('sign', {
                rules: [{ required: true, message: '不能为空！' }],
                initialValue: sign
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="性别"
              hasFeedback
            >
              {getFieldDecorator('sex', {
                initialValue: String(sex)
              })(
                <RadioGroup>
                  <RadioButton value="0">男</RadioButton>
                  <RadioButton value="1">女</RadioButton>
                </RadioGroup>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="头像"
            >
              {getFieldDecorator('avatar', {
                valuePropName: 'imgUrl',
                initialValue: avatar
              })(
                <EasyImgUpload
                  name="file"
                  action={api.imgUpload}
                  token={token}
                />
              )}
            </FormItem>
            <Collapse bordered={true}>
              <Panel header="其他" key="1">
                <Link to={{ pathname: '/m/am/real_name', query: { user_id: userId } }} target="_blank">
                  查看Ta的实名认证申请
                </Link>
                {'，'}
                <Link to={{ pathname: '/m/am/company', query: { user_id: userId } }} target="_blank">
                  查看Ta的企业认证申请
                </Link>
              </Panel>
            </Collapse>
          </Form>
        </Spin>
      </Modal>
    )
  }
}

function select(state, ownProps) {
  return state.userDetailModal;
}

export default connect(select, { closeUserDetail })(Form.create()(UserDetailModal));
