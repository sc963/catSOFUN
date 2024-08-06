import User from '../user/model';
import { TYPE_MEDICAL_STAFF } from '../../constants/models/user';
import { DATA_EXISTED } from '../constants/error';

async function createMedicalStaff(_, { name }) {
  const existed = await User.findOne({ name });
  if (existed) {
    throw new Error(DATA_EXISTED.message);
  }
  const user = await User.create({ name, type: TYPE_MEDICAL_STAFF });
  return user;
}

export default createMedicalStaff;
