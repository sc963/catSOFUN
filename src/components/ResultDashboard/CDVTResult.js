/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Row, Col } from 'antd';
import s from 'antd/dist/antd.less';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Query } from 'react-apollo';
import CaseInfo from './CaseInfo';
import { GET_CASE_WITH_RESULT } from '../../db/queries/actions';

const { Column } = Table;

class CDVTResult extends Component {
  getTableData = resultInfo => {
    const pracQcount = resultInfo.practiceTotalCount;
    const pracCorrect = (resultInfo.practiceCorrectRate * 100).toFixed(1);
    const pracIncorrectCount = resultInfo.practiceIncorrectCount;
    const pracReactionSeconds = parseFloat(
      resultInfo.practiceAvgReactSeconds,
    ).toFixed(4);
    const pracCorrectAvgReactionSeconds = (
      resultInfo.practiceAvgCorrectReactSeconds / 1000
    ).toFixed(4);
    const pracTotalSeconds = resultInfo.practiceTotalCostSeconds;
    const {
      pracTotalSecondsPR,
      pracCorrectCountPR,
      pracCorrectAvgSecondsPR,
    } = resultInfo;

    const formalQcount = resultInfo.formalTotalCount;
    const formalCorrect = (resultInfo.formalCorrectRate * 100).toFixed(1);
    const formalReactionSeconds = resultInfo.formalAvgReactSeconds;
    const formalCorrectAvgReactionSeconds = (
      resultInfo.formalAvgCorrectReactSeconds / 1000
    ).toFixed(4);
    const formalTotalSeconds = resultInfo.formalTotalCostSeconds;
    const {
      formalCorrectJudge,
      formalIncorrectCount,
      formalTimeoutCount,
      formalResTimeJudge,
      formalTotalCostTimeJudge,
      formalTotalSecondsPR,
      formalCorrectCountPR,
      formalCorrectAvgSecondsPR,
    } = resultInfo;

    return [
      {
        key: 'qc',
        metrics: '題目數',
        practice: pracQcount,
        formal: formalQcount,
      },
      {
        key: 'cr',
        metrics: '正確率(%)',
        practice: `${pracCorrect}%`,
        formal: `${formalCorrect}% (${formalCorrectJudge})`,
      },
      {
        key: 'ic',
        metrics: '錯誤題數(個)',
        practice: pracIncorrectCount,
        formal: formalIncorrectCount,
      },
      {
        key: 'tc',
        metrics: '未答題數(個)',
        practice: 0,
        formal: formalTimeoutCount,
      },
      {
        key: 'ar',
        metrics: '每題平均反應時間(秒)',
        practice: pracReactionSeconds,
        formal: `${formalReactionSeconds} (${formalResTimeJudge})`,
      },
      {
        key: 'at',
        metrics: '答對題目平均反應時間(秒)',
        practice: pracCorrectAvgReactionSeconds,
        formal: formalCorrectAvgReactionSeconds,
      },
      {
        key: 'tt',
        metrics: '總測驗反應時間(秒)',
        practice: pracTotalSeconds,
        formal: `${formalTotalSeconds} (${formalTotalCostTimeJudge})`,
      },
      {
        key: 'pr',
        metrics: '總測驗時間常模百分比(%)',
        practice: pracTotalSecondsPR,
        formal: formalTotalSecondsPR,
      },
      {
        key: 'pr2',
        metrics: '答對題目數量常模百分比(%)',
        practice: pracCorrectCountPR,
        formal: formalCorrectCountPR,
      },
      {
        key: 'pr3',
        metrics: '答對題目平均反應時間常模百分比(%)',
        practice: pracCorrectAvgSecondsPR,
        formal: formalCorrectAvgSecondsPR,
      },
    ];
  };

  render() {
    const { caseObj, testName } = this.props;
    return (
      <Query
        query={GET_CASE_WITH_RESULT.query}
        variables={{ caseId: caseObj.id }}
      >
        {({ loading, error, data }) => {
          if (loading) return '取得結果中...';
          if (error) return `取得個案結果發生錯誤:${error.toString()}`;

          const caseData = data[GET_CASE_WITH_RESULT.name];
          if (!caseData) return '取得個案結果格式有誤!';
          if (!caseData.result) {
            return '個案結果資料損毀!';
          }

          return (
            <div>
              <Row type="flex" justify="center">
                <Col span={18}>
                  <CaseInfo caseData={caseData} testName={testName} />
                </Col>
              </Row>
              <Row type="flex" justify="center">
                <Col span={18}>
                  <Table dataSource={this.getTableData(caseData.result)}>
                    <Column
                      title="結果參數"
                      dataIndex="metrics"
                      key="metrics"
                      align="center"
                    />
                    <Column
                      title="練習題"
                      dataIndex="practice"
                      key="practice"
                      align="center"
                    />
                    <Column
                      title="正式測驗"
                      dataIndex="formal"
                      key="formal"
                      align="center"
                    />
                  </Table>
                </Col>
              </Row>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={`/download/records?caseIds[]=${caseObj.id}`}
              >
                下載此份Excel報表
              </a>
              <br />
              <br />
            </div>
          );
        }}
      </Query>
    );
  }
}

CDVTResult.propTypes = {
  caseObj: PropTypes.object.isRequired,
  testName: PropTypes.string.isRequired,
};

export default withStyles(s)(CDVTResult);
