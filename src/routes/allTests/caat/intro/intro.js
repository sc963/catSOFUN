import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Typography, Button } from 'antd';
import s from 'antd/dist/antd.less';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {
  TutorialRoot,
  TutorialWrapper,
  VideoWrapper,
  ImgPressButton,
} from '../../cdvt/tutorial/tutorial.style';
import ImgPressCircle from '../../../../images/pressCircle.png';
import ImgPressCross from '../../../../images/pressCross.png';

const { Text, Title } = Typography;

const MAX_STEP = 4;
const TURORIAL_STEPS = {
  1: {
    hintPrefix: '當您看見',
    highlightText: '畫面上出現數字小於5時',
    textTarget: 'Ｏ',
    imgPress: ImgPressCircle,
    buttonText: '我已了解何時要點擊Ｏ',
  },
  2: {
    hintPrefix: '當畫面上',
    highlightText: '出現數字大於5時',
    textTarget: 'Ｘ',
    imgPress: ImgPressCross,
    buttonText: '我已了解何時要點擊Ｘ',
  },
  3: {
    hintPrefix: '當您判斷',
    highlightText: '畫面上圖形左右對稱時',
    textTarget: 'Ｏ',
    imgPress: ImgPressCircle,
    buttonText: '我已了解何時要點擊Ｏ',
  },
  4: {
    hintPrefix: '當您判斷',
    highlightText: '畫面上圖形左右不對稱時',
    textTarget: 'Ｘ',
    imgPress: ImgPressCross,
    buttonText: '我已了解何時要點擊Ｘ',
  },
};

class Tutorial extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentStep: 1,
    };
  }

  componentDidMount = () => {
    this.setState({ currentStep: 1 });
  };

  handleNextStep = () => {
    const { currentStep } = this.state;
    if (currentStep < MAX_STEP) {
      this.setState({ currentStep: currentStep + 1 });
    } else if (currentStep === MAX_STEP) {
      const {
        params: {
          query: { caseId },
        },
      } = this.props;
      window.location.href = `caatFormalTest?caseId=${caseId}`;
    }
  };

  renderStep = () => {
    const {
      hintPrefix,
      highlightText,
      textTarget,
      imgPress,
      buttonText,
    } = TURORIAL_STEPS[this.state.currentStep];
    return (
      <div>
        <Title level={1}>
          <Text style={{ fontSize: '0.5em' }} type="secondary">
            <p style={{ marginBottom: '3px' }}>測驗說明</p>
          </Text>
          {hintPrefix}
          <Text type="danger">{highlightText}</Text>
          ，請點擊
          <Text style={{ fontSize: '1.5em' }}>{textTarget}</Text>
        </Title>
        <VideoWrapper>
          <ImgPressButton src={imgPress} />
        </VideoWrapper>
        <Button
          style={{ width: '350px', height: '70px', fontSize: '1.3em' }}
          type="primary"
          htmlType="button"
          size="large"
          onClick={this.handleNextStep}
        >
          {buttonText}
        </Button>
      </div>
    );
  };

  render() {
    return (
      <TutorialRoot>
        <TutorialWrapper>{this.renderStep()}</TutorialWrapper>
      </TutorialRoot>
    );
  }
}

Tutorial.propTypes = {
  params: PropTypes.object,
};

Tutorial.defaultProps = {
  params: {},
};

export default withStyles(s)(Tutorial);
