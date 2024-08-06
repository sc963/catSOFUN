import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Button } from 'antd';
import s from 'antd/dist/antd.less';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import TextArea from 'antd/lib/input/TextArea';

class QuestionaireTextInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      answer: '',
    };
  }

  handleOptionClick = () => {
    const { onSubmit } = this.props;
    if (onSubmit) {
      const clickOptionValue = this.state.answer;
      onSubmit(clickOptionValue || '使用者沒有回答');
    }
  };

  render() {
    return (
      <Row type="flex" justify="center">
        <Col span={18}>
          <TextArea
            rows={10}
            maxLength={500}
            onChange={e => this.setState({ answer: e.target.value })}
          />
          <br />
          <br />
          <Button
            type="primary"
            style={{ width: '180px', height: '50px' }}
            onClick={this.handleOptionClick}
          >
            確定
          </Button>
        </Col>
      </Row>
    );
  }
}

QuestionaireTextInput.propTypes = {
  onSubmit: PropTypes.func,
};

QuestionaireTextInput.defaultProps = {
  onSubmit: null,
};

export default withStyles(s)(QuestionaireTextInput);
