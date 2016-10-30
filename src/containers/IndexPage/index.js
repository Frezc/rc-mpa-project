/**
 * Created by Frezc on 2016/10/18.
 */
import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';

class MainPage extends PureComponent {

  static propTypes = {}

  static defaultProps = {}

  render() {
    const {} = this.props

    return (
      <div>
        主页
      </div>
    )
  }
}

function select(state, ownProps) {
  return {
    ...ownProps
  }
}

export default connect(select)(MainPage);
