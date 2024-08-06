import mongoose from 'mongoose';
import config from '../../src/config';
import {
  Q_TYPE_HINT,
  Q_TYPE_SQOL_NEGATIVE_SCORING,
  Q_TYPE_SQOL_POSITIVE_SCORING,
  Q_TYPE_TEXT_INPUT,
} from '../../src/constants/models/questionaire.const';
import Questionaire from '../../src/db/questionaire/model';

function getPositiveScoringOption() {
  return [
    {
      title: '比我預期的少很多',
      value: '1',
    },
    {
      title: '比我預期的少',
      value: '2',
    },
    {
      title: '比我預期稍微少一點',
      value: '3',
    },
    {
      title: '與我預期的相當',
      value: '4',
    },
    {
      title: '比我預期的更多',
      value: '5',
    },
  ];
}

function getNegativeScoringOption() {
  return [
    {
      title: '比我預期的多很多',
      value: '5',
    },
    {
      title: '比我預期的多',
      value: '4',
    },
    {
      title: '比我預期稍微多一點',
      value: '3',
    },
    {
      title: '與我預期的相當',
      value: '2',
    },
    {
      title: '比我預期的更少',
      value: '1',
    },
  ];
}

async function initSQOLTest() {
  mongoose.connect(config.db.uri, { useNewUrlParser: true });

  const count = await Questionaire.countDocuments({
    name: 'SQOLC生活品質量表',
  });

  if (count > 0) {
    console.info('SQOLC生活品質量表已存在，不執行匯入');
    return;
  }

  const getPositiveQData = (body, order) => ({
    body,
    order,
    type: Q_TYPE_SQOL_POSITIVE_SCORING,
    options: getPositiveScoringOption(),
  });

  const getNegativeQData = (body, order) => ({
    body,
    order,
    type: Q_TYPE_SQOL_NEGATIVE_SCORING,
    options: getNegativeScoringOption(),
  });

  const positiveQs = [
    '1. 我對生活有信心',
    '2. 我為生活打拼',
    '3. 我為我的工作及個人未來作規畫',
    '4. 我達成我的工作及個人目標',
    '5. 我相信自己',
    '6. 我很快樂',
    '7. 我一個人很自在',
    '8. 我感覺開心',
    '9. 我可以自主地作決定',
    '10. 我可以自主地採取行動',
    '11. 我過著積極的生活',
    '12. 我努力工作',
    '13. 我能外出(看電影、散步、去餐館吃飯)',
    '14. 我能享有家庭及感情生活',
    '15. 我的身材體型很好',
    '16. 我的體力充沛',
    '17. 我從事球類活動或其他體能活動',
    '18. 我的生活作息很規律、均衡',
    '19. 我能夠對我的家人訴說',
    '20. 我能夠獲得家人的幫助',
    '21. 我的家人了解我',
    '22. 我能自給自足並且不依賴家人',
    '23. 我可與家人見面',
    '24. 我的家人會聽我傾訴',
    '25. 我會與我的好朋友見面、也會邀請他們到我家',
    '26. 我能夠信任某些人',
    '27. 我能夠獲得好朋友的幫助',
    '28. 我的好朋友了解我',
    '29. 我有我的朋友群(死黨)',
    '30. 我對我的感情生活滿意',
    '31. 在公共場合中我覺得很自在',
  ];

  const negativeQs = [
    '32. 我對未來感到害怕',
    '33. 我感到沒有用',
    '34. 我感到焦慮',
    '35. 我感到孤單',
    '36. 我很難專心和保持思考通暢',
    '37. 我感到無聊',
    '38. 我覺得我和世界隔離',
    '39. 我對要填寫很多申報表格感到害怕',
    '40. 我對於表達我的感受有困難',
    '41. 對於要注意到週遭發生的事情我有困難',
  ];

  const qData = [];
  positiveQs.forEach(q => qData.push(getPositiveQData(q, qData.length)));
  qData.push({
    body: '請勾選每項問題中最能反應你目前感受的一個選項。',
    order: 0,
    type: Q_TYPE_HINT,
    skippable: true,
    options: [],
  });
  negativeQs.forEach(q => qData.push(getNegativeQData(q, qData.length)));
  qData.push(
    ...[
      {
        body: '請寫下你覺得作答有困難的題號，並說明原因',
        order: qData.length + 1,
        type: Q_TYPE_TEXT_INPUT,
      },
      {
        body: '對於那些你日常生活的需求，是我們沒有提到的?',
        order: qData.length + 2,
        type: Q_TYPE_TEXT_INPUT,
      },
      {
        body: '你有任何其他意見或補充資料嗎?',
        order: qData.length + 3,
        type: Q_TYPE_TEXT_INPUT,
      },
    ],
  );

  const sqolQuestionaire = {
    name: 'SQOLC生活品質量表',
    questions: qData,
  };

  await Questionaire.create(sqolQuestionaire);
}

export default initSQOLTest;
