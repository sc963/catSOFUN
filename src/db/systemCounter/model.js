import mongoose, { Schema } from 'mongoose';
import * as COUNTER_TYPES from '../../constants/models/systemCounter.const';

const schema = new Schema(
  {
    counterType: {
      type: String,
      enum: Object.values(COUNTER_TYPES),
      required: true,
      index: true,
    },
    counterValue: {
      type: Number,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

delete mongoose.connection.models.SystemCounter;
const SystemCounter = mongoose.model('SystemCounter', schema);

export default SystemCounter;
