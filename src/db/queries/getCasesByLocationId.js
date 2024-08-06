import log4js from 'log4js';
import Case from '../case/model';

const log = log4js.getLogger('getCasesByLocationId');

async function getCasesByLocationId(_, { locationId }) {
  let c;
  try {
    c = await Case.find({ location: locationId }).sort({ createdAt: -1 });
  } catch (e) {
    log.error(e);
  }

  return c;
}

export default getCasesByLocationId;
