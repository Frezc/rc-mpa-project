/**
 * Created by Frezc on 2016/11/6.
 */
import React, { PureComponent, PropTypes } from 'react';
import { formatTime } from '../../helpers'

import './style.scss';

class MsgSection extends PureComponent {

  static propTypes = {
    avatar: PropTypes.string,
    name: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    unread: PropTypes.number,
    onPress: PropTypes.func
  }

  static defaultProps = {
    avatar: '',
    unread: 0
  }

  render() {
    const { avatar, name, content, time, onPress, unread } = this.props

    return (
      <div className="msg-section" onClick={onPress}>
        <img src={avatar || require('../../../assets/default-avatar.png')} alt="头像"/>
        <div className="msg-name no-break-line">{name}</div>
        <div className="msg-content no-break-line">{content}</div>
        <div className="msg-time">{formatTime(new Date(time))}</div>
        {unread > 0 &&
          <div className="msg-unread">{unread > 99 ? '99+' : unread}</div>
        }
      </div>
    )
  }
}

export default MsgSection
