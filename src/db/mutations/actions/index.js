import gql from 'graphql-tag';

export const CREATE_MEDICAL_STAFF = {
  name: 'createMedicalStaff',
  query: gql`
    mutation createMedicalStaff($name: String!) {
      createMedicalStaff(name: $name) {
        id
        name
      }
    }
  `,
};

export const CREATE_LOCATION = {
  name: 'createLocation',
  query: gql`
    mutation createLocation($name: String!) {
      createLocation(name: $name) {
        id
        name
      }
    }
  `,
};

export const CREATE_CASE = {
  name: 'createCase',
  query: gql`
    mutation createCase(
      $caseNo: String!
      $medicalStaffId: ID!
      $locationId: ID!
      $testType: String!
    ) {
      createCase(
        caseNo: $caseNo
        medicalStaffId: $medicalStaffId
        locationId: $locationId
        testType: $testType
      ) {
        id
        testType
      }
    }
  `,
};

export const ADD_PRACTICE_LOGS = {
  name: 'addPracticeLogs',
  query: gql`
    mutation addPracticeLogs($caseId: String!, $logs: [ExamLogInput]!) {
      addPracticeLogs(caseId: $caseId, logs: $logs) {
        caseNo
      }
    }
  `,
};

export const ADD_FORMAL_LOGS = {
  name: 'addFormalLogs',
  query: gql`
    mutation addFormalLogs(
      $caseId: String!
      $logs: [ExamLogInput]!
      $pause: Boolean
    ) {
      addFormalLogs(caseId: $caseId, logs: $logs, pause: $pause) {
        caseNo
      }
    }
  `,
};

export const ADD_QUESTIONAIRE_LOGS = {
  name: 'addQuestionaireLogs',
  query: gql`
    mutation addFormalLogs(
      $caseId: String!
      $logs: [QuestionaireLogInput]!
      $pause: Boolean
    ) {
      addQuestionaireLogs(caseId: $caseId, logs: $logs, pause: $pause) {
        caseNo
      }
    }
  `,
};

export const SAVE_CASE_SIGNATURE = {
  name: 'saveCaseSignature',
  query: gql`
    mutation saveCaseSignature($caseId: String!, $signatureBase64: String!) {
      saveCaseSignature(caseId: $caseId, signatureBase64: $signatureBase64) {
        caseNo
      }
    }
  `,
};
