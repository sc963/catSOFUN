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
  IntroCardScore,
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
    window.location.href = `socialParticipateFormalTest?caseId=${caseId}`;
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
          <TestName>社會參與度量表</TestName>
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
                      本問卷希望了解您與他人互動，以及參與社區活動的情形。
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
                    <IntroCardTitle>分數說明</IntroCardTitle>
                    <IntroCardScore
                      style={{ textAlign: 'left', padding: '5px 75px' }}
                    >
                      <p>5分：每天都這麼做，例如：每天都會主動找家人聊天。</p>
                      <p>
                        4分：每都3次(含)以上，例如：幾乎每2天就會用網路訊息關心朋友過得好不好。
                      </p>
                      <p>3分：每都1-2次，例如：每到假日總會邀請朋友聚會。</p>
                      <p>2分：兩週1次，例如：每2週會去親戚家拜訪一次。</p>
                      <p>
                        1分：每月1次或過去1個月沒有這麼做，例如：過去1個月都沒有參加宗教活動
                      </p>
                    </IntroCardScore>
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
