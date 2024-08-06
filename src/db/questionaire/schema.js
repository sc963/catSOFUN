import gql from 'graphql-tag';

export const schema = [
  gql`
    type Questionaire {
      id: ID!
      name: String
      questions: [QuestionaireQuestion]
    }

    type QuestionaireQuestion {
      body: String
      order: Int
      type: String
      skippable: Boolean
      keepValue: Boolean
      maxSelection: Int
      extraJsonInfo: String
      options: [QuestionaireQuestionOption]
    }

    type QuestionaireQuestionOption {
      order: Int
      title: String
      value: String
      values: [String]
      resOptions: [ResponseQption]
      subQuestionOptions: [SubQuestionOption]
    }

    type ResponseQption {
      title: String
      value: String
    }

    type SubQuestionOption {
      label: String
      options: [QuestionInSubQuestion]
    }

    type QuestionInSubQuestion {
      name: String
      options: [ResponseQption]
    }
  `,
];

export const resolvers = {};
