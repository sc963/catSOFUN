import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Typography, Progress, Row, Col, Button, Modal } from 'antd';
import moment from 'moment';
import s from 'antd/dist/antd.less';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { QuestionPlayerWrapper, InfoPanel } from './QuestionPlayer.style';
import Question from '../Question';

const { Text } = Typography;

class QuestionPlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentIdx: 0,
      answerLogs: [],
      pausing: false,
    };
  }

  handleOnSubmit = (question, isCorrect, costTime, isTimeout = false) => {
    const { questions, caseObj, onAllDone } = this.props;
    const { currentIdx, answerLogs } = this.state;
    const caseDate = moment(caseObj.createdAt, 'x').format(
      'YYYY-MM-DD H:mm:ss',
    );
    const log = { question, isCorrect, costTime, caseDate, isTimeout };
    this.setState(
      { answerLogs: [...answerLogs, log], currentIdx: currentIdx + 1 },
      () => {
        const { answerLogs: logs, currentIdx: idx } = this.state;
        if (idx === questions.length && onAllDone) {
          onAllDone(logs);
        }
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
    const { questions, timeoutSeconds } = this.props;
    const { currentIdx } = this.state;
    if (currentIdx === questions.length) {
      return <Text type="info">已做完所有題目</Text>;
    }
    const q = questions[currentIdx];
    if (!q) {
      return <Text type="danger">錯誤！找不到題目</Text>;
    }
    return (
      <Question
        question={q}
        onSubmit={this.handleOnSubmit}
        timeoutSeconds={timeoutSeconds}
        onTimeout={this.handleTimout}
      />
    );
  };

  render() {
    const { questions, showInfoPanel, showPauseButton } = this.props;
    const { currentIdx } = this.state;
    const currentProgress = parseFloat(
      (parseFloat(currentIdx / questions.length) * 100).toFixed(2),
    );
    return (
      <QuestionPlayerWrapper>
        {showPauseButton && (
          <Row type="flex" justify="end">
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
        {showInfoPanel && (
          <InfoPanel>
            <h3>
              測驗題 {currentIdx + 1} / {questions.length}
            </h3>
            <Progress percent={currentProgress} status="active" />
          </InfoPanel>
        )}
        {this.renderQuestion()}
      </QuestionPlayerWrapper>
    );
  }
}

QuestionPlayer.propTypes = {
  caseObj: PropTypes.object.isRequired,
  questions: PropTypes.array.isRequired,
  onAllDone: PropTypes.func.isRequired,
  timeoutSeconds: PropTypes.number,
  onTimeout: PropTypes.func,
  onPauseConfirm: PropTypes.func,
  showInfoPanel: PropTypes.bool,
  showPauseButton: PropTypes.bool,
};

QuestionPlayer.defaultProps = {
  showInfoPanel: false,
  showPauseButton: false,
  timeoutSeconds: null,
  onTimeout: null,
  onPauseConfirm: null,
};

export default withStyles(s)(QuestionPlayer);
