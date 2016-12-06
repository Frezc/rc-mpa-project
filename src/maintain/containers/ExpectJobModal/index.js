/**
 * Created by Frezc on 2016/11/21.
 */
import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { easyGet, api, easyPost } from '../../../network';
import { Modal, message, Spin, Form, Input, Radio, DatePicker } from 'antd';
const FormItem = Form.Item;
const { Group: RadioGroup, Button: RadioButton } = Radio;
import { closeExpectJobModal } from '../../actions/common';
import { formItemLayout } from '../../configs/constants';
import auth from '../../configs/jwtAuth';
import EasyImgUpload from '../../../components/EasyImgUpload';
import moment from 'moment';

import './style.scss';

class ExpectJobModal extends PureComponent {

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
        easyPost(`${api.expectJobs}/${id}`, {
          ...values,
          birthday: values.birthday.format('YYYY-MM-DD')
        }).then(json => {
            message.success('保存成功');
          })
          .catch(() => {})
          .then(() => this.setState({ confirmLoading: false }))
      }
    });
  };

  componentWillReceiveProps({ visible, id }) {
    if (visible && id > 0 && id != this.props.id) {
      this.setState({ loading: true });
      easyGet(`${api.expectJobs}/${id}`)
        .then(json => {
          this.setState({ data: json });
          this.props.form.resetFields();
        })
        .catch(() => {})
        .then(() => this.setState({ loading: false }))
    }
  }

  render() {
    const { visible, closeExpectJobModal, form, id } = this.props;
    const { data, loading, confirmLoading } = this.state;
    const { name, photo, school, introduction, birthday, contact, sex, expect_location } = data;
    const { getFieldDecorator } = form;

    const token = auth.getToken();
    return (
      <Modal
        title={`公开简历信息（id: ${id}）`}
        visible={visible}
        onCancel={closeExpectJobModal}
        wrapClassName="expect-job-modal"
        okText="保存"
        onOk={this.handleSave}
        confirmLoading={confirmLoading}
      >
        <Spin spinning={loading}>
          <Form>
            <FormItem
              {...formItemLayout}
              label="姓名"
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
              label="性别"
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
              label="学校"
            >
              {getFieldDecorator('school', {
                initialValue: school
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="生日"
            >
              {getFieldDecorator('birthday', {
                initialValue: moment(birthday)
              })(
                <DatePicker />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="联系方式"
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
              label="期望工作地区"
            >
              {getFieldDecorator('expect_location', {
                initialValue: expect_location
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="介绍"
            >
              {getFieldDecorator('introduction', {
                initialValue: introduction
              })(
                <Input type="textarea" rows={4}/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="照片"
            >
              {getFieldDecorator('photo', {
                valuePropName: 'imgUrl',
                initialValue: photo
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
      </Modal>
    )
  }
}

function select(state, ownProps) {
  return state.expectJobModal;
}

export default connect(select, { closeExpectJobModal })(Form.create()(ExpectJobModal));
