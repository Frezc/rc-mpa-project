/**
 * Created by Frezc on 2016/11/27.
 */
import React, { PureComponent, PropTypes } from 'react';
import { Card, Button, Upload, message, Progress } from 'antd';
import MaskLayer from '../../../components/MaskLayer';
import LinkImg from '../../../components/LinkImg';

import './style.scss';

class BannerCard extends PureComponent {

  static propTypes = {
    action: PropTypes.string.isRequired,
    name: PropTypes.string,
    imgUrl: PropTypes.string,
    token: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    otherActions: PropTypes.array
  };

  static defaultProps = {
    name: 'file'
  };

  state = {
    uploading: false,
    uploadProgress: 0
  };

  handleUploadChange = ({ file }) => {
    const { onChange } = this.props;
    switch (file.status) {
      case 'done':
        this.setState({ uploading: false });
        return onChange && onChange(file.response);
      case 'uploading':
        return this.setState({ uploading: true, uploadProgress: Math.round(file.percent) });
      case 'error':
        this.setState({ uploading: false });
        const msg = typeof file.response == 'object' ? file.response.error : file.response;
        return message.error(msg);
    }
  }

  render() {
    const { action, name, imgUrl, token, style, className, otherActions } = this.props;
    const { uploading, uploadProgress } = this.state;

    return (
      <Card className={`banner-card ${className || ''}`} style={style} bodyStyle={{ padding: 0 }}>
        <MaskLayer
          className="banner-picture"
          masked={uploading}
          renderLayer={() => <Progress type="circle" percent={uploadProgress}/>}
        >
          {imgUrl ?
            <LinkImg src={imgUrl}/> :
            <div className="no-picture">请上传图片</div>
          }
        </MaskLayer>
        <div className="banner-actions">
          <Upload
            name={name}
            action={action}
            accept="image/jpg,image/jpeg,image/png"
            headers={{ Authorization: `Bearer ${token}` }}
            showUploadList={false}
            onChange={this.handleUploadChange}
            disabled={uploading}
          >
            <Button type="primary" icon="upload" className="action-button" loading={uploading}>上传</Button>
          </Upload>
          {otherActions}
        </div>
      </Card>
    )
  }
}

export default BannerCard
