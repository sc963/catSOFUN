import gql from 'graphql-tag';
import User from '../user/model';
import Location from '../location/model';
import Question from '../question/model';

export const schema = [
  gql`
    type Case {
      id: ID!
      caseNo: String
      testType: String
      pause: Boolean
      completed: Boolean
      signatureBase64: String
      location: Location
      medicalStaff: User
      practiceHistories: [ExamLog]
      examHistories: [ExamLog]
      questionaireHistories: [QuestionaireLog]
      createdAt: String
      result: Result
    }

    type Result {
      toalCostSeconds: Float
      totalReactionSeconds: Float

      formalTotalCount: Int
      formalCorrectCount: Int
      formalIncorrectCount: Int
      formalCorrectRate: Float
      formalTotalCostSeconds: Float
      formalAvgReactSeconds: Float
      formalAvgCorrectReactSeconds: Float
      formalTimeoutCount: Float
      formalCorrectJudge: String
      formalResTimeJudge: String
      formalTotalCostTimeJudge: String

      practiceTotalCount: Int
      practiceCorrectCount: Int
      practiceIncorrectCount: Int
      practiceCorrectRate: Float
      practiceTotalCostSeconds: Float
      practiceAvgReactSeconds: Float
      practiceAvgCorrectReactSeconds: Float

      pracTotalSecondsPR: Int
      pracCorrectCountPR: Int
      pracCorrectAvgSecondsPR: Int
      formalTotalSecondsPR: Int
      formalCorrectCountPR: Int
      formalCorrectAvgSecondsPR: Int
    }

    type ExamLog {
      question: Question
      costTime: Float
      isCorrect: Boolean
      isTimeout: Boolean
      caseDate: String
    }

    type QuestionaireLog {
      questionaire: Questionaire
      questionType: String
      order: Int
      costTime: Float
      body: String
      answer: String
      isTimeout: Boolean
      caseDate: String
    }

    input ExamLogInput {
      question: ID!
      costTime: Float
      isCorrect: Boolean
      isTimeout: Boolean
      caseDate: String
    }

    input QuestionaireLogInput {
      questionaire: ID!
      questionType: String
      order: Int
      costTime: Float
      body: String
      answer: String
      isTimeout: Boolean
      caseDate: String
    }
  `,
];

export const resolvers = {
  Case: {
    medicalStaff: async ({ medicalStaff }) => {
      const u = await User.findOne({ _id: medicalStaff });
      return u;
    },
    location: async ({ location }) => {
      const l = await Location.findOne({ _id: location });
      return l;
    },
  },
  ExamLog: {
    question: async ({ question }) => {
      const q = await Question.findOne({ _id: question });
      return q;
    },
  },
};
