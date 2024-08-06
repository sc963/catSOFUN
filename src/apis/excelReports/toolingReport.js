import { reduce } from 'lodash';
import getDatetimeString from '../../utils/reports/getDatetimeString';
import {
  Q_TYPE_EVER_DONE_BEFORE,
  Q_TYPE_BATCH_SUB_QUESTION,
} from '../../constants/models/questionaire.const';

const NONE_STRING = 'N/A';
const FRENQUENCY_SCORE = { '>7': 3, '4~6': 2, '<3': 1 };
const RESOURCE_CODE_MAPPING = { 人: 'a', 環境: 'b', 輔具: 'c', 經費補助: 'd' };
const QUESTION_NO = [
  // eslint-disable-next-line prettier/prettier
  'G1a', 'G1b', 'G1c', 'G1d', 'G1b', 'G2b', 'G3a', 'G3b', 'G4a', 'G4b',
  // eslint-disable-next-line prettier/prettier
  'C1a', 'C1b', 'C1c', 'C2a', 'C2b',
  // eslint-disable-next-line prettier/prettier
  'M1a', 'M1b', 'M2a', 'M2b', 'M3a', 'M3b',
  // eslint-disable-next-line prettier/prettier
  'S1a', 'S1b', 'S1c',
  // eslint-disable-next-line prettier/prettier
  'L1a', 'L1b',
  // eslint-disable-next-line prettier/prettier
  'W1a', 'W1b',
  // eslint-disable-next-line prettier/prettier
  'F1a', 'F1b', 'F2a', 'F2b',
  // eslint-disable-next-line prettier/prettier
  'P1a', 'P1b', 'P2',
  // eslint-disable-next-line prettier/prettier
  'H1b', 'H1b', 'H2a', 'H2b',
];
const QUESTION_BODY = [
  '活動於鄰近住家或固定熟悉之路線',
  '前往遠方或不熟悉之地點(如:規劃遠處旅行)',
  '遵守交通規則(如:注意號誌燈、行走斑馬線等)',
  '安全維護(如:注意來車、路面顛簸等)',
  '主動請家人、朋友接送',
  '自行招呼計程車、定點接駁或Uber等',
  '購買車票或正確使用票卡（如:悠遊卡、愛心卡）',
  '正確轉乘（如轉換捷運線、捷運轉公車等）',
  '安全操作及駕駛(如:打方向燈、使用安全帶/帽等)',
  '駕駛操控能力(如:流暢度、反應力、判斷力等)',

  '操作電話或手機(含接聽、撥打)',
  '記住重要或常用號碼(包含住家電話、緊急電話:110/119等)',
  '查詢電話簿或打查號台查詢不熟悉之電話號碼',
  '查看訊息',
  '發送訊息(包含文字及影像)',

  '購買外帶餐點',
  '使用外賣、外送服務',
  '將已做好的飯菜加熱',
  '獨立備料（含採買）及烹煮食材',
  '收拾碗筷、洗滌',
  '廚餘、垃圾處理',

  '自行擬訂清單',
  '可自行至店家採買(或網路、電話/電視購物)基本日常必需品',
  '獨立購買任何物品（包含非必需品或複雜採購）',

  '簡單衣物(如:衣褲、襪子)',
  '需分類洗滌或複雜程序(如:厚外套、大型床單等)',

  '簡單清潔或整理(如:掃地、擦拭、折疊衣物、倒垃圾等)',
  '較繁重清潔或整理(如:拖地、洗窗、搬動傢俱等)',

  '攜帶小額金錢或日常交易(如購買日用品)',
  '操作提款機(如ATM提款)',
  '辦理金融事務(如:前往銀行存款、匯款或轉帳等)',
  '帳單處理(如:繳交水費、電費、卡費、支付房租等)',

  '定期執行個人衛生活動(如:按時盥洗、刮鬍子、修剪指甲等)',
  '維護個人外觀及整潔(如:保持衣著乾淨、頭髮整潔、無明顯口腔異味等)',
  '外出打扮合宜、依場合需求適度打扮自己',

  '服藥遵從(如:按時服藥、服用正確劑量等)',
  '藥品知識(如:正確領藥及排藥、可辨識自己常服用之藥物)',
  '記得返診時間、按時返診',
  '瞭解並可正確尋求就醫管道(如:預約或完成掛號程序)',
];

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
  const rowQuestionNo = ['題目編號'];
  const rowQuestionBody = ['題目'];
  // const rowEverDoneBefore = ['是:1 / 否:0'];
  const rowIndependentScore = [
    'I獨立程度：\n3分:4、2分:3、\n1分:2、0分:1、NA:0',
  ];
  const rowFrequencyScore = [
    'P參與/從事頻率：\n經常:3、偶爾:2、\n很少:1、NA:0',
  ];
  const rowResourceScore = ['R資源支持度：\n2分:3、1分:2、\n0分:1、NA:4'];
  const rowResourceType = ['資源需求(abcd)'];
  const rowResourceNeeds = ['資源需求'];

  const updateResourceData = (qBody, history) => {
    try {
      const ansArr = JSON.parse(history.answer);
      const ansObj = ansArr.find(a => a.mainQuestion === qBody);
      const resourseScore = parseInt(ansObj.mainValue, 10) + 1 || 4; // 20200621 付費需求，NA都算成4分
      rowResourceScore.push(resourseScore);
      if (ansObj.subValue && Array.isArray(ansObj.subValue)) {
        // 20200901 需求追加：資源需求可複選
        if (
          ansObj.subValue.length === 1 &&
          ansObj.subValue[0] === NONE_STRING
        ) {
          rowResourceType.push('NA');
          rowResourceNeeds.push('NA');
        } else {
          let resourceType = [];
          let resourceNeeds = [];
          ansObj.subValue.forEach(subV => {
            if (Array.isArray(subV)) {
              if (!resourceType.includes(RESOURCE_CODE_MAPPING[subV[0]])) {
                resourceType.push(RESOURCE_CODE_MAPPING[subV[0]]);
              }
              resourceNeeds.push(subV[1]);
            } else {
              // 向下相容之前不能複選的版本
              resourceType = RESOURCE_CODE_MAPPING[ansObj.subValue[0]];
              resourceNeeds = ansObj.subValue[1];
            }
          });
          rowResourceType.push(
            Array.isArray(resourceType) ? resourceType.join(',') : resourceType,
          );
          rowResourceNeeds.push(
            Array.isArray(resourceNeeds)
              ? resourceNeeds.join(',')
              : resourceNeeds,
          );
        }
      } else {
        rowResourceType.push('NA');
        rowResourceNeeds.push('NA');
      }
    } catch (e) {
      console.error(`toolingReport-updateResourceData: ${e.toString()}`);
    }
  };

  // 題目編號
  QUESTION_NO.forEach(qNo => rowQuestionNo.push(qNo));

  // 原本還沒改選否也要填支援程度，以前是用「做過的」事項找，但現在因為資源支持「沒做過」也會有log
  QUESTION_NO.forEach((qNo, idx) => {
    const qBody = QUESTION_BODY[idx];
    let historyIdx = -1;
    histories.forEach((h, hidx) => {
      if (
        h.questionType === Q_TYPE_EVER_DONE_BEFORE &&
        h.answer.indexOf(qBody) !== -1
      ) {
        if (historyIdx === -1) {
          historyIdx = hidx;
        }
      }
    });
    if (historyIdx === -1) {
      // 最近一個月沒做過
      rowQuestionBody.push('-');
      rowIndependentScore.push(1); // 20200621 付費需求，沒做過也有一分
      rowFrequencyScore.push(1); // 20200621 付費需求，沒做過也有一分
      const ansHistory = histories.find(
        h =>
          h.questionType === Q_TYPE_BATCH_SUB_QUESTION &&
          h.answer.indexOf(qBody) !== -1,
      );
      if (ansHistory) {
        updateResourceData(qBody, ansHistory);
      } else {
        rowResourceScore.push('-');
        rowResourceType.push('-');
        rowResourceNeeds.push('-');
      }
    } else {
      // 過去一個月是否有執行
      rowQuestionBody.push(qBody);
      // 獨立程度
      const idxOfIndependent = historyIdx + 1;
      const iScoreJson = JSON.parse(histories[idxOfIndependent].answer);
      rowIndependentScore.push(parseInt(iScoreJson[qBody], 10) + 1); // I獨立程度：3分:4、2分:3、1分:2、0分:1、NA:0

      // 參與頻率
      const idxOfParticipate = historyIdx + 2;
      const fScoreJson = JSON.parse(histories[idxOfParticipate].answer);
      rowFrequencyScore.push(FRENQUENCY_SCORE[fScoreJson[qBody]]);

      // 資源支持程度
      const idxOfResourceSupport = historyIdx + 3;
      const ansHistory = histories[idxOfResourceSupport];
      updateResourceData(qBody, ansHistory);
    }
  });

  return [
    [...rowCaseInfo],
    [...rowQuestionNo],
    // [...rowQuestionBody],
    // [...rowEverDoneBefore],
    [...rowIndependentScore],
    [...rowFrequencyScore],
    [...rowResourceScore],
    [...rowResourceType],
    [...rowResourceNeeds],
    [''], // 美觀上空白隔開
  ];
}

