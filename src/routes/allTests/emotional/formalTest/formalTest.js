import React, { Component } from 'react';
import { sampleSize, shuffle } from 'lodash';
import PropTypes from 'prop-types';
import { Modal, Spin, notification } from 'antd';
import s from 'antd/dist/antd.less';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Query, Mutation } from 'react-apollo';
import { FormalTestRoot, FormalTestWrapper } from './formalTest.style';
import { GET_CASE } from '../../../../db/queries/actions';
import { GET_QUESTIONAIRE } from '../../../../db/queries/actions/questionaireActions';
import { ADD_QUESTIONAIRE_LOGS } from '../../../../db/mutations/actions';
import {
  NAME_EMOTIONAL_TEST,
  Q_TYPE_EMOTIONAL_PRACTICE,
  Q_TYPE_EMOTIONAL_CONTROL,
  Q_TYPE_EMOTIONAL_FORMAL,
  Q_TYPE_HINT,
  Q_TYPE_WAIT_UNTIL,
} from '../../../../constants/models/questionaire.const';
import QuestionairePlayer from '../../../../components/QuestionairePlayer';
import TestFinished from '../../../../components/TestFinished';

const REST_SECONDS = 60;

class FormalTest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      testing: false,
      allQuestionAnswered: false,
    };
  }

  handlePauseConfirm = (answerLogs, mutation) => {
    this.saveAnswerLog(answerLogs, mutation, { pause: true });
  };

  handleAllQuestionAnswered = (answerLogs, mutation) => {
    this.saveAnswerLog(answerLogs, mutation);
  };

  handleStartFormalTest = () => {
    this.setState({ testing: true });
  };

  saveAnswerLog = (answerLogs, mutation, vars) => {
    const { allQuestionAnswered } = this.state;
    const caseId = this.getCaseId();
    console.info({ all: answerLogs });
    if (!allQuestionAnswered) {
      this.setState({ allQuestionAnswered: true }, () => {
        mutation({ variables: { caseId, logs: answerLogs, ...vars } }).then(
          () =>
            notification.success({
              message: '儲存答題紀錄成功',
            }),
        );
      });
    }
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
    if (!this.getCaseId()) {
      this.renderErrorModal('找不到個案編號，請重新再試。');
    }
  };

  getCaseId = () => {
    const {
      params: {
        query: { caseId },
      },
    } = this.props;
    return caseId;
  };

  createEmotionalTest = fullQuestionData => {
    const { id, name } = fullQuestionData;
    const practiceQs = fullQuestionData.questions.filter(
      q => q.type === Q_TYPE_EMOTIONAL_PRACTICE,
    );
    const formalQs = shuffle(
      fullQuestionData.questions.filter(
        q => q.type === Q_TYPE_EMOTIONAL_FORMAL,
      ),
    );
    const controlQs = shuffle(
      fullQuestionData.questions.filter(
        q => q.type === Q_TYPE_EMOTIONAL_CONTROL,
      ),
    );

    // 挑選指定的題目數量，並隨機選題
    const qDataAfterShuffle = {
      id,
      name,
      questions: [],
    };
    // 先練習10題
    qDataAfterShuffle.questions.push(...sampleSize(practiceQs, 10));

    // 休息一分鐘
    qDataAfterShuffle.questions.push({
      order: 99900,
      body: '練習結束，請休息片刻，正式測驗即將開始',
      type: Q_TYPE_WAIT_UNTIL,
      seconds: REST_SECONDS,
      buttonText: '下一步',
    });

    // 正式測驗開始提示
    qDataAfterShuffle.questions.push({
      order: 999001,
      body: '接下來為正式測驗',
      type: Q_TYPE_HINT,
      buttonText: '開始測驗',
      skippable: true,
      options: [],
    });

    // 做6組題目，每組有28題正式題 + 2題控制題，每組結束後休息一分鐘
    for (let i = 1; i < 7; i += 1) {
      const formalQ = formalQs.splice(0, 28);
      const controlQ = controlQs.splice(0, 2);
      qDataAfterShuffle.questions.push(...formalQ);
      qDataAfterShuffle.questions.push(...controlQ);
      if (i < 6) {
        qDataAfterShuffle.questions.push({
          order: 99902 + i,
          body: `已完成${i}組測驗，請休息片刻，第${i + 1}組測驗即將開始`,
          type: Q_TYPE_WAIT_UNTIL,
          seconds: REST_SECONDS,
          buttonText: '繼續測驗',
        });
      }
    }

    return qDataAfterShuffle;
  };

  render() {
    const { testing, allQuestionAnswered } = this.state;
    const caseId = this.getCaseId();
    let isRedo = false;
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
          if (caseData.getCase.pause) {
            this.renderErrorModal('此個案已被評估人員中斷，請建立新個案。');
            isRedo = true;
          }
          if (caseData.getCase.completed) {
            this.renderErrorModal('此個案已完成測驗，請重新建立個案。');
            isRedo = true;
          }
          const isReady =
            !loading &&
            !testing &&
            !error &&
            caseData &&
            caseData.getCase &&
            !isRedo;

          return (
            <FormalTestRoot>
              <FormalTestWrapper>
                {(!caseData || !caseData.getCase) && <h3>個案不存在</h3>}
                {isReady && this.handleStartFormalTest()}
                {allQuestionAnswered && (
                  <h3>
                    個案自陳問卷結束
                    <br />
                    您已完成作答，謝謝!
                  </h3>
                )}
                {testing && (
                  <Query
                    query={GET_QUESTIONAIRE.query}
                    variables={{
                      name: NAME_EMOTIONAL_TEST,
                    }}
                  >
                    {({
                      loading: questionLoading,
                      error: fetchQErr,
                      data: qData,
                    }) => {
                      if (questionLoading) return '正在取得測驗問題...';
                      if (fetchQErr) return `發生錯誤! ${fetchQErr.message}`;

                      return (
                        <Mutation mutation={ADD_QUESTIONAIRE_LOGS.query}>
                          {(
                            addFormalLogs,
                            { loading: saving, error: saveErr },
                          ) => (
                            <div>
                              {/* 開始作答 */}
                              {!allQuestionAnswered && (
                                <QuestionairePlayer
                                  showPauseButton
                                  caseObj={caseData.getCase}
                                  questionaire={this.createEmotionalTest(
                                    qData[GET_QUESTIONAIRE.name],
                                  )}
                                  onAllDone={logs =>
                                    this.handleAllQuestionAnswered(
                                      logs,
                                      addFormalLogs,
                                    )
                                  }
                                  onPauseConfirm={logs =>
                                    this.handlePauseConfirm(logs, addFormalLogs)
                                  }
                                />
                              )}
                              {/* 作答完成後續處理 */}
                              {allQuestionAnswered && saving && (
                                <h3>正在儲存答題紀錄...</h3>
                              )}
                              {allQuestionAnswered && saveErr && (
                                <div>
                                  {notification.error({
                                    message: '儲存答題紀錄發生錯誤',
                                    description: saveErr.toString(),
                                  })}
                                </div>
                              )}
                              {allQuestionAnswered && !saving && !saveErr && (
                                <TestFinished caseId={caseData.getCase.id} />
                              )}
                            </div>
                          )}
                        </Mutation>
                      );
                    }}
                  </Query>
                )}
              </FormalTestWrapper>
            </FormalTestRoot>
          );
        }}
      </Query>
    );
  }
}

FormalTest.propTypes = {
  params: PropTypes.object,
};

FormalTest.defaultProps = {
  params: { query: '' },
};

export default withStyles(s)(FormalTest);
