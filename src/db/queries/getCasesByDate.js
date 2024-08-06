import log4js from 'log4js';
import moment from 'moment';
import Case from '../case/model';

const log = log4js.getLogger('getCasesByDate');

async function getCasesByDate(_, { date }) {
  let c;
  try {
    const rangeEnd = moment(date)
      .add(1, 'day')
      .toDate();

    c = await Case.find({
      createdAt: { $gte: new Date(date), $lt: rangeEnd },
    }).sort({ createdAt: -1 });
  } catch (e) {
    log.error(e);
  }

  return c;
}

export default getCasesByDate;
