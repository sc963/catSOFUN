import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Button, Icon } from 'antd';
import s from 'antd/dist/antd.less';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Countdown from 'react-countdown-now';

class QuestionaireWaitUntil extends React.Component {
  handleButtonClick = () => {
    const { onClick } = this.props;
    if (onClick) {
      onClick();
    }
  };

  countDownRender = ({ minutes, seconds, completed }) => {
    if (completed) {
      const { question } = this.props;
      const btnStyle = {
        width: 250,
        height: 60,
        fontSize: '1.5em',
        fontWeight: 400,
      };
      return (
        <Col span={24}>
          <Button
            style={btnStyle}
            type="primary"
            onClick={this.handleButtonClick}
          >
            {question.buttonText || '下一步'}
            <Icon type="right" />
          </Button>
        </Col>
      );
    }
    return (
      <div>
        <div>
          請稍後：
          {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </div>
      </div>
    );
  };

  render() {
    const { question } = this.props;
    const { seconds } = question;

    return (
      <Row type="flex" justify="center">
        <Countdown
          date={Date.now() + seconds * 1000}
          renderer={this.countDownRender}
        />
      </Row>
    );
  }
}

QuestionaireWaitUntil.propTypes = {
  question: PropTypes.object.isRequired,
  onClick: PropTypes.func,
};

QuestionaireWaitUntil.defaultProps = {
  onClick: null,
};

export default withStyles(s)(QuestionaireWaitUntil);
