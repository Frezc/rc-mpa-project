/**
 * Created by Frezc on 2016/11/22.
 */
import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import WrapTable from '../../components/WrapTable';
import { api, easyPost, easyDelete } from '../../../network';
import { push } from 'react-router-redux';
import { showUserDetail, showExpectJobModal } from '../../actions/common';
import Clickable from '../../../components/Clickable';
import Filters from '../../components/Filters';
import { modelExist } from '../../configs/constants';
import { message, Modal } from 'antd';

class ExpectJobsPage extends PureComponent {

  get columns() {
    const { showUserDetail } = this.props;
    const { exist } = this.props.location.query;

    return [{
      title: 'id',
      dataIndex: 'id',
      key: 'id'
    }, {
      title: '标题',
      dataIndex: 'title',
      key: 'title'
    }, {
      title: '发布者',
      dataIndex: 'user_name',
      key: 'user_name',
      render: (v, record) => (
        <Clickable onClick={e => {
          e.stopPropagation();
          showUserDetail(record.user_id)
        }}
        >
          {v}
        </Clickable>
      )
    }, {
      title: '姓名',
      dataIndex: 'name',
      key: 'name'
    }, {
      title: '学校',
      dataIndex: 'school',
      key: 'school'
    }, {
      title: '期望工作地点',
      dataIndex: 'expect_location',
      key: 'expect_location'
    }, {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at'
    }, {
      title: 'Exist',
      dataIndex: 'deleted_at',
      key: 'exist',
      render: v => v ? '已删除' : '正常',
      filteredValue: exist || [],
      filters: modelExist.filters,
      filterMultiple: false
    }, {
      title: '操作',
      key: 'actions',
      render: (_, record, i) => this.renderAction(record, i)
    }];
  }

  handleRowClick = record => {
    this.props.showExpectJobModal(record.id)
  };

  handleDelete(id, index) {
    Modal.confirm({
      title: '确定要删除该公开简历？',
      onOk: () => easyDelete(`${api.expectJobs}/${id}`)
        .then(json => {
          message.success('删除成功');
          this.table.setLocalData(index, json);
        }).catch(() => {
        })
    })
  }

  handleRestore(id, index) {
    Modal.confirm({
      title: '确定要恢复该公开简历？',
      onOk: () => easyPost(`${api.expectJobs}/${id}/restore`)
        .then(json => {
          message.success('恢复成功');
          this.table.setLocalData(index, json);
        }).catch(() => {
        })
    })
  }

  renderAction({ id, deleted_at }, index) {
    if (deleted_at) {
      return (
        <Clickable
          onClick={e => {
            e.stopPropagation();
            this.handleRestore(id, index);
          }}
        >
          恢复
        </Clickable>
      )
    } else {
      return (
        <Clickable
          style={{ color: 'red' }}
          onClick={e => {
            e.stopPropagation();
            this.handleDelete(id, index);
          }}
        >
          删除
        </Clickable>
      )
    }
  }

  render() {
    const { location, push } = this.props

    return (
      <div style={{ margin: 16 }}>
        <Filters style={{ marginBottom: 8 }} filters={['kw']}/>
        <WrapTable
          ref={r => this.table = r}
          columns={this.columns}
          dataUrl={api.expectJobs}
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

export default connect(select, { push, showUserDetail, showExpectJobModal })(ExpectJobsPage);
