import React from 'react';
import PropTypes from 'prop-types';
import {
  Row,
  Col,
  Button,
  Icon,
  Cascader,
  notification,
  Divider,
  Typography,
} from 'antd';
import s from 'antd/dist/antd.less';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

const { Title } = Typography;

class QuestionaireFrequncy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentItem: '',
      frequencies: {},
    };
    this.countDownTimer = null;
  }

  handleItemClick = e => {
    const clickItem = e.target.dataset.value;
    this.setState({ currentItem: clickItem });
  };

  handleFrequencySelected = value => {
    const { currentItem, frequencies } = this.state;
    const itemFrequecy = [currentItem, ...value];
    frequencies[currentItem] = itemFrequecy;
    this.setState({ frequencies });
  };

  handleNext = () => {
    const { onSubmit, items } = this.props;
    if (onSubmit) {
      const { frequencies } = this.state;
      if (Object.keys(frequencies).length < items.length) {
        notification.error({
          message: `${items.length}項活動都必須選擇頻率`,
          placement: 'bottomRight',
        });
        return;
      }
      const result = JSON.stringify(frequencies); // {"電玩遊戲":["電玩遊戲","每週","2"],"社群網站":["社群網站","每月","3"],"看影片":["看影片","每月","7"]}
      onSubmit(result);
    }
  };

  render() {
    const { items, question } = this.props;
    return (
      <React.Fragment>
        <Row type="flex" justify="center" gutter={16}>
          {items &&
            items.length > 0 &&
            items.map(value => {
              const freq = question.options.map(v => ({
                label: v.title,
                value: v.title,
                children: v.values.map(subV => ({
                  value: subV,
                  label: `${subV}次`,
                })),
              }));
              return (
                <Col key={value}>
                  <p className="title">
                    <Title level={4}>{value}</Title>
                  </p>
                  <Cascader
                    data-value={value}
                    options={freq}
                    onClick={this.handleItemClick}
                    onChange={this.handleFrequencySelected}
                    placeholder="請選擇頻率"
                    size="large"
                  />
                  <Divider type="vertical" />
                </Col>
              );
            })}
        </Row>
        <Divider />
        <Row type="flex" justify="center">
          <Col span={24}>
            <Button type="primary" onClick={this.handleNext}>
              下一題
              <Icon type="right" />
            </Button>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

QuestionaireFrequncy.propTypes = {
  question: PropTypes.object.isRequired,
  items: PropTypes.array,
  onSubmit: PropTypes.func,
};

QuestionaireFrequncy.defaultProps = {
  items: [],
  onSubmit: null,
};

export default withStyles(s)(QuestionaireFrequncy);
