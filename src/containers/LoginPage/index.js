/**
 * Created by Frezc on 2016/10/12.
 */
import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Form, Input, Button, Icon } from 'antd';
const FormItem = Form.Item;
import { easyPost } from '../../helpers';
import api from '../../configs/api'

import './style.scss'

class LoginPage extends PureComponent {

  static propTypes = {}

  static defaultProps = {}

  state = {
    email: '',
    password: ''
  }

  handleSubmit = (e) => {
    const { email, password } = this.state
    e.preventDefault();

    easyPost(api.auth, { email, password });
  }

  render() {
    const { email, password } = this.state

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
            >
              <Input
                placeholder="请输入邮箱"
                value={email}
                onChange={e => this.setState({ email: e.target.value })}
              />
            </FormItem>
            <FormItem
              label="密码"
            >
              <Input
                type="password"
                placeholder="请输入密码"
                value={password}
                onChange={e => this.setState({ password: e.target.value })}
              />
            </FormItem>
            <Button type="primary" htmlType="submit" className="submit">登录</Button>
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
