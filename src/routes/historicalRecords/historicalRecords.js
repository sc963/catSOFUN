import React, { Component } from 'react';
import moment from 'moment';
import {
  Typography,
  Button,
  Col,
  Row,
  Form,
  Input,
  Icon,
  DatePicker,
  Table,
  Divider,
  notification,
} from 'antd';
import s from 'antd/dist/antd.less';
import { ApolloConsumer } from 'react-apollo';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { RecordRoot, RecordWrapper } from './historicalRecords.style';
import {
  GET_LOCATIONS,
  GET_MEDICAL_STAFFS,
  GET_CASES_HISTORY_DATA_BY_CASE_NO,
  GET_CASES_HISTORY_DATA_BY_STAFF_ID,
  GET_CASES_HISTORY_DATA_BY_LOCATION_ID,
  GET_CASES_HISTORY_DATA_BY_DATE,
} from '../../db/queries/actions';
import { TEST_NAME_MAPPING } from '../../constants/models/questionaire.const';
import NewTestFormSelect from '../newTest/newTestFormSelect';

const { Title } = Typography;

const tableColumns = [
  {
    title: '個案編號',
    dataIndex: 'caseNo',
    key: 'caseNo',
  },
  {
    title: '測驗項目',
    dataIndex: 'testType',
    key: 'testType',
  },
  {
    title: '狀態',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: '評估人員',
    dataIndex: 'staff',
    key: 'staff',
  },
  {
    title: '測驗地點',
    dataIndex: 'location',
    key: 'location',
  },
  {
    title: '測驗時間',
    key: 'datetime',
    dataIndex: 'datetime',
  },
  {
    title: '操作',
    key: 'action',
    render: (text, record) => (
      <div>
        <span>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`/result?caseId=${record.caseId}`}
          >
            查看詳細
          </a>
        </span>
        {record.status === '正常完成' && (
          <div>
            <Divider type="vertical" />
            <span>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={`/download/records?caseIds[]=${record.caseId}`}
              >
                下載
              </a>
            </span>
          </div>
        )}
      </div>
    ),
  },
];

