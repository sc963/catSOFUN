import styled from 'styled-components';
import imgBgAfterPractice from '../../../../images/bgAfterPractice.jpg';

export const PracticeRoot = styled.div`
  min-height: 768px;
  background-color: #f0f2f5;
  text-align: center;
`;

export const PracticeWrapper = styled.div`
  margin: 0 auto;
  padding: 30px;
  text-align: center;
`;

export const VerifingCase = styled.div`
  margin: 0 auto;
  padding: 150px;
`;

export const BgAfterPractice = styled.div`
  width: 100%;
  text-align: center;
  background: url(${imgBgAfterPractice}) no-repeat center center;
  background-size: cover;
`;

export const TextCountDown = styled.h1`
  color: #555;
  padding-top: 20%;
`;
