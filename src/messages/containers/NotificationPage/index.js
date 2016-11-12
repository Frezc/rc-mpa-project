/**
 * Created by Frezc on 2016/11/3.
 */
import React, { PureComponent, PropTypes } from 'react';
import NotificationSection from '../../../components/NotificationSection';
import { mobileGet } from '../../helpers';
import SimplePTR from 'rc-pull-to-refresh/lib/SimplePTR';
import api from '../../../network/api';

class NotificationPage extends PureComponent {

  state = {
    total: 0,
    list: [],
    loading: false
  }

  fetchDate(refresh = false) {
    if (refresh) {
      this.setState({
        loading: true
      });
    }
    const { id } = this.props.params;
    const off = refresh ? 0 : this.state.list.length;
    mobileGet(`${api.notifications}/${id}`, { off })
      .then(({ total, list }) => this.setState((prevState) => ({
        total,
        list: refresh ? list : prevState.list.concat(list),
        loading: false
      })));
  }

  handleRefresh = () => {
    this.fetchDate(true);
  };

  loadMore = () => {
    this.fetchDate();
  };

  componentDidMount() {
    this.fetchDate(true);
  }

  render() {
    console.log(this.props);
    const {} = this.props;
    const { list, loading } = this.state;

    return (
      <SimplePTR
        className="fill"
        loading={loading}
        onRefresh={this.handleRefresh}
        onEndReached={this.loadMore}
      >
        {list.map((data, index) =>
          <NotificationSection
            key={index}
            content={data.content}
            time={data.created_at}
          />
        )}
      </SimplePTR>
    )
  }
}

export default NotificationPage
