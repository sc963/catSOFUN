import { reduce } from 'lodash';
import getDatetimeString from '../../utils/reports/getDatetimeString';
import { Q_TYPE_HINT } from '../../constants/models/questionaire.const';

const REVERT_START_Q_ORDER = 32;
const REVERT_END_Q_ORDER = 41;

// 反向計分： answer - 5 取絕對值 + 1
function getReversedScore(score) {
  return Math.abs(Number(score) - 5) + 1;
}

// Excel上方各題結果歷程
async function createTestLogExcelData(caseObj) {
  const { questionaireHistories: histories } = caseObj;

  // Excel Data Rows
  const rowCaseInfo = [
    '個案編號',
    caseObj.caseNo,
    '測驗時間',
    getDatetimeString(caseObj.createdAt),
  ];
  const rowQuestionOrder = ['題目編號'];
  const rowQuestionOrgScore = ['原始分數'];
  const rowQuestionReversedScore = ['反向計分'];
  const rowReactionTime = ['Reaciontime(每題反應毫秒)'];

  // 量表紀錄資料
  histories
    .filter(h => h.questionType !== Q_TYPE_HINT)
    .forEach((h, idx) => {
      const qOrder = Number(idx + 1);

      rowQuestionOrder.push(qOrder);

      // 41題後回簡答題，不能 as number
      if (qOrder > REVERT_END_Q_ORDER) {
        rowQuestionOrgScore.push(h.answer);
        rowQuestionReversedScore.push('');
        rowReactionTime.push(h.costTime);
        return;
      }

      const ansNumber = Number(h.answer);

      // 跳過就是 0 分
      if (ansNumber === 0) {
        rowQuestionOrgScore.push(ansNumber);
        rowQuestionReversedScore.push(ansNumber);
        rowReactionTime.push(h.costTime);
        return;
      }

      /**
       * 計分規則：
       * 1 ~ 31 題： answer 是幾分就是幾分
       * 32 ~ 41 題，反向計分： answer - 5 取絕對值 + 1
       */
      rowQuestionOrgScore.push(Number(h.answer));
      if (qOrder >= REVERT_START_Q_ORDER && qOrder <= REVERT_END_Q_ORDER) {
        rowQuestionReversedScore.push(getReversedScore(h.answer));
      } else {
        rowQuestionReversedScore.push(Number(h.answer));
      }

      rowReactionTime.push(h.costTime);
    });

  return [
    [...rowCaseInfo],
    [...rowQuestionOrder],
    [...rowQuestionOrgScore],
    [...rowQuestionReversedScore],
    [...rowReactionTime],
    [''], // 美觀上空白隔開
  ];
}

