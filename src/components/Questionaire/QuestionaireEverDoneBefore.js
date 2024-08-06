import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Radio, Button, Icon, notification, Divider } from 'antd';
import s from 'antd/dist/antd.less';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { EverDoneBeforeQ, BatchQuestionOption } from './Questionaire.style';

class QuestionaireEverDoneBefore extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      everDoneValues: [],
      choosedItems: [],
      isAllChoosed: false,
    };
    this.countDownTimer = null;
    this.customInput = React.createRef();
  }

  handleNextClick = () => {
    const { onSubmit } = this.props;
    if (onSubmit) {
      const { isAllChoosed, everDoneValues } = this.state;
      if (isAllChoosed) {
        if (everDoneValues.length === 0) {
          notification.error({
            message: '至少需要一項為「是」',
            placement: 'bottomRight',
          });
          return;
        }
        const choosedValueString = everDoneValues.join(',');
        onSubmit(choosedValueString);
      } else {
        notification.error({
          message: '每個項目都必須選擇：是或否',
          placement: 'bottomRight',
        });
      }
    }
  };

  handleRadioChange = e => {
    const { question } = this.props;
    const { everDoneValues, choosedItems } = this.state;
    const { name, value } = e.target;

    if (value === 'true' && everDoneValues.indexOf(name) === -1) {
      this.setState({ everDoneValues: [...everDoneValues, name] });
    } else if (value === 'false') {
      this.setState({ everDoneValues: everDoneValues.filter(v => v !== name) });
    }
    // 檢查是否通通已選擇了
    if (choosedItems.indexOf(name) === -1) {
      this.setState({ choosedItems: [...choosedItems, name] });
      this.setState({
        isAllChoosed: question.options.length === choosedItems.length + 1,
      });
    }
  };

  componentDidMount = () => {
    this.setState({
      everDoneValues: [],
      choosedItems: [],
      isAllChoosed: false,
    });
    const { onOriginalInitValuesUpdate } = this.props;
    if (onOriginalInitValuesUpdate) {
      const { question } = this.props;
      onOriginalInitValuesUpdate(question.options.map(op => op.title));
    }
  };

  render() {
    const { question } = this.props;
    return (
      <Row>
        {question.options.map(op => (
          <Col span={24} key={op.title}>
            <Row type="flex" justify="center">
              <Col>
                <EverDoneBeforeQ>{op.title}</EverDoneBeforeQ>
              </Col>
              <Col>
                <Radio.Group name={op.title} onChange={this.handleRadioChange}>
                  {op.resOptions.map(subOp => (
                    <Radio value={subOp.value} key={subOp.value}>
                      <BatchQuestionOption data-value={subOp.value}>
                        {subOp.title}
                      </BatchQuestionOption>
                    </Radio>
                  ))}
                </Radio.Group>
              </Col>
            </Row>
          </Col>
        ))}
        <Col span={24}>
          <Divider />
          <Button type="primary" onClick={this.handleNextClick}>
            下一步
            <Icon type="right" />
          </Button>
        </Col>
      </Row>
    );
  }
}

QuestionaireEverDoneBefore.propTypes = {
  question: PropTypes.object.isRequired,
  onSubmit: PropTypes.func,
  onOriginalInitValuesUpdate: PropTypes.func,
};

QuestionaireEverDoneBefore.defaultProps = {
  onSubmit: null,
  onOriginalInitValuesUpdate: null,
};

export default withStyles(s)(QuestionaireEverDoneBefore);
