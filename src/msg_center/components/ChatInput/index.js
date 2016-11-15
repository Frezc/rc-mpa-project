/**
 * Created by Frezc on 2016/11/9.
 */
import React, { PureComponent, PropTypes } from 'react';

import './style.scss';

class ChatInput extends PureComponent {

  static propTypes = {
    className: PropTypes.string,
    value: PropTypes.any,
    onChange: PropTypes.func,
    onSubmit: PropTypes.func,
    maxHeight: PropTypes.number
  }

  static defaultProps = {
    value: '',
    maxHeight: 92
  }

  handleInputChange = e => {
    const { onChange } = this.props;
    onChange && onChange(e.target.value);
  };

  componentDidUpdate() {
    const { maxHeight } = this.props;
    this.inputEl.style.height = 'auto';
    if (this.inputEl.scrollHeight > maxHeight) {
      this.inputEl.style.overflow = 'auto';
      this.inputEl.style.height = `${maxHeight}px`;
    } else {
      this.inputEl.style.height = `${this.inputEl.scrollHeight}px`;
    }
  }

  render() {
    const { className, value, onSubmit } = this.props

    return (
      <div className={`chat-input ${className}`}>
        <textarea
          rows={1}
          ref={r => this.inputEl = r}
          value={value}
          onChange={this.handleInputChange}
        />
        <button onClick={onSubmit} disabled={!value}>发送</button>
      </div>
    )
  }
}

export default ChatInput
