/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { HeaderContainer, Navigation, NavLink, BrandImg } from './Header.style';
import smile from '../../images/smile.png';

class Header extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
  };

  render() {
    const { title } = this.props;
    return (
      <HeaderContainer>
        <BrandImg src={smile} />
        <span>{title}</span>
        <Navigation>
          <NavLink href="#">HOMEEEEE</NavLink>
        </Navigation>
      </HeaderContainer>
    );
  }
}

export default Header;
