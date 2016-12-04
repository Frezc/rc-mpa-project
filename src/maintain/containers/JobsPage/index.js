/**
 * Created by Frezc on 2016/11/21.
 */
import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import WrapTable from '../../components/WrapTable';
import { api, easyDelete, easyPost } from '../../../network';
import { push } from 'react-router-redux';
import { showUserDetail, showCompanyModal, showJobModal } from '../../actions/common';
import Clickable from '../../../components/Clickable';
import { Tooltip, Modal, message } from 'antd';
import Filters from '../../components/Filters';
import { modelExist } from '../../configs/constants';

class JobsPage extends PureComponent {

  get columns() {
    const { exist } = this.props.location.query;

    return [{
      title: 'id',
      dataIndex: 'id',
      key: 'id'
    }, {
      title: '岗位名称',
      dataIndex: 'name',
      key: 'name'
    }, {
      title: '发布者',
      dataIndex: 'owner',
      key: 'owner',
      render: this.renderOwner
    }, {
      title: '联系方式',
      dataIndex: 'contact',
      key: 'contact'
    }, {
      title: '访问次数',
      dataIndex: 'visited',
      key: 'visited'
    }, {
      title: '评分',
      dataIndex: 'average_score',
      key: 'average_score',
      render: (v, record) => v ?
        <Tooltip title={`来自${record.number_evaluate}位用户的评价`}><span>{Number(v).toFixed(2)}</span></Tooltip> :
        '-'
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
    this.props.showJobModal(record.id);
  };

  handleDelete(id, index) {
    Modal.confirm({
      title: '确定要删除该岗位？',
      onOk: () => easyDelete(`${api.jobs}/${id}`)
        .then(json => {
          message.success('删除成功');
          this.table.setLocalData(index, json);
        }).catch(() => {
        })
    })
  }

  handleRestore(id, index) {
    Modal.confirm({
      title: '确定要恢复该岗位？',
      onOk: () => easyPost(`${api.jobs}/${id}/restore`)
        .then(json => {
          message.success('恢复成功');
          this.table.setLocalData(index, json);
        }).catch(() => {})
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

  renderOwner = (_, record) => {
    const { showCompanyModal, showUserDetail } = this.props;
    const { creator_id, creator_name, company_id, company_name } = record;

    return (
      <span>
        <Clickable
          onClick={() => showUserDetail(creator_id)}
        >
          {creator_name}
        </Clickable>
        {company_id &&
        <span>
            （
            <Clickable
              onClick={() => showCompanyModal(company_id)}
            >
              {company_name}
            </Clickable>
            ）
          </span>
        }
      </span>
    )
  };

  render() {
    const { location, push } = this.props

    return (
      <div style={{ margin: 16 }}>
        <Filters style={{ marginBottom: 8 }} filters={['kw']}/>
        <WrapTable
          ref={r => this.table = r}
          columns={this.columns}
          dataUrl={api.jobs}
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

export default connect(select, { push, showUserDetail, showCompanyModal, showJobModal })(JobsPage);
