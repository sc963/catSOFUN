import log4js from 'log4js';
import Questionaire from '../questionaire/model';

const log = log4js.getLogger('getCase');

async function getQuestionaire(_, { name }) {
  let c;
  try {
    c = await Questionaire.findOne({ name });
  } catch (e) {
    log.error(e);
  }

  return c;
}

export default getQuestionaire;
