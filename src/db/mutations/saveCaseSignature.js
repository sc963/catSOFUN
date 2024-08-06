import Case from '../case/model';
import { DATA_NOT_EXISTS } from '../constants/error';

async function saveCaseSignature(_, { caseId, signatureBase64 }) {
  const caseToUpdate = await Case.findOne({ _id: caseId });
  if (!caseToUpdate) {
    throw new Error(DATA_NOT_EXISTS.message);
  }
  caseToUpdate.signatureBase64 = signatureBase64;
  caseToUpdate.save();
  return caseToUpdate;
}

export default saveCaseSignature;
