/**
 * Created by Frezc on 2016/11/16.
 */
import React, { PureComponent, PropTypes } from 'react';

class Clickable extends PureComponent {

  static propTypes = {
    onClick: PropTypes.func
  };

  clickAgent = (e) => {
    const { onClick } = this.props;
    e.preventDefault();
    onClick && onClick(e);
  };

  render() {
    return (
      <a {...this.props} onClick={this.clickAgent} />
    )
  }
}

export default Clickable;
