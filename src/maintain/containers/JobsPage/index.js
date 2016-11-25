/**
 * Created by Frezc on 2016/11/21.
 */
import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import WrapTable from '../../components/WrapTable';
import { api } from '../../../network';
import { push } from 'react-router-redux';
import { showUserDetail, showCompanyModal, showJobModal } from '../../actions/common';
import Clickable from '../../../components/Clickable';

class JobsPage extends PureComponent {

  columns = [{
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
    render: this.renderOwner.bind(this)
  }, {
    title: '联系方式',
    dataIndex: 'contact',
    key: 'contact'
  }, {
    title: '访问次数',
    dataIndex: 'visited',
    key: 'visited'
  }, {
    title: 'Active',
    dataIndex: 'active',
    key: 'active',
    render: v => v ? 'Yes' : 'No'
  }, {
    title: '创建时间',
    dataIndex: 'created_at',
    key: 'created_at'
  }];

  handleRowClick = record => {
    this.props.showJobModal(record.id);
  };

  renderOwner(_, record) {
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
  }

  render() {
    const { location, push } = this.props

    return (
      <div style={{ margin: 16 }}>
        <WrapTable
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
