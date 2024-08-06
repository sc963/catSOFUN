import React from 'react';
import PropTypes from 'prop-types';
import {
  Row,
  Col,
  Radio,
  Button,
  Icon,
  notification,
  Divider,
  Cascader,
  Tag,
} from 'antd';
import s from 'antd/dist/antd.less';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {
  BatchSubQuestionItem,
  BatchSubQuestionItemName,
  BatchSubQuestionOption,
  SubQuestionItem,
  SubQuestionChoosedArea,
} from './Questionaire.style';
import { TOOLING_COLOR_4_OPTIONS } from '../../constants/colors.const';

const NONE_STRING = 'N/A';

class QuestionaireBatchSubQuestion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mainQeustionStatus: {},
      subQuestionStatus: {},
      currentSubQuestion: null,
    };
    this.countDownTimer = null;
    this.customInput = React.createRef();
  }

  handleNextClick = () => {
    const { onSubmit } = this.props;
    if (onSubmit) {
      // eslint-disable-next-line prettier/prettier
      const {
        useOrignalValue,
        previousChoosedValues,
        originalInitValues,
      } = this.props;
      const { mainQeustionStatus, subQuestionStatus } = this.state;
      const mainQCount = Object.keys(mainQeustionStatus).length || 0;
      const subQCount = Object.keys(subQuestionStatus).length || 0;
      // 20200621 付費需求，就算在「是否曾經做過」那邊選否，到資源支援還是要選
      // eslint-disable-next-line prettier/prettier
      const qList = useOrignalValue
        ? originalInitValues
        : previousChoosedValues;

      if (qList.length === mainQCount && mainQCount === subQCount) {
        // 檢查有沒有需要支援卻沒選擇資源的
        let hasSubItemNotChooseYet = false;
        Object.keys(subQuestionStatus).forEach(key => {
          const hasEmpty = subQuestionStatus[key].length === 0;
          if (hasEmpty) {
            hasSubItemNotChooseYet = true;
          }
        });
        if (hasSubItemNotChooseYet) {
          notification.error({
            message: '有需協助項目未選擇資源需求',
            placement: 'bottomRight',
          });
          return;
        }
        const result = qList.map(qString => {
          const mainValue = mainQeustionStatus[qString];
          const subValue = subQuestionStatus[qString];
          return {
            mainQuestion: qString,
            mainValue,
            subValue,
          };
        });
        onSubmit(JSON.stringify(result));
      } else {
        notification.error({
          message: '每個項目都必須選擇資源支持程度',
          placement: 'bottomRight',
        });
      }
    }
  };

  handleMainQuestionChange = e => {
    const { mainQeustionStatus, subQuestionStatus } = this.state;
    const { name, value } = e.target;

    mainQeustionStatus[name] = value;
    this.setState({ mainQeustionStatus });

    if (value === NONE_STRING) {
      subQuestionStatus[name] = [value];
    } else {
      subQuestionStatus[name] = [];
    }
    this.setState({ subQuestionStatus });
  };

  onSubQuestionClick = e => {
    const clickSubQ = e.target.dataset.value;
    this.setState({ currentSubQuestion: clickSubQ });
  };

  handleSubQuestionChoose = value => {
    const { subQuestionStatus, currentSubQuestion } = this.state;
    // 20200901 需求追加：要讓子問題可以複選
    const currentValues = subQuestionStatus[currentSubQuestion] || [];
    const existed = currentValues.find(v => v.toString() === value.toString());
    if (!existed) {
      subQuestionStatus[currentSubQuestion] = [...currentValues, value];
      this.setState({ subQuestionStatus });
    }
  };

  handleSubQuestionItemRemove = (key, value) => {
    const { subQuestionStatus } = this.state;
    const newValues = subQuestionStatus[key].filter(
      item => item.toString() !== value.toString(),
    );
    subQuestionStatus[key] = newValues;
    this.setState({ subQuestionStatus });
  };

  componentDidMount = () => {
    this.setState({
      mainQeustionStatus: {},
      subQuestionStatus: {},
      currentSubQuestion: null,
    });
  };

  render() {
    const { mainQeustionStatus, subQuestionStatus } = this.state;
    const {
      useOrignalValue,
      question,
      previousChoosedValues,
      originalInitValues,
    } = this.props;
    const subQCascaderData = question.options[0].subQuestionOptions[0].options.map(
      v => ({
        label: v.name,
        value: v.name,
        children: v.options.map(sv => ({
          value: sv.value,
          label: sv.title,
        })),
      }),
    );
    // 20200621 付費需求，就算在「是否曾經做過」那邊選否，到資源支援還是要選
    const qList = useOrignalValue ? originalInitValues : previousChoosedValues;
    return (
      <Row>
        {qList.map(preValue => (
          <Col span={24} key={preValue}>
            <BatchSubQuestionItem>
              <Row type="flex" justify="center">
                <Col>
                  <BatchSubQuestionItemName>
                    {preValue}
                  </BatchSubQuestionItemName>
                  <br />
                  <Radio.Group
                    name={preValue}
                    onChange={this.handleMainQuestionChange}
                  >
                    {question.options.map((subOp, idx) => (
                      <Radio value={subOp.value} key={subOp.value}>
                        <BatchSubQuestionOption
                          data-value={subOp.value}
                          style={{
                            color: TOOLING_COLOR_4_OPTIONS[idx] || '#555',
                          }}
                        >
                          {subOp.title}
                        </BatchSubQuestionOption>
                      </Radio>
                    ))}
                  </Radio.Group>
                </Col>
              </Row>
            </BatchSubQuestionItem>
            {mainQeustionStatus[preValue] &&
              mainQeustionStatus[preValue] !== NONE_STRING && (
                <SubQuestionItem>
                  資源需求：
                  <Cascader
                    data-value={preValue}
                    style={{ width: '525px' }}
                    options={subQCascaderData}
                    onClick={this.onSubQuestionClick}
                    onChange={this.handleSubQuestionChoose}
                    placeholder={`請選擇「${preValue}」的資源需求`}
                    size="large"
                  />
                  <SubQuestionChoosedArea>
                    {subQuestionStatus && subQuestionStatus[preValue] && (
                      <>
                        {subQuestionStatus[preValue].map(subQ => {
                          if (subQ !== NONE_STRING) {
                            return (
                              <Tag
                                key={`index_${subQ.toString()}`}
                                closable
                                onClose={() =>
                                  this.handleSubQuestionItemRemove(
                                    preValue,
                                    subQ,
                                  )
                                }
                              >
                                {subQ.toString()}
                              </Tag>
                            );
                          }
                          return null;
                        })}
                      </>
                    )}
                  </SubQuestionChoosedArea>
                </SubQuestionItem>
              )}
            <Divider />
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

QuestionaireBatchSubQuestion.propTypes = {
  useOrignalValue: PropTypes.bool,
  question: PropTypes.object.isRequired,
  previousChoosedValues: PropTypes.array,
  originalInitValues: PropTypes.array,
  onSubmit: PropTypes.func,
};

QuestionaireBatchSubQuestion.defaultProps = {
  useOrignalValue: false,
  previousChoosedValues: [],
  originalInitValues: [],
  onSubmit: null,
};

export default withStyles(s)(QuestionaireBatchSubQuestion);
