/**
 * Created by Frezc on 2016/11/25.
 */
import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Tabs, Carousel, message, Button, Icon, Modal } from 'antd';
const TabPane = Tabs.TabPane;
import auth from '../../configs/jwtAuth';
import BannerCard from '../../components/BannerCard';
import { easyGet, easyPost, api } from '../../../network';
import LocalIdArray from 'local-id-array';

import './style.scss';

class BannersPage extends PureComponent {


  state = {
    previewBanners: new LocalIdArray(),
    saving: false
  };

  fetchData() {
    const hide = message.loading('加载数据中。。。', 0);
    easyGet(api.banners)
      .then(banners => this.setState({ previewBanners: new LocalIdArray(banners) }))
      .catch(() => {})
      .then(hide)
  }

  addItem = () => {
    if (this.state.previewBanners.length >= 6) {
      message.info('最多只能显示6张图片');
    } else {
      this.setState((prevState) => ({
        previewBanners: prevState.previewBanners.push('')
      }));
    }
  };

  save = () => {
    const { previewBanners } = this.state;
    if (previewBanners.every(item => item)) {
      this.setState({ saving: true });
      easyPost(api.data, {
        key: 'banners',
        value: JSON.stringify(previewBanners.toArray())
      }).then(re => {
        message.success('保存成功');
      }).catch(() => {
      }).then(() => this.setState({ saving: false }));
    } else {
      message.info('请确保每项都不为空');
    }
  };

  componentWillMount() {
    this.fetchData();
  }

  componentWillReceiveProps() {
    this.fetchData();
  }

  render() {
    const { previewBanners, saving } = this.state;

    const token = auth.getToken();
    return (
      <div className="card-container banners-page">
        <Tabs type="card" className="banners-edit">
          <TabPane tab="选择图片" key="1">
            {previewBanners.map((url, id, i) =>
              <BannerCard
                key={id}
                style={{ marginBottom: 8 }}
                action={api.imgUpload}
                token={token}
                imgUrl={url && (api.host + url)}
                onChange={url => this.setState((prevState) => ({
                  previewBanners: prevState.previewBanners.set(i, url)
                }))}
                otherActions={[
                  <Button type="ghost" icon="up" className="action-button" key="1"
                    onClick={() => i > 0 && this.setState((prevState) => ({
                      previewBanners: prevState.previewBanners.exchange(i, i - 1)
                    }))}>
                    上移
                  </Button>,
                  <Button type="ghost" className="action-button" key="2"
                    onClick={() => i < previewBanners.length - 1 && this.setState((prevState) => ({
                      previewBanners: prevState.previewBanners.exchange(i, i + 1)
                    }))}>
                    <Icon type="down" style={{ fontSize: 14 }}/>下移
                  </Button>,
                  <Button type="dashed" icon="delete" className="action-button" key="3"
                    onClick={() => {
                      if (previewBanners.length <= 1) {
                        message.info('最少需要有一张图片');
                      } else {
                        Modal.confirm({
                          title: '确定要删除该项吗？',
                          onOk: () => {
                            this.setState((prevState) => ({
                              previewBanners: prevState.previewBanners.splice(i, 1)
                            }))
                          }
                        });
                      }
                    }}>
                    删除
                  </Button>
                ]}
              />
            )}
            <div style={{ marginTop: 8 }}>
              <Button size="large" type="ghost" icon="plus" style={{ marginRight: 16 }}
                      onClick={this.addItem}>
                添加一项
              </Button>
              <Button size="large" type="primary" icon="save" onClick={this.save} loading={saving}>保存</Button>
            </div>
          </TabPane>
        </Tabs>
        <Tabs type="card" className="banners-preview">
          <TabPane tab="预览" key="1">
            {previewBanners.length > 0 ?
              <Carousel autoplay>
                {previewBanners.map((url, id) =>
                  url && <img src={api.host + url} className="preview-pic" key={id}/>
                )}
              </Carousel> :
              <div className="preview-empty">请添加图片</div>
            }
          </TabPane>
        </Tabs>
      </div>
    )
  }
}

function select(state, ownProps) {
  return {
    ...ownProps
  }
}

export default connect(select)(BannersPage);
