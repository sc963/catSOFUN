import Case from '../case/model';
import { updateFormalPr } from '../utils/prUtils';
import getResultInfo from '../utils/resultDisplayUtils';
import {
  increaseFinishedFormalCount,
  increaseInterruptFormalCount,
} from '../utils/systemCounterUtils';
import { DATA_NOT_EXISTS } from '../constants/error';

async function addFormalLogs(_, { caseId, logs, pause }) {
  const caseToUpdate = await Case.findOne({ _id: caseId });
  if (!caseToUpdate) {
    throw new Error(DATA_NOT_EXISTS.message);
  }
  caseToUpdate.examHistories = [...caseToUpdate.examHistories, ...logs];
  if (pause !== null && pause !== undefined && pause) {
    caseToUpdate.pause = true;
    increaseInterruptFormalCount();
  } else {
    caseToUpdate.completed = true;
    increaseFinishedFormalCount();
    const caseInfo = getResultInfo(caseToUpdate);
    // 更新PR值
    updateFormalPr(
      caseInfo.formalTotalCostSeconds,
      caseInfo.formalCorrectCount,
      caseInfo.formalAvgCorrectReactSeconds,
    );
  }
  caseToUpdate.save();
  return caseToUpdate;
}

export default addFormalLogs;
