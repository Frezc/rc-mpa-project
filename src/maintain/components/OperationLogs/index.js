/**
 * Created by Frezc on 2016/12/4.
 */
import React, { PureComponent, PropTypes } from 'react';
import { Timeline, Icon, Spin } from 'antd';
import { api, easyGet } from '../../../network';
const Item = Timeline.Item;

class OperationLogs extends PureComponent {

  static propTypes = {
    userId: PropTypes.number
  };

  static defaultProps = {
    userId: -1
  };

  state = {
    total: 0,
    list: [],
    loading: false
  };

  fetchData({ userId } = this.props) {
    this.setState({
      loading: true
    });
    easyGet(`${api.users}/${userId}/logs`)
      .then(json => this.setState(json))
      .catch(() => {})
      .then(() => this.setState({ loading: false }));
  }

  componentWillMount() {
    if (this.props.userId > 0) {
      this.fetchData();
    }
  }

  componentWillReceiveProps(nextProps) {
    const { userId } = nextProps;
    if (userId != this.props.userId) {
      if (userId > 0) {
        this.fetchData(nextProps);
      } else {
        this.setState({
          total: 0,
          list: []
        })
      }
    }
  }

  render() {
    const { total, list, loading } = this.state;

    return (
      <Spin spinning={loading}>
        {total > 0 && list ?
          <Timeline pending={'end'}>
            {list.map((log, i) =>
              <Item color="green" key={i}>{log.path}</Item>
            )}
          </Timeline> :
          <p>没有任何操作记录。</p>
        }
      </Spin>
    );
  }
}

export default OperationLogs
