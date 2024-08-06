import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Button, Icon, Checkbox, Input, message } from 'antd';
import s from 'antd/dist/antd.less';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { ActivityChoiceItem } from './Questionaire.style';

const NAME_OF_CUSTOM_INPUT = 'custom';

message.config({
  top: 100,
  duration: 0,
  maxCount: 1,
});

class QuestionaireCheckbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      choosedValues: {},
    };
    this.countDownTimer = null;
    this.customInput = React.createRef();
  }

  handleActivityCheck = e => {
    const { checked, dataValue: targetValue } = e.target;

    if (!checked) {
      const { choosedValues } = this.state;
      // Remove Unchecked Value
      delete choosedValues[`key_${targetValue}`];
      this.setState({ choosedValues }, () => {
        this.checkMaxSelection();
      });
    }
    if (checked && targetValue && targetValue.trim() !== '') {
      const { choosedValues } = this.state;
      choosedValues[`key_${targetValue}`] = targetValue;

      // Add New Checked Value
      this.setState({ choosedValues }, () => {
        this.checkMaxSelection();
      });
    }
  };

  handleCustomInput = e => {
    const { choosedValues } = this.state;

    if (e.target.value.trim() === '') {
      // 自行輸入全部刪掉
      delete choosedValues[NAME_OF_CUSTOM_INPUT];
    } else {
      choosedValues[NAME_OF_CUSTOM_INPUT] = e.target.value;
      this.setState({ choosedValues });
    }

    this.checkMaxSelection();
  };

  handleNext = () => {
    const { onSubmit } = this.props;
    if (onSubmit) {
      const { maxSelection } = this.props.question;
      const { choosedValues } = this.state;
      if (maxSelection && Object.keys(choosedValues).length <= maxSelection) {
        const choosed = Object.keys(choosedValues)
          .map(key => choosedValues[key])
          .join(',');
        onSubmit(choosed);
      }
    }
  };

  checkMaxSelection = () => {
    const { choosedValues } = this.state;
    const { question } = this.props;
    const { maxSelection } = question;
    if (maxSelection && Object.keys(choosedValues).length > maxSelection) {
      message.error(`最多只能選擇${question.maxSelection}項`);
    } else {
      message.destroy();
    }
  };

  componentDidMount = () => {
    this.setState({ choosedValues: {} });
  };

  render() {
    const { question } = this.props;
    return (
      <Row type="flex" justify="space-between" gutter={2}>
        {question.options.map(op => (
          <Col span={12} key={op.title}>
            <ActivityChoiceItem>
              <p className="title">{op.title}</p>
              {op.values.map(v => (
                <Checkbox
                  className="options"
                  dataValue={v}
                  key={`key_${v}`}
                  onChange={this.handleActivityCheck}
                >
                  {v}
                </Checkbox>
              ))}
            </ActivityChoiceItem>
          </Col>
        ))}
        <Col span={12}>
          <ActivityChoiceItem>
            <p className="title">是否還有上述沒提的活動</p>
            <Input
              ref={this.customInput}
              addonBefore="自行填入："
              onChange={this.handleCustomInput}
              maxLength={25}
            />
          </ActivityChoiceItem>
        </Col>
        <Col span={24}>
          <Button type="primary" onClick={this.handleNext}>
            我選好了
            <Icon type="right" />
          </Button>
        </Col>
      </Row>
    );
  }
}

QuestionaireCheckbox.propTypes = {
  question: PropTypes.object.isRequired,
  onSubmit: PropTypes.func,
};

QuestionaireCheckbox.defaultProps = {
  onSubmit: null,
};

export default withStyles(s)(QuestionaireCheckbox);
