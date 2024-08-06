import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Button, Icon } from 'antd';
import ReactHtmlParser from 'react-html-parser';
import s from 'antd/dist/antd.less';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { QuestionWrapper, QuestionBody } from './Questionaire.style';
import QuestionaireFrequency from './QuestionaireFrequency';
import QuestionaireCheckbox from './QuestionaireCheckbox';
import QuestionaireLevelChoose from './QuestionaireLevelChoose';
import QuestionaireWhen from './QuestionaireWhen';
import QuestionaireEverDoneBefore from './QuestionaireEverDoneBefore';
import QuestionaireBatchLevelSelect from './QuestionaireBatchLevelSelect';
import QuestionaireBatchFrequencyChoose from './QuestionaireBatchFrequencyChoose';
import QuestionaireBatchSubQuestion from './QuestionaireBatchSubQuestion';
import QuestionaireEmotional from './QuestionaireEmotional';
import QuestionaireCAAT from './QuestionaireCAAT';
import QuestionaireWaitUntil from './QuestionaireWaitUntil';
import {
  Q_TYPE_5_LEVELS,
  Q_TYPE_TRUE_FALSE,
  Q_TYPE_HINT,
  Q_TYPE_TWO_TIERS_MULTIPLE_CHOICE,
  Q_TYPE_FREQUENCY,
  Q_TYPE_TIME_SELECT,
  Q_TYPE_CUSTOM,
  Q_TYPE_BATCH_LEVEL_SELECT,
  Q_TYPE_EVER_DONE_BEFORE,
  Q_TYPE_BATCH_FREQUENCY_CHOOSE,
  Q_TYPE_BATCH_SUB_QUESTION,
  Q_TYPE_EMOTIONAL_PRACTICE,
  Q_TYPE_EMOTIONAL_CONTROL,
  Q_TYPE_EMOTIONAL_FORMAL,
  Q_TYPE_CAAT_FORMAL,
  Q_TYPE_CAAT_PRACTICE,
  Q_TYPE_WAIT_UNTIL,
  Q_TYPE_CAAT_SIMULATION,
  Q_TYPE_SQOL_POSITIVE_SCORING,
  Q_TYPE_SQOL_NEGATIVE_SCORING,
  Q_TYPE_TEXT_INPUT,
} from '../../constants/models/questionaire.const';
import QuestionaireSQOLSelection from './QuestionaireSQOLSelection';
import QuestionaireTextInput from './QuestionaireTextInput';

const SHOW_Q_BODY_INDEPENDENTLY_TYPES = [
  Q_TYPE_EMOTIONAL_PRACTICE,
  Q_TYPE_EMOTIONAL_CONTROL,
  Q_TYPE_EMOTIONAL_FORMAL,
  Q_TYPE_CAAT_FORMAL,
  Q_TYPE_CAAT_PRACTICE,
  Q_TYPE_CAAT_SIMULATION,
];

