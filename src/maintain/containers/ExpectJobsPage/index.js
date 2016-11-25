/**
 * Created by Frezc on 2016/11/22.
 */
import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import WrapTable from '../../components/WrapTable';
import { api } from '../../../network';
import { push } from 'react-router-redux';
import { showUserDetail, showExpectJobModal } from '../../actions/common';
import Clickable from '../../../components/Clickable';

class ExpectJobsPage extends PureComponent {

  get columns() {
    const { showUserDetail } = this.props;
    return [{
      title: 'id',
      dataIndex: 'id',
      key: 'id'
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
    }];
  }

  handleRowClick = record => {
    this.props.showExpectJobModal(record.id)
  };

  render() {
    const { location, push } = this.props

    return (
      <div style={{ margin: 16 }}>
        <WrapTable
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
