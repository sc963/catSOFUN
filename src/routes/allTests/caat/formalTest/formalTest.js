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
  Q_TYPE_WAIT_UNTIL,
  NAME_CAAT_TEST,
  Q_TYPE_CAAT_PRACTICE,
  Q_TYPE_CAAT_FORMAL,
  CAAT_ASK_FOR_NUMERIC,
  CAAT_ASK_FOR_GRAPHIC,
  Q_TYPE_CAAT_SIMULATION,
  Q_TYPE_HINT,
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
    const isNumericQ = q =>
      JSON.parse(q.extraJsonInfo).askFor === CAAT_ASK_FOR_NUMERIC;
    const isGraphicQ = q =>
      JSON.parse(q.extraJsonInfo).askFor === CAAT_ASK_FOR_GRAPHIC;

    const practiceGraphicQs = fullQuestionData.questions.filter(
      q => q.type === Q_TYPE_CAAT_PRACTICE && isGraphicQ(q),
    );
    const practiceNumericQs = fullQuestionData.questions.filter(
      q => q.type === Q_TYPE_CAAT_PRACTICE && isNumericQ(q),
    );
    const simulationGraphicQs = fullQuestionData.questions.filter(
      q => q.type === Q_TYPE_CAAT_SIMULATION && isGraphicQ(q),
    );
    const simulationNumericQs = fullQuestionData.questions.filter(
      q => q.type === Q_TYPE_CAAT_SIMULATION && isNumericQ(q),
    );
    const formalGraphicQs = fullQuestionData.questions.filter(
      q => q.type === Q_TYPE_CAAT_FORMAL && isGraphicQ(q),
    );
    const formalNumericQs = fullQuestionData.questions.filter(
      q => q.type === Q_TYPE_CAAT_FORMAL && isNumericQ(q),
    );

    // 挑選指定的題目數量，並隨機選題
    const qDataAfterShuffle = {
      id,
      name,
      questions: [],
    };

    // 再次提醒
    qDataAfterShuffle.questions.push({
      order: 99800,
      body: `即將開始練習，並再次提醒您<br />
      當您判斷畫面數字<b style="color: red">小於5</b>時，請點擊<b style="color: red">Ｏ</b><br />
      當您判斷畫面數字<b style="color: #4287f5">大於5</b>時，請點擊<b style="color: #4287f5">Ｘ</b><br /><br />

      當您判斷畫面圖形小<b style="color: red">左右對稱</b>時，請點擊<b style="color: red">Ｏ</b><br />
      當您判斷畫面圖形小<b style="color: #4287f5">左右不對稱</b>時，請點擊<b style="color: #4287f5">Ｘ</b>`,
      buttonText: '下一步',
      type: Q_TYPE_HINT,
      skippable: true,
      options: [],
    });

    // 練習說明
    qDataAfterShuffle.questions.push({
      order: 998001,
      body: `即將開始練習題，提醒您<br />
      測驗中請務必將注意力放在題目上<br /><br />
      專注、不間斷並以最快的速度答題直到測驗結束。`,
      buttonText: '開始練習',
      type: Q_TYPE_HINT,
      skippable: true,
      options: [],
    });

    // 先練習10題數字題
    qDataAfterShuffle.questions.push(
      ...shuffle([...practiceNumericQs, ...sampleSize(practiceNumericQs, 2)]),
    );
    // 再練習10題圖形題
    qDataAfterShuffle.questions.push(
      ...shuffle([...practiceGraphicQs, ...sampleSize(practiceGraphicQs, 2)]),
    );
    // 再練習10題圖形＋數字題
    qDataAfterShuffle.questions.push(
      ...shuffle([
        ...sampleSize(practiceNumericQs, 5),
        ...sampleSize(practiceGraphicQs, 5),
      ]),
    );

    // 休息一分鐘
    qDataAfterShuffle.questions.push({
      order: 99900,
      body: `恭喜您，您已經了解題目的作答規則<br />
      請休息片刻，一分鐘後將開始模擬測驗<br /><br />

      請專注、不間斷並以最快的速度答題直到測驗結束`,
      type: Q_TYPE_WAIT_UNTIL,
      seconds: REST_SECONDS,
      buttonText: '開始模擬測驗',
    });

    // 模擬練習8題數字題
    qDataAfterShuffle.questions.push(...shuffle(simulationNumericQs));
    // 模擬練習8題圖形題
    qDataAfterShuffle.questions.push(...shuffle(simulationGraphicQs));
    // 模擬練習8題圖形題＋數字題
    qDataAfterShuffle.questions.push(
      ...shuffle([
        ...sampleSize(simulationNumericQs, 4),
        ...sampleSize(simulationGraphicQs, 4),
      ]),
    );

    // 正式測驗開始提示
    qDataAfterShuffle.questions.push({
      order: 999001,
      body: `恭喜您完成模擬測驗<br />
      請休息片刻，一分鐘後將進入正式測驗<br /><br />

      請保持專注、不間斷並以最快的速度答題直到測驗結束`,
      type: Q_TYPE_WAIT_UNTIL,
      seconds: REST_SECONDS,
      buttonText: '開始正式測驗',
    });

    // 正式測驗24題數字題
    qDataAfterShuffle.questions.push(
      ...shuffle([...formalNumericQs, ...formalNumericQs, ...formalNumericQs]),
    );
    // 正式測驗24題圖形題
    qDataAfterShuffle.questions.push(
      ...shuffle([...formalGraphicQs, ...formalGraphicQs, ...formalGraphicQs]),
    );
    // 正式測驗24題圖形＋數字題
    qDataAfterShuffle.questions.push(
      ...shuffle([
        ...sampleSize([...formalNumericQs, ...formalNumericQs], 12),
        ...sampleSize([...formalGraphicQs, ...formalGraphicQs], 12),
      ]),
    );

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
                      name: NAME_CAAT_TEST,
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
                                  showInfoPanel
                                  showProgrssText={false}
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
