/**
 * Created by Frezc on 2016/11/21.
 */
import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import WrapTable from '../../components/WrapTable';
import { api, easyDelete, easyPost } from '../../../network';
import { push } from 'react-router-redux';
import { showUserDetail, showCompanyModal, showJobModal, loadJobTypes } from '../../actions/common';
import Clickable from '../../../components/Clickable';
import { Tooltip, Modal, message } from 'antd';
import Filters from '../../components/Filters';
import { modelExist } from '../../configs/constants';
import JobTimeModal from '../JobTimeModal';

class JobsPage extends PureComponent {

  state = {
    jobTimeModal: {
      visible: false
    }
  };

  get columns() {
    const { exist, type } = this.props.location.query;

    return [{
      title: 'id',
      dataIndex: 'id',
      key: 'id'
    }, {
      title: '岗位名称',
      dataIndex: 'name',
      key: 'name'
    }, {
      title: '类型',
      dataIndex: 'type',
      key: 'type'
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
      title: '城市',
      dataIndex: 'city',
      key: 'city'
    }, {
      title: '地址',
      dataIndex: 'address',
      key: 'address'
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
        }).catch(() => {
        })
    })
  }

  componentWillMount() {
    const { loadJobTypes, types } = this.props;
    if (types.length == 0) {
      loadJobTypes();
    }
  }

  renderAction({ id, deleted_at }, index) {

    return (
      <span>
        <Clickable
          onClick={e => {
            e.stopPropagation();
            this.setState({ jobTimeModal: { visible: true, id } });
          }}
        >
          查看时间
        </Clickable>
        <span className="ant-divider"/>
        {deleted_at ?
          <Clickable
            onClick={e => {
              e.stopPropagation();
              this.handleRestore(id, index);
            }}
          >
            恢复
          </Clickable> :
          <Clickable
            style={{ color: 'red' }}
            onClick={e => {
              e.stopPropagation();
              this.handleDelete(id, index);
            }}
          >
            删除
          </Clickable>
        }
      </span>
    );
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
    const { location, push, types } = this.props;
    const { jobTimeModal } = this.state;

    return (
      <div style={{ margin: 16 }}>
        <Filters
          style={{ marginBottom: 8 }}
          filters={['kw', 'type']}
          types={types}
        />
        <WrapTable
          ref={r => this.table = r}
          columns={this.columns}
          dataUrl={api.jobs}
          params={location.query}
          location={location}
          push={push}
          onRowClick={this.handleRowClick}
        />
        <JobTimeModal
          {...jobTimeModal}
          onCancel={() => this.setState({ jobTimeModal: { visible: false } })}
        />
      </div>
    )
  }
}

function select(state, ownProps) {
  return {
    location: state.router.locationBeforeTransitions,
    types: state.jobTypes
  }
}

export default connect(select, { push, showUserDetail, showCompanyModal, showJobModal, loadJobTypes })(JobsPage);
