import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Radio, Button, Icon, notification, Divider } from 'antd';
import s from 'antd/dist/antd.less';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {
  BatchFrequencyItem,
  BatchFrequencyItemName,
  BatchFrequencyOption,
} from './Questionaire.style';
import { TOOLING_COLOR_3_OPTIONS } from '../../constants/colors.const';

class QuestionaireBatchFrequencyChoose extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      choosedItems: {},
      isAllChoosed: false,
    };
    this.countDownTimer = null;
    this.customInput = React.createRef();
  }

  handleNextClick = () => {
    const { onSubmit } = this.props;
    if (onSubmit) {
      const { isAllChoosed, choosedItems } = this.state;
      if (isAllChoosed) {
        const result = JSON.stringify(choosedItems);
        onSubmit(result);
      } else {
        notification.error({
          message: '每個項目都必須選擇參與頻率',
          placement: 'bottomRight',
        });
      }
    }
  };

  handleRadioChange = e => {
    const { items } = this.props;
    const { choosedItems } = this.state;
    const { name, value } = e.target;

    choosedItems[name] = value;
    this.setState({ choosedItems }, () => {
      // 檢查是否通通已選擇了
      this.setState({
        isAllChoosed: items.length === Object.keys(choosedItems).length,
      });
    });
  };

  componentDidMount = () => {
    this.setState({
      choosedItems: {},
      isAllChoosed: false,
    });
  };

  render() {
    const { question, items } = this.props;
    return (
      <Row>
        {items.map(preValue => (
          <Col span={24} key={preValue}>
            <BatchFrequencyItem>
              <Row type="flex" justify="center">
                <Col>
                  <BatchFrequencyItemName>{preValue}</BatchFrequencyItemName>
                </Col>
                <Col>
                  <Radio.Group
                    name={preValue}
                    onChange={this.handleRadioChange}
                  >
                    {question.options.map((subOp, idx) => (
                      <Radio value={subOp.value} key={subOp.value}>
                        <BatchFrequencyOption
                          data-value={subOp.value}
                          style={{
                            color: TOOLING_COLOR_3_OPTIONS[idx] || '#555',
                          }}
                        >
                          {subOp.title}
                        </BatchFrequencyOption>
                      </Radio>
                    ))}
                  </Radio.Group>
                </Col>
              </Row>
            </BatchFrequencyItem>
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

QuestionaireBatchFrequencyChoose.propTypes = {
  question: PropTypes.object.isRequired,
  items: PropTypes.array,
  onSubmit: PropTypes.func,
};

QuestionaireBatchFrequencyChoose.defaultProps = {
  items: [],
  onSubmit: null,
};

export default withStyles(s)(QuestionaireBatchFrequencyChoose);
