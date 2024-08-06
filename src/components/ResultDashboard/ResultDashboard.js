import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import s from 'antd/dist/antd.less';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import CDVTResult from './CDVTResult';
import QuestionaireResult from './QuestionaireResult';
import { ResultRoot, ResultWrapper } from './ResultDashboard.style';
import {
  CDVT,
  LEISURE,
  SOCIAL_PARTICIPATE,
  TOOLING_LIFE,
  EMOTIONAL,
  CAAT,
  SQOL,
} from '../../constants/testType.const';
import {
  NAME_LEISURE_ACTIVITY,
  NAME_SOCIAL_PARTICIPATE,
  NAME_TOOLING_LIFE,
  NAME_CDVT,
  NAME_EMOTIONAL_TEST,
  NAME_CAAT_TEST,
  NAME_SQOL,
} from '../../constants/models/questionaire.const';

class Result extends Component {
  getCaseId = () => {
    const {
      params: {
        query: { caseId },
      },
    } = this.props;
    return caseId;
  };

  backToIndex = () => {
    window.location.href = '/';
  };

  render() {
    const { caseObj } = this.props;
    return (
      <ResultRoot>
        <ResultWrapper>
          {caseObj.testType === CDVT && (
            <CDVTResult caseObj={caseObj} testName={NAME_CDVT} />
          )}

          {caseObj.testType === LEISURE && (
            <QuestionaireResult
              caseObj={caseObj}
              testName={NAME_LEISURE_ACTIVITY}
            />
          )}

          {caseObj.testType === SOCIAL_PARTICIPATE && (
            <QuestionaireResult
              caseObj={caseObj}
              testName={NAME_SOCIAL_PARTICIPATE}
            />
          )}

          {caseObj.testType === TOOLING_LIFE && (
            <QuestionaireResult
              caseObj={caseObj}
              testName={NAME_TOOLING_LIFE}
            />
          )}

          {caseObj.testType === EMOTIONAL && (
            <QuestionaireResult
              caseObj={caseObj}
              testName={NAME_EMOTIONAL_TEST}
            />
          )}

          {caseObj.testType === CAAT && (
            <QuestionaireResult caseObj={caseObj} testName={NAME_CAAT_TEST} />
          )}

          {caseObj.testType === SQOL && (
            <QuestionaireResult caseObj={caseObj} testName={NAME_SQOL} />
          )}

          <div>
            <Button onClick={this.backToIndex}>返回首頁</Button>
          </div>
        </ResultWrapper>
      </ResultRoot>
    );
  }
}

Result.propTypes = {
  caseObj: PropTypes.object.isRequired,
  params: PropTypes.object,
};

Result.defaultProps = {
  params: {},
};

export default withStyles(s)(Result);
