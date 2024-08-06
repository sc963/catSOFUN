import mongoose, { Schema } from 'mongoose';
import random from 'mongoose-simple-random';

const schema = new Schema(
  {
    number0: {
      type: Number,
      required: true,
    },
    number1: {
      type: Number,
      required: true,
    },
    number2: {
      type: Number,
      required: true,
    },
    number3: {
      type: Number,
      required: true,
    },
    number4: {
      type: Number,
      required: true,
    },
    exists: {
      type: Boolean,
      required: true,
      index: true,
    },
    practice: {
      type: Boolean,
      required: true,
      index: true,
    },
    creatorUserId: {
      type: Schema.Types.ObjectId,
    },
  },
  {
    timestamps: true,
  },
);
schema.plugin(random);

delete mongoose.connection.models.Question;
const Question = mongoose.model('Question', schema);

export default Question;
