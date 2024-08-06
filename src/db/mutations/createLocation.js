import Location from '../location/model';
import { DATA_EXISTED } from '../constants/error';

async function createLocation(_, { name }) {
  const existed = await Location.findOne({ name });
  if (existed) {
    throw new Error(DATA_EXISTED.message);
  }
  const location = await Location.create({ name });
  return location;
}

export default createLocation;
