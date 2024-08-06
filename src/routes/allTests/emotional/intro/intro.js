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
  EmotionTypeWrapper,
  EmotionTypeText,
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
    window.location.href = `emotionalFormalTest?caseId=${caseId}`;
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
          <TestName>表情測驗</TestName>
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
                    <IntroCardTitle>測驗說明</IntroCardTitle>
                    <IntroCardDesc>
                      <p>請您依照顯示的照片，選出能夠代表照片人物的情緒</p>
                      <Row type="flex" justify="space-around" align="middle">
                        <Col span={24}>
                          <EmotionTypeWrapper>
                            <EmotionTypeText>
                              <p>快樂：歡樂，指感到高興或滿意</p>
                              <p>悲傷：哀痛憂傷，悲傷的思緒，是悲痛哀傷之意</p>
                              <p>生氣：發怒，因不合心意而不愉快</p>
                              <p>平靜：心情平和安靜</p>
                              <p>厭惡：討厭、憎惡，是一種反感的情緒</p>
                              <p>害怕：心中感到恐懼、驚慌</p>
                              <p>驚訝：驚異、驚奇，覺得很意外，很奇怪</p>
                              <p>不確定：不知道應該選擇哪個情緒</p>
                            </EmotionTypeText>
                          </EmotionTypeWrapper>
                        </Col>
                      </Row>
                    </IntroCardDesc>
                    <Button.Group>
                      <Button type="primary" onClick={this.handleCarouselNext}>
                        我暸解了
                        <Icon type="right" />
                      </Button>
                    </Button.Group>
                  </Card>
                </div>
                <div>
                  <Card bordered={false}>
                    <IntroCardTitle>練習題</IntroCardTitle>
                    <IntroCardDesc>
                      <Button
                        style={btnStartStyle}
                        type="primary"
                        htmlType="button"
                        onClick={this.handleTestStart}
                      >
                        進入練習
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
