import mongoose, { Schema } from 'mongoose';
import {
  CDVT,
  LEISURE,
  SOCIAL_PARTICIPATE,
  TOOLING_LIFE,
  EMOTIONAL,
  CAAT,
  SQOL,
} from '../../constants/testType.const';

const examLog = new Schema(
  {
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
    },
    costTime: {
      type: Number,
      required: true,
    },
    isCorrect: {
      type: Boolean,
      required: true,
    },
    isTimeout: {
      type: Boolean,
      required: true,
      default: false,
    },
    caseDate: {
      type: Date,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

const questionaireLog = new Schema(
  {
    questionaire: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Questionaire',
    },
    questionType: {
      type: String,
      required: true,
    },
    costTime: {
      type: Number,
      required: true,
    },
    order: {
      type: Number,
    },
    body: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    isTimeout: {
      type: Boolean,
      required: true,
      default: false,
    },
    caseDate: {
      type: Date,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

const schema = new Schema(
  {
    caseNo: {
      type: String,
      required: true,
      index: true,
    },
    testType: {
      type: String,
      required: true,
      enum: [
        CDVT,
        LEISURE,
        SOCIAL_PARTICIPATE,
        TOOLING_LIFE,
        EMOTIONAL,
        CAAT,
        SQOL,
      ],
      index: true,
    },
    medicalStaff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Location',
      index: true,
    },
    pause: {
      type: Boolean,
      default: false,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    signatureBase64: {
      type: String,
    },
    practiceHistories: [examLog],
    examHistories: [examLog],
    questionaireHistories: [questionaireLog],
  },
  {
    timestamps: true,
  },
);

delete mongoose.connection.models.Case;
const Case = mongoose.model('Case', schema);

export default Case;
