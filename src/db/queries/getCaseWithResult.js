/* eslint-disable prettier/prettier */
import log4js from 'log4js';
import Case from '../case/model';
import getResultInfo from '../utils/resultDisplayUtils';
import { PRACTICE_PR, FORMAL_PR } from '../../constants/models/pr.const';
import {
  calTotcalSecondPR,
  calCorrectCountPR,
  calCorrectAvgSecondsPR,
} from '../utils/prUtils';

const log = log4js.getLogger('getCase');

async function getCaseWithResult(_, { caseId }) {
  let c;
  try {
    c = await Case.findOne({ _id: caseId });
    if (c) {
      const resultInfo = getResultInfo(c);
      const {
        practiceTotalCostSeconds,
        practiceCorrectCount,
        practiceAvgCorrectReactSeconds,
      } = resultInfo;
      const pracCorrectAvgReactionSeconds = (practiceAvgCorrectReactSeconds / 1000).toFixed(4);

      const pracTotalSecondsPR = await calTotcalSecondPR(practiceTotalCostSeconds, PRACTICE_PR);
      const pracCorrectCountPR = await calCorrectCountPR(practiceCorrectCount, PRACTICE_PR);
      const pracCorrectAvgSecondsPR = await calCorrectAvgSecondsPR(pracCorrectAvgReactionSeconds, PRACTICE_PR);

      const {
        formalTotalCostSeconds,
        formalCorrectCount,
        formalAvgCorrectReactSeconds,
      } = resultInfo;
      const formalCorrectAvgReactionSeconds = (formalAvgCorrectReactSeconds /1000).toFixed(4);
      const formalTotalSecondsPR = await calTotcalSecondPR(formalTotalCostSeconds, FORMAL_PR);
      const formalCorrectCountPR = await calCorrectCountPR(formalCorrectCount, FORMAL_PR);
      const formalCorrectAvgSecondsPR = await calCorrectAvgSecondsPR(formalCorrectAvgReactionSeconds, FORMAL_PR);

      const result = {
        ...resultInfo,
        pracTotalSecondsPR,
        pracCorrectCountPR,
        pracCorrectAvgSecondsPR,
        formalTotalSecondsPR,
        formalCorrectCountPR,
        formalCorrectAvgSecondsPR,
      }
      c.result = result;
    }
  } catch (e) {
    log.error(e);
  }

  return c;
}

export default getCaseWithResult;
