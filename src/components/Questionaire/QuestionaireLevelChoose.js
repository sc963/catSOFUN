import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'antd';
import s from 'antd/dist/antd.less';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { QuestionOption } from './Questionaire.style';
import { Q_TYPE_TRUE_FALSE } from '../../constants/models/questionaire.const';

class QuestionaireLevelChoose extends React.Component {
  handleOptionClick = event => {
    const { onSubmit } = this.props;
    if (onSubmit) {
      const clickOptionValue = event.currentTarget.dataset.value;
      onSubmit(clickOptionValue);
    }
  };

  render() {
    const { question } = this.props;
    const moreThanThree = question.options.length > 3 || false;
    return (
      <Row
        type="flex"
        gutter={moreThanThree ? 0 : 8}
        justify={moreThanThree ? 'space-between' : 'center'}
      >
        {question.options.map(op => (
          <Col span={4} key={op.value}>
            <QuestionOption
              data-value={op.value}
              onClick={this.handleOptionClick}
            >
              <p className="title">{op.title}</p>
              {question.type !== Q_TYPE_TRUE_FALSE && (
                <p className="value">{op.value}</p>
              )}
            </QuestionOption>
          </Col>
        ))}
      </Row>
    );
  }
}

QuestionaireLevelChoose.propTypes = {
  question: PropTypes.object.isRequired,
  onSubmit: PropTypes.func,
};

QuestionaireLevelChoose.defaultProps = {
  onSubmit: null,
};

export default withStyles(s)(QuestionaireLevelChoose);
