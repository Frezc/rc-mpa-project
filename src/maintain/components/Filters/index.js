/**
 * Created by Frezc on 2016/11/20.
 */
import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Form, Input, Select } from 'antd';
import { objectFilter } from '../../../helpers';

const FormItem = Form.Item;
const Option = Select.Option;

class Filters extends PureComponent {

  static propTypes = {
    filters: PropTypes.array.isRequired,
    types: PropTypes.array
  };

  static defaultProps = {
    types: []
  };

  state = {
    user_id: '',
    kw: '',
    type: ''
  };



  setFilter(props = this.props) {
    this.setState({
      user_id: '',
      kw: '',
      type: '',
      ...props.location.query
    });
  }

  filter() {
    const { push, location, filters } = this.props;
    const { pathname, query } = location;
    push({
      pathname, query: objectFilter({ ...query, ...objectFilter(this.state, filters) }, (_, v) => v)
    });
  }

  componentWillMount() {
    this.setFilter();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.location != nextProps.location) {
      this.setFilter(nextProps);
    }
  }

  render() {
    const { style, className, filters, types } = this.props;
    const { user_id, kw, type } = this.state;

    return (
      <Form inline style={style} className={className}>
        {filters.indexOf('user_id') != -1 &&
          <FormItem
            label="用户id"
          >
            <Input.Search
              size="default"
              value={user_id}
              onChange={e => {
                this.setState({ user_id: e.target.value.replace(/[^0-9]*/g, '') })
              }}
              onSearch={() => this.filter()}
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
              onSearch={() => this.filter()}
            />
          </FormItem>
        }
        {filters.indexOf('type') != -1 &&
          <FormItem
            label="类型"
          >
            <Select
              size="default"
              showSearch
              style={{ width: 120 }}
              value={type}
              onChange={type => {
                console.log(type);
                this.setState({ type }, () => this.filter());
              }}>
              <Option value={''}>不限</Option>
              {types.map(type =>
                <Option value={type} key={type}>{type}</Option>
              )}
            </Select>
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
