import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Button, Icon, Checkbox, Divider, Typography } from 'antd';
import s from 'antd/dist/antd.less';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

const { Title } = Typography;

class QuestionaireWhen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      whenWillDoing: {},
    };
  }

  onChange = e => {
    const { checked, dataTarget, dataValue } = e.target;
    const { whenWillDoing } = this.state;
    if (checked) {
      if (whenWillDoing[dataTarget]) {
        whenWillDoing[dataTarget] = [...whenWillDoing[dataTarget], dataValue];
      } else {
        whenWillDoing[dataTarget] = [dataValue];
      }
    } else {
      whenWillDoing[dataTarget] = whenWillDoing[dataTarget].filter(
        item => item !== dataValue,
      );
    }
    this.setState({ whenWillDoing });
  };

  handleNext = () => {
    const { onSubmit } = this.props;
    if (onSubmit) {
      const { whenWillDoing } = this.state;
      const result = JSON.stringify(whenWillDoing); // "{"看電影":["中午"],"社群網站":["早上"],"聽演唱會":["晚上","不定時","中午"]}"
      onSubmit(result);
    }
  };

  render() {
    const { items, question } = this.props;
    return (
      <Row type="flex" justify="center" gutter={2}>
        {items &&
          items.length > 0 &&
          items.map(value => (
            <Col span={24} key={value}>
              <p className="title">
                <Title level={4}>{value}</Title>
              </p>
              {question.options.map(option => (
                <Checkbox
                  className="options"
                  dataTarget={value}
                  dataValue={option.value}
                  key={`key_${option.value}`}
                  onChange={this.onChange}
                >
                  {option.title}
                  <Divider type="vertical" />
                </Checkbox>
              ))}
              <Divider />
            </Col>
          ))}
        <Col span={24}>
          <Button type="primary" onClick={this.handleNext}>
            下一題
            <Icon type="right" />
          </Button>
        </Col>
      </Row>
    );
  }
}

QuestionaireWhen.propTypes = {
  question: PropTypes.object.isRequired,
  items: PropTypes.array,
  onSubmit: PropTypes.func,
};

QuestionaireWhen.defaultProps = {
  items: [],
  onSubmit: null,
};

export default withStyles(s)(QuestionaireWhen);
