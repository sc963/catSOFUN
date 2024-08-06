/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Row, Col, Typography } from 'antd';
import s from 'antd/dist/antd.less';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { ImgSignature } from './ResultDashboard.style';

const { Text } = Typography;

class CaseInfo extends Component {
  render() {
    const { caseData, testName } = this.props;
    const caseDate = moment(caseData.createdAt, 'x').format(
      'YYYY-MM-DD H:mm:ss',
    );
    return (
      <Row type="flex" justify="space-between">
        <Col span={10}>
          <div style={{ textAlign: 'left' }}>
            <h1>個案編號：{caseData.caseNo}</h1>
            <h3>評估人員：{caseData.medicalStaff.name}</h3>
            <h3>項目：{testName}</h3>
            <h3>測驗地點：{caseData.location.name}</h3>
            <h3>測驗日期：{caseDate}</h3>
            {caseData.pause && (
              <Text type="danger">
                <b>此個案被評估人員中斷</b>
              </Text>
            )}
          </div>
          <br />
          <br />
        </Col>
        <Col span={14}>
          {caseData.signatureBase64 && caseData.signatureBase64 !== '' && (
            <div style={{ textAlign: 'right' }}>
              <ImgSignature src={caseData.signatureBase64} />
              <br />
              <Text type="secondary">受測者簽名</Text>
            </div>
          )}
        </Col>
      </Row>
    );
  }
}

CaseInfo.propTypes = {
  caseData: PropTypes.object.isRequired,
  testName: PropTypes.string.isRequired,
};

export default withStyles(s)(CaseInfo);
