import Case from '../case/model';
import { DATA_NOT_EXISTS } from '../constants/error';

async function addQuestionaireLogs(_, { caseId, logs, pause }) {
  const caseToUpdate = await Case.findOne({ _id: caseId });
  if (!caseToUpdate) {
    throw new Error(DATA_NOT_EXISTS.message);
  }
  caseToUpdate.questionaireHistories = [
    ...caseToUpdate.questionaireHistories,
    ...logs,
  ];
  if (pause !== null && pause !== undefined && pause) {
    caseToUpdate.pause = true;
  } else {
    caseToUpdate.completed = true;
  }
  caseToUpdate.save();
  return caseToUpdate;
}

export default addQuestionaireLogs;
