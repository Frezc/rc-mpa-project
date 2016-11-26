/**
 * Created by Frezc on 2016/11/25.
 */
import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Tabs, Carousel } from 'antd';
const TabPane = Tabs.TabPane;

import './style.scss';

class BannersPage extends PureComponent {


  state = {
    previewBanners: []
  }

  render() {
    const {} = this.props;
    const { previewBanners } = this.state;

    return (
      <div style={{ margin: 16, minWidth: 960 }} className="card-container banners-page">
        <Tabs type="card" className="banners-edit">
          <TabPane tab="选择图片">123</TabPane>
        </Tabs>
        <Tabs type="card" className="banners-preview">
          <TabPane tab="预览">
            <Carousel>
              {previewBanners.map(url =>
                <img src={url} className="preview-pic"/>
              )}
            </Carousel>
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
