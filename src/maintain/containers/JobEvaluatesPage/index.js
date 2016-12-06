/**
 * Created by Frezc on 2016/11/22.
 */
import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import WrapTable from '../../components/WrapTable';
import { api } from '../../../network';
import { push } from 'react-router-redux';
import { showUserDetail, showOrderModal, showJobModal } from '../../actions/common';
import Clickable from '../../../components/Clickable';
import { Rate } from 'antd';
import LinkImg from '../../../components/LinkImg';

class JobEvaluatesPage extends PureComponent {

  get columns() {
    const { showUserDetail, showOrderModal, showJobModal } = this.props;

    return [{
      title: 'id',
      dataIndex: 'id',
      key: 'id',
      width: 64
    }, {
      title: '评分',
      dataIndex: 'score',
      key: 'score',
      width: 126,
      render: v => <Rate value={v} style={{ fontSize: 14 }} disabled/>
    }, {
      title: '评价',
      dataIndex: 'comment',
      key: 'comment',
    }, {
      title: '发布者',
      dataIndex: 'user_name',
      key: 'user_name',
      width: 120,
      render: (v, record) => (
        <Clickable onClick={e => {
          e.stopPropagation();
          showUserDetail(record.user_id)
        }}>
          {v}
        </Clickable>
      )
    }, {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 130
    }, {
      title: '操作',
      key: 'action',
      width: 140,
      render: (_, record) => (
        <span>
          <Clickable onClick={() => showOrderModal(record.order_id)}>查看订单</Clickable>
          <span className="ant-divider"/>
          <Clickable onClick={() => showJobModal(record.job_id)}>查看岗位</Clickable>
        </span>
      )
    }];
  }

  renderExpandedRow = (record) => {
    const { pictures } = record;

    return (
      <div>
        {pictures ?
          pictures.split(',').map(pic =>
            <LinkImg src={api.host + pic} alt="附图" style={{ maxHeight: 100, maxWidth: 100 }}/>
          ) :
          '没有图片'
        }
      </div>
    )
  };

  render() {
    const { location, push } = this.props

    return (
      <div style={{ margin: 16 }}>
        <WrapTable
          ref={r => this.table = r}
          columns={this.columns}
          dataUrl={api.evaluates}
          params={location.query}
          location={location}
          push={push}
          expandedRowRender={this.renderExpandedRow}
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

export default connect(select, { push, showUserDetail, showOrderModal, showJobModal })(JobEvaluatesPage);
