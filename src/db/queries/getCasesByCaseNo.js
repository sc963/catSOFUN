import log4js from 'log4js';
import Case from '../case/model';

const log = log4js.getLogger('getCasesByCaseNo');

async function getCasesByCaseNo(_, { caseNo }) {
  let c;
  try {
    c = await Case.find({ caseNo }).sort({ createdAt: -1 });
  } catch (e) {
    log.error(e);
  }

  return c;
}

export default getCasesByCaseNo;
