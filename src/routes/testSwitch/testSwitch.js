import React, { Component } from 'react';
import { Row, Col, Card, Divider, Button } from 'antd';
import s from 'antd/dist/antd.less';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { TestSwitchRoot, TestSwitchWrapper } from './testSwitch.style';
import {
  CDVT,
  LEISURE,
  SOCIAL_PARTICIPATE,
  TOOLING_LIFE,
  EMOTIONAL,
  CAAT,
  SQOL,
} from '../../constants/testType.const';

class TestSwitch extends Component {
  handleTestSwitch = testTypeName => {
    window.location.href = `/newTest?testType=${testTypeName}`;
  };

  render() {
    return (
      <TestSwitchRoot>
        <TestSwitchWrapper>
          <h3>請選擇要進行的測驗</h3>
          <Divider />
          <Row gutter={16} type="flex" justify="space-between">
            <Col md={12} xs={24} style={{ padding: 10 }}>
              <Card title="網頁版數字警醒測驗" bordered={false}>
                <Button
                  style={{ width: '100%' }}
                  type="primary"
                  htmlType="button"
                  onClick={() => this.handleTestSwitch(CDVT)}
                >
                  進入測驗
                </Button>
              </Card>
            </Col>
            <Col md={12} xs={24} style={{ padding: 10 }}>
              <Card title="休閒生活滿意度量表" bordered={false}>
                <Button
                  style={{ width: '100%' }}
                  type="primary"
                  htmlType="button"
                  onClick={() => this.handleTestSwitch(LEISURE)}
                >
                  進入測驗
                </Button>
              </Card>
            </Col>
            <Col md={12} xs={24} style={{ padding: 10 }}>
              <Card title="社會參與度量表" bordered={false}>
                <Button
                  style={{ width: '100%' }}
                  type="primary"
                  htmlType="button"
                  onClick={() => this.handleTestSwitch(SOCIAL_PARTICIPATE)}
                >
                  進入測驗
                </Button>
              </Card>
            </Col>
            <Col md={12} xs={24} style={{ padding: 10 }}>
              <Card title="工具性日常生活活動量表" bordered={false}>
                <Button
                  style={{ width: '100%' }}
                  type="primary"
                  htmlType="button"
                  onClick={() => this.handleTestSwitch(TOOLING_LIFE)}
                >
                  進入測驗
                </Button>
              </Card>
            </Col>
            <Col md={12} xs={24} style={{ padding: 10 }}>
              <Card title="表情測驗" bordered={false}>
                <Button
                  style={{ width: '100%' }}
                  type="primary"
                  htmlType="button"
                  onClick={() => this.handleTestSwitch(EMOTIONAL)}
                >
                  進入測驗
                </Button>
              </Card>
            </Col>
            <Col md={12} xs={24} style={{ padding: 10 }}>
              <Card title="電腦化交替性注意力測驗" bordered={false}>
                <Button
                  style={{ width: '100%' }}
                  type="primary"
                  htmlType="button"
                  onClick={() => this.handleTestSwitch(CAAT)}
                >
                  進入測驗
                </Button>
              </Card>
            </Col>
            <Col md={12} xs={24} style={{ padding: 10 }}>
              <Card title="SQOLC生活品質量表" bordered={false}>
                <Button
                  style={{ width: '100%' }}
                  type="primary"
                  htmlType="button"
                  onClick={() => this.handleTestSwitch(SQOL)}
                >
                  進入測驗
                </Button>
              </Card>
            </Col>
          </Row>
        </TestSwitchWrapper>
      </TestSwitchRoot>
    );
  }
}

export default withStyles(s)(TestSwitch);
