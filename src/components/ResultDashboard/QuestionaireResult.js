/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reduce } from 'lodash';
import { Table, Row, Col, Divider, Statistic } from 'antd';
import s from 'antd/dist/antd.less';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Query } from 'react-apollo';
import CaseInfo from './CaseInfo';
import { TestSummaryWrapper } from './ResultDashboard.style';
import { GET_CASE_WITH_QUESTIONAIRE_RESULT } from '../../db/queries/actions';
import {
  NAME_TOOLING_LIFE,
  NAME_EMOTIONAL_TEST,
  Q_TYPE_EMOTIONAL_PRACTICE,
  Q_TYPE_EMOTIONAL_CONTROL,
  Q_TYPE_EMOTIONAL_FORMAL,
  NAME_CAAT_TEST,
} from '../../constants/models/questionaire.const';
import CAATReportMetrics from '../../db/utils/caatReportMetrics';

const { Column } = Table;
const EMOTIONAL_TYPES = [
  Q_TYPE_EMOTIONAL_PRACTICE,
  Q_TYPE_EMOTIONAL_CONTROL,
  Q_TYPE_EMOTIONAL_FORMAL,
];

class QuestionaireResult extends Component {
  getEmotionalResultTableData = resultInfo =>
    resultInfo.map((r, idx) => {
      if (EMOTIONAL_TYPES.includes(r.questionType)) {
        const { answer } = r;
        const ansObj = JSON.parse(answer) || {};
        const answerString = ansObj.clickOption || '';
        // const photoUrl = ansObj.photoUrl || '';
        const photoName = ansObj.photoName || r.body;
        return {
          key: `r_${idx}`,
          // photoUrl,
          photoName,
          ans: answerString,
          timecost: r.costTime,
        };
      }

      return {
        key: `r_${idx}`,
        photoName: r.body,
        ans: r.answer,
        timecost: r.costTime,
      };
    });

  getToolingResultTableData = resultInfo =>
    resultInfo.map((r, idx) => {
      let ans = r.answer;
      if (idx === 1) {
        // 餐點準備-獨立程度
        ans = JSON.parse(ans);
        ans = Object.keys(ans)
          .map(q => `${q}： ${ans[q]}`)
          .join(',');
      } else if (idx === 2) {
        // 餐點準備-參與頻率
        ans = JSON.parse(ans);
        ans = Object.keys(ans)
          .map(q => `${q}： ${ans[q]}`)
          .join('次/週,');
      } else if (idx === 3) {
        // 餐點準備-資源支持程度
        ans = JSON.parse(ans);
        ans = ans
          .map(
            obj =>
              `${obj.mainQuestion}：${obj.mainValue}` +
              `,資源支持：${obj.subValue.toString().replace(/,/g, '/')},,`,
          )
          .join(',');
      }

      ans = ans.replace(/,/g, '\n');
      return {
        key: `r_${idx}`,
        qbody: r.body,
        ans,
        timecost: r.costTime,
      };
    });

  getTableData = resultInfo => {
    const { testName } = this.props;

    if (testName === NAME_TOOLING_LIFE) {
      return this.getToolingResultTableData(resultInfo);
    }
    if (testName === NAME_EMOTIONAL_TEST) {
      return this.getEmotionalResultTableData(resultInfo);
    }

    return resultInfo.map((r, idx) => ({
      key: `r_${idx}`,
      qbody: r.body,
      ans: r.answer,
      timecost: r.costTime,
    }));
  };

  getEmotionalTestSummary = caseData => {
    const { questionaireHistories: histories } = caseData;
    const formals = histories.filter(
      h => h.questionType === Q_TYPE_EMOTIONAL_FORMAL,
    );
    const formalTotalCostSeconds =
      (reduce(formals, (result, p) => result + p.costTime, 0) / 1000).toFixed(
        4,
      ) || 0;
    const formalTotalScore = reduce(
      formals,
      (score, p) => {
        const ansObj = JSON.parse(p.answer);
        const userAns = parseInt(ansObj.clickOption, 10);
        const correctAns = parseInt(ansObj.photoName.split('_')[1], 10);
        return score + (userAns === correctAns ? 1 : 0);
      },
      0,
    );
    const emotionMap = {
      e_0: { correct: 0 },
      e_1: { correct: 0 },
      e_2: { correct: 0 },
      e_3: { correct: 0 },
      e_4: { correct: 0 },
      e_5: { correct: 0 },
      e_6: { correct: 0 },
    };
    const validQType = [
      Q_TYPE_EMOTIONAL_PRACTICE,
      Q_TYPE_EMOTIONAL_CONTROL,
      Q_TYPE_EMOTIONAL_FORMAL,
    ];
    formals.forEach(h => {
      if (validQType.includes(h.questionType)) {
        const ansObj = JSON.parse(h.answer);
        const userAns = parseInt(ansObj.clickOption, 10);
        const emotion = parseInt(ansObj.photoName.split('_')[1], 10);
        emotionMap[`e_${emotion}`].correct += userAns === emotion ? 1 : 0;
      }
    });
    return (
      <TestSummaryWrapper>
        <Row gutter={16}>
          <Col span={4}>
            <Statistic
              title="正式測驗總時間"
              value={`${formalTotalCostSeconds}秒`}
            />
          </Col>
          <Col span={4}>
            <Statistic title="答對的總題數" value={`${formalTotalScore}題`} />
          </Col>
        </Row>
        <Divider />
        <Row gutter={16}>
          <Col span={24}>
            <h4>答對表情分佈</h4>
          </Col>
          <Col span={2}>
            <Statistic title="快樂" value={emotionMap.e_1.correct} />
          </Col>
          <Col span={2}>
            <Statistic title="悲傷" value={emotionMap.e_2.correct} />
          </Col>
          <Col span={2}>
            <Statistic title="生氣" value={emotionMap.e_3.correct} />
          </Col>
          <Col span={2}>
            <Statistic title="厭惡" value={emotionMap.e_4.correct} />
          </Col>
          <Col span={2}>
            <Statistic title="害怕" value={emotionMap.e_5.correct} />
          </Col>
          <Col span={2}>
            <Statistic title="驚訝" value={emotionMap.e_6.correct} />
          </Col>
          <Col span={2}>
            <Statistic title="平靜" value={emotionMap.e_0.correct} />
          </Col>
        </Row>
      </TestSummaryWrapper>
    );
  };

