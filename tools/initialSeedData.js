/* eslint-disable prettier/prettier */
import mongoose from 'mongoose';
import initEmotionalTest from './seedData/initEmotionalTest';
import config from '../src/config';
import Question from '../src/db/question/model';
import Questionaire from '../src/db/questionaire/model';
import {
  Q_TYPE_5_LEVELS,
  Q_TYPE_TRUE_FALSE,
  Q_TYPE_TWO_TIERS_MULTIPLE_CHOICE,
  Q_TYPE_FREQUENCY,
  Q_TYPE_TIME_SELECT,
  Q_TYPE_HINT,
  Q_TYPE_BATCH_LEVEL_SELECT,
  Q_TYPE_EVER_DONE_BEFORE,
  Q_TYPE_BATCH_FREQUENCY_CHOOSE,
  Q_TYPE_BATCH_SUB_QUESTION,
  Q_TYPE_CAAT_PRACTICE,
  Q_TYPE_CAAT_FORMAL,
  CAAT_ASK_FOR_GRAPHIC,
  CAAT_ASK_FOR_NUMERIC,
  CAAT_NUMERIC_THRESHOLD_DIGIT,
  Q_TYPE_CAAT_SIMULATION,
} from '../src/constants/models/questionaire.const';
import initSQOLTest from './seedData/initSQOLTest';

const PRACTICE_Q_COUNT = 100;
const FARMAL_Q_COUNT = 500;

function getRandomNumber(existed) {
  let number = parseInt(Math.random() * 9, 0);
  while (existed.indexOf(number) > -1) {
    number = parseInt(Math.random() * 9, 0);
  }
  return number;
}

function genQuestionHashs(count, isPractice) {
  const questions = [];
  for (let i = 0; i < count; i += 1) {
    const question = { exists: false };
    const numbers = [];
    for (let j = 0; j < 5; j += 1) {
      const number = getRandomNumber(numbers);
      numbers.push(number);
      const isSix = number === 6;
      if (!question.exists && isSix) {
        question.exists = true;
      }
      question.practice = isPractice;
      question[`number${j}`] = number;
    }
    questions.push(question);
  }
  return questions;
}

function getFiveLevelOption(wording) {
  return [
    {
      title: `非常${wording}`,
      value: '5',
    },
    {
      title: wording,
      value: '4',
    },
    {
      title: '普通',
      value: '3',
    },
    {
      title: `不${wording}`,
      value: '2',
    },
    {
      title: `非常不${wording}`,
      value: '1',
    },
  ];
}

function getFiveLevelFrequencyOption() {
  return [
    {
      title: '每天',
      value: '5',
    },
    {
      title: '每週3次或以上',
      value: '4',
    },
    {
      title: '每週1~2次',
      value: '3',
    },
    {
      title: '兩週1次',
      value: '2',
    },
    {
      title: '每月1次或以下',
      value: '1',
    },
  ];
}

function getLeisureActivityOptions() {
  return [
    {
      order: 1,
      title: '試聽類',
      values: [
        '看電視',
        '看影片',
        '社群網站',
        '電玩遊戲',
        '卡拉OK',
        '看電影',
        'Youtube電視劇',
        '聽演唱會',
        '上網',
      ],
    },
    {
      order: 2,
      title: '運動類',
      values: [
        '登山',
        '球類運動',
        '游泳',
        '慢跑',
        '健身',
        '氣功',
        '有氧運動',
        '太極拳',
        '元極舞',
        '內丹功',
      ],
    },
    {
      order: 3,
      title: '學習類',
      values: [
        '閱讀',
        '語言學習',
        '攝影',
        '讀書會',
        '寫作',
        '表演藝術',
        '茶道',
        '聽演講',
      ],
    },
    {
      order: 4,
      title: '嗜好類',
      values: ['園藝', '集郵', '養寵物', '收藏物品'],
    },
    {
      order: 5,
      title: '戶外活動類',
      values: ['散步', '旅遊', '自行車', '直排輪', '賞鳥', '露營'],
    },
    {
      order: 6,
      title: '遊憩社交類',
      values: ['朋友聚會', '家庭聚會', '泡湯', '逛街購物', '品嚐美食'],
    },
    {
      order: 7,
      title: '益智類',
      values: [
        '下棋',
        '撲克牌',
        '麻將',
        '益智遊戲',
        '拼圖',
        '魔術',
        '數獨',
        '魔術方塊',
      ],
    },
    {
      order: 8,
      title: '藝文類',
      values: ['跳舞', '手工藝', '演湊樂器', '繪畫', '欣賞話劇', '藝文展覽'],
    },
    {
      order: 9,
      title: '其他類',
      values: ['宗教活動', '志工活動'],
    },
  ];
}

async function initCDVTQuestions() {
  mongoose.connect(config.db.uri, { useNewUrlParser: true });

  let qData;

  const practiceQCount = await Question.countDocuments({ practice: true });
  if (practiceQCount === 0) {
    qData = genQuestionHashs(PRACTICE_Q_COUNT, true);
    const practiceQs = await Question.create(qData);
    console.info(
      `====== ${PRACTICE_Q_COUNT} Questions for Practice Created. Contains: ${
        practiceQs.filter(q => q.exists).length
      } ======`,
    );
  } else {
    console.info('CDVT Practice Question Already Existed. No needs to create.');
  }

  const formalQCount = await Question.countDocuments({ practice: false });
  if (formalQCount === 0) {
    qData = genQuestionHashs(FARMAL_Q_COUNT, false);
    const formalQs = await Question.create(qData);
    console.info(
      `====== ${FARMAL_Q_COUNT} Questions for Formal Use Created. Contians: ${
        formalQs.filter(q => q.exists).length
      } ======`,
    );
  } else {
    console.info('CDVT Formal Question Already Existed. No needs to create.');
  }

  await mongoose.disconnect();
}

