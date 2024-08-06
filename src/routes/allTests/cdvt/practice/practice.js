/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Button, Modal, Spin, notification, Typography } from 'antd';
import s from 'antd/dist/antd.less';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Query, Mutation } from 'react-apollo';
import Countdown from 'react-countdown-now';
import QuestionPlayer from '../../../../components/QuestionPlayer';
import Hint from './hint';
import {
  PracticeRoot,
  PracticeWrapper,
  BgAfterPractice,
  TextCountDown,
} from './practice.style';
import { GET_RANDOM_QUESTIONS, GET_CASE } from '../../../../db/queries/actions';
import { ADD_PRACTICE_LOGS } from '../../../../db/mutations/actions';

const FETCH_PRACTICE_Q_COUNT = 42;
const COUNDOWN_SECONDS = 60;

const { Title } = Typography;

class Practice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      restRemainSeconds: COUNDOWN_SECONDS,
      practicing: false,
      allQuestionAnswered: false,
    };
  }

  handleAllQuestionAnswered = (caseId, answerLogs, mutation) => {
    const { allQuestionAnswered } = this.state;
    console.info({ all: answerLogs });
    if (!allQuestionAnswered) {
      this.setState({ allQuestionAnswered: true }, () => {
        mutation({ variables: { caseId, logs: answerLogs } }).then(() =>
          notification.success({
            message: '儲存答題紀錄成功',
          }),
        );
      });
    }
  };

  handleStartPractice = () => {
    this.setState({ practicing: true });
  };

  countDownRender = ({ minutes, seconds, completed }) => {
    if (completed) {
      const {
        params: {
          query: { caseId },
        },
      } = this.props;
      return (
        <Row type="flex" justify="space-around" align="middle">
          <Col span={16}>
            <h2 style={{ marginTop: '20%' }}>網頁版數字警醒測驗</h2>
          </Col>
          <Col span={16}>
            <Button
              style={{ width: '350px', height: '70px', fontSize: '1.3em' }}
              type="primary"
              htmlType="button"
              size="large"
              onClick={() => {
                window.location.href = `cdvtFormalTest?caseId=${caseId}`;
              }}
            >
              正式開始測驗
            </Button>
          </Col>
        </Row>
      );
    }
    return (
      <BgAfterPractice style={{ minHeight: `768px` }}>
        <TextCountDown>
          練習結束，請休息片刻，正式測驗即將於
          {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
          後開始
        </TextCountDown>
      </BgAfterPractice>
    );
  };

  renderErrorModal = errorMsg => {
    Modal.error({
      title: '發生錯誤',
      content: errorMsg,
      keyboard: false,
      onOk: () => {
        window.location.href = '/';
      },
    });
  };

  componentDidMount = () => {
    const {
      params: {
        query: { caseId },
      },
    } = this.props;
    if (!caseId) {
      this.renderErrorModal('找不到個案，請重新再試。');
    }
  };

  render() {
    const { practicing, allQuestionAnswered, restRemainSeconds } = this.state;
    const {
      params: {
        query: { caseId },
      },
    } = this.props;
    return (
      <Query query={GET_CASE.query} variables={{ caseId }}>
        {({ loading, error, data: caseData }) => {
          if (loading) {
            return (
              <h3>
                驗證個案中... <Spin size="large" />
              </h3>
            );
          }
          if (error) {
            return <h3>{`驗證個案發生錯誤! ${error.message}`}</h3>;
          }
          const isReady =
            !loading && !practicing && !error && caseData && caseData.getCase;

          return (
            <PracticeRoot>
              {allQuestionAnswered && (
                <Countdown
                  date={Date.now() + restRemainSeconds * 1000}
                  renderer={this.countDownRender}
                />
              )}
              <PracticeWrapper>
                {(!caseData || !caseData.getCase) && <h3>個案不存在</h3>}
                {isReady && <Hint onPracticeStart={this.handleStartPractice} />}
                {practicing && (
                  <Query
                    query={GET_RANDOM_QUESTIONS.query}
                    variables={{
                      fetchCount: FETCH_PRACTICE_Q_COUNT,
                      practice: true,
                      fiftyFifty: true,
                    }}
                  >
                    {({
                      loading: questionLoading,
                      error: fetchQErr,
                      data: qData,
                    }) => {
                      if (questionLoading) return '取得題目中...';
                      if (fetchQErr) return `發生錯誤! ${fetchQErr.message}`;

                      return (
                        <Mutation mutation={ADD_PRACTICE_LOGS.query}>
                          {(
                            addPracticeLogs,
                            { loading: saving, error: saveErr },
                          ) => (
                            <div>
                              {!allQuestionAnswered && (
                                <div>
                                  <Title level={2} type="warning">
                                    練習模式
                                  </Title>
                                  <QuestionPlayer
                                    caseObj={caseData.getCase}
                                    questions={qData[GET_RANDOM_QUESTIONS.name]}
                                    onAllDone={logs =>
                                      this.handleAllQuestionAnswered(
                                        caseId,
                                        logs,
                                        addPracticeLogs,
                                      )
                                    }
                                  />
                                </div>
                              )}
                              {allQuestionAnswered && (
                                <div>
                                  {saving && <h3>正在儲存答題紀錄...</h3>}
                                  {saveErr && (
                                    <div>
                                      {notification.error({
                                        message: '儲存答題紀錄發生錯誤',
                                        description: saveErr.toString(),
                                      })}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </Mutation>
                      );
                    }}
                  </Query>
                )}
              </PracticeWrapper>
            </PracticeRoot>
          );
        }}
      </Query>
    );
  }
}

Practice.propTypes = {
  params: PropTypes.object,
};

Practice.defaultProps = {
  params: { query: '' },
};

export default withStyles(s)(Practice);
