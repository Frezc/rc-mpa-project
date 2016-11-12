/**
 * Created by Frezc on 2016/11/7.
 */
import React, { PureComponent, PropTypes } from 'react';
import { formatTime } from '../../helpers';

import './style.scss';

class NotificationSection extends PureComponent {

  static propTypes = {
    content: PropTypes.any.isRequired,
    time: PropTypes.string.isRequired
  }

  render() {
    const { content, time } = this.props

    return (
      <div className="notification-section">
        {content}
        <div className="time">{formatTime(new Date(time))}</div>
      </div>
    )
  }
}

export default NotificationSection;
