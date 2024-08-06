import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Radio, Button, Icon, notification, Divider } from 'antd';
import s from 'antd/dist/antd.less';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {
  BatchLevelItem,
  BatchLevelItemName,
  BatchLevelOptionHeader,
  BatchLevelOption,
} from './Questionaire.style';

class QuestionaireBatchLevelSelect extends React.Component {
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
          message: '每個項目都必須選擇獨立程度',
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
    const colors = { 0: '#ee3a6a', 1: '#ffa500', 2: '#07AC2B', 3: '#338CFF' };
    return (
      <Row>
        <Col span={24}>
          <Row type="flex" justify="center">
            <Col>
              <BatchLevelItemName>&nbsp;</BatchLevelItemName>
            </Col>
            <Col>
              {question.options.map(subOp => (
                <BatchLevelOptionHeader key={subOp.value}>
                  {subOp.title}
                </BatchLevelOptionHeader>
              ))}
            </Col>
          </Row>
        </Col>
        {items.map(preValue => (
          <Col span={24} key={preValue}>
            <BatchLevelItem>
              <Row type="flex" justify="center">
                <Col>
                  <BatchLevelItemName>{preValue}</BatchLevelItemName>
                </Col>
                <Col>
                  <Radio.Group
                    name={preValue}
                    onChange={this.handleRadioChange}
                  >
                    {question.options.map((subOp, idx) => (
                      <Radio value={subOp.value} key={subOp.value}>
                        <BatchLevelOption
                          data-value={subOp.value}
                          style={{ color: colors[idx] || '#555' }}
                        >
                          {subOp.title}
                        </BatchLevelOption>
                      </Radio>
                    ))}
                  </Radio.Group>
                </Col>
              </Row>
            </BatchLevelItem>
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

QuestionaireBatchLevelSelect.propTypes = {
  question: PropTypes.object.isRequired,
  items: PropTypes.array,
  onSubmit: PropTypes.func,
};

QuestionaireBatchLevelSelect.defaultProps = {
  items: [],
  onSubmit: null,
};

export default withStyles(s)(QuestionaireBatchLevelSelect);
