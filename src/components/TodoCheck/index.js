/**
 * Created by ypc on 2016/9/21.
 */
import React, { PropTypes } from 'react'

class Checkbox extends React.Component {

  static propTypes = {
    checked: PropTypes.bool,
    onChange: PropTypes.func,
    size: PropTypes.number
  }

  static defaultProps = {
    checked: false,
    size: 32
  }

  renderUncheck () {
    const { size } = this.props
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 100 100"
      >
        <circle cx="50" cy="50" r="50" fill="none" stroke="#ededed" strokeWidth="3"/>
      </svg>
    )
  }

  renderChecked () {
    const { size } = this.props
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 100 100"
      >
        <circle cx="50" cy="50" r="50" fill="none" stroke="#bddad5" strokeWidth="3"/>
        <path fill="#5dc2af" d="M72 25L42 71 27 56l-4 4 20 20 34-52z"/>
      </svg>
    )
  }

  render () {
    const { style, checked, onChange, size } = this.props

    return (
      <span
        style={Object.assign({}, {
          display: 'inline-block',
          width: size,
          height: size,
          cursor: 'pointer'
        }, style)}
        onClick={() => onChange && onChange(!checked)}
      >
        {checked ? this.renderChecked() : this.renderUncheck()}
      </span>
    )
  }
}

export default Checkbox