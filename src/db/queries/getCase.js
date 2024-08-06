import log4js from 'log4js';
import Case from '../case/model';

const log = log4js.getLogger('getCase');

async function getCase(_, { caseId }) {
  let c;
  try {
    c = await Case.findOne({ _id: caseId });
  } catch (e) {
    log.error(e);
  }

  return c;
}

export default getCase;
