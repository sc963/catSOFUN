/* eslint-disable prettier/prettier */
import { filter, reduce } from 'lodash';

function getResultInfo(caseData) {
  const correctJudgeString = correctCount => {
    if (correctCount >= 100) {
      return '良好';
    } if (correctCount >= 80 && correctCount < 100) {
      return '尚可';
    } if (correctCount < 80) {
      return '待加強';
    }
    return '無法判定';
  };
  const responseTimeJudgeString = avgResSeconds => {
    if (avgResSeconds <= 1) {
      return '良好';
    } if (avgResSeconds > 1 && avgResSeconds <= 4) {
      return '尚可';
    } if (avgResSeconds > 4) {
      return '待加強';
    }
    return '無法判定';
  };
  const totalTimeJudgeString = totalCostSeconds => {
    if (totalCostSeconds <= 100) {
      return '良好';
    } if (totalCostSeconds > 100 && totalCostSeconds <= 500) {
      return '尚可';
    } if (totalCostSeconds > 500) {
      return '待加強';
    }
    return '無法判定';
  };

  // Formal Test Result
  const formalTotalCount = caseData.examHistories.length;
  const formalCorrectCount = filter(caseData.examHistories, q => q.isCorrect).length;
  const formalIncorrectCount = filter(caseData.examHistories, q => !q.isTimeout && !q.isCorrect).length;
  const formalCorrectRate = formalCorrectCount / formalTotalCount;
  const formalTotalCostSeconds = (reduce(
    caseData.examHistories,
    (result, qObj) => result + qObj.costTime,
    0,
  ) / 1000).toFixed(4) || 0;
  const formalAvgReactSeconds = parseFloat(formalTotalCostSeconds / formalTotalCount).toFixed(4);

  const formalAvgCorrectReactSeconds = (reduce(
    filter(caseData.examHistories, q => q.isCorrect),
    (result, qObj) => result + qObj.costTime,
    0,
  ) / formalCorrectCount) || 0;
  const formalTimeoutCount = filter(caseData.examHistories, q => q.isTimeout).length;
  const formalCorrectJudge = correctJudgeString(formalCorrectCount);
  const formalResTimeJudge = responseTimeJudgeString(formalAvgReactSeconds);
  const formalTotalCostTimeJudge = totalTimeJudgeString(formalTotalCostSeconds);

  // Practice Test Result
  const practiceTotalCount = caseData.practiceHistories.length;
  const practiceCorrectCount = filter(caseData.practiceHistories, q => q.isCorrect).length;
  const practiceIncorrectCount = filter(caseData.practiceHistories, q => !q.isCorrect).length;
  const practiceCorrectRate = practiceCorrectCount / practiceTotalCount;
  const practiceTotalCostSeconds = (reduce(
    caseData.practiceHistories,
    (result, qObj) => result + qObj.costTime,
    0,
  ) / 1000).toFixed(4) || 0;
  const practiceAvgReactSeconds = practiceTotalCostSeconds / practiceTotalCount;
  const practiceAvgCorrectReactSeconds = (reduce(
    filter(caseData.practiceHistories, q => q.isCorrect),
    (result, qObj) => result + qObj.costTime,
    0,
  ) / practiceCorrectCount) || 0;

  // Total
  const toalCostSeconds = (parseFloat(formalTotalCostSeconds) + parseFloat(practiceTotalCostSeconds)).toFixed(4);
  const totalReactionSeconds = ((parseFloat(formalAvgReactSeconds) + parseFloat(practiceAvgReactSeconds)) / 2).toFixed(4);

  return {
    toalCostSeconds,
    totalReactionSeconds,

    formalTotalCount,
    formalCorrectCount,
    formalIncorrectCount,
    formalCorrectRate,
    formalTotalCostSeconds,
    formalAvgReactSeconds,
    formalAvgCorrectReactSeconds,
    formalTimeoutCount,
    formalCorrectJudge,
    formalResTimeJudge,
    formalTotalCostTimeJudge,

    practiceTotalCount,
    practiceCorrectCount,
    practiceIncorrectCount,
    practiceCorrectRate,
    practiceTotalCostSeconds,
    practiceAvgReactSeconds,
    practiceAvgCorrectReactSeconds,
  };
}

export default getResultInfo;