async function initLeisureActivityQuestionaire() {
  mongoose.connect(config.db.uri, { useNewUrlParser: true });

  const count = await Questionaire.countDocuments({ name: '休閒生活量表' });

  if (count === 0) {
    let qData = [
      {
        body: '以下問題，請根據您過去一個月個人參與休閒活動的實際情況來回答。',
        order: 0,
        type: Q_TYPE_HINT,
        skippable: true,
        options: [],
      },
      {
        body: '1. 參與休閒活動對您的重要程度為？',
        order: 1,
        type: Q_TYPE_5_LEVELS,
        options: getFiveLevelOption('重要'),
      },
      {
        body: '2. 請選出您目前較常參與或安排的休閒活動？（可複選，至多三項）',
        order: 2,
        type: Q_TYPE_TWO_TIERS_MULTIPLE_CHOICE,
        maxSelection: 3,
        keepValue: true,
        options: getLeisureActivityOptions(),
      },
      {
        body: '2. 請選出下列活動您安排的頻率(或次數)？',
        order: 3,
        type: Q_TYPE_FREQUENCY,
        options: [
          {
            title: '每週',
            values: ['1', '2', '3', '4', '5', '6', '7'],
          },
          {
            title: '每月',
            values: ['1', '2', '3', '4', '5', '6', '7', '>7'],
          },
        ],
      },
      {
        body: '2. 請選出下列活動您進行的時段(可複選)？',
        order: 4,
        type: Q_TYPE_TIME_SELECT,
        options: [
          {
            title: '早上',
            value: '早上',
          },
          {
            title: '中午',
            value: '中午',
          },
          {
            title: '晚上',
            value: '晚上',
          },
          {
            title: '不定時',
            value: '不定時',
          },
        ],
      },
      {
        body: '3. 請選出您想參與的休閒活動？（目前沒在做或未曾做過的均可）',
        order: 5,
        type: Q_TYPE_TWO_TIERS_MULTIPLE_CHOICE,
        maxSelection: 999,
        options: getLeisureActivityOptions(),
      },
      {
        body: '以下問題，請根據您過去一個月個人參與休閒活動的滿意度來回答。',
        order: 6,
        type: Q_TYPE_HINT,
        skippable: true,
        options: [],
      },
    ];

    const qTitles = [
      '1. 我安排、規劃休閒活動的能力',
      '2. 我可以選擇的休閒活動數量或種類',
      '3. 我可以選擇的休閒活動器材或設施的數量',
      '4. 我參與休閒活動的頻率',
      '5. 我每次可以有充足的時間參與休閒活動',
      '6. 我參與休閒活動時的表現',
      '7. 我參與休閒活動時的體力及耐力',
      '8. 我參與休閒活動所獲得的樂趣',
      '9. 我參與休閒活動所獲得的成就感',
      '10. 我可以用於休閒活動的支出',
      '11. 我參與休閒活動時的場地安全性(逃生門指示、無障礙設施等)',
      '12. 我參與休閒活動時的場地交通便利性(可近性、停車便利性等)',
      '13. 我參與休閒活動時的人際表現(若休閒活動為單人活動，則此題可略過)',
      '14. 我對參與休閒活動的整體滿意度',
    ];

    qData = [
      ...qData,
      ...qTitles.map((title, idx) => ({
        body: title,
        order: qData.length + idx,
        type: Q_TYPE_5_LEVELS,
        skippable: title.indexOf('可略過') !== -1,
        options: getFiveLevelOption('滿意'),
      })),
    ];

    qData.push({
      body: '15. 我希望休閒生活得到改善',
      order: qData.length + 1,
      type: Q_TYPE_TRUE_FALSE,
      options: [
        { title: '有', value: 'true' },
        { title: '沒有', value: 'false' },
      ],
    });

    const leisureQuestionaire = {
      name: '休閒生活量表',
      questions: qData,
    };

    await Questionaire.create(leisureQuestionaire);
  } else {
    console.info('休閒生活量表已存在，不執行匯入');
  }

  await mongoose.disconnect();
}

