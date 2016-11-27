/**
 * Created by Frezc on 2016/11/27.
 */
import React, { PureComponent, PropTypes } from 'react';
import './style.scss';

class MaskLayer extends PureComponent {

  static propTypes = {
    renderLayer: PropTypes.func,
    masked: PropTypes.bool
  };

  static defaultProps = {
    masked: false
  };

  render() {
    const { style, className, children, renderLayer, masked } = this.props;

    return (
      <div style={style} className={`mask-layer ${className}`}>
        <div className={`mask-container ${masked ? 'masked' : ''}`}>{children}</div>
        {masked &&
          <div className="dark-layer">
            {renderLayer && renderLayer()}
          </div>
        }
      </div>
    )
  }
}

export default MaskLayer
