import { reduce } from 'lodash';
import getDatetimeString from '../../utils/reports/getDatetimeString';
import {
  Q_TYPE_HINT,
  Q_TYPE_FREQUENCY,
  Q_TYPE_TIME_SELECT,
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
  const rowQuestionOrder = ['題目順序'];
  const rowQuestionBody = ['題目內容'];
  const rowUserAnswer = ['回答'];
  // const rowReactiontime = ['Reaciontime(每題反應毫秒)'];

  // 量表紀錄資料
  histories.filter(h => h.questionType !== Q_TYPE_HINT).forEach((h, idx) => {
    rowQuestionOrder.push(idx + 1);
    rowQuestionBody.push(h.body);

    if (h.questionType === Q_TYPE_FREQUENCY) {
      // e.g.: {"電玩遊戲":["電玩遊戲","每月","2"],"卡拉OK":["卡拉OK","每週","1"],"有啊":["有啊","每月","3"]}
      const answer = JSON.parse(h.answer) || {};
      const frequencyString = Object.keys(answer).map(
        key => `${key}: ${answer[key][1]}_${answer[key][2]}次`,
      );
      rowUserAnswer.push(frequencyString.join(', '));
    } else if (h.questionType === Q_TYPE_TIME_SELECT) {
      // e.g.: {"電玩遊戲":["中午","晚上"],"卡拉OK":["晚上"],"有啊":["晚上","不定時"]}
      const answer = JSON.parse(h.answer) || {};
      const timeSelectString = Object.keys(answer).map(
        key => `${key}:${answer[key].join(',')}`,
      );
      rowUserAnswer.push(timeSelectString.join('。 '));
    } else {
      rowUserAnswer.push(h.answer);
    }
    // rowReactiontime.push(h.costTime);
  });

  return [
    [...rowCaseInfo],
    [...rowQuestionOrder],
    [...rowQuestionBody],
    [...rowUserAnswer],
    // [...rowReactiontime],
    [''], // 美觀上空白隔開
  ];
}

// Excel下方的Summary報表
function createTestSummaryExcelData(caseObjs) {
  // Excel Data Rows
  const rowCase = ['個案'];
  const rowDate = ['date(測驗日期)'];
  const rowImportance = ['重要程度'];
  const rowTotalCostSeconds = ['全題目之總測驗時間(s)'];
  const row1to14TotalScore = ['滿1~滿14總分'];
  const row15Score = ['滿15分數（是:1、否:0）'];

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

      // 第一題獨立拉出，欄位：重要程度
      const history1 = histories.find(
        h => h.body.indexOf('參與休閒活動對您的重要程度為') !== -1,
      );
      if (history1 !== undefined) {
        rowImportance.push(parseInt(history1.answer, 10));
      }

      // 15題另外拉出來看
      const history15 = histories.find(
        h => h.body.indexOf('我希望休閒生活得到改善') !== -1,
      );
      if (history15 !== undefined) {
        row15Score.push((history15.answer === 'true' ? 1 : 0) || -1);
      } else {
        row15Score.push('未答');
      }

      // 計算1~14題的得分(出現位置在第6題～第19題)
      const levelChooseQs = histories.filter(
        (h, idx) => idx >= 5 && idx <= 22 && h.questionType === Q_TYPE_5_LEVELS,
      );
      const scoreFrom1To14 =
        reduce(
          levelChooseQs,
          (result, history) => result + parseInt(history.answer, 10),
          0,
        ) || 0;
      row1to14TotalScore.push(scoreFrom1To14);
    });
  }

  return [
    [''],
    [''], // 跟上方歷程資料隔兩個ROW，留個空白
    [...rowCase],
    [...rowDate],
    [...rowTotalCostSeconds],
    [...rowImportance],
    [...row1to14TotalScore],
    [...row15Score],
  ];
}

export default async function getLeisureExcelData(cases) {
  if (cases && Array.isArray(cases)) {
    const data = [];
    await Promise.all(
      cases.filter(c => c.completed.toString() === 'true').map(async c => {
        const rowData = await createTestLogExcelData(c);
        rowData.forEach(row => data.push(row));
      }),
    );
    const summaryExcelData = createTestSummaryExcelData(cases);
    summaryExcelData.forEach(row => data.push(row));
    return data;
  }
  throw Error('LEISURE DATA NOT FOUND');
}
