/**
 * Created by Frezc on 2016/11/22.
 */
import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import WrapTable from '../../components/WrapTable';
import { api, easyDelete } from '../../../network';
import { push } from 'react-router-redux';
import { showUserDetail, showCompanyModal, showJobModal, showExpectJobModal } from '../../actions/common';
import Clickable from '../../../components/Clickable';
import { renderOrderStatusText } from '../../configs/constants';
import { Modal, message } from 'antd';
import Filters from '../../components/Filters';
import EvaluateModal from '../OrderEvaluateModal';

class OrdersPage extends PureComponent {

  get columns() {
    const { showUserDetail, showCompanyModal, showJobModal, showExpectJobModal } = this.props;
    return [{
      title: 'id',
      dataIndex: 'id',
      key: 'id'
    }, {
      title: '岗位名称',
      dataIndex: 'job_name',
      key: 'job_name',
      render: (v, record) => <Clickable onClick={() => showJobModal(record.job_id)}>{v}</Clickable>
    }, {
      title: '应聘者',
      dataIndex: 'applicant_name',
      key: 'applicant_name',
      render: (v, record) => (
        <span>
          <Clickable onClick={() => showUserDetail(record.applicant_id)}>{v}</Clickable>
          (<Clickable onClick={() => showExpectJobModal(record.expect_job_id)}>申请资料</Clickable>)
        </span>
      )
    }, {
      title: '招聘方',
      dataIndex: 'recruiter_type',
      key: 'recruiter',
      render: (v, { recruiter_id, recruiter_name }) => (
        <span>
          <Clickable
            onClick={() => v == 1 ? showCompanyModal(recruiter_id) : showUserDetail(recruiter_id)}>
            {recruiter_name}
          </Clickable>
          ({v == 1 ? '企业' : '个人'})
        </span>
      )
    }, {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (_, record) => renderOrderStatusText(record)
    }, {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at'
    }, {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      render: (_, record, i) => this.renderAction(record, i)
    }];
  }

  handleCloseClick(orderId, i) {
    Modal.confirm({
      title: '确定要关闭该订单？',
      content: '该操作不可逆，请谨慎操作。',
      onOk: () => {
        return new Promise((res) => {
          easyDelete(`${api.orders}/${orderId}`)
            .then(json => {
              console.log(this.table);
              this.table.setLocalData(i, json);
              message.success('订单关闭成功。');
            })
            .catch(err => console.log(err))
            .then(() => res());
        });
      }
    })
  }

  handleRowClick = record => {

  }

  renderAction({ id, status }, i) {
    switch (status) {
      case 2:
        return <Clickable onClick={() => this.evaluateModal.show(id)}>评价信息</Clickable>;
      case 0:
      case 1:
        return (
          <Clickable
            style={{ color: 'red' }}
            onClick={() => this.handleCloseClick(id, i)}
          >
            关闭
          </Clickable>
        )
    }
    return ''
  }

  render() {
    const { location, push } = this.props

    return (
      <div style={{ margin: 16 }}>
        <Filters style={{ marginBottom: 8 }} filters={['user_id']}/>
        <WrapTable
          ref={o => this.table = o}
          columns={this.columns}
          dataUrl={api.orders}
          params={location.query}
          location={location}
          push={push}
          onRowClick={this.handleRowClick}
        />
        <EvaluateModal ref={r => this.evaluateModal = r}/>
      </div>
    )
  }
}

function select(state, ownProps) {
  return {
    location: state.router.locationBeforeTransitions
  }
}

export default connect(select, {
  push,
  showUserDetail,
  showCompanyModal,
  showJobModal,
  showExpectJobModal
})(OrdersPage);
