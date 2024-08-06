import styled from 'styled-components';

export const HeaderContainer = styled.div`
  width: 100%;
  height: 55px;
  background-color: #61dafb;
  padding: 10px 20px;
`;

export const BrandImg = styled.img`
  width: 35px;
`;

export const Navigation = styled.div`
  float: right;
  margin: 0 35px;
`;

export const NavLink = styled.a`
  display: inline-block;
  padding: 3px 8px;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: bold;
  &:hover {
    color: rgba(255, 255, 255, 1);
  }
`;
