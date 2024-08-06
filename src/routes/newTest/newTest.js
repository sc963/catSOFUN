/* eslint-disable prettier/prettier */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import PropTypes from 'prop-types';
import {
  Row,
  Col,
  Form,
  Input,
  Icon,
  Button,
  Modal,
  Typography,
  notification,
} from 'antd';
import s from 'antd/dist/antd.less';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import NewTestFormSelect from './newTestFormSelect';
import { FormRoot, FormWrapper, ImgCreateNew } from './newTest.style';
import IconCreateNew from '../../images/iconNewTest.png';
import { GET_LOCATIONS, GET_MEDICAL_STAFFS } from '../../db/queries/actions';
import {
  CREATE_LOCATION,
  CREATE_MEDICAL_STAFF,
  CREATE_CASE,
} from '../../db/mutations/actions';
import { CDVT } from '../../constants/testType.const';

const { Text, Title } = Typography;

class NewTest extends Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      staffId: null,
      locationId: null,
      caseNo: null,
      newLocationName: '',
      newLocationModalVisible: false,
      newMedicalStaffName: '',
      newMedicalStaffModalVisible: false,
    };
  }

  handleCreateCase = createMutation => {
    this.props.form.validateFields(err => {
      if (!err) {
        createMutation().then(c => {
          const { id: caseId, testType } = c.data[CREATE_CASE.name];
          let url = '';
          if (testType === CDVT) {
            url = `/${testType}Tutorial?caseId=${caseId}`;
          } else {
            url = `/${testType}Intro?caseId=${caseId}`;
          }
          window.location.href = url;
        });
      }
    });
  };

  handleCaseNoChange = e => {
    // eslint-disable-next-line react/no-unused-state
    this.setState({ caseNo: e.target.value });
  };

  handleStaffChange = value => {
    // eslint-disable-next-line react/no-unused-state
    this.setState({ staffId: value });
    this.props.form.setFieldsValue({ medicalStaff: value });
  };

  handleLocationChange = value => {
    // eslint-disable-next-line react/no-unused-state
    this.setState({ locationId: value });
    this.props.form.setFieldsValue({ location: value });
  };

  showLocationModal = () => {
    this.setState({ newLocationModalVisible: true });
  };

  hideLocationModal = () => {
    this.setState({ newLocationModalVisible: false });
  };

  showNewStaffModal = () => {
    this.setState({ newMedicalStaffModalVisible: true });
  };

  hideNewStaffModal = () => {
    this.setState({ newMedicalStaffModalVisible: false });
  };

  showSuccess = desc => {
    notification.success({
      message: '操作成功',
      description: desc,
    });
  };

  renderNewStaffModal = () => {
    const { newMedicalStaffName } = this.state;
    return (
      <Mutation
        mutation={CREATE_MEDICAL_STAFF.query}
        variables={{ name: newMedicalStaffName }}
        update={(cache, { data: { createMedicalStaff } }) => {
          const { getMedicalStaffs } = cache.readQuery({
            query: GET_MEDICAL_STAFFS.query,
          });
          cache.writeQuery({
            query: GET_MEDICAL_STAFFS.query,
            data: {
              getMedicalStaffs: getMedicalStaffs.concat([createMedicalStaff]),
            },
          });
        }}
      >
        {(createMedicalStaff, { error }) => (
          <Modal
            title="新增評估人員"
            visible={this.state.newMedicalStaffModalVisible}
            onOk={() => {
              if (newMedicalStaffName.trim() !== '') {
                createMedicalStaff()
                  .then(() => this.hideNewStaffModal())
                  .then(() =>
                    this.showSuccess(`已新增：${newMedicalStaffName}`),
                  );
              }
            }}
            onCancel={this.hideNewStaffModal}
            okText="新增"
            cancelText="取消"
          >
            <Input
              prefix={<Icon type="home" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="請輸入評估人員名稱"
              maxLength={10}
              onChange={e =>
                this.setState({ newMedicalStaffName: e.target.value })
              }
            />
            {error && <Text type="danger">{error.toString()}</Text>}
          </Modal>
        )}
      </Mutation>
    );
  };

  renderLocationModal = () => {
    const { newLocationName } = this.state;
    return (
      <Mutation
        mutation={CREATE_LOCATION.query}
        variables={{ name: newLocationName }}
        update={(cache, { data: { createLocation } }) => {
          const { getLocations } = cache.readQuery({
            query: GET_LOCATIONS.query,
          });
          cache.writeQuery({
            query: GET_LOCATIONS.query,
            data: { getLocations: getLocations.concat([createLocation]) },
          });
        }}
      >
        {(createLocation, { error }) => (
          <Modal
            title="新增測驗地點"
            visible={this.state.newLocationModalVisible}
            onOk={() => {
              if (newLocationName.trim() !== '') {
                createLocation()
                  .then(() => this.hideLocationModal())
                  .then(() => this.showSuccess(`已新增：${newLocationName}`));
              }
            }}
            onCancel={this.hideLocationModal}
            okText="新增"
            cancelText="取消"
          >
            <Input
              prefix={<Icon type="home" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="請輸入測驗地點名稱"
              maxLength={10}
              onChange={e => this.setState({ newLocationName: e.target.value })}
            />
            {error && <Text type="danger">{error.toString()}</Text>}
          </Modal>
        )}
      </Mutation>
    );
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { caseNo, staffId: medicalStaffId, locationId } = this.state;
    const {
      params: {
        query: { testType },
      },
    } = this.props;
    return (
      <Mutation
        mutation={CREATE_CASE.query}
        variables={{ caseNo, medicalStaffId, locationId, testType }}
      >
        {(createCase, { loading, error }) => (
          <FormRoot>
            <FormWrapper>
              <Row type="flex" justify="space-around" align="middle">
                <Col span={18}>
                  <Form onSubmit={this.handleSubmit} className="new-test-form">
                    <Form.Item label="個案編號">
                      {getFieldDecorator('caseName', {
                        rules: [
                          { required: true, message: 'Please input caseName!' },
                        ],
                      })(
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
                        />,
                      )}
                    </Form.Item>
                    <Form.Item label="評估人員">
                      {getFieldDecorator('medicalStaff', {
                        rules: [
                          {
                            required: true,
                            message: 'Please input medicalStaff!',
                          },
                        ],
                      })(
                        <NewTestFormSelect
                          query={GET_MEDICAL_STAFFS}
                          placeholder="選擇評估人員"
                          onChange={this.handleStaffChange}
                        />,
                      )}
                      <Button type="dashed" onClick={this.showNewStaffModal}>
                        新增評估人員
                      </Button>
                    </Form.Item>
                    <Form.Item label="測驗地點">
                      {getFieldDecorator('location', {
                        rules: [
                          { required: true, message: 'Please input location!' },
                        ],
                      })(
                        <NewTestFormSelect
                          query={GET_LOCATIONS}
                          placeholder="選擇測驗地點"
                          onChange={this.handleLocationChange}
                        />,
                      )}
                      <Button type="dashed" onClick={this.showLocationModal}>
                        新增測驗地點
                      </Button>
                    </Form.Item>
                    <Form.Item label="測驗時間">
                      <Title level={3}>
                        {new Date().toLocaleDateString('zh-TW')}
                      </Title>
                    </Form.Item>
                    <Form.Item>
                      <Button
                        style={{ width: '100%' }}
                        type="primary"
                        htmlType="button"
                        onClick={() => this.handleCreateCase(createCase)}
                      >
                        {loading ? '個案建立中...' : '進入測驗'}
                      </Button>
                      {error && <Text type="danger">{error.toString()}</Text>}
                    </Form.Item>
                  </Form>
                </Col>
                <Col span={6}>
                  <ImgCreateNew src={IconCreateNew} alt="icon-create-new" />
                </Col>
              </Row>
              {this.renderLocationModal()}
              {this.renderNewStaffModal()}
            </FormWrapper>
          </FormRoot>
        )}
      </Mutation>
    );
  }
}

NewTest.propTypes = {
  params: PropTypes.object,
};

NewTest.defaultProps = {
  params: {},
};

const WrappedNewTestForm = Form.create({ name: 'new_test' })(NewTest);

export default withStyles(s)(WrappedNewTestForm);
