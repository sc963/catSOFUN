import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Spin, notification } from 'antd';
import s from 'antd/dist/antd.less';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Query, Mutation } from 'react-apollo';
import QuestionPlayer from '../../../../components/QuestionPlayer';
import { FormalTestRoot, FormalTestWrapper } from './formalTest.style';
import { GET_RANDOM_QUESTIONS, GET_CASE } from '../../../../db/queries/actions';
import { ADD_FORMAL_LOGS } from '../../../../db/mutations/actions';
import TestFinished from '../../../../components/TestFinished';

const FETCH_FORMAL_Q_COUNT = 120;
const QUESTION_TIMEOUT = 5;

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
                {allQuestionAnswered && <h3>測驗結束，感謝您的作答。</h3>}
                {testing && (
                  <Query
                    query={GET_RANDOM_QUESTIONS.query}
                    variables={{
                      fetchCount: FETCH_FORMAL_Q_COUNT,
                      practice: false,
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
                        <Mutation mutation={ADD_FORMAL_LOGS.query}>
                          {(
                            addFormalLogs,
                            { loading: saving, error: saveErr },
                          ) => (
                            <div>
                              {/* 開始作答 */}
                              {!allQuestionAnswered && (
                                <QuestionPlayer
                                  showPauseButton
                                  showInfoPanel
                                  caseObj={caseData.getCase}
                                  questions={qData[GET_RANDOM_QUESTIONS.name]}
                                  timeoutSeconds={QUESTION_TIMEOUT}
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
