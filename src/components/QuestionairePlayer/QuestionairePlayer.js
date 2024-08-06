import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Typography, Progress, Row, Col, Button, Modal } from 'antd';
import moment from 'moment';
import s from 'antd/dist/antd.less';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { PlayerWrapper, InfoPanel } from './QuestionairePlayer.style';
import Questionaire from '../Questionaire';

const { Text } = Typography;

class QuestionairePlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentIdx: 0,
      answerLogs: [],
      pausing: false,
      valuesForRemainQuestion: [], // 紀錄後面還需要用到的字串們
      originalInitValues: [], // 紀錄原本完整的值，例如「是否曾經做過」的完整選單
    };
  }

  handleOnSubmit = (
    question,
    answer,
    costTime,
    isTimeout = false,
    initValues = [],
  ) => {
    const { questionaire, caseObj, onAllDone } = this.props;
    const { currentIdx, answerLogs } = this.state;
    const { order, body, type: questionType } = question;
    const caseDate = moment(caseObj.createdAt, 'x').format(
      'YYYY-MM-DD H:mm:ss',
    );
    const log = {
      questionaire: questionaire.id,
      order,
      questionType,
      body,
      answer,
      costTime,
      caseDate,
      isTimeout,
    };
    if (question.keepValue) {
      this.setState({ originalInitValues: initValues });
      this.setState({ valuesForRemainQuestion: answer.split(',') });
    }
    this.setState(
      { answerLogs: [...answerLogs, log], currentIdx: currentIdx + 1 },
      () => {
        const { answerLogs: logs, currentIdx: idx } = this.state;
        if (idx === questionaire.questions.length && onAllDone) {
          onAllDone(logs);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
    );
  };

  handleTimout = question => {
    const { timeoutSeconds, onTimeout } = this.props;
    this.handleOnSubmit(question, false, timeoutSeconds * 1000, true);
    if (onTimeout) {
      onTimeout(question);
    }
  };

  handlePause = () => {
    const { onPauseConfirm } = this.props;
    this.setState({ pausing: true }, () => {
      Modal.confirm({
        title: '確定暫停？',
        content: `測驗紀錄只會保存至第${this.state.answerLogs.length}題`,
        okText: '確定',
        cancelText: '取消',
        onOk: () => {
          if (onPauseConfirm) {
            onPauseConfirm(this.state.answerLogs);
          }
        },
        onCancel: () => {
          this.setState({ pausing: false });
        },
      });
    });
  };

  renderQuestion = () => {
    if (this.state.pausing) {
      return <h3>暫停中</h3>;
    }
    const { questionaire, timeoutSeconds } = this.props;
    const {
      currentIdx,
      valuesForRemainQuestion,
      originalInitValues,
    } = this.state;
    if (currentIdx === questionaire.questions.length) {
      return <Text type="info">已做完所有題目</Text>;
    }
    const q = questionaire.questions[currentIdx];
    if (!q) {
      return <Text type="danger">錯誤！找不到題目</Text>;
    }
    return (
      <Questionaire
        question={q}
        originalInitValues={originalInitValues}
        previousChoosedValues={valuesForRemainQuestion}
        onSubmit={this.handleOnSubmit}
        timeoutSeconds={timeoutSeconds}
        onTimeout={this.handleTimout}
      />
    );
  };

  render() {
    const {
      questionaire,
      showInfoPanel,
      showProgrssText,
      showPauseButton,
    } = this.props;
    const { currentIdx } = this.state;
    const currentProgress = parseFloat(
      (parseFloat(currentIdx / questionaire.questions.length) * 100).toFixed(2),
    );
    return (
      <PlayerWrapper>
        {showPauseButton && (
          <Row type="flex" justify="end" align="middle">
            {showInfoPanel && (
              <Col span={23}>
                <InfoPanel>
                  {showProgrssText && (
                    <h3>
                      題目數量 {currentIdx + 1} /{' '}
                      {questionaire.questions.length}
                    </h3>
                  )}
                  <Progress percent={currentProgress} status="active" />
                </InfoPanel>
              </Col>
            )}
            <Col span={1}>
              <Button
                type="dashed"
                shape="circle"
                icon="pause"
                size="small"
                onClick={this.handlePause}
              />
            </Col>
          </Row>
        )}
        {this.renderQuestion()}
      </PlayerWrapper>
    );
  }
}

QuestionairePlayer.propTypes = {
  caseObj: PropTypes.object.isRequired,
  questionaire: PropTypes.object.isRequired,
  onAllDone: PropTypes.func.isRequired,
  timeoutSeconds: PropTypes.number,
  onTimeout: PropTypes.func,
  onPauseConfirm: PropTypes.func,
  showInfoPanel: PropTypes.bool,
  showProgrssText: PropTypes.bool,
  showPauseButton: PropTypes.bool,
};

QuestionairePlayer.defaultProps = {
  showInfoPanel: false,
  showProgrssText: false,
  showPauseButton: false,
  timeoutSeconds: null,
  onTimeout: null,
  onPauseConfirm: null,
};

export default withStyles(s)(QuestionairePlayer);
