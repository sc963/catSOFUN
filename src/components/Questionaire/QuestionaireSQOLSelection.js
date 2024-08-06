import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'antd';
import s from 'antd/dist/antd.less';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {
  SQOLBtnSkip,
  SQOLOption,
  SQOLTextDegreeDesc,
} from './Questionaire.style';
import imgArrow from '../../images/sqol/sqol_arrow.png';
import { ImgCongrats } from '../TestFinished/TestFinished.style';

class QuestionaireSQOLSelection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      canSkip: false,
    };
  }

  componentDidMount = () => {
    setTimeout(() => this.setState({ canSkip: true }), 500);
  };

  handleOptionClick = event => {
    const { onSubmit } = this.props;
    if (onSubmit) {
      const clickOptionValue = event.currentTarget.dataset.value;
      onSubmit(clickOptionValue);
    }
  };

  handleSkip = () => {
    const { onSubmit } = this.props;
    if (onSubmit) {
      onSubmit('0');
    }
  };

  render() {
    const { question } = this.props;

    return (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Row
          type="flex"
          gutter={0}
          justify="space-around"
          style={{ width: '80vw' }}
        >
          {question.options.map((op, idx) => (
            <Col span={4} key={op.value}>
              <SQOLOption
                data-value={op.value}
                onClick={this.handleOptionClick}
              />
              <p
                style={{
                  marginTop: '12px',
                  fontSize: '2rem',
                  fontWeight: '400',
                }}
              >
                {idx + 1}
              </p>
            </Col>
          ))}

          <Col span={24}>
            <Row
              type="flex"
              gutter={0}
              justify="space-around"
              align="center"
              style={{ width: '80vw' }}
            >
              <Col span={4}>
                <SQOLTextDegreeDesc>
                  比我預期的
                  <br />
                  <b>更少</b>
                </SQOLTextDegreeDesc>
              </Col>
              <Col span={13}>
                <ImgCongrats src={imgArrow} />
              </Col>
              <Col span={4}>
                <SQOLTextDegreeDesc>
                  比我預期的
                  <br />
                  <b>更多</b>
                </SQOLTextDegreeDesc>
              </Col>
            </Row>
          </Col>

          <Col span={24}>
            {this.state.canSkip && (
              <SQOLBtnSkip onClick={this.handleSkip}>下一題</SQOLBtnSkip>
            )}
          </Col>
        </Row>
      </div>
    );
  }
}

QuestionaireSQOLSelection.propTypes = {
  question: PropTypes.object.isRequired,
  onSubmit: PropTypes.func,
};

QuestionaireSQOLSelection.defaultProps = {
  onSubmit: null,
};

export default withStyles(s)(QuestionaireSQOLSelection);
