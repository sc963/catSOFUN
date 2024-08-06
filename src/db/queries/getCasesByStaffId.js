import log4js from 'log4js';
import Case from '../case/model';

const log = log4js.getLogger('getCaseByStaffId');

export default async function getCasesByStaffId(_, { staffId }) {
  let c;
  try {
    c = await Case.find({ medicalStaff: staffId }).sort({ createdAt: -1 });
  } catch (e) {
    log.error(e);
  }

  return c;
}
