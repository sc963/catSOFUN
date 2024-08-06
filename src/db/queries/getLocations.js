import log4js from 'log4js';
import Location from '../location/model';

const log = log4js.getLogger('getLocations');

async function getLocations() {
  let data;
  try {
    data = await Location.find({}).sort({ createdAt: -1 });
  } catch (e) {
    log.error(e);
  }

  return data;
}

export default getLocations;