class Questionaire extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startTimestamp: null,
      originalInitValues: [],
    };
    this.countDownTimer = null;
  }

  onOriginalInitValuesUpdate = values => {
    this.setState({ originalInitValues: values });
  };

  submitQuestion = value => {
    const timeElapsed = new Date() - this.state.startTimestamp;
    const { question } = this.props;
    const { originalInitValues } = this.state;
    this.props.onSubmit(
      question,
      value,
      timeElapsed,
      false,
      originalInitValues,
    );
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
          onTimeout(question);
        }
      }
    }, 100);
  };

  handleHintNext = () => {
    this.submitQuestion('hintAcknowledge');
  };

  handleOptionClick = event => {
    const clickOptionValue = event.currentTarget.dataset.value;
    this.submitQuestion(clickOptionValue);
  };

  componentDidMount = () => {
    this.setState({ startTimestamp: new Date() }, () => {
      this.startTimeoutCoundown();
    });
  };

  componentDidUpdate = prevProps => {
    const { question } = this.props;
    const isSameBody = prevProps.question.body === question.body;
    const isSameOrder = prevProps.question.order === question.order;
    if (!isSameBody || !isSameOrder) {
      // eslint-disable-next-line react/no-did-update-set-state
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

  // 20200901 需求追加：讓資源支持程度選項不要顯示N/A, 2, 1, 0。選項改成文字
  restructureResourceSupportOptionTitle = question => {
    const { options } = question;
    const newOptions = options.map(o => {
      let newTitle = o.title;
      switch (o.title) {
        case 'N/A':
          newTitle = '不需協助';
          break;
        case '2':
          newTitle = '有資源，並提供穩定協助';
          break;
        case '1':
          newTitle = '有資源，但無法提供穩定協助';
          break;
        case '0':
          newTitle = '無資源協助';
          break;
        default:
          break;
      }
      return {
        ...o,
        title: newTitle,
      };
    });
    return { ...question, options: newOptions };
  };

  render() {
    const { question, previousChoosedValues, originalInitValues } = this.props;
    const { body, order, buttonText } = question;
    const btnHintStyle = {
      width: 250,
      height: 60,
      fontSize: '1.5em',
      fontWeight: 400,
    };

    return (
      <QuestionWrapper key={order}>
        {!SHOW_Q_BODY_INDEPENDENTLY_TYPES.includes(question.type) && (
          <Row type="flex" justify="center" gutter={8}>
            <Col span={24}>
              <QuestionBody>{ReactHtmlParser(body)}</QuestionBody>
            </Col>
          </Row>
        )}

        {question.type === Q_TYPE_HINT && (
          <Button
            style={btnHintStyle}
            type="primary"
            onClick={this.handleHintNext}
          >
            {buttonText || '我已了解'}
            <Icon type="right" />
          </Button>
        )}

        {question.type === Q_TYPE_WAIT_UNTIL && (
          <QuestionaireWaitUntil
            question={question}
            onClick={this.handleHintNext}
          />
        )}

        {(question.type === Q_TYPE_5_LEVELS ||
          question.type === Q_TYPE_TRUE_FALSE) && (
          <QuestionaireLevelChoose
            question={question}
            onSubmit={this.submitQuestion}
          />
        )}

        {question.type === Q_TYPE_TWO_TIERS_MULTIPLE_CHOICE && (
          <QuestionaireCheckbox
            question={question}
            onSubmit={this.submitQuestion}
          />
        )}

        {question.type === Q_TYPE_FREQUENCY && (
          <QuestionaireFrequency
            items={previousChoosedValues}
            question={question}
            onSubmit={this.submitQuestion}
          />
        )}

        {question.type === Q_TYPE_TIME_SELECT && (
          <QuestionaireWhen
            items={previousChoosedValues}
            question={question}
            onSubmit={this.submitQuestion}
          />
        )}

        {question.type === Q_TYPE_EVER_DONE_BEFORE && (
          <QuestionaireEverDoneBefore
            question={question}
            onSubmit={this.submitQuestion}
            onOriginalInitValuesUpdate={this.onOriginalInitValuesUpdate}
          />
        )}

        {question.type === Q_TYPE_BATCH_LEVEL_SELECT && (
          <QuestionaireBatchLevelSelect
            items={previousChoosedValues}
            question={question}
            onSubmit={this.submitQuestion}
          />
        )}

        {question.type === Q_TYPE_BATCH_FREQUENCY_CHOOSE && (
          <QuestionaireBatchFrequencyChoose
            items={previousChoosedValues}
            question={question}
            onSubmit={this.submitQuestion}
          />
        )}

        {question.type === Q_TYPE_BATCH_SUB_QUESTION && (
          <QuestionaireBatchSubQuestion
            useOrignalValue
            originalInitValues={originalInitValues}
            previousChoosedValues={previousChoosedValues}
            question={this.restructureResourceSupportOptionTitle(question)}
            onSubmit={this.submitQuestion}
          />
        )}

        {(question.type === Q_TYPE_EMOTIONAL_PRACTICE ||
          question.type === Q_TYPE_EMOTIONAL_CONTROL ||
          question.type === Q_TYPE_EMOTIONAL_FORMAL) && (
          <QuestionaireEmotional
            question={question}
            onSubmit={this.submitQuestion}
          />
        )}

        {(question.type === Q_TYPE_CAAT_PRACTICE ||
          question.type === Q_TYPE_CAAT_FORMAL ||
          question.type === Q_TYPE_CAAT_SIMULATION) && (
          <QuestionaireCAAT
            question={question}
            onSubmit={this.submitQuestion}
          />
        )}

        {(question.type === Q_TYPE_SQOL_POSITIVE_SCORING ||
          question.type === Q_TYPE_SQOL_NEGATIVE_SCORING) && (
          <QuestionaireSQOLSelection
            question={question}
            onSubmit={this.submitQuestion}
          />
        )}

        {question.type === Q_TYPE_TEXT_INPUT && (
          <QuestionaireTextInput onSubmit={this.submitQuestion} />
        )}

        {question.type === Q_TYPE_CUSTOM && (
          <Button type="primary" onClick={this.handleHintNext}>
            還沒做，先跳過
            <Icon type="right" />
          </Button>
        )}
      </QuestionWrapper>
    );
  }
}

Questionaire.propTypes = {
  question: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  timeoutSeconds: PropTypes.number,
  onTimeout: PropTypes.func,
  previousChoosedValues: PropTypes.array,
  originalInitValues: PropTypes.array,
};

Questionaire.defaultProps = {
  timeoutSeconds: null,
  onTimeout: null,
  previousChoosedValues: [],
  originalInitValues: [],
};

export default withStyles(s)(Questionaire);
