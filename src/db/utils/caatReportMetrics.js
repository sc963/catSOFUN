import { reduce } from 'lodash';
import {
  CAAT_NUMERIC_THRESHOLD_DIGIT,
  Q_TYPE_CAAT_FORMAL,
  Q_TYPE_CAAT_PRACTICE,
  Q_TYPE_CAAT_SIMULATION,
} from '../../constants/models/questionaire.const';

const isNumeric = str => {
  if (typeof str !== 'string') return false;
  return !isNaN(str) && !isNaN(parseFloat(str));
};

const getCorrectCount = questions => {
  let correctCount = 0;
  questions.forEach(q => {
    if (isNumeric(q.body)) {
      if (
        parseInt(q.body, 10) > CAAT_NUMERIC_THRESHOLD_DIGIT &&
        q.answer === 'false'
      ) {
        correctCount += 1;
      } else if (
        parseInt(q.body, 10) < CAAT_NUMERIC_THRESHOLD_DIGIT &&
        q.answer === 'true'
      ) {
        correctCount += 1;
      }
    } else if (
      q.body.indexOf('NON_SYMMETRICAL') === -1 &&
      q.answer === 'true'
    ) {
      correctCount += 1;
    } else if (
      q.body.indexOf('NON_SYMMETRICAL') !== -1 &&
      q.answer === 'false'
    ) {
      correctCount += 1;
    }
  });
  return correctCount;
};

