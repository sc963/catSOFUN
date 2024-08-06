import styled, { css } from 'styled-components';

const textStyle = css`
  padding: 2px 5px;
  font-size: 1em;
`;

export const FooterRoot = styled.div`
  position: relative;
  bottom: 0;
  width: 100%;
  background: #333;
  color: #fff;
`;

export const FooterContainer = styled.div`
  margin: 0 auto;
  padding: 20px 15px;
  max-width: var(--max-content-width);
  text-align: center;
`;

export const Text = styled.span`
  ${textStyle};
  color: rgba(255, 255, 255, 0.5);
`;

export const Spacer = styled.span`
  color: rgba(255, 255, 255, 0.3);
`;

export const Link = styled.a`
  ${textStyle};
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  &:hover {
    color: rgba(255, 255, 255, 1);
  }
`;
