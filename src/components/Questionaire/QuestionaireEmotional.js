import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'antd';
import s from 'antd/dist/antd.less';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {
  EmotionOption,
  ImgEmotionalFacePhoto,
  EmotionQuestionText,
} from './Questionaire.style';

class QuestionaireEmotional extends React.Component {
  handleOptionClick = event => {
    const { onSubmit } = this.props;
    if (onSubmit) {
      const { question } = this.props;
      const extraInfo = JSON.parse(question.extraJsonInfo) || {};
      const clickOptionValue = event.currentTarget.dataset.value;
      const ans = {
        type: question.type,
        photoName: extraInfo.filename,
        photoUrl: extraInfo.photoUrl,
        clickOption: clickOptionValue,
      };
      onSubmit(JSON.stringify(ans));
    }
  };

  render() {
    const { question } = this.props;
    const extraInfo = JSON.parse(question.extraJsonInfo) || {};
    return (
      <Row type="flex" justify="space-around" align="middle" gutter={16}>
        <Col span={8}>
          <ImgEmotionalFacePhoto
            alt={extraInfo.filename}
            src={extraInfo.photoUrl}
          />
        </Col>
        <Col span={16}>
          <Row type="flex" justify="center">
            <Col span={24}>
              <EmotionQuestionText>{question.body}</EmotionQuestionText>
            </Col>
          </Row>
          <Row>
            {question.options.map(op => (
              <Col span={6} key={op.value}>
                <EmotionOption
                  data-value={op.value}
                  onClick={this.handleOptionClick}
                >
                  <span className="title">{op.title}</span>
                </EmotionOption>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    );
  }
}

QuestionaireEmotional.propTypes = {
  question: PropTypes.object.isRequired,
  onSubmit: PropTypes.func,
};

QuestionaireEmotional.defaultProps = {
  onSubmit: null,
};

export default withStyles(s)(QuestionaireEmotional);
