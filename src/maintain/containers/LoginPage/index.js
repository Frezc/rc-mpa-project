/**
 * Created by Frezc on 2016/10/12.
 */
import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Form, Input, Button, Icon } from 'antd';
const FormItem = Form.Item;
import auth from '../../configs/jwtAuth';
import isEmail from 'validator/lib/isEmail';
import isLength from 'validator/lib/isLength';
import { setLogonUser } from '../../actions/user';
import { push } from 'react-router-redux';

import './style.scss'

class LoginPage extends PureComponent {

  static propTypes = {}

  static defaultProps = {}

  state = {
    email: '',
    password: '',
    error: {},
    loading: false
  }

  validate() {
    const { email, password } = this.state
    const error = {};
    let isPassed = true;
    if (!isEmail(email)) {
      error['email'] = {
        validateStatus: 'error',
        help: '请输入合法的邮箱地址'
      }
      isPassed = false;
    }

    if (!isLength(password, { min: 6 })) {
      error['password'] = {
        validateStatus: 'error',
        help: '密码不能少于6位'
      }
      isPassed = false;
    }

    this.setState({ error });
    return isPassed;
  }

  handleSubmit = (e) => {
    const { email, password } = this.state
    e.preventDefault();

    window.auth = auth

    if (this.validate()) {
      this.setState({ loading: true });
      auth.fetchAuth(email, password)
        .then(json => {
          // this.props.dispatch(setLogonUser(json.user));
          this.props.dispatch(push('/m'));
        })
        .catch(errorMsg => {
          const newState = {};
          if (errorMsg.error) {
            newState['error'] = errorMsg.error;
          }
          newState['loading'] = false;
          this.setState(newState);
        })
    }
  }

  componentWillMount() {
    if (auth.check()) {
      this.props.dispatch(push('/m'));
    }
  }

  render() {
    const { email, password, error, loading } = this.state;

    return (
      <div className="login-page">
        <div className="title">
          <Icon type="meh-o" className="title-icon"/>
          <span className="title-text">淘兼职后台管理</span>
        </div>
        <div className="input-box">
          <Form vertical onSubmit={this.handleSubmit}>
            <FormItem
              label="邮箱"
              hasFeedback
              {...(error['email'] || {})}
            >
              <Input
                placeholder="请输入邮箱"
                value={email}
                onChange={e => this.setState({ email: e.target.value })}
              />
            </FormItem>
            <FormItem
              label="密码"
              hasFeedback
              {...(error['password'] || {})}
            >
              <Input
                type="password"
                placeholder="请输入密码"
                value={password}
                onChange={e => this.setState({ password: e.target.value })}
              />
            </FormItem>
            <Button type="primary" htmlType="submit" className="submit" loading={loading}>登录</Button>
          </Form>
        </div>
      </div>
    )
  }
}

function select(state, ownProps) {
  return {
    ...ownProps
  }
}

export default connect(select)(LoginPage);
