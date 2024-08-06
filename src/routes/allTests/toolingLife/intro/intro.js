import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Divider, Carousel, Card, Row, Col, Button, Icon } from 'antd';
import s from 'antd/dist/antd.less';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {
  IntroRoot,
  IntroWrapper,
  TestName,
  IntroCardTitle,
  IntroCardDesc,
} from './intro.style';

class Intro extends Component {
  constructor(props) {
    super(props);
    this.carousel = null;
  }

  getCaseId = () => {
    const {
      params: {
        query: { caseId },
      },
    } = this.props;
    return caseId;
  };

  handleTestStart = () => {
    const {
      params: {
        query: { caseId },
      },
    } = this.props;
    window.location.href = `toolingLifeFormalTest?caseId=${caseId}`;
  };

  handleCarouselNext = () => {
    this.carousel.next();
  };

  handleCarouselPrev = () => {
    this.carousel.prev();
  };

  render() {
    const btnStartStyle = {
      width: 250,
      height: 80,
      fontSize: '2rem',
      fontWeight: 400,
    };
    return (
      <IntroRoot>
        <IntroWrapper>
          <TestName>工具性日常生活活動量表</TestName>
          <Divider />
          <Row gutter={16} type="flex" justify="center">
            <Col span={24} style={{ padding: '20px 120px' }}>
              <Carousel
                effect="fade"
                ref={node => {
                  this.carousel = node;
                }}
              >
                <div>
                  <Card bordered={false}>
                    <IntroCardTitle>測驗目的</IntroCardTitle>
                    <IntroCardDesc>
                      希望了解您的日常生活功能以及參與頻率。
                    </IntroCardDesc>
                    <Button type="primary" onClick={this.handleCarouselNext}>
                      下一步
                      <Icon type="right" />
                    </Button>
                  </Card>
                </div>
                <div>
                  <Card bordered={false}>
                    <IntroCardTitle>測驗說明</IntroCardTitle>
                    <IntroCardDesc>
                      <p>
                        請您根據過去1個月的實際情況圈選下列各題項分別參與的次數(或頻率)。
                      </p>
                      <p>若對題目有不瞭解，可先詢問工作人員後再填答。</p>
                    </IntroCardDesc>
                    <Button.Group>
                      <Button type="primary" onClick={this.handleCarouselPrev}>
                        <Icon type="left" />
                        上一步
                      </Button>
                      <Button type="primary" onClick={this.handleCarouselNext}>
                        下一步
                        <Icon type="right" />
                      </Button>
                    </Button.Group>
                  </Card>
                </div>
                <div>
                  <Card bordered={false}>
                    <IntroCardTitle>日常生活功能量表</IntroCardTitle>
                    <IntroCardDesc
                      style={{ textAlign: 'left', padding: '20px 50px' }}
                    >
                      <p>I 獨立程度(Independent)： 1-4分</p>
                      <p>P 參與度(Participant)：「經常」、「偶爾」、「很少」</p>
                      <p>R 資源支持程度(Resources)：1-3分、NA</p>
                      <p>
                        R
                        資源支持程度(Resources)資源需求調查：人、環境、輔具、經費補助
                      </p>
                    </IntroCardDesc>
                    <Button.Group>
                      <Button type="primary" onClick={this.handleCarouselPrev}>
                        <Icon type="left" />
                        上一步
                      </Button>
                      <Button type="primary" onClick={this.handleCarouselNext}>
                        下一步
                        <Icon type="right" />
                      </Button>
                    </Button.Group>
                  </Card>
                </div>
                <div>
                  <Card bordered={false}>
                    <IntroCardTitle>
                      本問卷不限時間，請您安心作答
                    </IntroCardTitle>
                    <IntroCardDesc>
                      <Button
                        style={btnStartStyle}
                        type="primary"
                        htmlType="button"
                        onClick={this.handleTestStart}
                      >
                        進入測驗
                      </Button>
                    </IntroCardDesc>
                  </Card>
                </div>
              </Carousel>
            </Col>
          </Row>
        </IntroWrapper>
      </IntroRoot>
    );
  }
}

Intro.propTypes = {
  params: PropTypes.object,
};

Intro.defaultProps = {
  params: { query: '' },
};

export default withStyles(s)(Intro);
