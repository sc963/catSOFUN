import { reduce } from 'lodash';
import getDatetimeString from '../../utils/reports/getDatetimeString';
import {
  Q_TYPE_HINT,
  Q_TYPE_5_LEVELS,
} from '../../constants/models/questionaire.const';

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
  const rowUserAnswer = ['回答'];
  const rowReactiontime = ['Reaciontime(每題反應毫秒)'];

  // 量表紀錄資料
  histories.filter(h => h.questionType !== Q_TYPE_HINT).forEach((h, idx) => {
    rowQuestionOrder.push(idx + 1);
    rowUserAnswer.push(h.answer);
    rowReactiontime.push(h.costTime);
  });

  return [
    [...rowCaseInfo],
    [...rowQuestionOrder],
    [...rowUserAnswer],
    [...rowReactiontime],
    [''], // 美觀上空白隔開
  ];
}

// Excel下方的Summary報表
function createTestSummaryExcelData(caseObjs) {
  // Excel Data Rows
  const rowCase = ['個案'];
  const rowDate = ['date(測驗日期)'];
  const rowTotalCostSeconds = ['全題目之總測驗時間(s)'];
  const row1to13TotalScore = ['1~15總分'];
  const row14Score = ['16分數'];
  const row15Score = ['17分數（是:1、否:0）'];

  if (caseObjs && Array.isArray(caseObjs)) {
    caseObjs.forEach(c => {
      const { questionaireHistories: histories } = c;
      const totalCostSeconds =
        (
          reduce(histories, (result, history) => result + history.costTime, 0) /
          1000
        ).toFixed(4) || 0;
      rowCase.push(c.caseNo);
      rowDate.push(getDatetimeString(c.createdAt));
      rowTotalCostSeconds.push(totalCostSeconds);

      // 16, 17題另外拉出來看
      const history16 = histories.find(
        h => h.body.indexOf('與服務單位的同事或同儕相處融洽') !== -1,
      );
      const history17 = histories.find(
        h => h.body.indexOf('我有可以述說心事的朋友') !== -1,
      );
      row14Score.push(history16.answer || -999);
      row15Score.push(history17.answer === 'true' ? 1 : 0);

      // 計算1~15題的得分(要扣掉第16題)
      const levelChooseQs = histories.filter(
        h => h.questionType === Q_TYPE_5_LEVELS,
      );
      const costSecondsFrom1To13 =
        reduce(
          levelChooseQs,
          (result, history) => result + parseInt(history.answer, 10),
          0,
        ) || 0;
      row1to13TotalScore.push(
        costSecondsFrom1To13 - parseInt(history16.answer, 10),
      );
    });
  }

  return [
    [''],
    [''], // 跟上方歷程資料隔兩個ROW，留個空白
    [...rowCase],
    [...rowDate],
    [...rowTotalCostSeconds],
    [...row1to13TotalScore],
    [...row14Score],
    [...row15Score],
  ];
}

export default async function getSocialParticipateExcelData(cases) {
  if (cases && Array.isArray(cases)) {
    const data = [];
    await Promise.all(
      cases.map(async c => {
        const rowData = await createTestLogExcelData(c);
        rowData.forEach(row => data.push(row));
      }),
    );
    const summaryExcelData = createTestSummaryExcelData(cases);
    summaryExcelData.forEach(row => data.push(row));
    return data;
  }
  throw Error('SOCIAL PARTICIPATE DATA NOT FOUND');
}