async function initSocialParticipateQuestionnaire() {
  mongoose.connect(config.db.uri, { useNewUrlParser: true });

  const count = await Questionaire.countDocuments({ name: '社會參與度量表' });

  if (count === 0) {
    const qTitles = [
      '1. 我會和鄰居打招呼或攀談',
      '2. 我會主動拜訪親戚',
      '3. 我會邀請親戚來家中作客',
      '4. 我會主動邀請親戚聚會(聚餐、出遊)',
      '5.當親戚邀請我參加聚會時，我會答應參與',
      '6.我會主動跟家人聊天、話家常',
      '7.我會主動找家人訴苦',
      '8.我會主動邀請朋友聚會(如：聚餐、出遊、慶生、唱KTV等)',
      '9.朋友邀請我參加聚會(如：聚餐、出遊、慶生、唱KTV等)，我會答應參加聚會',
      '10.我會主動關心朋友最近過得好不好(含透過電話、網路訊息)',
      '11.我會傾聽朋友的煩惱並安慰他',
      '12.我有去可能會認識新朋友的場合(如：去公園看人下棋、社區活動等)',
      '13.我會主動認識新朋友',
      '14.我會與不認識的人互動(如：問路、點餐等)',
      '15.我有參加宗教活動(如：廟宇拜拜、廟會活動、團契/主日活動)',
    ];
    let qData = qTitles.map((title, idx) => ({
      body: title,
      order: idx + 1,
      type: Q_TYPE_5_LEVELS,
      options: getFiveLevelFrequencyOption(),
    }));

    qData = [
      ...qData,
      ...[
        {
          body: '問卷尚未結束，還有兩題',
          order: qData.length + 1,
          type: Q_TYPE_HINT,
          skippable: true,
          options: [],
        },
        {
          body:
            '16.您覺得『與服務單位的同事或同儕相處融洽(如：工作夥伴、工作坊學員)』是否重要？',
          order: qData.length + 2,
          type: Q_TYPE_5_LEVELS,
          options: getFiveLevelOption('重要'),
        },
        {
          body: '17.除了家人以外，我有可以述說心事的朋友？',
          order: qData.length + 3,
          type: Q_TYPE_TRUE_FALSE,
          options: [
            { title: '有', value: 'true' },
            { title: '沒有', value: 'false' },
          ],
        },
      ],
    ];

    const socialParticipateQuestionaire = {
      name: '社會參與度量表',
      questions: qData,
    };

    await Questionaire.create(socialParticipateQuestionaire);
  } else {
    console.info('社會參與度量表已存在，不執行匯入');
  }

  await mongoose.disconnect();
}

