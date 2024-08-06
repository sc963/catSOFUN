import React, { Component } from 'react';
import { Button, Row, Col } from 'antd';
import s from 'antd/dist/antd.less';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {
  WelcomeRoot,
  BannerWrapper,
  Banner,
  BannerTitle,
  MenuWrapper,
} from './welcome.style';

class Welcome extends Component {
  handleNewTest = () => {
    window.location.href = '/testSwitch';
  };

  handleLoadRecord = () => {
    window.location.href = '/historicalRecords';
  };

  render() {
    return (
      <WelcomeRoot>
        <Banner>
          <BannerWrapper>
            <Row type="flex" justify="space-around" align="middle">
              <Col>
                <BannerTitle>
                  歡迎使用
                  <br />
                  職能評估測驗系統
                </BannerTitle>
              </Col>
            </Row>
          </BannerWrapper>
          <MenuWrapper>
            <Row type="flex" justify="space-around" align="middle">
              <Col span={12}>
                <Button
                  style={{
                    height: '65px',
                    fontSize: '1.4em',
                    padding: '0 20px',
                  }}
                  type="primary"
                  htmlType="button"
                  size="large"
                  icon="right-circle"
                  onClick={this.handleNewTest}
                >
                  進入測驗
                </Button>
              </Col>
            </Row>
          </MenuWrapper>
        </Banner>
      </WelcomeRoot>
    );
  }
}

export default withStyles(s)(Welcome);
