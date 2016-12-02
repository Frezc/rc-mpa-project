/**
 * Created by Frezc on 2016/11/21.
 */
import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import WrapTable from '../../components/WrapTable';
import { api } from '../../../network';
import { push } from 'react-router-redux';
import { showCompanyModal } from '../../actions/common';
import Filters from '../../components/Filters';

class CompaniesPage extends PureComponent {

  handleRowClick = record => {
    this.props.showCompanyModal(record.id);
  };

  render() {
    const { location, push } = this.props;

    return (
      <div style={{ margin: 16 }}>
        <Filters style={{ marginBottom: 8 }} filters={['kw']}/>
        <WrapTable
          columns={columns}
          dataUrl={api.companies}
          params={location.query}
          location={location}
          push={push}
          onRowClick={this.handleRowClick}
        />
      </div>
    )
  }
}

const columns = [{
  title: 'id',
  dataIndex: 'id',
  key: 'id'
}, {
  title: '公司名',
  dataIndex: 'name',
  key: 'name',
  render: (value, record) => <a href={record.url} target="_blank">{value}</a>
}, {
  title: '地址',
  dataIndex: 'address',
  key: 'address'
}, {
  title: '联系人',
  dataIndex: 'contact_person',
  key: 'contact_person'
}, {
  title: '联系方式',
  dataIndex: 'contact',
  key: 'contact'
}, {
  title: '加入时间',
  dataIndex: 'created_at',
  key: 'created_at'
}];

function select(state, ownProps) {
  return {
    location: state.router.locationBeforeTransitions
  }
}

export default connect(select, { push, showCompanyModal })(CompaniesPage);
