/**
 * Created by Frezc on 2016/10/12.
 */
import React from 'react';
import AppHeader from '../../../components/AppHeader';
import { Menu, Badge } from 'antd';
const SubMenu = Menu.SubMenu;
import auth from '../../configs/jwtAuth';
import { connect } from 'react-redux';
import { replace, push } from 'react-router-redux';
import UserDetailModal from '../UserDetailModal';
import CompanyModal from '../CompanyModal';
import JobModal from '../JobModal';
import ExpectJobModal from '../ExpectJobModal';

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
    const { dispatch } = this.props;
    dispatch(push(`/m/${keyPath.reverse().join('/')}`));
  }

  componentWillMount() {
    if (!auth.check()) {
      this.props.dispatch(replace('/login'));
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
              <Menu.Item key="expect_jobs">公开简历信息</Menu.Item>
            </SubMenu>
            <SubMenu key="am" title="申请处理">
              <Menu.Item key="real_name">实名认证</Menu.Item>
              <Menu.Item key="company">企业认证</Menu.Item>
              <Menu.Item key="feedbacks">用户反馈</Menu.Item>
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

export default connect(select)(NavContainer);
