/**
 * Created by Frezc on 2016/12/5.
 */
import React, { PureComponent, PropTypes } from 'react';
import { Input } from 'antd';

import './style.css';

class ReadOnlyTextarea extends PureComponent {

  static propTypes = {}

  static defaultProps = {}

  render() {
    const { value } = this.props

    return (
      <Input type="textarea" autosize value={value} className="readonly-textarea" readOnly/>
    )
  }
}

export default ReadOnlyTextarea