export default function CAATReportMetrics(histories) {
  const practices = histories.filter(
    h => h.questionType === Q_TYPE_CAAT_PRACTICE,
  );
  const simulations = histories.filter(
    h => h.questionType === Q_TYPE_CAAT_SIMULATION,
  );
  const formals = histories.filter(h => h.questionType === Q_TYPE_CAAT_FORMAL);

  const getTotalSeconds = questions =>
    (reduce(questions, (result, p) => result + p.costTime, 0) / 1000).toFixed(
      4,
    ) || 0;
  const practiceTotalCostSeconds = getTotalSeconds(practices);
  const simulationTotalCostSeconds = getTotalSeconds(simulations);
  const formalTotalCostSeconds = getTotalSeconds(formals);
  const totalCostSeconds =
    parseFloat(practiceTotalCostSeconds) +
    parseFloat(simulationTotalCostSeconds) +
    parseFloat(formalTotalCostSeconds);

  /** 練習題每個part 10題 */
  // 數字平均測驗時間(s)
  const practiceFirstPartAvgSeconds = (
    getTotalSeconds(practices.slice(0, 10)) / 10
  ).toFixed(4);
  // 圖形平均測驗時間(s)
  const practiceSecondPartAvgSeconds = (
    getTotalSeconds(practices.slice(10, 20)) / 10
  ).toFixed(4);
  // 交替平均測驗時間(s)
  const practiceThirdPartAvgSeconds = (
    getTotalSeconds(practices.slice(20, practices.length)) / 10
  ).toFixed(4);

  /** 模擬測驗每個part 8題 */
  // 數字平均測驗時間(s)
  const simulationFirstPartAvgSeconds = (
    getTotalSeconds(simulations.slice(0, 8)) / 10
  ).toFixed(4);
  // 圖形平均測驗時間(s)
  const simulationSecondPartAvgSeconds = (
    getTotalSeconds(simulations.slice(8, 16)) / 10
  ).toFixed(4);
  // 交替平均測驗時間(s)
  const simulationThirdPartAvgSeconds = (
    getTotalSeconds(simulations.slice(16, simulations.length)) / 10
  ).toFixed(4);

  /** 正是測驗每個part 24題 */
  // 數字平均測驗時間(s)
  const formalFirstPartAvgSeconds = (
    getTotalSeconds(formals.slice(0, 24)) / 10
  ).toFixed(4);
  // 圖形平均測驗時間(s)
  const formalSecondPartAvgSeconds = (
    getTotalSeconds(formals.slice(24, 48)) / 10
  ).toFixed(4);
  // 交替平均測驗時間(s)
  const formalThirdPartAvgSeconds = (
    getTotalSeconds(formals.slice(48, formals.length)) / 10
  ).toFixed(4);

  // 未交替的平均秒數：(數字+圖形的總秒數) / (數字題數+圖形題數）
  const practiceNonMixedAvgSeconds = (
    getTotalSeconds(practices.slice(0, 20)) / 20
  ).toFixed(4);
  const practiceMixedAvgSeconds = (
    getTotalSeconds(practices.slice(20, 30)) / 10
  ).toFixed(4);
  const simulationNonMixedAvgSeconds = (
    getTotalSeconds(simulations.slice(0, 16)) / 16
  ).toFixed(4);
  const simulationMixedAvgSeconds = (
    getTotalSeconds(simulations.slice(16, 32)) / 8
  ).toFixed(4);
  const formalNonMixedAvgSeconds = (
    getTotalSeconds(formals.slice(0, 48)) / 48
  ).toFixed(4);
  const formalMixedAvgSeconds = (
    getTotalSeconds(formals.slice(48, 72)) / 24
  ).toFixed(4);

  // 測驗比值（交替的平均秒數 / 未交替平均秒數）
  const practiceTestRatio = (
    practiceMixedAvgSeconds / practiceNonMixedAvgSeconds
  ).toFixed(4);
  const simulationTestRatio = (
    simulationMixedAvgSeconds / simulationNonMixedAvgSeconds
  ).toFixed(4);
  const formalTestRatio = (
    formalMixedAvgSeconds / formalNonMixedAvgSeconds
  ).toFixed(4);

  // 測驗差值（交替平均秒數 - 未交替平均秒數
  const practiceTestDeviation =
    practiceMixedAvgSeconds - practiceNonMixedAvgSeconds;
  const simulationTestDeviation =
    simulationMixedAvgSeconds - simulationNonMixedAvgSeconds;
  const formalTestDeviation = formalMixedAvgSeconds - formalNonMixedAvgSeconds;

  const practiceCorrectCount = getCorrectCount(practices);
  const simulationCorrectCount = getCorrectCount(simulations);
  const formalCorrectCount = getCorrectCount(formals);

  // 每個part的答對題數
  const practiceFirstPartCorrectCount = getCorrectCount(practices.slice(0, 10));
  const practiceSecondPartCorrectCount = getCorrectCount(
    practices.slice(10, 20),
  );
  const practiceThirdPartCorrectCount = getCorrectCount(
    practices.slice(20, 30),
  );

  const simulationFirstPartCorrectCount = getCorrectCount(
    simulations.slice(0, 8),
  );
  const simulationSecondPartCorrectCount = getCorrectCount(
    simulations.slice(8, 16),
  );
  const simulationThirdPartCorrectCount = getCorrectCount(
    simulations.slice(16, 24),
  );

  const formalFirstPartCorrectCount = getCorrectCount(formals.slice(0, 24));
  const formalSecondPartCorrectCount = getCorrectCount(formals.slice(24, 48));
  const formalThirdPartCorrectCount = getCorrectCount(formals.slice(48, 72));

  return {
    practices,
    simulations,
    formals,

    // 時間類
    practiceTotalCostSeconds,
    simulationTotalCostSeconds,
    formalTotalCostSeconds,
    totalCostSeconds,
    // 每個part平均答題時間（順序：數字 => 圖形 => 圖形＋數字交替）
    practiceFirstPartAvgSeconds,
    practiceSecondPartAvgSeconds,
    practiceThirdPartAvgSeconds,
    simulationFirstPartAvgSeconds,
    simulationSecondPartAvgSeconds,
    simulationThirdPartAvgSeconds,
    formalFirstPartAvgSeconds,
    formalSecondPartAvgSeconds,
    formalThirdPartAvgSeconds,

    // 未交替平均秒數（數字＋圖形）
    practiceNonMixedAvgSeconds,
    simulationNonMixedAvgSeconds,
    formalNonMixedAvgSeconds,

    // 測驗比值
    practiceTestRatio,
    simulationTestRatio,
    formalTestRatio,

    // 測驗差值
    practiceTestDeviation,
    simulationTestDeviation,
    formalTestDeviation,

    // count類
    practiceCorrectCount,
    simulationCorrectCount,
    formalCorrectCount,

    // 每個part的答對數（順序：數字 => 圖形 => 圖形＋數字交替）
    practiceFirstPartCorrectCount,
    practiceSecondPartCorrectCount,
    practiceThirdPartCorrectCount,
    simulationFirstPartCorrectCount,
    simulationSecondPartCorrectCount,
    simulationThirdPartCorrectCount,
    formalFirstPartCorrectCount,
    formalSecondPartCorrectCount,
    formalThirdPartCorrectCount,
  };
}
