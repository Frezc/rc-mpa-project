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

  static propTypes = {
    filters: PropTypes.array.isRequired
  };

  state = {
    user_id: '',
    kw: ''
  };

  setFilter(props = this.props) {
    this.setState(props.location.query);
  }

  handleSubmit = e => {
    e.preventDefault();
    const { push, location, filters } = this.props;
    const { pathname, query } = location;
    push({
      pathname, query: objectFilter({ ...query, ...objectFilter(this.state, filters) }, (_, v) => v)
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
    const { style, className, filters } = this.props;
    const { user_id, kw } = this.state;

    return (
      <Form inline style={style} className={className} onSubmit={this.handleSubmit}>
        {filters.indexOf('user_id') != -1 &&
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
        }
        {filters.indexOf('kw') != -1 &&
          <FormItem
            label="搜索"
          >
            <Input.Search
              size="default"
              value={kw}
              onChange={e => {
                this.setState({ kw: e.target.value })
              }}
            />
          </FormItem>
        }
      </Form>
    )
  }
}



function select(state, ownProps) {
  return {
    location: state.router.locationBeforeTransitions,
    ...ownProps
  }
}

export default connect(select, { push })(Filters);
