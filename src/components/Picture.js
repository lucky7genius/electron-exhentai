import React, { Component } from 'react';
import autobind from 'autobind-decorator';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

import request from 'request';

import CircularProgress from 'material-ui/CircularProgress';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';

import { getEhWebPage } from '../service/UrlService';
import { getPic } from '../service/PicService';
// import { remote } from 'electron';

// const remote = window.require('electron').remote;
// const request = remote.require('request');

@withRouter
@inject('picStore')
@autobind
@observer
export default class Picture extends Component {
  componentDidMount() {
    this.props.picStore.setState(0);
    const url = this.props.picStore.Picture.PictureUrl;
    this.getPic(url);
  }

  getPic(url) {
    this.props.picStore.setState(0);
    const web = getEhWebPage(url);
    request.get(web, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        const picture = getPic(body);
        this.props.picStore.Picture = picture;
        this.props.picStore.setState(3);
      }
    });
  }

  getPrevPic() {
    this.getPic(this.props.picStore.Picture.prevPicUrl);
  }

  getNextPic() {
    this.getPic(this.props.picStore.Picture.nextPicUrl);
  }

  picBack() {
    this.props.push('/gallery');
  }
  picOnError() {
    // 失败会运行这个
    console.log('Error');
  }
  picOnLoad() {
    // 成功加载完毕会运行这个
    console.log('picOnLoad');
  }

  render() {
    const showPicture = () => (
      <div>
        <button onClick={() => this.getPrevPic()}>{'上一页'}</button>
        <button onClick={() => this.getNextPic()}>{'下一页'}</button>
        <button onClick={() => this.picBack()}>{'返回上一级'}</button>
        <Card>
          <img
            alt={this.props.picStore.Picture.pictureUrl}
            src={this.props.picStore.Picture.pictureUrl}
            onLoad={this.picOnLoad}
            onError={this.picOnError}
          />
        </Card>
      </div>
    );

    const pageState = (state) => {
      switch (state) {
        case 0:
          return <CircularProgress size={60} thickness={7} />;
        case 3:
          return showPicture();
        default:
          return 0;
      }
    };
    return (
      <div>
        {pageState(this.props.picStore.state)}
      </div>
    );
  }
}
