/**
 * Created by Frezc on 2016/11/3.
 */
import React, { PureComponent, PropTypes } from 'react';
import SimplePTR from 'rc-pull-to-refresh/lib/SimplePTR';
import MsgSection from '../../../components/MsgSection';
import { hashHistory } from 'react-router';
import { mobileGet, getSelf } from '../../helpers';
import api from '../../../network/api';
import LocalIdArray from 'local-id-array';

import './style.scss';

class MsgListPage extends PureComponent {

  static propTypes = {}

  static defaultProps = {}

  state = {
    loading: false,
    total: -1,
    list: new LocalIdArray()
  };

  fetchData(refresh = false) {
    if (refresh) {
      this.setState({
        loading: true
      });
    }
    const off = refresh ? 0 : this.state.list.length;
    mobileGet(api.messages, { off })
      .then(({ total, list }) => this.setState((prevState) => ({
        total,
        list: refresh ? new LocalIdArray(list) : prevState.list.concat(list),
        loading: false
      })));
  }

  handleRefresh = () => {
    this.fetchData(true);
  }

  loadMore = () => {
    this.fetchData();
  }

  componentDidMount() {
    getSelf().then(() => this.fetchData(true));
  }

  render() {
    const { children } = this.props;
    const { loading, list, total } = this.state;

    return (
      <div className="messages-page">
        <div className={`container ${children ? 'right' : 'left'}`}>
          <SimplePTR
            loading={loading}
            onRefresh={this.handleRefresh}
            onEndReached={this.loadMore}
          >
            {list.length > 0 ?
              list.map((data, i, index) =>
                <MsgSection
                  key={i}
                  avatar={data.sender_avatar}
                  content={data.content}
                  name={data.sender_name}
                  time={data.updated_at}
                  unread={data.unread}
                  onPress={() => {
                    this.setState({
                      list: list.set(index, Object.assign({}, data, { unread: 0 }))
                    });
                    if (data.type == 'conversation') {
                      hashHistory.push(`conversations/${data.sender_id}`)
                    } else {
                      hashHistory.push(`${data.type}s/${data.id}`)
                    }
                  }}
                />
              ) :
              <div className="no-messages">{total === 0 ? '你没有消息哦~' : '请稍后。。。'}</div>
            }
          </SimplePTR>
          <div className="frame">
            {children}
          </div>
        </div>
      </div>
    )
  }
}

export default MsgListPage