  getCAATTestSummary = caseData => {
    const { questionaireHistories: histories } = caseData;
    const {
      practices,
      simulations,
      formals,
      practiceTotalCostSeconds,
      simulationTotalCostSeconds,
      formalTotalCostSeconds,
      practiceCorrectCount,
      simulationCorrectCount,
      formalCorrectCount,
    } = CAATReportMetrics(histories);

    return (
      <TestSummaryWrapper>
        <Row gutter={16}>
          <Col span={6}>結果參數</Col>
          <Col span={6}>練習題</Col>
          <Col span={6}>模擬測驗</Col>
          <Col span={6}>正式測驗</Col>
        </Row>
        <Divider />
        <Row gutter={16}>
          <Col span={6}>題目數</Col>
          <Col span={6}>30</Col>
          <Col span={6}>24</Col>
          <Col span={6}>72</Col>
        </Row>
        <Divider />
        <Row gutter={16}>
          <Col span={6}>正確率</Col>
          <Col span={6}>
            {(practiceCorrectCount / practices.length).toFixed(4) * 100}%
          </Col>
          <Col span={6}>
            {(simulationCorrectCount / simulations.length).toFixed(4) * 100}%
          </Col>
          <Col span={6}>
            {(formalCorrectCount / formals.length).toFixed(4) * 100}%
          </Col>
        </Row>
        <Divider />
        <Row gutter={16}>
          <Col span={6}>錯誤題數(個)</Col>
          <Col span={6}>{practices.length - practiceCorrectCount}</Col>
          <Col span={6}>{simulations.length - simulationCorrectCount}</Col>
          <Col span={6}>{formals.length - formalCorrectCount}</Col>
        </Row>
        <Divider />
        <Row gutter={16}>
          <Col span={6}>未答題數(個)</Col>
          <Col span={6}>{30 - practices.length}</Col>
          <Col span={6}>{24 - simulations.length}</Col>
          <Col span={6}>{72 - formals.length}</Col>
        </Row>
        <Divider />
        <Row gutter={16}>
          <Col span={6}>每題平均反應時間(秒)</Col>
          <Col span={6}>
            {(practiceTotalCostSeconds / practices.length).toFixed(4)}
          </Col>
          <Col span={6}>
            {(simulationTotalCostSeconds / simulations.length).toFixed(4)}
          </Col>
          <Col span={6}>
            {(formalTotalCostSeconds / formals.length).toFixed(4)}
          </Col>
        </Row>
        <Divider />
        <Row gutter={16}>
          <Col span={6}>總測驗反應時間(秒)</Col>
          <Col span={6}>{practiceTotalCostSeconds}</Col>
          <Col span={6}>{simulationTotalCostSeconds}</Col>
          <Col span={6}>{formalTotalCostSeconds}</Col>
        </Row>
        <Divider />
      </TestSummaryWrapper>
    );
  };

  render() {
    const { caseObj, testName } = this.props;

    return (
      <Query
        query={GET_CASE_WITH_QUESTIONAIRE_RESULT.query}
        variables={{ caseId: caseObj.id }}
      >
        {({ loading, error, data }) => {
          if (loading) return '取得結果中...';
          if (error) return `取得個案結果發生錯誤:${error.toString()}`;

          const caseData = data[GET_CASE_WITH_QUESTIONAIRE_RESULT.name];
          if (!caseData) return '取得個案結果格式有誤!';
          if (!caseData.questionaireHistories) {
            return '個案結果資料損毀!';
          }

          return (
            <div>
              <Row>
                <Col span={22} offset={1}>
                  <CaseInfo caseData={caseData} testName={testName} />
                  {testName === NAME_CAAT_TEST &&
                    this.getCAATTestSummary(caseData)}
                  {testName === NAME_EMOTIONAL_TEST &&
                    // 測驗總時間、答對的總題數、各個表情答對的總題數
                    this.getEmotionalTestSummary(caseData)}

                  {testName !== NAME_EMOTIONAL_TEST &&
                    testName !== NAME_CAAT_TEST && (
                      <Table
                        style={{ whiteSpace: 'pre' }}
                        dataSource={this.getTableData(
                          caseData.questionaireHistories,
                        )}
                        pagination={{ defaultPageSize: 50 }}
                      >
                        <Column
                          title="題目內容"
                          dataIndex="qbody"
                          key="qbody"
                          align="left"
                        />
                        <Column
                          title="受測者回應"
                          dataIndex="ans"
                          key="ans"
                          align="left"
                        />
                        <Column
                          title="費時(ms)"
                          dataIndex="timecost"
                          key="timecost"
                          align="center"
                        />
                      </Table>
                    )}
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

QuestionaireResult.propTypes = {
  caseObj: PropTypes.object.isRequired,
  testName: PropTypes.string.isRequired,
};

export default withStyles(s)(QuestionaireResult);
