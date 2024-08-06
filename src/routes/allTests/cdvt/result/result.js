/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import s from 'antd/dist/antd.less';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Query } from 'react-apollo';
import ResultDashboard from '../../../../components/ResultDashboard';
import { GET_CASE } from '../../../../db/queries/actions';

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
    return (
      <Query query={GET_CASE.query} variables={{ caseId: this.getCaseId() }}>
        {({ loading, error, data }) => {
          if (loading) return '取得結果中...';
          if (error) return `取得個案結果發生錯誤:${error.toString()}`;

          const caseObj = data[GET_CASE.name];
          if (!caseObj) return '取得個案結果格式有誤!';

          return <ResultDashboard caseObj={caseObj} />;
        }}
      </Query>
    );
  }
}

Result.propTypes = {
  params: PropTypes.object,
};

Result.defaultProps = {
  params: {},
};

export default withStyles(s)(Result);
