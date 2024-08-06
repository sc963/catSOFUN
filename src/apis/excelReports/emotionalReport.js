/* eslint-disable prettier/prettier */
import { reduce } from 'lodash';
import Questionaire from '../../db/questionaire/model';
import getDatetimeString from '../../utils/reports/getDatetimeString';
import {
  NAME_EMOTIONAL_TEST,
  Q_TYPE_EMOTIONAL_PRACTICE,
  Q_TYPE_EMOTIONAL_CONTROL,
  Q_TYPE_EMOTIONAL_FORMAL,
} from '../../constants/models/questionaire.const';

// Excel上方各題結果歷程
async function createTestLogExcelData(caseObj) {
  const { questionaireHistories: histories } = caseObj;

  const emotionalTest = await Questionaire.findOne({ name:  NAME_EMOTIONAL_TEST});
  const { questions } = emotionalTest;
  const headerTestName = ['表情測驗'];
  const rowCase = ['個案', caseObj.caseNo];
  const headerPhotoName = ['施測日期', '練習題庫'];
  const allPracticeQ = questions.filter(q => q.type === Q_TYPE_EMOTIONAL_PRACTICE);
  const allFormalQ = questions.filter(q => q.type === Q_TYPE_EMOTIONAL_FORMAL);
  const allControlQ = questions.filter(q => q.type === Q_TYPE_EMOTIONAL_CONTROL);
  // 列出練習題
  allPracticeQ.forEach(q => {
    const phtoInfo = JSON.parse(q.extraJsonInfo);
    headerPhotoName.push(phtoInfo.filename);
  });
  headerPhotoName.push('測驗題庫');
  // 列出測驗題
  allFormalQ.forEach(q => {
    const phtoInfo = JSON.parse(q.extraJsonInfo);
    headerPhotoName.push(phtoInfo.filename);
  });
  headerPhotoName.push('控制題庫');
  // 列出控制題庫
  allControlQ.forEach(q => {
    const phtoInfo = JSON.parse(q.extraJsonInfo);
    headerPhotoName.push(phtoInfo.filename);
  });
  // 測驗結果
  headerPhotoName.push(
    ...[
      '練習總分', '練習題數', '測驗總分', '測驗題數', '控制總分', '控制題數', '練習花費時間(秒)',
      '測驗花費時間(秒)', '快樂', '悲傷', '生氣', '厭惡', '害怕', '驚訝', '平靜',
    ],
  );

  // 正確解答
  const rowCorrectAns = ['正確解答', '.'];
  const addCorrectAns = (q) => {
    try {
      const phtoInfo = JSON.parse(q.extraJsonInfo);
      const { filename } = phtoInfo;
      const correctAns = filename.split('_')[1];
      rowCorrectAns.push(correctAns);
    } catch(e) {
      throw new Error(`表情測驗：parseCorrectAnsError___${e.toString()}`);
    }
  };

  // 作答記錄
  const throwJsonParseError = (e, id, filename, targetLog) => {
    throw new Error(
      `報表測錯：表情測驗_parseAnsLogError | 
       caseId: ${id}__
       Target:${filename}__
       orgAns:${JSON.stringify(targetLog)} |
       stackTrace: ${e.toString()}
      `);
  };
  const rowAnswerLog = [getDatetimeString(caseObj.createdAt), '.'];

  // 每題花費時間
  const rowCostTime = ['花費時間(ms毫秒)', '.'];
  // 題目出現順序
  const rowComesUpOrder = ['出現順序', '.'];

  const practices =  histories.filter(h => h.questionType === Q_TYPE_EMOTIONAL_PRACTICE);
  const formals =  histories.filter(h => h.questionType === Q_TYPE_EMOTIONAL_FORMAL);
  const controls =  histories.filter(h => h.questionType === Q_TYPE_EMOTIONAL_CONTROL);

  const pushLogToExcelRow = (orgQuestion, targetArray) => {
    const phtoInfo = JSON.parse(orgQuestion.extraJsonInfo);
    const { filename } = phtoInfo;
    const targetLog = targetArray.find(h => h.answer.indexOf(filename) !== -1);
    if (targetLog === undefined) {
      rowAnswerLog.push('.');
      rowCostTime.push('.');
      rowComesUpOrder.push('.');
    } else {
      try {
        const ansObj = JSON.parse(targetLog.answer);
        rowAnswerLog.push(ansObj.clickOption);
        rowCostTime.push(targetLog.costTime);
        rowComesUpOrder.push(targetArray.findIndex(h => h.answer.indexOf(filename) !== -1) + 1);
      } catch(e) {
        throwJsonParseError(e, caseObj.id, filename, targetLog);
      }
    }
  }

  // 根據所有題目的順序，寫入正確答案、與使用者作答記錄
  questions.filter(q => q.type === Q_TYPE_EMOTIONAL_PRACTICE).forEach(q => {
    addCorrectAns(q);
    pushLogToExcelRow(q, practices);
  });
  // 欄位：測驗題庫，補'.'
  rowCorrectAns.push('.');
  rowAnswerLog.push('.');
  rowCostTime.push('.');
  rowComesUpOrder.push('.');
  questions.filter(q => q.type === Q_TYPE_EMOTIONAL_FORMAL).forEach(q => {
    addCorrectAns(q);
    pushLogToExcelRow(q, formals);
  });
  // 欄位：控制題庫，補'.'
  rowCorrectAns.push('.');
  rowAnswerLog.push('.');
  rowCostTime.push('.');
  rowComesUpOrder.push('.');
  questions.filter(q => q.type === Q_TYPE_EMOTIONAL_CONTROL).forEach(q => {
    addCorrectAns(q);
    pushLogToExcelRow(q, controls);
  });

  // 練習總分
  const practiceTotalScore = reduce(practices, (score, p) => {
    const ansObj = JSON.parse(p.answer);
    const userAns = parseInt(ansObj.clickOption, 10);
    const correctAns = parseInt(ansObj.photoName.split('_')[1], 10);
    return score + (userAns === correctAns ? 1 : 0);
  }, 0);
  // 練習題數
  const practiceCount = practices.length;
  // 測驗總分
  const formalTotalScore = reduce(formals, (score, p) => {
    const ansObj = JSON.parse(p.answer);
    const userAns = parseInt(ansObj.clickOption, 10);
    const correctAns = parseInt(ansObj.photoName.split('_')[1], 10);
    return score + (userAns === correctAns ? 1 : 0);
  }, 0);
  // 測驗題數
  const formalCount = formals.length;
  // 控制總分
  const controlTotalScore = reduce(controls, (score, p) => {
    const ansObj = JSON.parse(p.answer);
    const userAns = parseInt(ansObj.clickOption, 10);
    const correctAns = parseInt(ansObj.photoName.split('_')[1], 10);
    return score + (userAns === correctAns ? 1 : 0);
  }, 0);
  // 控制題數
  const controlCount = controls.length;
  // 練習花費時間
  const practiceTotalCostSeconds = (
    reduce(practices, (result, p) => result + p.costTime, 0) /
    1000
  ).toFixed(4) || 0;
  // 測驗花費時間
  const formalTotalCostSeconds = (
    reduce(formals, (result, p) => result + p.costTime, 0) /
    1000
  ).toFixed(4) || 0;

  // 測驗統計數據
  rowAnswerLog.push(practiceTotalScore);
  rowAnswerLog.push(practiceCount);
  rowAnswerLog.push(formalTotalScore);
  rowAnswerLog.push(formalCount);
  rowAnswerLog.push(controlTotalScore);
  rowAnswerLog.push(controlCount);
  rowAnswerLog.push(practiceTotalCostSeconds);
  rowAnswerLog.push(formalTotalCostSeconds);

  // 情緒對照
  // 0	peaceful  平靜
  // 1	happy		  快樂
  // 2	sad		    傷心
  // 3	anger		  生氣
  // 4	disgusting厭惡
  // 5	fear		  害怕
  // 6	surprise	驚訝
  // 9	not sure	不確定
  const emotionCount = {
    0: 0, 1: 0, 2:0, 3:0, 4:0, 5:0, 6:0, 9:0,
  };
  formals.forEach(h => {
    const ansObj = JSON.parse(h.answer);
    const s = parseInt(ansObj.clickOption, 10);
    emotionCount[s] += 1;
  });
  practices.forEach(h => {
    const ansObj = JSON.parse(h.answer);
    const s = parseInt(ansObj.clickOption, 10);
    emotionCount[s] += 1;
  });

  // Excel順序：'快樂', '悲傷', '生氣', '厭惡', '害怕', '驚訝', '平靜'
  rowAnswerLog.push(emotionCount[1]);
  rowAnswerLog.push(emotionCount[2]);
  rowAnswerLog.push(emotionCount[3]);
  rowAnswerLog.push(emotionCount[4]);
  rowAnswerLog.push(emotionCount[5]);
  rowAnswerLog.push(emotionCount[6]);
  rowAnswerLog.push(emotionCount[0]);

 
  const emotionMap = {
    e_0: { comesUp: 0, correct: 0, totalCostTime: 0 },
    e_1: { comesUp: 0, correct: 0, totalCostTime: 0 },
    e_2: { comesUp: 0, correct: 0, totalCostTime: 0 },
    e_3: { comesUp: 0, correct: 0, totalCostTime: 0 },
    e_4: { comesUp: 0, correct: 0, totalCostTime: 0 },
    e_5: { comesUp: 0, correct: 0, totalCostTime: 0 },
    e_6: { comesUp: 0, correct: 0, totalCostTime: 0 },
  }

  const validQType = [Q_TYPE_EMOTIONAL_PRACTICE, Q_TYPE_EMOTIONAL_CONTROL, Q_TYPE_EMOTIONAL_FORMAL,];
  histories.forEach(h => {
    if (validQType.includes(h.questionType)) {
      const costTime = parseInt(h.costTime, 10);
      const ansObj = JSON.parse(h.answer);
      const userAns = parseInt(ansObj.clickOption, 10);
      const emotion = parseInt(ansObj.photoName.split('_')[1], 10);
  
      emotionMap[`e_${emotion}`].comesUp += 1;
      emotionMap[`e_${emotion}`].correct += (userAns === emotion ? 1 : 0);
      emotionMap[`e_${emotion}`].totalCostTime += costTime;
    }
  });

  const rowHeaderEmotionCount = ['各項表情統計', '表情名稱', '出現次數', '答對次數', '該表情的累積答題時間(ms毫秒)']; 
  const rowEmotion1Count = ['', '快樂', emotionMap.e_1.comesUp, emotionMap.e_1.correct, emotionMap.e_1.totalCostTime];
  const rowEmotion2Count = ['', '悲傷', emotionMap.e_2.comesUp, emotionMap.e_2.correct, emotionMap.e_2.totalCostTime];
  const rowEmotion3Count = ['', '生氣', emotionMap.e_3.comesUp, emotionMap.e_3.correct, emotionMap.e_3.totalCostTime];
  const rowEmotion4Count = ['', '厭惡', emotionMap.e_4.comesUp, emotionMap.e_4.correct, emotionMap.e_4.totalCostTime];
  const rowEmotion5Count = ['', '害怕', emotionMap.e_5.comesUp, emotionMap.e_5.correct, emotionMap.e_5.totalCostTime];
  const rowEmotion6Count = ['', '驚訝', emotionMap.e_6.comesUp, emotionMap.e_6.correct, emotionMap.e_6.totalCostTime];
  const rowEmotion0Count = ['', '平靜', emotionMap.e_0.comesUp, emotionMap.e_0.correct, emotionMap.e_0.totalCostTime];

  return [
    [...headerTestName],
    [...rowCase],
    [...headerPhotoName],
    [...rowCorrectAns],
    [...rowAnswerLog],
    [...rowCostTime],
    [...rowComesUpOrder],
    [''], // 美觀上空白隔開
    [''], // 美觀上空白隔開
    [...rowHeaderEmotionCount],
    [...rowEmotion1Count],
    [...rowEmotion2Count],
    [...rowEmotion3Count],
    [...rowEmotion4Count],
    [...rowEmotion5Count],
    [...rowEmotion6Count],
    [...rowEmotion0Count],
  ];
}

export default async function getEmotionalExcelData(cases) {
  if (cases && Array.isArray(cases)) {
    const data = [];
    await Promise.all(
      cases.map(async c => {
        const rowData = await createTestLogExcelData(c);
        rowData.forEach(row => data.push(row));
      }),
    );
    return data;
  }
  throw Error('EMOTIONAL TEST DATA NOT FOUND');
}
