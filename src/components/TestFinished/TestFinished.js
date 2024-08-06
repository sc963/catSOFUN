import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import { Button, Typography, Row, Col } from 'antd';
import s from 'antd/dist/antd.less';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import SignatureCanvas from 'react-signature-canvas';
import {
  TestFinishedRoot,
  ImgCongrats,
  SignPadWrapper,
} from './TestFinished.style';
import imgCongrats from '../../images/congrats.png';
import { SAVE_CASE_SIGNATURE } from '../../db/mutations/actions';

const { Title } = Typography;

class TestFinished extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSigned: false,
    };
    this.signPad = React.createRef();
  }

  clear = () => {
    this.signPad.current.clear();
    this.setState({ isSigned: false });
  };

  onSignBegin = () => {
    if (this.signPad.current.toData().length >= 2) {
      this.setState({ isSigned: true });
    }
  };

  handleViewResult = saveSignatureMutation => {
    const { isSigned } = this.state;
    if (isSigned) {
      const { caseId } = this.props;
      const signatureBase64 = this.signPad.current.toDataURL('image/png');
      saveSignatureMutation({ variables: { caseId, signatureBase64 } }).then(
        () => {
          window.location.href = `/result?caseId=${caseId}`;
        },
      );
    }
  };

  render() {
    return (
      <TestFinishedRoot>
        <Row type="flex" justify="space-between">
          <Col span={6}>
            <Mutation mutation={SAVE_CASE_SIGNATURE.query}>
              {(saveCaseSignature, { loading: saving, error: saveErr }) => (
                <div>
                  <ImgCongrats src={imgCongrats} />
                  <Title level={4}>請在空白處簽上您的大名</Title>
                  {this.state.isSigned && (
                    <Button
                      style={{
                        width: '100%',
                        height: '70px',
                        fontSize: '1.3em',
                      }}
                      type="primary"
                      htmlType="button"
                      size="large"
                      onClick={() =>
                        this.handleViewResult(saveCaseSignature, saving)
                      }
                    >
                      {saving && '正在儲存簽名...'}
                      {!saving && '前往查看結果'}
                      {saveErr && `儲存簽名失敗:${saveErr.toString()}`}
                    </Button>
                  )}
                </div>
              )}
            </Mutation>
          </Col>
          <Col span={16}>
            <SignPadWrapper>
              <SignatureCanvas
                ref={this.signPad}
                onBegin={this.onSignBegin}
                backgroundColor="#fff"
                canvasProps={{
                  width: 650,
                  height: 350,
                }}
              />
              <br />
              <Button type="dashed" onClick={this.clear}>
                清除
              </Button>
            </SignPadWrapper>
          </Col>
        </Row>
      </TestFinishedRoot>
    );
  }
}

TestFinished.propTypes = {
  caseId: PropTypes.string.isRequired,
};

export default withStyles(s)(TestFinished);