// Excel下方的Summary報表
function createTestSummaryExcelData(caseObj) {
  if (!caseObj) throw Error('caseObj is undefined');

  // Excel Data Rows
  const rowHeaders = [
    '個案',
    'date(測驗日期)',
    '全題目之總測驗時間(s)',
    '未答題號',
    '線性轉換分數',
    '全部總分',
    '自尊心',
    '復原力',
    '自主能力',
    '感情生活',
    '生理健康',
    '家庭關係',
    '朋友關係',
    '心理健康',
  ];
  const rowValus = [];

  const { questionaireHistories: histories } = caseObj;
  const historiesExceptHint = histories.filter(
    h => h.questionType !== Q_TYPE_HINT,
  );
  const totalCostSeconds =
    (
      reduce(
        historiesExceptHint,
        (result, history) => result + history.costTime,
        0,
      ) / 1000
    ).toFixed(4) || 0;

  rowValus.push(caseObj.caseNo);
  rowValus.push(getDatetimeString(caseObj.createdAt));
  rowValus.push(totalCostSeconds);

  const skipQuestionOrders = [];
  historiesExceptHint.forEach((h, idx) => {
    const order = idx + 1;
    if (order <= REVERT_END_Q_ORDER && String(h.answer) === '0') {
      skipQuestionOrders.push(order);
    }
  });
  // 未答題號
  rowValus.push(skipQuestionOrders.join(','));

  // 全部總分（是加總「反向」總分哦～）
  let counter = 0;
  const totalScore = reduce(
    historiesExceptHint.filter((_, idx) => idx + 1 <= REVERT_END_Q_ORDER),
    (total, current) => {
      counter += 1;
      if (counter >= REVERT_START_Q_ORDER) {
        return total + getReversedScore(Number(current.answer));
      }
      return total + Number(current.answer);
    },
    0,
  );

  // 分數線性轉換
  if (totalScore < 41) {
    rowValus.push(0);
  } else if (totalScore > 205) {
    rowValus.push(100);
  } else {
    // 41 ~ 205 轉換成 0 ~ 100
    // (1-(205-42)/164)*100
    const convertedScore = (1 - (205 - totalScore) / (205 - 41)) * 100;
    rowValus.push(convertedScore.toFixed(2));
  }

  // 全部總分
  rowValus.push(totalScore);

  /**
   * 八個子項目的分數「都是使用反向過的分數」來加總
   *
   * 自尊心：題目1、5、6、7、8、31
   * 復原力：題目2、3、4、11、12
   * 自主能力：題目9、10、13、22
   * 感情生活：題目14、30
   * 生理健康：題目15~18
   * 家庭關係：題目19、20、21、23、24
   * 朋友關係：題目25~29
   * 心理健康：題目32~41
   */

  const getScore = qOrderArray => {
    const questions = historiesExceptHint.filter((h, idx) =>
      qOrderArray.includes(idx + 1),
    );
    const score = reduce(
      questions,
      (total, current) => {
        if (current.order + 1 >= REVERT_START_Q_ORDER) {
          return total + getReversedScore(Number(current.answer));
        }
        return total + Number(current.answer);
      },
      0,
    );
    return score;
  };

  // 自尊心題目們
  const SELF_ESTEEM_Q_ORDERS = [1, 5, 6, 7, 8, 31];
  rowValus.push(getScore(SELF_ESTEEM_Q_ORDERS));

  // 復原力題目們
  const RESILIENCE_Q_ORDERS = [2, 3, 4, 11, 12];
  rowValus.push(getScore(RESILIENCE_Q_ORDERS));

  // 自主能力題目們
  const INDEPENDENT_Q_ORDERS = [9, 10, 13, 22];
  rowValus.push(getScore(INDEPENDENT_Q_ORDERS));

  // 感情生活題目們
  const LOVE_LIFE_Q_ORDERS = [14, 30];
  rowValus.push(getScore(LOVE_LIFE_Q_ORDERS));

  // 生理健康題目們
  const PHYSICAL_HEALTH_Q_ORDERS = [15, 16, 17, 18];
  rowValus.push(getScore(PHYSICAL_HEALTH_Q_ORDERS));

  // 家庭關係題目們
  const FAMILY_REL_Q_ORDERS = [19, 20, 21, 23, 24];
  rowValus.push(getScore(FAMILY_REL_Q_ORDERS));

  // 朋友關係題目們
  const FRIENDS_REL_Q_ORDERS = [25, 26, 27, 28, 29];
  rowValus.push(getScore(FRIENDS_REL_Q_ORDERS));

  // 心理健康題目們
  const PHYCHOLOGICAL_Q_ORDERS = [32, 33, 34, 35, 36, 37, 38, 39, 40, 41];
  rowValus.push(getScore(PHYCHOLOGICAL_Q_ORDERS));

  return [
    [''],
    [''], // 跟上方歷程資料隔兩個ROW，留個空白
    [...rowHeaders],
    [...rowValus],
  ];
}

export default async function getSQOLExcelData(cases) {
  if (cases && Array.isArray(cases)) {
    const data = [];
    await Promise.all(
      cases
        .filter(c => c.completed.toString() === 'true')
        .map(async c => {
          const rowData = await createTestLogExcelData(c);
          rowData.forEach(row => data.push(row));
          const summaryExcelData = createTestSummaryExcelData(c);
          summaryExcelData.forEach(row => data.push(row));
        }),
    );

    return data;
  }
  throw Error('SQOL DATA NOT FOUND');
}
