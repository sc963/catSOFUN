import gql from 'graphql-tag';
import Query from './queries';
import Mutation from './mutations';

export const schema = [
  gql`
    type Query {
      getCase(caseId: String!): Case
      getCasesByCaseNo(caseNo: String!): [Case]
      getCasesByStaffId(staffId: String!): [Case]
      getCasesByLocationId(locationId: String!): [Case]
      getCasesByDate(date: String!): [Case]
      getLocations: [Location]
      getRandomQuestions(
        fetchCount: Int!
        practice: Boolean!
        fiftyFifty: Boolean!
      ): [Question]
      getMedicalStaffs: [User]
      getCaseWithResult(caseId: String!): Case
      getQuestionaire(name: String!): Questionaire
    }

    type Mutation {
      createMedicalStaff(name: String!): User
      createLocation(name: String!): Location
      createCase(
        caseNo: String!
        medicalStaffId: ID!
        locationId: ID!
        testType: String!
      ): Case
      addPracticeLogs(caseId: String!, logs: [ExamLogInput]!): Case
      addFormalLogs(
        caseId: String!
        logs: [ExamLogInput]!
        pause: Boolean
      ): Case
      addQuestionaireLogs(
        caseId: String!
        logs: [QuestionaireLogInput]!
        pause: Boolean
      ): Case
      saveCaseSignature(caseId: String!, signatureBase64: String!): Case
    }

    schema {
      query: Query
      mutation: Mutation
    }
  `,
];

export const resolvers = {
  Query,
  Mutation,
  // Subscription,
};
