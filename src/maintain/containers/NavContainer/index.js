/**
 * Created by Frezc on 2016/10/12.
 */
import React from 'react';
import AppHeader from '../../components/AppHeader';
import { Menu } from 'antd';
import auth from '../../configs/jwtAuth';
import { connect } from 'react-redux';
import { replace, push } from 'react-router-redux';
import UserDetailModal from '../UserDetailModal';
import CompanyModal from '../CompanyModal';
import JobModal from '../JobModal';
import ExpectJobModal from '../ExpectJobModal';
import OrderModal from '../OrderModal';

const SubMenu = Menu.SubMenu;

import './style.scss';

class NavContainer extends React.Component {

  state = {
    openKeys: [],
    selectedKeys: []
  }

  setUpMenu({ pathname } = this.props) {
    const arr = pathname.split('/');
    this.setState({
      openKeys: arr.slice(2, 3),
      selectedKeys: [arr[arr.length - 1]]
    })
  }

  navTo(keyPath) {
    const { push } = this.props;
    console.log(keyPath);
    const path = keyPath.reverse();
    const state = { pathname: `/m/${path.join('/')}` };
    if (path[0] == 'um') {
      switch (path[1]) {
        case 'jobs':
          if (Boolean(window.localStorage.getItem('job_exist_show'))) state.query = { exist: 1 };
          break;
        case 'expect_jobs':
          if (Boolean(window.localStorage.getItem('expect_exist_show'))) state.query = { exist: 1 };
          break;
      }
    }
    push(state);
  }

  componentWillMount() {
    if (!auth.check()) {
      this.props.replace('/login');
    }
    this.setUpMenu();
  }

  componentWillReceiveProps(nextProps) {
    const { pathname } = this.props;
    if (pathname !== nextProps.pathname) {
      this.setUpMenu(nextProps);
    }
  }

  render() {
    const { children, user } = this.props;
    const { openKeys, selectedKeys } = this.state

    return (
      <div className="main-page">
        <AppHeader
          nickname={user.nickname}
          avatar={user.avatar}
        />
        <div className="content-with-menu">
          <Menu
            style={{ width: 240, height: '100%' }}
            mode="inline"
            openKeys={openKeys}
            onOpenChange={openKeys => this.setState({ openKeys })}
            selectedKeys={selectedKeys}
            onClick={({ keyPath }) => this.navTo(keyPath)}
          >
            <Menu.Item key="index">主页</Menu.Item>
            <SubMenu key="um" title="数据管理">
              <Menu.Item key="user_profiles">用户信息</Menu.Item>
              <Menu.Item key="companies">企业信息</Menu.Item>
              <Menu.Item key="jobs">岗位信息</Menu.Item>
              <Menu.Item key="orders">订单信息</Menu.Item>
              <Menu.Item key="expect_jobs">求职信息</Menu.Item>
              <Menu.Item key="job_evaluates">评价信息</Menu.Item>
            </SubMenu>
            <SubMenu key="am" title="申请处理">
              <Menu.Item key="real_name">实名认证</Menu.Item>
              <Menu.Item key="company">企业认证</Menu.Item>
              <Menu.Item key="feedbacks">用户反馈</Menu.Item>
              <Menu.Item key="reports">举报和投诉</Menu.Item>
            </SubMenu>
            <SubMenu key="ac" title="功能中心">
              <Menu.Item key="notifications">发送通知</Menu.Item>
              <Menu.Item key="banners">首页BANNER</Menu.Item>
            </SubMenu>
          </Menu>
          <div className="main-content">
            {children}
          </div>
        </div>
        <UserDetailModal />
        <CompanyModal />
        <JobModal />
        <ExpectJobModal />
        <OrderModal />
      </div>
    )
  }
}

function select(state) {
  return {
    pathname: state.router.locationBeforeTransitions.pathname,
    user: state.logonUser
  }
}

export default connect(select, { push, replace })(NavContainer);
