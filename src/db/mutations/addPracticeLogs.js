import Case from '../case/model';
import { updatePracticePr } from '../utils/prUtils';
import getResultInfo from '../utils/resultDisplayUtils';
import { increaseFinishedPracticeCount } from '../utils/systemCounterUtils';
import { DATA_NOT_EXISTS } from '../constants/error';

async function addPracticeLogs(_, { caseId, logs }) {
  const caseToUpdate = await Case.findOne({ _id: caseId });
  if (!caseToUpdate) {
    throw new Error(DATA_NOT_EXISTS.message);
  }
  caseToUpdate.practiceHistories = [...caseToUpdate.practiceHistories, ...logs];
  caseToUpdate.save();
  increaseFinishedPracticeCount();
  const caseInfo = getResultInfo(caseToUpdate);
  // 更新PR值
  updatePracticePr(
    caseInfo.practiceTotalCostSeconds,
    caseInfo.practiceCorrectCount,
    caseInfo.practiceAvgCorrectReactSeconds,
  );
  return caseToUpdate;
}

export default addPracticeLogs;
