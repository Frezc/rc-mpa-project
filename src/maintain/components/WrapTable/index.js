/**
 * Created by Frezc on 2016/11/15.
 */
import React, { PureComponent, PropTypes } from 'react';
import { Table } from 'antd';
import { easyGet } from '../../../network';

class WrapTable extends PureComponent {

  static propTypes = {
    pageSize: PropTypes.number,
    dataUrl: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    params: PropTypes.object,
    push: PropTypes.func,
    pathname: PropTypes.string.isRequired
  };

  static defaultProps = {
    pageSize: 20,
    params: {}
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
      .catch(() => {})
      .then(() => this.setState({ loading: false }));
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
    return (query) => {
      const { push, pathname } = this.props;
      console.log('pagination', pagination);
      if (!query) {
        const filtersParams = Object.keys(filters).reduce((obj, cur) => {
          filters[cur].length > 0 && (obj[cur] = filters[cur].join(','));
          return obj;
        }, {});
        const sorterParam = sorter.field ? {
          orderby: sorter.field,
          dir: sorter.order == 'ascend' ? 'asc' : 'desc'
        } : {};
        query =  {
          ...filtersParams,
          ...sorterParam
        };
      }

      push && push({
        pathname,
        query: {
          page: pagination.current,
          ...query
        }
      })
    }
  }

  componentWillMount() {
    this.fetchData();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.params != nextProps.params) {
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

export default WrapTable;