class HistoricalRecords extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResultData: null,
      caseNo: null,
      staffId: null,
      locationId: null,
      searchDate: null,
    };
  }

  backToIndex = () => {
    window.location.href = '/';
  };

  handleCaseNoChange = e => {
    this.setState({ caseNo: e.target.value });
  };

  handleStaffChange = value => {
    this.setState({ staffId: value });
  };

  handleLocationChange = value => {
    this.setState({ locationId: value });
  };

  handleDateChange = (date, dateString) => {
    this.setState({ searchDate: dateString });
  };

  formatToTableData = caseData => {
    const resultData = [];
    const caseObjs = Array.isArray(caseData) ? caseData : [caseData];

    caseObjs.forEach((caseObj, idx) => {
      let statusText;
      if (caseObj.pause) {
        statusText = '評估人員中斷';
      } else {
        statusText = caseObj.completed ? '正常完成' : '未完成';
      }
      resultData.push({
        key: idx,
        caseId: caseObj.id,
        caseNo: caseObj.caseNo,
        testType: TEST_NAME_MAPPING[caseObj.testType],
        status: statusText,
        staff: caseObj.medicalStaff.name,
        location: caseObj.location.name,
        datetime: moment(caseObj.createdAt, 'x').format('YYYY-MM-DD H:mm:ss'),
      });
    });

    return resultData;
  };

  hasData = fetchData => {
    if (!fetchData || fetchData.length === 0) {
      notification.error({
        message: '查無資料',
      });
      return false;
    }
    return true;
  };

  searchByCaseNo = async apolloClient => {
    const { caseNo } = this.state;
    if (caseNo && caseNo.trim() !== '') {
      this.search(apolloClient, GET_CASES_HISTORY_DATA_BY_CASE_NO, {
        caseNo,
      });
    }
  };

  searchByStaff = async apolloClient => {
    const { staffId } = this.state;
    if (staffId && staffId.trim() !== '') {
      this.search(apolloClient, GET_CASES_HISTORY_DATA_BY_STAFF_ID, {
        staffId,
      });
    }
  };

  searchByLocation = async apolloClient => {
    const { locationId } = this.state;
    if (locationId && locationId.trim() !== '') {
      this.search(apolloClient, GET_CASES_HISTORY_DATA_BY_LOCATION_ID, {
        locationId,
      });
    }
  };

  searchByDate = async apolloClient => {
    const { searchDate } = this.state;
    if (searchDate && searchDate.trim() !== '') {
      this.search(apolloClient, GET_CASES_HISTORY_DATA_BY_DATE, {
        date: searchDate,
      });
    }
  };

  search = async (apolloClient, queryObj, variables) => {
    this.setState({ searchResultData: null });

    const { data } = await apolloClient.query({
      query: queryObj.query,
      variables,
    });
    const fetchData = data[queryObj.name];
    if (this.hasData(fetchData)) {
      const resultData = this.formatToTableData(fetchData);
      this.setState({ searchResultData: resultData });
    }
  };

  renderSearchResult = () => {
    const { searchResultData } = this.state;
    if (searchResultData && Array.isArray(searchResultData)) {
      let downloadAllUrl = '/download/records?';
      searchResultData.forEach(d => {
        downloadAllUrl += `caseIds[]=${d.caseId}&`;
      });

      return (
        <Row type="flex" justify="center" align="middle">
          <Divider>查詢結果</Divider>
          {searchResultData.length > 0 && (
            <Col span={18}>
              <h3>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={downloadAllUrl}
                >
                  全部下載
                </a>
              </h3>
            </Col>
          )}
          <Col span={22}>
            <Table
              pagination={{ defaultPageSize: 50 }}
              columns={tableColumns}
              dataSource={this.state.searchResultData}
            />
          </Col>
        </Row>
      );
    }
    return null;
  };

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    return (
      <ApolloConsumer>
        {client => (
          <RecordRoot>
            <RecordWrapper>
              <Title level={3}>請選擇查詢方式：</Title>
              <Row type="flex" justify="end" align="middle">
                <Col span={18}>
                  <Form {...formItemLayout} className="new-test-form">
                    <Form.Item label="個案編號">
                      <Row>
                        <Col span={12}>
                          <Input
                            prefix={
                              <Icon
                                type="solution"
                                style={{ color: 'rgba(0,0,0,.25)' }}
                              />
                            }
                            placeholder="個案編號"
                            onChange={this.handleCaseNoChange}
                            autoComplete="off"
                          />
                        </Col>
                        <Col span={4}>
                          <Button
                            type="dashed"
                            onClick={async () => {
                              this.searchByCaseNo(client);
                            }}
                          >
                            查詢
                          </Button>
                        </Col>
                      </Row>
                    </Form.Item>
                    <Form.Item label="評估人員">
                      <Row>
                        <Col span={12}>
                          <NewTestFormSelect
                            query={GET_MEDICAL_STAFFS}
                            placeholder="選擇評估人員"
                            onChange={this.handleStaffChange}
                          />
                        </Col>
                        <Col span={4}>
                          <Button
                            type="dashed"
                            onClick={async () => {
                              this.searchByStaff(client);
                            }}
                          >
                            查詢
                          </Button>
                        </Col>
                      </Row>
                    </Form.Item>
                    <Form.Item label="測驗地點">
                      <Row>
                        <Col span={12}>
                          <NewTestFormSelect
                            query={GET_LOCATIONS}
                            placeholder="選擇測驗地點"
                            onChange={this.handleLocationChange}
                          />
                        </Col>
                        <Col span={4}>
                          <Button
                            type="dashed"
                            onClick={async () => {
                              this.searchByLocation(client);
                            }}
                          >
                            查詢
                          </Button>
                        </Col>
                      </Row>
                    </Form.Item>
                    <Form.Item label="測驗日期">
                      <Row type="flex" justify="start">
                        <Col span={12}>
                          <DatePicker onChange={this.handleDateChange} />
                        </Col>
                        <Col span={4}>
                          <Button
                            type="dashed"
                            onClick={async () => {
                              this.searchByDate(client);
                            }}
                          >
                            查詢
                          </Button>
                        </Col>
                      </Row>
                    </Form.Item>
                  </Form>
                </Col>
              </Row>
              {this.renderSearchResult()}
              <Button onClick={this.backToIndex}>返回首頁</Button>
            </RecordWrapper>
          </RecordRoot>
        )}
      </ApolloConsumer>
    );
  }
}

// HistoricalRecords.propTypes = {
//   form: PropTypes.object.isRequired,
// };

export default withStyles(s)(HistoricalRecords);
