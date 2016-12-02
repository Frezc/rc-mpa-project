/**
 * Created by Frezc on 2016/12/1.
 */
import React, { PureComponent, PropTypes } from 'react';
import { Modal, Button, Form, Rate, Input, Collapse, Spin } from 'antd';
const FormItem = Form.Item;
const Panel = Collapse.Panel;
import { formItemLayout } from '../../configs/constants';
import LinkImg from '../../../components/LinkImg';
import { easyGet, api } from '../../../network';

class OrderEvaluateModal extends PureComponent {

  state = {
    visible: false,
    orderId: -1,
    job_evaluate: null,
    user_evaluate: null,
    loading: false
  };

  show(orderId) {
    this.setState({
      visible: true,
      orderId,
      loading: true
    });

    easyGet(`${api.orders}/${orderId}/evaluate`)
      .then(json => this.setState(json))
      .catch(() => {})
      .then(() => this.setState({ loading: false }))
  }

  close = () => {
    this.setState({
      visible: false
    })
  };

  render() {
    const { visible, orderId, loading, job_evaluate, user_evaluate } = this.state;

    return (
      <Modal
        title={`订单${orderId}的评价信息`}
        visible={visible}
        footer={<Button onClick={this.close} type="primary" size="large">OK</Button>}
        onCancel={this.close}
        width={650}
      >
        <Spin spinning={loading}>
          <Collapse>
            <Panel header="应聘者评价" key="1">
              {job_evaluate ?
                <Form>
                  <FormItem
                    label="满意度"
                    {...formItemLayout}
                  >
                    <Rate value={job_evaluate.score} disabled/>
                  </FormItem>
                  <FormItem
                    label="评价"
                    {...formItemLayout}
                  >
                    <Input type="textarea" rows={4} value={job_evaluate.comment} readOnly/>
                  </FormItem>
                  {job_evaluate.pictures &&
                  <FormItem
                    label="附图"
                    {...formItemLayout}
                  >
                    {job_evaluate.pictures.split(',').map((url, index) =>
                      <LinkImg src={api.host + url} key={index} style={styles.addonImg}/>
                    )}
                  </FormItem>
                  }
                  <FormItem
                    label="评价时间"
                    {...formItemLayout}
                  >
                    {job_evaluate.created_at}
                  </FormItem>
                </Form> :
                '应聘者还未评价'
              }
            </Panel>
            <Panel header="招聘者评价" key="2">
              {user_evaluate ?
                <Form>
                  <FormItem
                    label="满意度"
                    {...formItemLayout}
                  >
                    <Rate value={user_evaluate.score} disabled/>
                  </FormItem>
                  <FormItem
                    label="评价"
                    {...formItemLayout}
                  >
                    <Input type="textarea" rows={4} value={user_evaluate.comment} readOnly/>
                  </FormItem>
                  {user_evaluate.pictures &&
                  <FormItem
                    label="附图"
                    {...formItemLayout}
                  >
                    {user_evaluate.pictures.split(',').map((url, index) =>
                      <LinkImg src={api.host + url} key={index} style={styles.addonImg}/>
                    )}
                  </FormItem>
                  }
                  <FormItem
                    label="评价时间"
                    {...formItemLayout}
                  >
                    {user_evaluate.created_at}
                  </FormItem>
                </Form> :
                '招聘者还未评价'
              }
            </Panel>
          </Collapse>
        </Spin>
      </Modal>
    )
  }
}

const styles = {
  addonImg: {
    maxWidth: 60,
    maxHeight: 60,
    marginRight: 8
  }
}

export default OrderEvaluateModal
