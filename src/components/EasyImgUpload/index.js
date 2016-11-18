/**
 * Created by Frezc on 2016/11/17.
 */
import React, { PureComponent, PropTypes } from 'react';
import { Upload, Button, Icon, message } from 'antd';
import api from '../../network/api';

import './style.scss';

class EasyImgUpload extends PureComponent {

  static propTypes = {
    action: PropTypes.string.isRequired,
    name: PropTypes.string,
    imgUrl: PropTypes.string,
    token: PropTypes.string.isRequired,
    onChange: PropTypes.func
  };

  handleChange = ({ file }) => {
    const { onChange } = this.props;
    switch (file.status) {
      case 'done':
        return onChange && onChange(file.response);
      case 'error':
        const msg = typeof file.response == 'object' ? file.response.error : file.response;
        return message.error(msg);
    }
  }

  render() {
    const { action, name, imgUrl, token, onChange } = this.props

    return (
      <div className="easy-img-upload">
        {imgUrl &&
          <a href={api.host + imgUrl} target="_blank">
            <img src={api.host + imgUrl} alt="上传的图片"/>
          </a>
        }
        <Upload
          name={name}
          action={action}
          accept="image/jpg,image/jpeg,image/png"
          headers={{ Authorization: `Bearer ${token}` }}
          showUploadList={false}
          onChange={this.handleChange}
        >
          <Button type="ghost">
            <Icon type="upload"/> 上传
          </Button>
        </Upload>
      </div>
    )
  }
}

export default EasyImgUpload
