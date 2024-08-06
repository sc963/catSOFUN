import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'antd';
import s from 'antd/dist/antd.less';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {
  QuestionWrapper,
  Number,
  AnswerPanel,
  AnswerButton,
} from './Question.style';

class Question extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startTimestamp: null,
    };
    this.countDownTimer = null;
  }

  submitQuestion = isCorrect => {
    const timeElapsed = new Date() - this.state.startTimestamp;
    const { question } = this.props;
    this.props.onSubmit(question.id, isCorrect, timeElapsed);
  };

  startTimeoutCoundown = () => {
    const { timeoutSeconds, onTimeout, question } = this.props;
    if (!timeoutSeconds || timeoutSeconds <= 0) {
      return;
    }
    if (this.countDownTimer !== null && this.countDownTimer !== undefined) {
      clearInterval(this.countDownTimer);
    }
    const beginTimestamp = new Date();
    this.countDownTimer = window.setInterval(() => {
      const elasped = new Date() - beginTimestamp;
      if (elasped >= timeoutSeconds * 1000) {
        console.info('Timeout!');
        if (onTimeout) {
          onTimeout(question.id);
        }
      }
    }, 100);
  };

  handleHasSix = () => {
    this.submitQuestion(this.props.question.exists);
  };

  handleHasNoSix = () => {
    this.submitQuestion(!this.props.question.exists);
  };

  componentDidMount = () => {
    this.setState({ startTimestamp: new Date() }, () => {
      this.startTimeoutCoundown();
    });
  };

  componentDidUpdate = prevProps => {
    const { question } = this.props;
    if (prevProps.question.id !== question.id) {
      this.setState({ startTimestamp: new Date() }, () => {
        this.startTimeoutCoundown();
      });
    }
  };

  componentWillUnmount = () => {
    if (this.countDownTimer) {
      clearInterval(this.countDownTimer);
    }
  };

  render() {
    const { question } = this.props;
    return (
      <QuestionWrapper key={question.id}>
        <Row type="flex" justify="center" gutter={8}>
          <Col span={4}>
            <Number>{question.number0}</Number>
          </Col>
          <Col span={4}>
            <Number>{question.number1}</Number>
          </Col>
          <Col span={4}>
            <Number>{question.number2}</Number>
          </Col>
          <Col span={4}>
            <Number>{question.number3}</Number>
          </Col>
          <Col span={4}>
            <Number>{question.number4}</Number>
          </Col>
        </Row>
        <AnswerPanel>
          <Row type="flex" justify="center" gutter={4}>
            <Col span={10}>
              <AnswerButton onClick={this.handleHasNoSix}>Ｘ</AnswerButton>
            </Col>
            <Col span={10}>
              <AnswerButton onClick={this.handleHasSix}>Ｏ</AnswerButton>
            </Col>
          </Row>
        </AnswerPanel>
      </QuestionWrapper>
    );
  }
}

Question.propTypes = {
  question: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  timeoutSeconds: PropTypes.number,
  onTimeout: PropTypes.func,
};

Question.defaultProps = {
  timeoutSeconds: null,
  onTimeout: null,
};

export default withStyles(s)(Question);
