import styled from 'styled-components';

export const WelcomeRoot = styled.div`
  width: 100%;
  padding: 25px 0px;
  position: relative;
  min-height: 768px;
`;

export const BannerWrapper = styled.div`
  background-color: #ddd;
  padding: 75px 20px;
`;

export const Banner = styled.div`
  margin: 0 auto;
  position: relative;
  width: 768px;
  height: 400px;
  background-color: #eee;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 15px 20px;
`;

export const MenuWrapper = styled.div`
  text-align: center;
  width: 100%;
  padding: 40px 20px;
`;

export const BannerTitle = styled.p`
  font-weight: 600;
  text-align: center;
  color: #666;
  word-wrap: break-word;
  font-size: 1.4rem;
`;

export const BrandContainer = styled.div`
  width: 65%;
  max-width: 600px;
  max-height: 250px;
  border-radius: 5px;
  background-color: blue;
`;

export const BrandImage = styled.img`
  max-width: 50px;
`;

export const ButtonLink = styled.a`
  color: #fff;
  text-decoration: none;
  margin-left: 10px;
  vertical-align: -0.125em;
`;
