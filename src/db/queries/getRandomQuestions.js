import log4js from 'log4js';
import { shuffle } from 'lodash';
import Question from '../question/model';

const MAX_RECORD_LIMIT = 300;
const log = log4js.getLogger('getMedicalStaffs');

async function getRandomQuestions(_, { fetchCount, practice, fiftyFifty }) {
  const recordLimit =
    fetchCount > MAX_RECORD_LIMIT ? MAX_RECORD_LIMIT : fetchCount;

  return new Promise((resolve, reject) => {
    if (parseInt(recordLimit, 10) <= 0) {
      resolve([]);
      return;
    }

    let questions = [];
    if (fiftyFifty) {
      let containsSixQs;
      let withoutSixQs;
      Question.findRandom(
        { practice, exists: true },
        {},
        { limit: recordLimit / 2 },
        (err, result) => {
          if (err) {
            log.error(err.toString());
            reject(err);
          } else {
            containsSixQs = result;
            Question.findRandom(
              { practice, exists: false },
              {},
              { limit: recordLimit / 2 + (recordLimit % 2 !== 0 ? 1 : 0) }, // make without 6 more if the limit is odd
              (e, withoutSix) => {
                if (err) {
                  log.error(e.toString());
                  reject(e);
                } else {
                  withoutSixQs = withoutSix;
                  questions = shuffle([...containsSixQs, ...withoutSixQs]);
                  resolve(questions);
                }
              },
            );
          }
        },
      );
    } else {
      Question.findRandom(
        { practice },
        {},
        { limit: recordLimit },
        (err, result) => {
          if (err) {
            log.error(err.toString());
            reject(err);
          } else {
            resolve(result);
          }
        },
      );
    }
  });
}

export default getRandomQuestions;
