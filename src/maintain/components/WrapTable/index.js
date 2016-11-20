/**
 * Created by Frezc on 2016/11/15.
 */
import React, { PureComponent, PropTypes } from 'react';
import { Table } from 'antd';
import { easyGet } from '../../../network';
import { objectFilter } from '../../../helpers';

class WrapTable extends PureComponent {

  static propTypes = {
    pageSize: PropTypes.number,
    dataUrl: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    params: PropTypes.object,
    push: PropTypes.func,
    location: PropTypes.object.isRequired,
    shouldRefresh: PropTypes.func
  };

  static defaultProps = {
    pageSize: 20,
    params: {},
    shouldRefresh: shouldRefresh
  };

  state = {
    loading: false,
    total: 0,
    list: []
  };

  fetchData({ dataUrl, pageSize, params } = this.props) {
    const { page = 1 } = params;
    const requestParams = Object.assign({}, params, {
      off: (page - 1) * pageSize,
      siz: pageSize
    });
    this.setState({ loading: true });
    easyGet(dataUrl, requestParams)
      .then(json => this.setState(json))
      .catch(() => {
      })
      .then(() => this.setState({ loading: false }));
  }

  getTargetQuery(nextQuery) {
    const { location: { query }, columns } = this.props;
    return objectFilter(Object.assign({}, query, columns.reduce((obj, cur) =>
      ('filters' in cur) ? Object.assign(obj, { [cur.dataIndex]: undefined }) : obj
    , {}), nextQuery), (_, v) => v);
  }

  handleChange = (pagination, filters, sorter) => {
    const { onChange } = this.props;

    if (onChange) {
      onChange(pagination, filters, sorter, this.updateRouterCb(pagination, filters, sorter));
    } else {
      this.updateRouterCb(pagination, filters, sorter)();
    }
  };

  updateRouterCb(pagination, filters, sorter) {
    return (distQuery) => {
      const { push, location: { pathname, query } } = this.props;
      console.log('pagination', pagination);
      if (!distQuery) {
        const filtersParams = Object.keys(filters).reduce((obj, cur) => {
          filters[cur].length > 0 && (obj[cur] = filters[cur].join(','));
          return obj;
        }, {});
        const sorterParam = sorter.field ? {
          orderby: sorter.field,
          dir: sorter.order == 'ascend' ? 'asc' : 'desc'
        } : {};
        distQuery = {
          ...filtersParams,
          ...sorterParam
        };
      }

      push && push({
        pathname,
        query: this.getTargetQuery(distQuery)
      });
    }
  }

  componentWillMount() {
    this.fetchData();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.shouldRefresh(this.props, nextProps)) {
      this.fetchData(nextProps);
    }
  }

  render() {
    const { loading, list, total } = this.state;
    const { pageSize, params } = this.props;
    const { page = 1 } = params;

    return (
      <Table
        loading={loading}
        rowKey={data => data.id}
        dataSource={list}
        pagination={{
          current: Number(page),
          total,
          pageSize,
          showQuickJumper: true
        }}
        onChange={this.handleChange}
        {...this.props}
      />
    )
  }
}

function shouldRefresh(currentProps, nextProps) {
  return currentProps.params != nextProps.params;
}

export default WrapTable;
