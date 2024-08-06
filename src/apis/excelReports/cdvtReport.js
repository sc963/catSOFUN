import Question from '../../db/question/model';
import getResultInfo from '../../db/utils/resultDisplayUtils';
import getDatetimeString from '../../utils/reports/getDatetimeString';

// 產生答題歷程每個Row資料
function generateTestLogRowData(
  histories,
  questions,
  prefixWord,
  rowQuestionOrder,
  rowAnsPosition,
  rowCorrectAns,
  rowUserMatch,
  rowReactiontime,
) {
  histories.forEach((history, idx) => {
    rowQuestionOrder.push(`${prefixWord}${idx + 1}`);
    const targetQ = questions.find(
      // eslint-disable-next-line no-underscore-dangle
      q => String(q._id) === String(history.question),
    );
    const ansPosition = () => {
      for (let i = 0; i < 5; i += 1) {
        if (targetQ[`number${i}`] && String(targetQ[`number${i}`]) === '6') {
          return i + 1;
        }
      }
      return '9';
    };
    const isAnsExists = targetQ && targetQ.exists;
    rowCorrectAns.push(isAnsExists ? '1' : '0');
    rowAnsPosition.push(ansPosition());
    rowUserMatch.push(history.isCorrect ? '1' : '0');
    rowReactiontime.push((history.costTime / 1000).toFixed(4));
  });
}

// Excel上方各題結果歷程
async function createTestLogExcelData(caseObj) {
  // Excel Data Rows
  const rowCaseInfo = [
    '個案編號',
    caseObj.caseNo,
    '測驗時間',
    getDatetimeString(caseObj.createdAt),
  ];
  const rowQuestionOrder = ['題目編號'];
  const rowAnsPosition = ['刺激源位置(123456/9)'];
  const rowCorrectAns = ['正確答案 O:1、X:0'];
  const rowUserMatch = ['match(答對:1，答錯/跳題0)'];
  const rowReactiontime = ['Reaciontime(每題反應秒數)'];

  // 測驗紀錄資料
  const practiceQids = caseObj.practiceHistories.map(h => h.question);
  const practiceQs = await Question.find({ _id: practiceQids });
  const formalQids = caseObj.examHistories.map(h => h.question);
  const formalQs = await Question.find({ _id: formalQids });

  generateTestLogRowData(
    caseObj.practiceHistories,
    practiceQs,
    '練',
    rowQuestionOrder,
    rowAnsPosition,
    rowCorrectAns,
    rowUserMatch,
    rowReactiontime,
  );
  generateTestLogRowData(
    caseObj.examHistories,
    formalQs,
    '測',
    rowQuestionOrder,
    rowAnsPosition,
    rowCorrectAns,
    rowUserMatch,
    rowReactiontime,
  );

  return [
    [...rowCaseInfo],
    [...rowQuestionOrder],
    [...rowAnsPosition],
    [...rowCorrectAns],
    [...rowUserMatch],
    [...rowReactiontime],
    [''], // 美觀上空白隔開
  ];
}

// Excel下方的Summary報表
function createTestSummaryExcelData(caseObjs) {
  // Excel Data Rows
  const rowComplete = ['Complete'];
  const rowDate = ['date(測驗日期)'];
  const rowTotalCostSeconds = ['全題目之總測驗時間(s)'];
  const rowFormalCostSeconds = ['反應題之總測驗時間(s)'];
  const rowTotalAvgReactionSeconds = ['全題目之各題平均反應時間(s)'];
  const rowFormalAvgReactionSeconds = ['反應題之各題平均反應時間(s)'];

  const divisionFormal = ['測驗題'];
  const rowFormalCorrectCount = ['反應題數-答對'];
  const rowFormalIncorrectCount = ['反應題數-答錯'];
  const rowFormalTimeoutCount = ['未反應題數（跳題）'];
  const rowFormalScore = ['測驗題總分'];
  const rowFormalQuestionCount = ['測驗題答題數'];
  const rowFormalCorrectRate = ['正確率'];

  const divisionPractice = ['練習題'];
  const rowPracticeCorrectCount = ['答對題數'];
  const rowPracticeIncorrectCount = ['答錯題數'];
  const rowPracticeTimeoutCount = ['跳題題數'];
  const rowPracticeScore = ['練習題總分'];
  const rowPracticeQuestionCount = ['練習題答題數'];
  const rowPracticeCorrectRate = ['正確率'];

  if (caseObjs && Array.isArray(caseObjs)) {
    caseObjs.forEach((c, idx) => {
      const info = getResultInfo(c);
      rowComplete.push(`Trials${idx + 1}`);
      rowDate.push(getDatetimeString(c.createdAt));
      rowTotalCostSeconds.push(info.toalCostSeconds);
      rowFormalCostSeconds.push(info.formalTotalCostSeconds);
      rowTotalAvgReactionSeconds.push(info.totalReactionSeconds);
      rowFormalAvgReactionSeconds.push(info.formalAvgReactSeconds);

      rowFormalCorrectCount.push(info.formalCorrectCount);
      rowFormalIncorrectCount.push(info.formalIncorrectCount);
      rowFormalTimeoutCount.push(info.formalTimeoutCount);
      rowFormalScore.push(info.formalCorrectCount);
      rowFormalQuestionCount.push(info.formalTotalCount);
      rowFormalCorrectRate.push(
        `${(parseFloat(info.formalCorrectRate) * 100).toFixed(4)}%`,
      );

      rowPracticeCorrectCount.push(info.practiceCorrectCount);
      rowPracticeIncorrectCount.push(info.practiceIncorrectCount);
      rowPracticeTimeoutCount.push('0');
      rowPracticeScore.push(info.practiceCorrectCount);
      rowPracticeQuestionCount.push(info.practiceTotalCount);
      rowPracticeCorrectRate.push(
        `${(parseFloat(info.practiceCorrectRate) * 100).toFixed(4)}%`,
      );
    });
  }

  return [
    [''],
    [''], // 跟上方歷程資料隔兩個ROW，留個空白
    [...rowComplete],
    [...rowDate],
    [...rowTotalCostSeconds],
    [...rowFormalCostSeconds],
    [...rowTotalAvgReactionSeconds],
    [...rowFormalAvgReactionSeconds],
    [...divisionFormal],
    [...rowFormalCorrectCount],
    [...rowFormalIncorrectCount],
    [...rowFormalTimeoutCount],
    [...rowFormalScore],
    [...rowFormalQuestionCount],
    [...rowFormalCorrectRate],
    [...divisionPractice],
    [...rowPracticeCorrectCount],
    [...rowPracticeIncorrectCount],
    [...rowPracticeScore],
    [...rowPracticeQuestionCount],
    [...rowPracticeCorrectRate],
  ];
}

export default async function getCDVTExcelData(cases) {
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
  throw Error('CDVT DATA NOT FOUND');
}
