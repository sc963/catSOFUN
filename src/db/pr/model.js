import mongoose, { Schema } from 'mongoose';
import * as PR_TYPES from '../../constants/models/pr.const';

// 需要計算的常模： 總答題時間，正確題數，正確提平均答題時間
const schema = new Schema(
  {
    prType: {
      type: String,
      enum: Object.values(PR_TYPES),
      required: true,
      index: true,
    },
    prValue: {
      type: Number,
      required: true,
      index: true,
    },
    count: {
      type: Number,
      required: true,
      index: true,
    },
    isFormal: {
      type: Boolean,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

delete mongoose.connection.models.Pr;
const Pr = mongoose.model('Pr', schema);

export default Pr;
