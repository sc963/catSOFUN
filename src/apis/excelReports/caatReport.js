import getDatetimeString from '../../utils/reports/getDatetimeString';
import CAATReportMetrics from '../../db/utils/caatReportMetrics';

// Excel上方各題結果歷程
async function createTestLogExcelData(caseObj) {
  if (!caseObj.completed) {
    const errorTable = [];

    errorTable.push(['個案編號', caseObj.caseNo]);
    errorTable.push(['date(測驗日期)', getDatetimeString(caseObj.createdAt)]);
    errorTable.push(['測驗未完成，無法產生報告']);
    return errorTable;
  }

  const { questionaireHistories: histories } = caseObj;
  const {
    practices,
    simulations,
    formals,

    // 時間類
    // practiceTotalCostSeconds,
    // simulationTotalCostSeconds,
    // formalTotalCostSeconds,
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
    // practiceNonMixedAvgSeconds,
    // simulationNonMixedAvgSeconds,
    // formalNonMixedAvgSeconds,

    // 測驗比值
    practiceTestRatio,
    simulationTestRatio,
    formalTestRatio,

    // 測驗差值
    practiceTestDeviation,
    simulationTestDeviation,
    formalTestDeviation,

    // count類
    // practiceCorrectCount,
    // simulationCorrectCount,
    // formalCorrectCount,

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
  } = CAATReportMetrics(histories);

  const finalTable = [];

  finalTable.push(['個案編號', caseObj.caseNo]);
  finalTable.push(['date(測驗日期)', getDatetimeString(caseObj.createdAt)]);
  finalTable.push(['全題目之總測驗時間(s)', totalCostSeconds]);
  finalTable.push([
    '全題目之各題平均反應時間(s)',
    (totalCostSeconds / 126).toFixed(4),
  ]);

  finalTable.push(['']);

  let testType = '正式測驗';
  finalTable.push([testType]);
  finalTable.push([
    `${testType}數字平均測驗時間(s)`,
    formalFirstPartAvgSeconds,
  ]);
  finalTable.push([
    `${testType}圖形平均測驗時間(s)`,
    formalSecondPartAvgSeconds,
  ]);
  finalTable.push([
    `${testType}交替平均測驗時間(s)`,
    formalThirdPartAvgSeconds,
  ]);

  finalTable.push([`${testType}數字- 答對`, formalFirstPartCorrectCount]);
  finalTable.push([`${testType}圖形- 答對`, formalSecondPartCorrectCount]);
  finalTable.push([`${testType}交替- 答對`, formalThirdPartCorrectCount]);

  finalTable.push([`${testType}交替- 答錯`, 24 - formalThirdPartCorrectCount]);
  finalTable.push([`${testType}圖形- 答錯`, 24 - formalSecondPartCorrectCount]);
  finalTable.push([`${testType}交替- 答錯`, 24 - formalThirdPartCorrectCount]);

  finalTable.push([`數字未測驗題數（跳題）`, 72 - formals.length]);
  finalTable.push([`圖形未測驗題數（跳題）`, 72 - formals.length]);
  finalTable.push([`交替未測驗題數（跳題）`, 72 - formals.length]);

  finalTable.push([`${testType}測驗比值`, formalTestRatio]);
  finalTable.push([`${testType}測驗差值`, formalTestDeviation]);

  finalTable.push(['']);

  testType = '模擬測驗';
  finalTable.push([testType]);
  finalTable.push([
    `${testType}數字平均測驗時間(s)`,
    simulationFirstPartAvgSeconds,
  ]);
  finalTable.push([
    `${testType}圖形平均測驗時間(s)`,
    simulationSecondPartAvgSeconds,
  ]);
  finalTable.push([
    `${testType}交替平均測驗時間(s)`,
    simulationThirdPartAvgSeconds,
  ]);

  finalTable.push([`${testType}數字- 答對`, simulationFirstPartCorrectCount]);
  finalTable.push([`${testType}圖形- 答對`, simulationSecondPartCorrectCount]);
  finalTable.push([`${testType}交替- 答對`, simulationThirdPartCorrectCount]);

  finalTable.push([
    `${testType}交替- 答錯`,
    8 - simulationThirdPartCorrectCount,
  ]);
  finalTable.push([
    `${testType}圖形- 答錯`,
    8 - simulationSecondPartCorrectCount,
  ]);
  finalTable.push([
    `${testType}交替- 答錯`,
    8 - simulationThirdPartCorrectCount,
  ]);

  finalTable.push([`數字未測驗題數（跳題）`, 32 - simulations.length]);
  finalTable.push([`圖形未測驗題數（跳題）`, 32 - simulations.length]);
  finalTable.push([`交替未測驗題數（跳題）`, 32 - simulations.length]);

  finalTable.push([`${testType}測驗比值`, simulationTestRatio]);
  finalTable.push([`${testType}測驗差值`, simulationTestDeviation]);

  finalTable.push(['']);

  testType = '練習題';
  finalTable.push([testType]);
  finalTable.push([
    `${testType}數字平均測驗時間(s)`,
    practiceFirstPartAvgSeconds,
  ]);
  finalTable.push([
    `${testType}圖形平均測驗時間(s)`,
    practiceSecondPartAvgSeconds,
  ]);
  finalTable.push([
    `${testType}交替平均測驗時間(s)`,
    practiceThirdPartAvgSeconds,
  ]);

  finalTable.push([`${testType}數字- 答對`, practiceFirstPartCorrectCount]);
  finalTable.push([`${testType}圖形- 答對`, practiceSecondPartCorrectCount]);
  finalTable.push([`${testType}交替- 答對`, practiceThirdPartCorrectCount]);

  finalTable.push([
    `${testType}交替- 答錯`,
    10 - practiceThirdPartCorrectCount,
  ]);
  finalTable.push([
    `${testType}圖形- 答錯`,
    10 - practiceSecondPartCorrectCount,
  ]);
  finalTable.push([
    `${testType}交替- 答錯`,
    10 - practiceThirdPartCorrectCount,
  ]);

  finalTable.push([`數字未測驗題數（跳題）`, 30 - practices.length]);
  finalTable.push([`圖形未測驗題數（跳題）`, 30 - practices.length]);
  finalTable.push([`交替未測驗題數（跳題）`, 30 - practices.length]);

  finalTable.push([`${testType}測驗比值`, practiceTestRatio]);
  finalTable.push([`${testType}測驗差值`, practiceTestDeviation]);

  return finalTable;
}

// Excel下方的Summary報表
function createTestSummaryExcelData(caseObjs) {
  // Excel Data Rows
  // const rowCase = ['個案'];
  // const rowDate = ['date(測驗日期)'];

  // if (caseObjs && Array.isArray(caseObjs)) {
  //   caseObjs.forEach(c => {
  //     rowCase.push(c.caseNo);
  //     rowDate.push(getDatetimeString(c.createdAt));
  //   });
  // }

  return [
    [''],
    [''],
    [''], // 跟上方歷程資料隔開，留個空白
  ];
}

export default async function getCAATExcelData(cases) {
  if (cases && Array.isArray(cases)) {
    const data = [];
    await Promise.all(
      cases
        // .filter(c => c.completed.toString() === 'true')
        .map(async c => {
          const rowData = await createTestLogExcelData(c);
          rowData.forEach(row => data.push(row));
        }),
    );
    const summaryExcelData = createTestSummaryExcelData(cases);
    summaryExcelData.forEach(row => data.push(row));
    return data;
  }
  throw Error('CAAT DATA NOT FOUND');
}