async function initToolingLifeQuestionnaire() {
  mongoose.connect(config.db.uri, { useNewUrlParser: true });

  const count = await Questionaire.countDocuments({
    name: '工具性日常生活活動量表',
  });

  if (count === 0) {
    const subQuestionOptions = {
      label: '資源需求',
      options: [
        {
          name: '人',
          options: [
            { title: '家人', value: '家人' },
            { title: '朋友', value: '朋友' },
            { title: '專業人員', value: '專業人員' },
          ],
        },
        {
          name: '環境',
          options: [
            { title: '住家設備', value: '住家設備' },
            { title: '社區資源', value: '社區資源' },
          ],
        },
        {
          name: '輔具',
          options: [
            { title: '指引手冊', value: '指引手冊' },
            { title: '提醒鈴', value: '提醒鈴' },
            { title: '科技產品', value: '科技產品' },
          ],
        },
        {
          name: '經費補助',
          options: [
            { title: '低收入補助', value: '低收入補助' },
            { title: '政府專案補助', value: '政府專案補助' },
          ],
        },
      ],
    };

    const qData = [
      {
        body: '1.外出 - 過去一個月是否有執行',
        order: 1,
        type: Q_TYPE_EVER_DONE_BEFORE,
        keepValue: true,
        options: [
          {
            order: 1,
            title: '活動於鄰近住家或固定熟悉之路線',
            resOptions: [
              { title: '是', value: 'true' },
              { title: '否', value: 'false' },
            ],
          },
          {
            order: 2,
            title: '前往遠方或不熟悉之地點(如:規劃遠處旅行)',
            resOptions: [
              { title: '是', value: 'true' },
              { title: '否', value: 'false' },
            ],
          },
          {
            order: 3,
            title: '遵守交通規則(如:注意號誌燈、行走斑馬線等)',
            resOptions: [
              { title: '是', value: 'true' },
              { title: '否', value: 'false' },
            ],
          },
          {
            order: 4,
            title: '安全維護(如:注意來車、路面顛簸等)',
            resOptions: [
              { title: '是', value: 'true' },
              { title: '否', value: 'false' },
            ],
          },
          {
            order: 5,
            title: '主動請家人、朋友接送',
            resOptions: [
              { title: '是', value: 'true' },
              { title: '否', value: 'false' },
            ],
          },
          {
            order: 6,
            title: '自行招呼計程車、定點接駁或Uber等',
            resOptions: [
              { title: '是', value: 'true' },
              { title: '否', value: 'false' },
            ],
          },
          {
            order: 6,
            title: '購買車票或正確使用票卡（如:悠遊卡、愛心卡）',
            resOptions: [
              { title: '是', value: 'true' },
              { title: '否', value: 'false' },
            ],
          },
          {
            order: 6,
            title: '正確轉乘（如轉換捷運線、捷運轉公車等）',
            resOptions: [
              { title: '是', value: 'true' },
              { title: '否', value: 'false' },
            ],
          },
          {
            order: 6,
            title: '安全操作及駕駛(如:打方向燈、使用安全帶/帽等)',
            resOptions: [
              { title: '是', value: 'true' },
              { title: '否', value: 'false' },
            ],
          },
          {
            order: 6,
            title: '駕駛操控能力(如:流暢度、反應力、判斷力等)',
            resOptions: [
              { title: '是', value: 'true' },
              { title: '否', value: 'false' },
            ],
          },
        ],
      },
      {
        body: '1.外出 - 獨立程度',
        order: 1,
        type: Q_TYPE_BATCH_LEVEL_SELECT,
        options: [
          { order: 1, title: '可獨立完成活動', value: '3' },
          { order: 2, title: '需要口語提示', value: '2' },
          { order: 3, title: '需要他人部分幫忙', value: '1' },
          { order: 4, title: '完全依賴他人', value: '0' },
        ],
      },
      {
        body: '1.外出 - 參與頻率',
        order: 1,
        type: Q_TYPE_BATCH_FREQUENCY_CHOOSE,
        options: [
          { order: 1, title: '經常 ≥7次/週', value: '>7' },
          { order: 2, title: '偶爾 4~6次/週', value: '4~6' },
          { order: 3, title: '很少 ≤3次/週', value: '<3' },
        ],
      },
      {
        body: '1.外出 - 資源支持程度',
        order: 1,
        type: Q_TYPE_BATCH_SUB_QUESTION,
        options: [
          { order: 1, title: 'N/A', value: 'N/A', subQuestionOptions },
          { order: 2, title: '2', value: '2', subQuestionOptions },
          { order: 3, title: '1', value: '1', subQuestionOptions },
          { order: 4, title: '0', value: '0', subQuestionOptions },
        ],
      },

      {
        body: '2.通訊 - 過去一個月是否有執行',
        order: 1,
        type: Q_TYPE_EVER_DONE_BEFORE,
        keepValue: true,
        options: [
          {
            order: 1,
            title: '操作電話或手機(含接聽、撥打)',
            resOptions: [
              { title: '是', value: 'true' },
              { title: '否', value: 'false' },
            ],
          },
          {
            order: 2,
            title: '記住重要或常用號碼(包含住家電話、緊急電話:110/119等)',
            resOptions: [
              { title: '是', value: 'true' },
              { title: '否', value: 'false' },
            ],
          },
          {
            order: 3,
            title: '查詢電話簿或打查號台查詢不熟悉之電話號碼',
            resOptions: [
              { title: '是', value: 'true' },
              { title: '否', value: 'false' },
            ],
          },
          {
            order: 4,
            title: '查看訊息',
            resOptions: [
              { title: '是', value: 'true' },
              { title: '否', value: 'false' },
            ],
          },
          {
            order: 5,
            title: '發送訊息(包含文字及影像)',
            resOptions: [
              { title: '是', value: 'true' },
              { title: '否', value: 'false' },
            ],
          },
        ],
      },
      {
        body: '2.通訊 - 獨立程度',
        order: 1,
        type: Q_TYPE_BATCH_LEVEL_SELECT,
        options: [
          { order: 1, title: '可獨立完成活動', value: '3' },
          { order: 2, title: '需要口語提示', value: '2' },
          { order: 3, title: '需要他人部分幫忙', value: '1' },
          { order: 4, title: '完全依賴他人', value: '0' },
        ],
      },
      {
        body: '2.通訊 - 參與頻率',
        order: 1,
        type: Q_TYPE_BATCH_FREQUENCY_CHOOSE,
        options: [
          { order: 1, title: '經常 ≥7次/週', value: '>7' },
          { order: 2, title: '偶爾 4~6次/週', value: '4~6' },
          { order: 3, title: '很少 ≤3次/週', value: '<3' },
        ],
      },
      {
        body: '2.通訊 - 資源支持程度',
        order: 1,
        type: Q_TYPE_BATCH_SUB_QUESTION,
        options: [
          { order: 1, title: 'N/A', value: 'N/A', subQuestionOptions },
          { order: 2, title: '2', value: '2', subQuestionOptions },
          { order: 3, title: '1', value: '1', subQuestionOptions },
          { order: 4, title: '0', value: '0', subQuestionOptions },
        ],
      },

      {
        body: '3.餐點準備 - 過去一個月是否有執行',
        order: 1,
        type: Q_TYPE_EVER_DONE_BEFORE,
        keepValue: true,
        options: [
          {
            order: 1,
            title: '購買外帶餐點',
            resOptions: [
              { title: '是', value: 'true' },
              { title: '否', value: 'false' },
            ],
          },
          {
            order: 2,
            title: '使用外賣、外送服務',
            resOptions: [
              { title: '是', value: 'true' },
              { title: '否', value: 'false' },
            ],
          },
          {
            order: 3,
            title: '將已做好的飯菜加熱',
            resOptions: [
              { title: '是', value: 'true' },
              { title: '否', value: 'false' },
            ],
          },
          {
            order: 4,
            title: '獨立備料（含採買）及烹煮食材',
            resOptions: [
              { title: '是', value: 'true' },
              { title: '否', value: 'false' },
            ],
          },
          {
            order: 5,
            title: '收拾碗筷、洗滌',
            resOptions: [
              { title: '是', value: 'true' },
              { title: '否', value: 'false' },
            ],
          },
          {
            order: 6,
            title: '廚餘、垃圾處理',
            resOptions: [
              { title: '是', value: 'true' },
              { title: '否', value: 'false' },
            ],
          },
        ],
      },
      {
        body: '3.餐點準備 - 獨立程度',
        order: 1,
        type: Q_TYPE_BATCH_LEVEL_SELECT,
        options: [
          { order: 1, title: '可獨立完成活動', value: '3' },
          { order: 2, title: '需要口語提示', value: '2' },
          { order: 3, title: '需要他人部分幫忙', value: '1' },
          { order: 4, title: '完全依賴他人', value: '0' },
        ],
      },
      {
        body: '3.餐點準備 - 參與頻率',
        order: 1,
        type: Q_TYPE_BATCH_FREQUENCY_CHOOSE,
        options: [
          { order: 1, title: '經常 ≥7次/週', value: '>7' },
          { order: 2, title: '偶爾 4~6次/週', value: '4~6' },
          { order: 3, title: '很少 ≤3次/週', value: '<3' },
        ],
      },
      {
        body: '3.餐點準備 - 資源支持程度',
        order: 1,
        type: Q_TYPE_BATCH_SUB_QUESTION,
        options: [
          { order: 1, title: 'N/A', value: 'N/A', subQuestionOptions },
          { order: 2, title: '2', value: '2', subQuestionOptions },
          { order: 3, title: '1', value: '1', subQuestionOptions },
          { order: 4, title: '0', value: '0', subQuestionOptions },
        ],
      },

      {
        body: '4.購物 - 過去一個月是否有執行',
        order: 1,
        type: Q_TYPE_EVER_DONE_BEFORE,
        keepValue: true,
        options: [
          {
            order: 1,
            title: '自行擬訂清單',
            resOptions: [
              { title: '是', value: 'true' },
              { title: '否', value: 'false' },
            ],
          },
          {
            order: 2,
            title: '可自行至店家採買(或網路、電話/電視購物)基本日常必需品',
            resOptions: [
              { title: '是', value: 'true' },
              { title: '否', value: 'false' },
            ],
          },
          {
            order: 3,
            title: '獨立購買任何物品（包含非必需品或複雜採購）',
            resOptions: [
              { title: '是', value: 'true' },
              { title: '否', value: 'false' },
            ],
          },
        ],
      },
      {
        body: '4.購物 - 獨立程度',
        order: 1,
        type: Q_TYPE_BATCH_LEVEL_SELECT,
        options: [
          { order: 1, title: '可獨立完成活動', value: '3' },
          { order: 2, title: '需要口語提示', value: '2' },
          { order: 3, title: '需要他人部分幫忙', value: '1' },
          { order: 4, title: '完全依賴他人', value: '0' },
        ],
      },
      {
        body: '4.購物 - 參與頻率',
        order: 1,
        type: Q_TYPE_BATCH_FREQUENCY_CHOOSE,
        options: [
          { order: 1, title: '經常 ≥7次/週', value: '>7' },
          { order: 2, title: '偶爾 4~6次/週', value: '4~6' },
          { order: 3, title: '很少 ≤3次/週', value: '<3' },
        ],
      },
      {
        body: '4.購物 - 資源支持程度',
        order: 1,
        type: Q_TYPE_BATCH_SUB_QUESTION,
        options: [
          { order: 1, title: 'N/A', value: 'N/A', subQuestionOptions },
          { order: 2, title: '2', value: '2', subQuestionOptions },
          { order: 3, title: '1', value: '1', subQuestionOptions },
          { order: 4, title: '0', value: '0', subQuestionOptions },
        ],
      },

      {
        body: '5.洗衣 - 過去一個月是否有執行',
        order: 1,
        type: Q_TYPE_EVER_DONE_BEFORE,
        keepValue: true,
        options: [
          {
            order: 1,
            title: '簡單衣物(如:衣褲、襪子)',
            resOptions: [
              { title: '是', value: 'true' },
              { title: '否', value: 'false' },
            ],
          },
          {
            order: 2,
            title: '需分類洗滌或複雜程序(如:厚外套、大型床單等)',
            resOptions: [
              { title: '是', value: 'true' },
              { title: '否', value: 'false' },
            ],
          },
        ],
      },
      {
        body: '5.洗衣 - 獨立程度',
        order: 1,
        type: Q_TYPE_BATCH_LEVEL_SELECT,
        options: [
          { order: 1, title: '可獨立完成活動', value: '3' },
          { order: 2, title: '需要口語提示', value: '2' },
          { order: 3, title: '需要他人部分幫忙', value: '1' },
          { order: 4, title: '完全依賴他人', value: '0' },
        ],
      },
      {
        body: '5.洗衣 - 參與頻率',
        order: 1,
        type: Q_TYPE_BATCH_FREQUENCY_CHOOSE,
        options: [
          { order: 1, title: '經常 ≥7次/週', value: '>7' },
          { order: 2, title: '偶爾 4~6次/週', value: '4~6' },
          { order: 3, title: '很少 ≤3次/週', value: '<3' },
        ],
      },
      {
        body: '5.洗衣 - 資源支持程度',
        order: 1,
        type: Q_TYPE_BATCH_SUB_QUESTION,
        options: [
          { order: 1, title: 'N/A', value: 'N/A', subQuestionOptions },
          { order: 2, title: '2', value: '2', subQuestionOptions },
          { order: 3, title: '1', value: '1', subQuestionOptions },
          { order: 4, title: '0', value: '0', subQuestionOptions },
        ],
      },

      {
        body: '6.處理家務 - 過去一個月是否有執行',
        order: 1,
        type: Q_TYPE_EVER_DONE_BEFORE,
        keepValue: true,
        options: [
          {
            order: 1,
            title: '簡單清潔或整理(如:掃地、擦拭、折疊衣物、倒垃圾等)',
            resOptions: [
              { title: '是', value: 'true' },
              { title: '否', value: 'false' },
            ],
          },
          {
            order: 2,
            title: '較繁重清潔或整理(如:拖地、洗窗、搬動傢俱等)',
            resOptions: [
              { title: '是', value: 'true' },
              { title: '否', value: 'false' },
            ],
          },
        ],
      },
      {
        body: '6.處理家務 - 獨立程度',
        order: 1,
        type: Q_TYPE_BATCH_LEVEL_SELECT,
        options: [
          { order: 1, title: '可獨立完成活動', value: '3' },
          { order: 2, title: '需要口語提示', value: '2' },
          { order: 3, title: '需要他人部分幫忙', value: '1' },
          { order: 4, title: '完全依賴他人', value: '0' },
        ],
      },
      {
        body: '6.處理家務 - 參與頻率',
        order: 1,
        type: Q_TYPE_BATCH_FREQUENCY_CHOOSE,
        options: [
          { order: 1, title: '經常 ≥7次/週', value: '>7' },
          { order: 2, title: '偶爾 4~6次/週', value: '4~6' },
          { order: 3, title: '很少 ≤3次/週', value: '<3' },
        ],
      },
      {
        body: '6.處理家務 - 資源支持程度',
        order: 1,
        type: Q_TYPE_BATCH_SUB_QUESTION,
        options: [
          { order: 1, title: 'N/A', value: 'N/A', subQuestionOptions },
          { order: 2, title: '2', value: '2', subQuestionOptions },
          { order: 3, title: '1', value: '1', subQuestionOptions },
          { order: 4, title: '0', value: '0', subQuestionOptions },
        ],
      },

      {
        body: '7.金錢管理 - 過去一個月是否有執行',
        order: 1,
        type: Q_TYPE_EVER_DONE_BEFORE,
        keepValue: true,
        options: [
          {
            order: 1,
            title: '攜帶小額金錢或日常交易(如購買日用品)',
            resOptions: [
              { title: '是', value: 'true' },
              { title: '否', value: 'false' },
            ],
          },
          {
            order: 2,
            title: '操作提款機(如ATM提款)',
            resOptions: [
              { title: '是', value: 'true' },
              { title: '否', value: 'false' },
            ],
          },
          {
            order: 2,
            title: '辦理金融事務(如:前往銀行存款、匯款或轉帳等)',
            resOptions: [
              { title: '是', value: 'true' },
              { title: '否', value: 'false' },
            ],
          },
          {
            order: 2,
            title: '帳單處理(如:繳交水費、電費、卡費、支付房租等)',
            resOptions: [
              { title: '是', value: 'true' },
              { title: '否', value: 'false' },
            ],
          },
        ],
      },
      {
        body: '7.金錢管理 - 獨立程度',
        order: 1,
        type: Q_TYPE_BATCH_LEVEL_SELECT,
        options: [
          { order: 1, title: '可獨立完成活動', value: '3' },
          { order: 2, title: '需要口語提示', value: '2' },
          { order: 3, title: '需要他人部分幫忙', value: '1' },
          { order: 4, title: '完全依賴他人', value: '0' },
        ],
      },
      {
        body: '7.金錢管理 - 參與頻率',
        order: 1,
        type: Q_TYPE_BATCH_FREQUENCY_CHOOSE,
        options: [
          { order: 1, title: '經常 ≥7次/週', value: '>7' },
          { order: 2, title: '偶爾 4~6次/週', value: '4~6' },
          { order: 3, title: '很少 ≤3次/週', value: '<3' },
        ],
      },
      {
        body: '7.金錢管理 - 資源支持程度',
        order: 1,
        type: Q_TYPE_BATCH_SUB_QUESTION,
        options: [
          { order: 1, title: 'N/A', value: 'N/A', subQuestionOptions },
          { order: 2, title: '2', value: '2', subQuestionOptions },
          { order: 3, title: '1', value: '1', subQuestionOptions },
          { order: 4, title: '0', value: '0', subQuestionOptions },
        ],
      },

      {
        body: '8.個人修飾 - 過去一個月是否有執行',
        order: 1,
        type: Q_TYPE_EVER_DONE_BEFORE,
        keepValue: true,
        options: [
          {
            order: 1,
            title: '定期執行個人衛生活動(如:按時盥洗、刮鬍子、修剪指甲等)',
            resOptions: [
              { title: '是', value: 'true' },
              { title: '否', value: 'false' },
            ],
          },
          {
            order: 2,
            title:
              '維護個人外觀及整潔(如:保持衣著乾淨、頭髮整潔、無明顯口腔異味等)',
            resOptions: [
              { title: '是', value: 'true' },
              { title: '否', value: 'false' },
            ],
          },
          {
            order: 2,
            title: '外出打扮合宜、依場合需求適度打扮自己',
            resOptions: [
              { title: '是', value: 'true' },
              { title: '否', value: 'false' },
            ],
          },
        ],
      },
      {
        body: '8.個人修飾 - 獨立程度',
        order: 1,
        type: Q_TYPE_BATCH_LEVEL_SELECT,
        options: [
          { order: 1, title: '可獨立完成活動', value: '3' },
          { order: 2, title: '需要口語提示', value: '2' },
          { order: 3, title: '需要他人部分幫忙', value: '1' },
          { order: 4, title: '完全依賴他人', value: '0' },
        ],
      },
      {
        body: '8.個人修飾 - 參與頻率',
        order: 1,
        type: Q_TYPE_BATCH_FREQUENCY_CHOOSE,
        options: [
          { order: 1, title: '經常 ≥7次/週', value: '>7' },
          { order: 2, title: '偶爾 4~6次/週', value: '4~6' },
          { order: 3, title: '很少 ≤3次/週', value: '<3' },
        ],
      },
      {
        body: '8.個人修飾 - 資源支持程度',
        order: 1,
        type: Q_TYPE_BATCH_SUB_QUESTION,
        options: [
          { order: 1, title: 'N/A', value: 'N/A', subQuestionOptions },
          { order: 2, title: '2', value: '2', subQuestionOptions },
          { order: 3, title: '1', value: '1', subQuestionOptions },
          { order: 4, title: '0', value: '0', subQuestionOptions },
        ],
      },

      {
        body: '9.健康管理 - 過去一個月是否有執行',
        order: 1,
        type: Q_TYPE_EVER_DONE_BEFORE,
        keepValue: true,
        options: [
          {
            order: 1,
            title: '服藥遵從(如:按時服藥、服用正確劑量等)',
            resOptions: [
              { title: '是', value: 'true' },
              { title: '否', value: 'false' },
            ],
          },
          {
            order: 2,
            title: '藥品知識(如:正確領藥及排藥、可辨識自己常服用之藥物)',
            resOptions: [
              { title: '是', value: 'true' },
              { title: '否', value: 'false' },
            ],
          },
          {
            order: 2,
            title: '記得返診時間、按時返診',
            resOptions: [
              { title: '是', value: 'true' },
              { title: '否', value: 'false' },
            ],
          },
          {
            order: 2,
            title: '瞭解並可正確尋求就醫管道(如:預約或完成掛號程序)',
            resOptions: [
              { title: '是', value: 'true' },
              { title: '否', value: 'false' },
            ],
          },
        ],
      },
      {
        body: '9.健康管理 - 獨立程度',
        order: 1,
        type: Q_TYPE_BATCH_LEVEL_SELECT,
        options: [
          { order: 1, title: '可獨立完成活動', value: '3' },
          { order: 2, title: '需要口語提示', value: '2' },
          { order: 3, title: '需要他人部分幫忙', value: '1' },
          { order: 4, title: '完全依賴他人', value: '0' },
        ],
      },
      {
        body: '9.健康管理 - 參與頻率',
        order: 1,
        type: Q_TYPE_BATCH_FREQUENCY_CHOOSE,
        options: [
          { order: 1, title: '經常 ≥7次/週', value: '>7' },
          { order: 2, title: '偶爾 4~6次/週', value: '4~6' },
          { order: 3, title: '很少 ≤3次/週', value: '<3' },
        ],
      },
      {
        body: '9.健康管理 - 資源支持程度',
        order: 1,
        type: Q_TYPE_BATCH_SUB_QUESTION,
        options: [
          { order: 1, title: 'N/A', value: 'N/A', subQuestionOptions },
          { order: 2, title: '2', value: '2', subQuestionOptions },
          { order: 3, title: '1', value: '1', subQuestionOptions },
          { order: 4, title: '0', value: '0', subQuestionOptions },
        ],
      },
    ];

    const socialParticipateQuestionaire = {
      name: '工具性日常生活活動量表',
      questions: qData,
    };

    await Questionaire.create(socialParticipateQuestionaire);
  } else {
    console.info('社會參與度量表已存在，不執行匯入');
  }

  await mongoose.disconnect();
}

