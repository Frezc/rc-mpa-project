/**
 * Created by Frezc on 2016/10/18.
 */
import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Tabs, Icon, Form, Switch } from 'antd';
import { easyGet, api } from '../../../network';
import { Link } from 'react-router'
import { formItemLayout } from '../../configs/constants';

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;

class MainPage extends PureComponent {

  static propTypes = {}

  static defaultProps = {}

  state = {
    umsg: null,
    jobDeletedShow: false,
    expectDeletedShow: false
  };

  fetchData() {
    easyGet(api.boss_umsg)
      .then(json => this.setState({ umsg: json }))
  }

  componentWillMount() {
    this.fetchData();
    this.setState({
      jobDeletedShow: Boolean(window.localStorage.getItem('job_exist_show')) || false,
      expectDeletedShow: Boolean(window.localStorage.getItem('expect_exist_show')) || false
    })
  }

  render() {
    const { umsg, jobDeletedShow, expectDeletedShow } = this.state;

    return (
      <div className="card-container" style={{ margin: 8 }}>
        <Tabs type="card">
          <TabPane tab="事务提醒" key="1">
            {umsg ?
              <div style={{ fontSize: 14 }}>
                <p>未处理消息：</p>
                <div style={{ marginLeft: 16 }}>
                  <p><span style={styles.red}>{umsg.real_name_applies}</span>条<Link to="/m/am/real_name">实名认证</Link></p>
                  <p><span style={styles.red}>{umsg.company_applies}</span>条<Link to="/m/am/company">企业认证</Link></p>
                  <p><span style={styles.red}>{umsg.feedbacks}</span>条<Link to="/m/am/feedbacks">用户反馈</Link></p>
                  <p><span style={styles.red}>{umsg.reports}</span>条<Link to="/m/am/reports">举报</Link></p>
                </div>
                <p style={{ marginTop: 8 }}>更新于 {umsg.end_at}</p>
              </div> :
              <span><Icon type="loading" style={{ marginRight: 8 }}/>加载数据中。。</span>
            }
          </TabPane>
        </Tabs>
        <Tabs type="card" style={{ marginTop: 16 }}>
          <TabPane tab="系统设置" key="1">
            <Form style={{ width: 750 }}>
              <FormItem
                {...formItemLayout}
                label="岗位信息默认不显示删除项"
              >
                <Switch checked={jobDeletedShow} onChange={checked => {
                  this.setState({ jobDeletedShow: checked });
                  window.localStorage.setItem('job_exist_show', checked || '');
                }}/>
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="公开简历信息默认不显示删除项"
              >
                <Switch checked={expectDeletedShow} onChange={checked => {
                  this.setState({ expectDeletedShow: checked });
                  window.localStorage.setItem('expect_exist_show', checked || '');
                }}/>
              </FormItem>
            </Form>
          </TabPane>
        </Tabs>
      </div>
    )
  }
}

const styles = {
  red: { color: 'red', fontWeight: 'bold', marginRight: 4 }
}

function select(state, ownProps) {
  return {
    ...ownProps
  }
}

export default connect(select)(MainPage);
