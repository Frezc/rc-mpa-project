/**
 * Created by Frezc on 2016/12/14.
 */
import React, { PureComponent, PropTypes } from 'react';
import { Modal, Spin, Table, Button } from 'antd';
import { easyGet, easyDelete, api } from '../../../network';
import moment from "moment";

class JobTimeModal extends PureComponent {

  static propTypes = {
    visible: PropTypes.bool,
    id: PropTypes.number.isRequired,    // job id
    onCancel: PropTypes.func
  }

  static defaultProps = {
    visible: false,
    id: -1
  }

  state = {
    loading: false,
    dataSource: [],
    deleting: false,
    selectedRowKeys: []
  };

  columns = [{
    title: '申请结束时间',
    dataIndex: 'apply_end_at',
    key: 'apply_end_at',
    width: 130
  }, {
    title: '工作时间',
    key: 'time',
    render: (_, { start_at, end_at }) => `${start_at} ~ ${end_at}`,
    width: 260
  }, {
    title: '工资',
    key: 'salary',
    render: (_, { salary_type, salary }) => salary_type == 1 ? '面议' : salary,
    width: 50
  }, {
    title: '申请人数',
    key: 'number',
    render: (_, { number, number_applied }) => `${number_applied} / ${number || '无限制'}`,
    width: 70
  }, {
    title: '状态',
    key: 'status',
    render: (_, record) => this.renderStatus(record)
  }];

  rowSelection = {
    selectedRowKeys: this.state.selectedRowKeys,
    getCheckboxProps: record => ({
      disabled: record.deleted_at
    }),
    onChange: (selectedRowKeys) => {
      this.setState({ selectedRowKeys })
    }
  };

  closeTime = () => {
    const { id } = this.props;
    const { selectedRowKeys } = this.state;
    this.setState({ deleting: true });
    easyDelete(`${api.jobs}/${id}/time`, {
      time: selectedRowKeys.join(',')
    }).then(dataSource => this.setState({ selectedRowKeys: [], dataSource }))
      .catch(() => {})
      .then(() => this.setState({ deleting: false }));
  }

  componentWillReceiveProps({ visible, id }) {
    if (visible && id > 0 && id != this.props.id) {
      this.setState({ loading: true });
      easyGet(`${api.jobs}/${id}/time`, { expire: 1 })
        .then(dataSource => this.setState({ dataSource }))
        .catch(() => {})
        .then(() => this.setState({ loading: false }))
    }
  }

  renderStatus({ deleted_at, apply_end_at }) {
    if (deleted_at) {
      return <span style={{ color: 'red' }}>已关闭</span>
    }
    if (moment().isAfter(apply_end_at)) {
      return <span style={{ color: 'gray' }}>已过期</span>
    }
    return <span style={{ color: 'green' }}>正常</span>
  }

  render() {
    const { id, visible, onCancel } = this.props;
    const { dataSource, loading, deleting, selectedRowKeys } = this.state;

    return (
      <Modal
        title={`岗位（id: ${id}）的时间信息`}
        width={655}
        visible={visible}
        footer={[
          <Button
            key="delete"
            type="ghost"
            size="large"
            icon="delete"
            loading={deleting}
            disabled={selectedRowKeys.length == 0}
            onClick={this.closeTime}
          >
            删除
          </Button>,
          <Button key="ok" type="primary" size="large" onClick={onCancel}>确定</Button>
        ]}
        onCancel={onCancel}
      >
        <Spin spinning={loading}>
          <Table
            dataSource={dataSource}
            columns={this.columns}
            pagination={false}
            size="middle"
            rowSelection={{ ...this.rowSelection, selectedRowKeys }}
            scroll={{ y: 300 }}
            rowKey={record => record.id}
          />
        </Spin>
      </Modal>
    )
  }
}

export default JobTimeModal
