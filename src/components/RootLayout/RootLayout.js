import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import normalizeCss from 'normalize.css';
import { Layout, Typography } from 'antd';
import antdStyle from 'antd/dist/antd.less';

const { Header, Content } = Layout;
const { Text } = Typography;

class RootLayout extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  render() {
    return (
      <div>
        <Layout>
          <Header>
            <a href="/">
              <Text style={{ color: '#FFF', fontWeight: 'bold' }}>
                職能評估測驗系統
              </Text>
            </a>
          </Header>
          <Content>{this.props.children}</Content>
        </Layout>
      </div>
    );
  }
}

export default withStyles(normalizeCss, antdStyle)(RootLayout);