async function initCAATQuestionnaire() {
  mongoose.connect(config.db.uri, { useNewUrlParser: true });

  const count = await Questionaire.countDocuments({
    name: '電腦化交替性注意力測驗',
  });
  if (count === 0) {
    const genGraphicQuestion = (graphicName, isSymmetry, qType) => ({
      type: qType,
      body: graphicName,
      order: 1,
      extraJsonInfo: JSON.stringify({
        askFor: CAAT_ASK_FOR_GRAPHIC,
        isSymmetry,
      }),
      options: [
        { title: 'Ｘ', value: 'false' },
        { title: 'Ｏ', value: 'true' },
      ],
    });

    const genNumericQuestion = (maxDigit, qType) => {
      const results = [];
      for (let i = 1; i <= maxDigit; i += 1) {
        if (i !== CAAT_NUMERIC_THRESHOLD_DIGIT) {
          results.push({
            type: qType,
            body: i,
            order: 1,
            extraJsonInfo: JSON.stringify({ askFor: CAAT_ASK_FOR_NUMERIC }),
            options: [
              { title: 'Ｘ', value: 'false' },
              { title: 'Ｏ', value: 'true' },
            ],
          });
        }
      }
      return results;
    };

    const qData = [
      // 練習題
      genGraphicQuestion(
        'GRAPHIC_SYMMETRICAL_TRAPEZOID',
        true,
        Q_TYPE_CAAT_PRACTICE,
      ), // 對稱梯形(類金字塔)
      genGraphicQuestion(
        'GRAPHIC_SYMMETRICAL_TRIANGLE',
        true,
        Q_TYPE_CAAT_PRACTICE,
      ), // 正三角形
      genGraphicQuestion(
        'GRAPHIC_SYMMETRICAL_RECTANGLE',
        true,
        Q_TYPE_CAAT_PRACTICE,
      ), // 對稱長方形
      genGraphicQuestion(
        'GRAPHIC_SYMMETRICAL_DIMAND',
        true,
        Q_TYPE_CAAT_PRACTICE,
      ), // 菱形
      genGraphicQuestion(
        'GRAPHIC_NON_SYMMETRICAL_TRAPEZOID',
        false,
        Q_TYPE_CAAT_PRACTICE,
      ), // 平行四邊形
      genGraphicQuestion(
        'GRAPHIC_NON_SYMMETRICAL_TRAPEZOID_CUT_RIGHT',
        false,
        Q_TYPE_CAAT_PRACTICE,
      ), // 右缺角梯形
      genGraphicQuestion(
        'GRAPHIC_NON_SYMMETRICAL_TRAPEZOID_CUT_LEFT',
        false,
        Q_TYPE_CAAT_PRACTICE,
      ), // 左下左缺角梯形
      genGraphicQuestion(
        'GRAPHIC_NON_SYMMETRICAL_TRIANGLE',
        false,
        Q_TYPE_CAAT_PRACTICE,
      ), // 直角三角形
      ...genNumericQuestion(9, Q_TYPE_CAAT_PRACTICE),

      // 模擬題
      genGraphicQuestion(
        'GRAPHIC_SYMMETRICAL_TRAPEZOID',
        true,
        Q_TYPE_CAAT_SIMULATION,
      ), // 對稱梯形(類金字塔)
      genGraphicQuestion(
        'GRAPHIC_SYMMETRICAL_TRIANGLE',
        true,
        Q_TYPE_CAAT_SIMULATION,
      ), // 正三角形
      genGraphicQuestion(
        'GRAPHIC_SYMMETRICAL_RECTANGLE',
        true,
        Q_TYPE_CAAT_SIMULATION,
      ), // 對稱長方形
      genGraphicQuestion(
        'GRAPHIC_SYMMETRICAL_DIMAND',
        true,
        Q_TYPE_CAAT_SIMULATION,
      ), // 菱形
      genGraphicQuestion(
        'GRAPHIC_NON_SYMMETRICAL_TRAPEZOID',
        false,
        Q_TYPE_CAAT_SIMULATION,
      ), // 平行四邊形
      genGraphicQuestion(
        'GRAPHIC_NON_SYMMETRICAL_TRAPEZOID_CUT_RIGHT',
        false,
        Q_TYPE_CAAT_SIMULATION,
      ), // 右缺角梯形
      genGraphicQuestion(
        'GRAPHIC_NON_SYMMETRICAL_TRAPEZOID_CUT_LEFT',
        false,
        Q_TYPE_CAAT_SIMULATION,
      ), // 左下左缺角梯形
      genGraphicQuestion(
        'GRAPHIC_NON_SYMMETRICAL_TRIANGLE',
        false,
        Q_TYPE_CAAT_SIMULATION,
      ), // 直角三角形
      ...genNumericQuestion(9, Q_TYPE_CAAT_SIMULATION),

      // 正式題
      genGraphicQuestion(
        'GRAPHIC_SYMMETRICAL_TRAPEZOID',
        true,
        Q_TYPE_CAAT_FORMAL,
      ), // 對稱梯形(類金字塔)
      genGraphicQuestion(
        'GRAPHIC_SYMMETRICAL_TRIANGLE',
        true,
        Q_TYPE_CAAT_FORMAL,
      ), // 正三角形
      genGraphicQuestion(
        'GRAPHIC_SYMMETRICAL_RECTANGLE',
        true,
        Q_TYPE_CAAT_FORMAL,
      ), // 對稱長方形
      genGraphicQuestion(
        'GRAPHIC_SYMMETRICAL_DIMAND',
        true,
        Q_TYPE_CAAT_FORMAL,
      ), // 菱形
      genGraphicQuestion(
        'GRAPHIC_NON_SYMMETRICAL_TRAPEZOID',
        false,
        Q_TYPE_CAAT_FORMAL,
      ), // 平行四邊形
      genGraphicQuestion(
        'GRAPHIC_NON_SYMMETRICAL_TRAPEZOID_CUT_RIGHT',
        false,
        Q_TYPE_CAAT_FORMAL,
      ), // 右缺角梯形
      genGraphicQuestion(
        'GRAPHIC_NON_SYMMETRICAL_TRAPEZOID_CUT_LEFT',
        false,
        Q_TYPE_CAAT_FORMAL,
      ), // 左下左缺角梯形
      genGraphicQuestion(
        'GRAPHIC_NON_SYMMETRICAL_TRIANGLE',
        false,
        Q_TYPE_CAAT_FORMAL,
      ), // 直角三角形
      ...genNumericQuestion(9, Q_TYPE_CAAT_FORMAL),
    ];

    const caatQuestionaire = {
      name: '電腦化交替性注意力測驗',
      questions: qData,
    };

    await Questionaire.create(caatQuestionaire);
  } else {
    console.info('電腦化交替性注意力測驗已存在，不執行匯入');
  }
}

async function initialSeedData() {
  console.info('======== Init CDVT Questions ========');
  await initCDVTQuestions();

  console.info('======== Init 休閒生活量表 ========');
  await initLeisureActivityQuestionaire();

  console.info('======== Init 社會參與度量表 ========');
  await initSocialParticipateQuestionnaire();

  console.info('======== Init 工具性日常生活活動量表 ========');
  await initToolingLifeQuestionnaire();

  console.info('======== Init 表情測驗 ========');
  await initEmotionalTest();

  console.info('======== Init 電腦化交替性注意力測驗 ========');
  await initCAATQuestionnaire();

  console.info('======== Init SQOLC生活品質量表 ========');
  await initSQOLTest();
}

export default initialSeedData;
