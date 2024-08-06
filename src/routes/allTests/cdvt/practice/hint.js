import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import s from 'antd/dist/antd.less';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import PracticePng from '../../../../images/practice.png';
import {
  ImgPractice,
  TextLastHint,
  TextHasSix,
  TextHasNoSix,
} from './hint.style';

class Hint extends Component {
  render() {
    const { onPracticeStart } = this.props;
    return (
      <div>
        <h2>即將開始練習，並再次提醒您</h2>
        <ImgPractice src={PracticePng} />
        <TextLastHint>
          當您看見畫面
          <TextHasSix>出現 6 時</TextHasSix>
          ，請碰觸下方
          <TextHasSix>Ｏ</TextHasSix>
        </TextLastHint>
        <TextLastHint>
          當您看見畫面
          <TextHasNoSix>未出現 6 時</TextHasNoSix>
          ，請碰觸下方
          <TextHasNoSix>Ｘ</TextHasNoSix>
        </TextLastHint>
        <Button
          style={{
            width: '350px',
            height: '70px',
            fontSize: '1.3em',
          }}
          type="primary"
          htmlType="button"
          size="large"
          onClick={onPracticeStart}
        >
          開始練習
        </Button>
      </div>
    );
  }
}

Hint.propTypes = {
  onPracticeStart: PropTypes.func.isRequired,
};

export default withStyles(s)(Hint);
