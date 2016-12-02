/**
 * Created by Frezc on 2016/10/12.
 */
import React, { PureComponent, PropTypes } from 'react';
import api from '../../../network/api';
import Clickable from '../../../components/Clickable';
import { Modal } from 'antd';
import auth from '../../configs/jwtAuth';

import './style.scss';

class AppHeader extends PureComponent {

  static propTypes = {
    avatar: PropTypes.string,
    nickname: PropTypes.any.isRequired
  };

  handleLogout = () => {
    Modal.confirm({
      title: '确定要退出登录？',
      onOk() {
        auth.toLogin();
      }
    })
  };

  render() {
    const { avatar, nickname } = this.props;

    return (
      <div className="app-header">
        <div className="title">淘兼职后台管理</div>
        <div className="abstract-profile">
          <img src={avatar ? api.host + avatar : require('../../../../assets/avatar.jpg')} alt="头像"/>
          <span>{nickname}</span>
          <Clickable style={{ marginLeft: 16 }} onClick={this.handleLogout}>注销</Clickable>
        </div>
      </div>
    )
  }
}

export default AppHeader