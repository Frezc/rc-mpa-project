/**
 * Created by Frezc on 2016/11/9.
 */
import React, { PureComponent, PropTypes } from 'react';

import './style.scss';

class ChatBubble extends PureComponent {

  static propTypes = {
    children: PropTypes.string.isRequired,
    turnRight: PropTypes.bool
  };

  static defaultProps = {
    turnRight: false
  };

  convertNewLine() {
    const { children } = this.props;
    const sp = children.split(/\n/);
    const converted = [sp[0]];
    for (let i = 1; i < sp.length; i++) {
      converted.push(<br key={i}/>);
      converted.push(sp[i]);
    }
    return converted;
  }

  render() {
    const { turnRight } = this.props;

    return (
      <div
        className={`chat-bubble ${turnRight ? 'turn-right' : 'turn-left'}`}
      >
        {this.convertNewLine()}
      </div>
    )
  }
}

export default ChatBubble
