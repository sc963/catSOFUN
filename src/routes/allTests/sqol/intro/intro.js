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
    window.location.href = `sqolFormalTest?caseId=${caseId}`;
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
          <TestName>SQOLC生活品質量表</TestName>
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
                      <p>了解您目前的日常生活與健康狀態，</p>
                      <p>請選擇每項問題中最能反應您目前的想法或感覺的回答。</p>
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
                        有些問題可能涉及你的隱私。
                        不過它們是評估你各方面健康時必須了解的問題。
                      </p>
                    </IntroCardDesc>
                    <Button.Group>
                      <Button type="primary" onClick={this.handleCarouselPrev}>
                        <Icon type="left" />
                        上一步
                      </Button>
                      <Button
                        type="primary"
                        onClick={this.handleCarouselNext}
                        style={{ marginLeft: '26px' }}
                      >
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
