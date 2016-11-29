/**
 * Created by Frezc on 2016/11/29.
 */
import React, { PureComponent, PropTypes } from 'react';
import { Modal, Input } from 'antd';

class RejModal extends PureComponent {

  state = {
    visible: false,
    reason: '',
    confirmLoading: false
  };

  show({ onOk }) {
    this.setState({ visible: true });
    this.onOk = onOk;
  }

  handleOk = () => {
    this.setState({ confirmLoading: true });
    this.onOk(this.state.reason)
      .then(() => this.handleCancel())
      .catch(() => this.setState({ confirmLoading: false }));
  };

  handleCancel = () => {
    this.setState({
      visible: false,
      reason: '',
      confirmLoading: false
    });
  };

  render() {
    const { visible, reason, confirmLoading } = this.state;

    return (
      <Modal
        visible={visible}
        title="请填写拒绝理由"
        onOk={this.handleOk}
        confirmLoading={confirmLoading}
        onCancel={this.handleCancel}
      >
        <Input type="textarea" rows={4}
               value={reason}
               onChange={e => this.setState({ reason: e.target.value })}/>
      </Modal>
    )
  }
}

export default RejModal
