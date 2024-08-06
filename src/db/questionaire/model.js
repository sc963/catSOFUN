import mongoose, { Schema } from 'mongoose';
import { ALL_Q_TYPE } from '../../constants/models/questionaire.const';

const subQuestionOption = new Schema({
  label: {
    type: String,
  },
  options: [
    {
      name: String,
      options: [
        {
          title: {
            type: String,
          },
          value: {
            type: String,
          },
        },
      ],
    },
  ],
});

const qOption = new Schema({
  order: {
    type: Number,
  },
  title: {
    type: String,
  },
  value: {
    type: String,
  },
  values: [
    {
      type: String,
    },
  ],
  resOptions: [
    {
      title: {
        type: String,
      },
      value: {
        type: String,
      },
    },
  ],
  subQuestionOptions: [subQuestionOption],
});

const question = new Schema({
  body: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    required: true,
  },
  skippable: {
    type: Boolean,
    default: false,
  },
  keepValue: {
    type: Boolean,
    default: false,
  },
  maxSelection: {
    type: Number,
    default: 1,
  },
  type: {
    type: String,
    enum: ALL_Q_TYPE,
    required: true,
  },
  extraJsonInfo: {
    type: String,
  },
  options: [qOption],
});

const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    questions: [question],
  },
  {
    timestamps: true,
  },
);

delete mongoose.connection.models.Questionaire;
const Questionaire = mongoose.model('Questionaire', schema);

export default Questionaire;
