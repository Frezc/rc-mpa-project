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
import { orderStatus, closeType } from '../../configs/constants';
import { Modal, message } from 'antd';
import Filters from '../../components/Filters';

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
      render: this.renderStatus
    }, {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at'
    }, {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      render: (_, { id, status }, i) => (status != 2 && status != 3 &&
        <Clickable
          style={{ color: 'red' }}
          onClick={() => this.handleCloseClick(id, i)}
        >
          关闭
        </Clickable>
      )
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

  };

  renderStatus(status, { applicant_check, recruiter_check, close_type }) {
    switch (status) {
      case 0:
        return `${applicant_check ? '发布方' : '申请者'}未确认`;
      case 3:
        return `由${closeType.text[close_type]}关闭`;
      default:
        return orderStatus.text[status];
    }
  }

  render() {
    const { location, push } = this.props

    return (
      <div style={{ margin: 16 }}>
        <Filters style={{ marginBottom: 8 }}/>
        <WrapTable
          ref={o => this.table = o}
          columns={this.columns}
          dataUrl={api.orders}
          params={location.query}
          location={location}
          push={push}
          onRowClick={this.handleRowClick}
        />
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
