import styled from 'styled-components';
import Cascader from 'antd/lib/cascader';

export const QuestionWrapper = styled.div`
  margin: 0 auto;
`;

export const QuestionBody = styled.h2`
  padding: 20px 10px;
  font-size: 1.9rem;
  color: #888;
`;

export const EverDoneBeforeQ = styled.h3`
  padding: 15px;
  width: 550px;
  text-align: left;
`;

export const BatchQuestionOption = styled.div`
  display: inline-block;
  background-color: #eee;
  border: 2px solid #aaa;
  margin-left: 10px;
  padding: 15px;
  color: #4085c6;
  font-weight: 700;
  cursor: pointer;
  &:hover {
    border: 2px solid #143656;
  }
`;

export const QuestionOption = styled.div`
  background-color: #eee;
  border: 1px solid #aaa;
  padding: 5px;
  margin-top: 10px;
  font-size: 1em;
  font-weight: 400;
  user-select: none;
  cursor: pointer;
  .title {
    color: #4085c6;
    font-weight: 700;
  }
  .value {
    color: #143656;
    font-weight: 500;
  }

  &:hover {
    border: 4px solid #143656;
  }
  @media (max-width: 769px) {
    font-size: 1.3em;
  }
`;

export const ActivityChoiceItem = styled.div`
  background-color: #eee;
  border: 3px solid #aaa;
  height: 230px;
  padding: 10px;
  margin: 5px;
  font-weight: 600;
  text-align: left;
  .title {
    font-size: 1.5em;
    font-weight: 600;
    margin-bottom: 8px;
  }
  .options {
    font-size: 1.3em;
    font-weight: 300;
    margin: 5px;
  }
`;

export const HugeCascader = styled(Cascader)`
  .ant-cascader-menu {
    .ant-cascader-menu-item {
      line-height: 40px;
      font-size: 1.1rem;
    }
  }
`;

// BatchLevelSelect
export const BatchLevelItem = styled.div`
  width: 100%;
  padding-top: 5px;
  margin: 10px 0px;
  &:hover {
    background-color: #eee;
  }
`;

export const BatchLevelItemName = styled.h3`
  width: 330px;
  text-align: left;
`;

export const BatchLevelOptionHeader = styled.div`
  display: inline-block;
  font-weight: 900;
  text-align: center;
  color: #555;
  width: 150px;
`;

export const BatchLevelOption = styled.div`
  display: inline-block;
  width: 110px;
  text-align: center;
  padding-top: 5px;
  font-size: 0.8em;
  font-weight: 900;
  cursor: pointer;
`;

// BatchFrequencyChoose
export const BatchFrequencyItem = styled.div`
  width: 100%;
  padding-top: 5px;
  margin: 10px 0px;
  &:hover {
    background-color: #eee;
  }
`;

export const BatchFrequencyItemName = styled.h3`
  width: 330px;
  text-align: left;
`;

export const BatchFrequencyOption = styled.div`
  display: inline-block;
  width: 125px;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
`;

// BatchSubQuestion
export const BatchSubQuestionItem = styled.div`
  width: 100%;
  padding-top: 5px;
  margin: 10px 0px;
  &:hover {
    background-color: #eee;
  }
`;

export const BatchSubQuestionItemName = styled.h3`
  text-align: left;
  font-size: 1.2em;
`;

export const BatchSubQuestionOption = styled.div`
  display: inline-block;
  font-weight: 900;
  cursor: pointer;
`;

export const SubQuestionItem = styled.div`
  width: 100%;
  padding-top: 5px;
  margin: 10px 0px;
`;

export const SubQuestionChoosedArea = styled.div`
  padding: 10px;
`;

// Emotional Test
export const ImgEmotionalFacePhoto = styled.img`
  padding: 15px;
  width: 100%;
  min-height: 430px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
`;

export const EmotionQuestionText = styled.h2`
  padding: 5px;
  font-size: 1.5rem;
  color: #888;
`;

export const EmotionOption = styled.div`
  background-color: #555;
  border: 1px solid #aaa;
  padding: 15px;
  margin: 5px;
  font-size: 1.3em;
  font-weight: 400;
  cursor: pointer;
  user-select: none;
  .title {
    color: white;
    font-weight: 700;
  }
  &:hover {
    .title {
      color: #ccc;
    }
  }
  @media (max-width: 769px) {
    font-size: 1.3em;
  }
`;

export const CAATNumber = styled.p`
  padding: 20px 10px;
  font-size: 10rem;
  margin-bottom: 0px;
  color: #888;
  height: 300px;
`;

export const CAATGraphicWrapper = styled.div`
  height: 300px;
`;

export const CAATOption = styled.div`
  background-color: #eee;
  border: 1px solid #aaa;
  padding: 5px;
  cursor: pointer;
  .title {
    color: #4085c6;
    font-weight: 900;
    font-size: 6rem;
    margin-bottom: 0px;
  }
  &:hover {
    border: 4px solid #143656;
  }
  @media (max-width: 769px) {
    font-size: 1.3em;
  }
`;

// SQOL Test
export const SQOLOption = styled.div`
  background-color: #53aadf;
  height: 80px;
  border: none;
  padding: 5px;
  margin-top: 10px;
  user-select: none;
  cursor: pointer;
  &:hover .score {
    color: #555;
  }
  @media (max-width: 769px) {
    font-size: 1.3em;
  }
`;

export const SQOLTextDegreeDesc = styled.p`
  font-size: 1.8rem;
`;

export const SQOLImgArrow = styled.img`
  display: block;
  margin: 0 auto;
  width: 100%;
`;

export const SQOLBtnSkip = styled.button`
  margin-top: 80px;
  width: 180px;
  height: 50px;
  background-color: #2fd9e9;
  border: none;
`;
