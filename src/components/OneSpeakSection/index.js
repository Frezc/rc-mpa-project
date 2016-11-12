/**
 * Created by Frezc on 2016/11/9.
 */
import React, { PureComponent, PropTypes } from 'react';
import ChatBubble from '../ChatBubble';

import './style.scss';

class OneSpeakSection extends PureComponent {

  static propTypes = {
    children: PropTypes.string.isRequired,
    avatar: PropTypes.string,
    attachRight: PropTypes.bool
  }

  static defaultProps = {
    attachRight: true,
    avatar: ''
  }

  render() {
    const { children, attachRight, avatar } = this.props

    return (
      <div className={`one-speak-section ${attachRight ? 'attach-right' : 'attach-left'}`}>
        <img src={avatar || require('../../../assets/default-avatar.png')} alt="头像"/>
        <ChatBubble
          turnRight={attachRight}
        >
          {children}
        </ChatBubble>
      </div>
    )
  }
}

export default OneSpeakSection
