import log4js from 'log4js';
import User from '../user/model';
import { TYPE_MEDICAL_STAFF } from '../../constants/models/user';

const log = log4js.getLogger('getMedicalStaffs');

async function getMedicalStaffs() {
  let data;
  try {
    data = await User.find({ type: TYPE_MEDICAL_STAFF }).sort({
      createdAt: -1,
    });
  } catch (e) {
    log.error(e);
  }

  return data;
}

export default getMedicalStaffs;
