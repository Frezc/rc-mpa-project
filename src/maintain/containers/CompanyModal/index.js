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
import { closeCompanyModal } from '../../actions/common';
import auth from '../../configs/jwtAuth';
import { Link } from 'react-router';
import { formItemLayout } from '../../configs/constants';

import './style.scss';

class CompanyModal extends PureComponent {

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
        easyPost(`${api.companies}/${id}`, values)
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
    if (nextProps.visible && nextProps.id > 0 && nextProps.id != this.props.id) {
      this.setState({ loading: true });
      easyGet(`${api.companies}/${nextProps.id}`)
        .then(json => {
          this.setState({ data: json });
          this.props.form.resetFields();
        })
        .catch(() => {
        })
        .then(() => this.setState({ loading: false }))
    }
  }

  render() {
    const { visible, closeCompanyModal, form, id } = this.props;
    const { data, loading, confirmLoading } = this.state;
    const { name, url, address, logo, description, contact, contact_person } = data;
    const { getFieldDecorator } = form;

    const token = auth.getAuthSync().token;
    return (
      <Modal
        title={`企业信息（id: ${id}）`}
        visible={visible}
        onCancel={closeCompanyModal}
        wrapClassName="company-modal"
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
              <Input value={name} readOnly/>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="主页"
              hasFeedback
            >
              {getFieldDecorator('url', {
                initialValue: url
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="地址"
              hasFeedback
            >
              {getFieldDecorator('address', {
                rules: [{ required: true, message: '不能为空！' }],
                initialValue: address
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
                rules: [{ required: true, message: '不能为空！' }],
                initialValue: contact_person
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="联系方式"
              hasFeedback
            >
              {getFieldDecorator('contact', {
                rules: [{ required: true, message: '不能为空！' }],
                initialValue: contact
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
                <Input />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="logo"
            >
              {getFieldDecorator('logo', {
                valuePropName: 'imgUrl',
                initialValue: logo
              })(
                <EasyImgUpload
                  name="file"
                  action={api.imgUpload}
                  token={token}
                />
              )}
            </FormItem>
          </Form>
        </Spin>
        <Collapse bordered={true}>
          <Panel header="其他" key="1">
            <Link to={{ pathname: '/m/am/company', query: { company_id: id, status: 2 } }} target="_blank">
              查看该企业的认证信息
            </Link>
            {'，'}
            <Link to={{ pathname: '/m/um/user_profiles', query: { company_id: id } }} target="_blank">
              查看该企业下的用户信息
            </Link>
            {'，'}
            <Link to={{ pathname: '/m/um/jobs', query: { company_id: id } }} target="_blank">
              查看该企业下的岗位信息
            </Link>
          </Panel>
        </Collapse>
      </Modal>
    )
  }
}

function select(state, ownProps) {
  return state.companyModal;
}

export default connect(select, { closeCompanyModal })(Form.create()(CompanyModal));
