import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'antd';
import s from 'antd/dist/antd.less';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {
  CAATOption,
  CAATNumber,
  CAATGraphicWrapper,
} from './Questionaire.style';
import {
  CAAT_ASK_FOR_GRAPHIC,
  CAAT_GRAPHICS_BASE64,
  CAAT_Q_TYPE_NAME_MAPPING,
} from '../../constants/models/questionaire.const';

class QuestionaireCAAT extends React.Component {
  handleOptionClick = event => {
    const { onSubmit } = this.props;
    if (onSubmit) {
      const clickOptionValue = event.currentTarget.dataset.value;
      onSubmit(clickOptionValue);
    }
  };

  render() {
    const { question } = this.props;
    const isGraphic =
      JSON.parse(question.extraJsonInfo).askFor === CAAT_ASK_FOR_GRAPHIC;
    return (
      <Col type="flex">
        <Row>
          <h3>{CAAT_Q_TYPE_NAME_MAPPING[question.type]}</h3>
        </Row>
        <Row type="flex" justify="center" gutter={8}>
          <Col span={24}>
            {isGraphic && (
              <CAATGraphicWrapper>
                <img
                  alt={question.type}
                  src={CAAT_GRAPHICS_BASE64[question.body]}
                  height="100%"
                />
              </CAATGraphicWrapper>
            )}
            {!isGraphic && <CAATNumber>{question.body}</CAATNumber>}
          </Col>
        </Row>
        <Row type="flex" justify="center" gutter={8}>
          {question.options.map(op => (
            <Col span={6} key={op.value}>
              <CAATOption
                data-value={op.value}
                onClick={this.handleOptionClick}
              >
                <p className="title">{op.title}</p>
              </CAATOption>
            </Col>
          ))}
        </Row>
      </Col>
    );
  }
}

QuestionaireCAAT.propTypes = {
  question: PropTypes.object.isRequired,
  onSubmit: PropTypes.func,
};

QuestionaireCAAT.defaultProps = {
  onSubmit: null,
};

export default withStyles(s)(QuestionaireCAAT);
