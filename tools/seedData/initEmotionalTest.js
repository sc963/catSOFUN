import mongoose from 'mongoose';
import fs from 'fs';
import config from '../../src/config';
import Questionaire from '../../src/db/questionaire/model';
import {
  Q_TYPE_EMOTIONAL_FORMAL,
  Q_TYPE_EMOTIONAL_PRACTICE,
  Q_TYPE_EMOTIONAL_CONTROL,
  NAME_EMOTIONAL_TEST,
} from '../../src/constants/models/questionaire.const';

const FILENAME_QUESTION_CSV = 'emotional-filenames.csv';
const PHOTO_URL_PREFIX =
  'https://storage.googleapis.com/tpechot/emotionalPhotos/';

function getEmotionOptions() {
  return [
    { title: '平靜', value: '0' },
    { title: '快樂', value: '1' },
    { title: '傷心', value: '2' },
    { title: '生氣', value: '3' },
    { title: '厭惡', value: '4' },
    { title: '害怕', value: '5' },
    { title: '驚訝', value: '6' },
    { title: '不確定', value: '9' },
  ];
}

function getAgeOptions() {
  return [
    { title: '20歲以下', value: '1' },
    { title: '20~39歲', value: '2' },
    { title: '40~69歲', value: '3' },
    { title: '60歲以上', value: '4' },
  ];
}

async function initEmotionalTest() {
  mongoose.connect(
    config.db.uri,
    { useNewUrlParser: true },
  );

  const count = await Questionaire.countDocuments({
    name: NAME_EMOTIONAL_TEST,
  });

  if (count === 0) {
    fs.readFile(
      `./tools/seedData/${FILENAME_QUESTION_CSV}`,
      'utf8',
      async (err, data) => {
        if (err) {
          throw err;
        }
        const dataArray = data.split(/\r?\n/);
        if (dataArray.length < 254) {
          throw new Error('Question count is not match in CSV file.');
        }
        const practiceQuestions = dataArray.filter(fn => fn.startsWith('P_'));
        const controlQuestions = dataArray.filter(fn => fn.startsWith('C_'));
        const formalQuestions = dataArray.filter(fn => fn.match(/^\d/));

        const qData = [];
        const qChooseEmotion =
          '請注視照片後，並於下方選擇最能代表照片人物之情緒';
        const qChooseAge = '請注視照片後，並於下方選擇代表照片人物之年紀';

        const getExtraInfoJsonString = filename =>
          JSON.stringify({
            filename,
            photoUrl: PHOTO_URL_PREFIX + filename,
          });

        practiceQuestions.forEach(filename => {
          qData.push({
            body: qChooseEmotion,
            order: qData.length + 1,
            type: Q_TYPE_EMOTIONAL_PRACTICE,
            options: getEmotionOptions(),
            extraJsonInfo: getExtraInfoJsonString(filename),
          });
        });

        controlQuestions.forEach(filename => {
          qData.push({
            body: qChooseAge,
            order: qData.length + 1,
            type: Q_TYPE_EMOTIONAL_CONTROL,
            options: getAgeOptions(),
            extraJsonInfo: getExtraInfoJsonString(filename),
          });
        });

        formalQuestions.forEach(filename => {
          qData.push({
            body: qChooseEmotion,
            order: qData.length + 1,
            type: Q_TYPE_EMOTIONAL_FORMAL,
            options: getEmotionOptions(),
            extraJsonInfo: getExtraInfoJsonString(filename),
          });
        });

        const emotionalTest = {
          name: NAME_EMOTIONAL_TEST,
          questions: qData,
        };

        await Questionaire.create(emotionalTest);
        await mongoose.disconnect();
      },
    );
  } else {
    console.info('表情測驗已存在，不執行匯入');
  }
}

export default initEmotionalTest;
