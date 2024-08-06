/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import {
  FooterRoot,
  FooterContainer,
  Text,
  Spacer,
  Link,
} from './Footer.style';

class Footer extends React.Component {
  render() {
    return (
      <FooterRoot>
        <FooterContainer>
          <Text>© C-DVT</Text>
          <Spacer>·</Spacer>
          <Link href="/">Home</Link>
          <Spacer>·</Spacer>
          <Link href="/admin">Admin</Link>
          <Spacer>·</Spacer>
          <Link href="/privacy">Privacy</Link>
        </FooterContainer>
      </FooterRoot>
    );
  }
}

export default Footer;
