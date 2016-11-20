/**
 * Created by Frezc on 2016/11/20.
 */
import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Form, Input } from 'antd';
const FormItem = Form.Item;
import { objectFilter } from '../../../helpers';

class Filters extends PureComponent {

  state = {
    user_id: ''
  };

  setFilter(props = this.props) {
    const { user_id } = props.location.query;
    this.setState({ user_id });
  }

  handleSubmit = e => {
    e.preventDefault();
    const { push, location } = this.props;
    const { pathname, query } = location;
    console.log(this.state);
    push({
      pathname, query: objectFilter(Object.assign({}, query, this.state), (_, v) => v)
    });
  };

  componentWillMount() {
    this.setFilter();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.location != nextProps.location) {
      this.setFilter(nextProps);
    }
  }

  render() {
    const { style, className } = this.props;
    const { user_id } = this.state;

    return (
      <Form inline style={style} className={className} onSubmit={this.handleSubmit}>
        <FormItem
          label="用户id"
        >
          <Input
            size="default"
            value={user_id}
            onChange={e => {
              this.setState({ user_id: e.target.value.replace(/[^0-9]*/g, '') })
            }}
          />
        </FormItem>
      </Form>
    )
  }
}



function select(state, ownProps) {
  return {
    location: state.router.locationBeforeTransitions
  }
}

export default connect(select, { push })(Filters);
