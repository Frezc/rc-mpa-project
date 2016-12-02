/**
 * Created by Frezc on 2016/11/21.
 */
import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { easyGet, api } from '../../../network';
import { Modal, Spin, Form, Button } from 'antd';
const FormItem = Form.Item;
import { closeOrderModal, showJobModal, showCompanyModal, showUserDetail, showExpectJobModal } from '../../actions/common';
import { formItemLayout, renderOrderStatusText } from '../../configs/constants';
import Clickable from '../../../components/Clickable';

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

  componentWillReceiveProps({ visible, id }) {
    if (visible && id > 0 && id != this.props.id) {
      this.setState({ loading: true });
      easyGet(`${api.orders}/${id}`)
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
    const { visible, closeOrderModal, form, id, showJobModal, showCompanyModal, showUserDetail, showExpectJobModal } = this.props;
    const { data, loading, confirmLoading } = this.state;
    const { job_name, job_id, recruiter_type, recruiter_id, recruiter_name, expect_job, applicant_id, applicant_name, created_at } = data;

    return (
      <Modal
        title="订单信息"
        visible={visible}
        wrapClassName="order-modal"
        confirmLoading={confirmLoading}
        footer={<Button type="primary" size="large" onClick={closeOrderModal}>确定</Button>}
        onCancel={closeOrderModal}
      >
        <Spin spinning={loading}>
          <Form>
            <FormItem
              {...formItemLayout}
              label="岗位"
            >
              <Clickable onClick={() => showJobModal(job_id)}>{job_name}</Clickable>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="招聘者"
            >
              <Clickable onClick={() => recruiter_type == 1 ? showCompanyModal(recruiter_id) : showUserDetail(recruiter_id)}>{recruiter_name}</Clickable>
              （{recruiter_type == 1 ? '公司' : '个人'}）
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="申请者"
            >
              <Clickable onClick={() => showUserDetail(applicant_id)}>{applicant_name}</Clickable>
              （<Clickable onClick={() => showExpectJobModal(expect_job.id)}>查看申请信息</Clickable>）
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="状态"
            >
              {renderOrderStatusText(data)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="创建时间"
            >
              {created_at}
            </FormItem>
          </Form>
        </Spin>
      </Modal>
    )
  }
}

function select(state, ownProps) {
  return state.orderModal;
}

export default connect(select, { closeOrderModal, showJobModal, showCompanyModal, showUserDetail, showExpectJobModal })(Form.create()(ExpectJobModal));