// Excel下方的Summary報表
function createTestSummaryExcelData(caseObjs) {
  // Excel Data Rows
  const rowCase = ['個案'];
  const rowDate = ['date(測驗日期)'];
  const rowTotalCostSeconds = ['全題目之總測驗時間(s)'];
  // const rowNegtiveCount = ['答否的項目個數'];
  const rowIdependentSocre = ['I獨立程度總分'];
  const rowFreqeuncySocre = ['P參與/從事頻率總分'];
  const rowResourceSupportSocre = ['R資源支持度總分'];
  const rowResourceACount = ['資源需求a項目個數'];
  const rowResourceBCount = ['資源需求b項目個數'];
  const rowResourceCCount = ['資源需求c項目個數'];
  const rowResourceDCount = ['資源需求d項目個數'];

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

      // TODO
      let everDoneBehaviors = [];
      let iScore = 0;
      let fScore = 0;
      let resourceScore = 0;
      const resourceCount = { a: 0, b: 0, c: 0, d: 0 };

      // 表示目前在哪一大題（外出、通訊、餐點準備、購物、洗衣、處理家務、金錢管理、個人修飾、健康管理）
      let currentPartIdx = 0;
      // 表示每一大題應該要有幾小題，hardCode的，如果未來題目有改（題數有變，這邊就會爛掉）
      const PART_QUESTION_COUNT_MAP = {
        1: 10,
        2: 5,
        3: 6,
        4: 3,
        5: 2,
        6: 2,
        7: 4,
        8: 3,
        9: 4,
      };

      histories.forEach((h, idx) => {
        // rowQuestionOrder.push(idx + 1);
        if (idx % 4 === 0) {
          // 過去一個月是否有執行
          everDoneBehaviors = h.answer.split(',');
          currentPartIdx += 1;
        } else if (idx % 4 === 1) {
          // 獨立程度
          if (everDoneBehaviors.length > 0) {
            const iScoreJson = JSON.parse(h.answer);
            everDoneBehaviors.forEach(b => {
              iScore += parseInt(iScoreJson[b], 10) + 1 || 0; // I獨立程度：3分:4、2分:3、1分:2、0分:1、NA:0
            });
          }
          // 20200621 付費需求，選否在獨立與參與也有分
          const neverDoneCount =
            PART_QUESTION_COUNT_MAP[currentPartIdx] - everDoneBehaviors.length;
          if (parseInt(neverDoneCount, 10) > 0) {
            iScore += neverDoneCount;
          }
        } else if (idx % 4 === 2) {
          // 參與頻率
          if (everDoneBehaviors.length > 0) {
            const fScoreJson = JSON.parse(h.answer);
            everDoneBehaviors.forEach(b => {
              fScore += FRENQUENCY_SCORE[fScoreJson[b]];
            });
          }
          // 20200621 付費需求，選否在獨立與參與也有分
          const neverDoneCount =
            PART_QUESTION_COUNT_MAP[currentPartIdx] - everDoneBehaviors.length;
          if (parseInt(neverDoneCount, 10) > 0) {
            fScore += neverDoneCount;
          }
        } else if (idx % 4 === 3) {
          // 資源支持程度
          const ansArr = JSON.parse(h.answer);
          ansArr.forEach(ansObj => {
            const rScore = parseInt(ansObj.mainValue, 10) + 1 || 4; // 20200621 付費需求，NA都算成4分
            resourceScore += rScore;
            // 20200901 需求追加：資源需求可以複選
            if (ansObj.subValue && Array.isArray(ansObj.subValue)) {
              if (
                ansObj.subValue.length >= 1 &&
                ansObj.subValue[0] !== NONE_STRING
              ) {
                if (Array.isArray(ansObj.subValue[0])) {
                  // 20200901後，因增加需求要可以複選，所以都會計成array
                  ansObj.subValue.forEach(valueItem => {
                    const resourceCode = RESOURCE_CODE_MAPPING[valueItem[0]];
                    resourceCount[resourceCode] += 1;
                  });
                } else {
                  // 20200901前的向下相容
                  const resourceCode =
                    RESOURCE_CODE_MAPPING[ansObj.subValue[0]];
                  resourceCount[resourceCode] += 1;
                }
              }
            }
          });
        }
      });

      rowIdependentSocre.push(iScore);
      rowFreqeuncySocre.push(fScore);
      rowResourceSupportSocre.push(resourceScore);
      rowResourceACount.push(resourceCount.a);
      rowResourceBCount.push(resourceCount.b);
      rowResourceCCount.push(resourceCount.c);
      rowResourceDCount.push(resourceCount.d);
    });
  }

  return [
    [''],
    [''], // 跟上方歷程資料隔兩個ROW，留個空白
    [...rowCase],
    [...rowDate],
    [...rowTotalCostSeconds],
    // [...rowNegtiveCount],
    [...rowIdependentSocre],
    [...rowFreqeuncySocre],
    [...rowResourceSupportSocre],
    [...rowResourceACount],
    [...rowResourceBCount],
    [...rowResourceCCount],
    [...rowResourceDCount],
  ];
}

export default async function getToolingLifeExcelData(cases) {
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
  throw Error('TOOLING LIFE DATA NOT FOUND');
}
