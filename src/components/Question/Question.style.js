import styled from 'styled-components';

export const QuestionWrapper = styled.div`
  margin: 0 auto;
  padding: 15px;
`;

export const Number = styled.div`
  background-color: #ccc;
  border: 5px solid #666;
  padding: 10px;
  font-size: 4em;
  font-weight: bold;
  @media (max-width: 769px) {
    font-size: 2em;
  }
`;

export const AnswerPanel = styled.div`
  margin: 0 auto;
  padding: 15px;
`;

export const AnswerButton = styled.button`
  width: 100%;
  font-size: 8em;
  font-weight: 900;
  padding: 30px 0px;
  color: #fff;
  background-color: #9ebfc3;
  border: 2px solid #33596b;
  cursor: pointer;
  &:hover {
    box-shadow: 2px 2px #a7a8a9;
    text-shadow: 2px 2px #666;
  }
  @media (max-width: 769px) {
    font-size: 3em;
    padding: 10px;
  }
`;
