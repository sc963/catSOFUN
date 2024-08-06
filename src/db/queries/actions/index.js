import gql from 'graphql-tag';

export const GET_CASE = {
  name: 'getCase',
  query: gql`
    query getCase($caseId: String!) {
      getCase(caseId: $caseId) {
        id
        caseNo
        testType
        pause
        completed
        signatureBase64
        createdAt
        medicalStaff {
          id
          name
        }
        location {
          id
          name
        }
      }
    }
  `,
};

export const GET_CASES_HISTORY_DATA_BY_CASE_NO = {
  name: 'getCasesByCaseNo',
  query: gql`
    query getCasesByCaseNo($caseNo: String!) {
      getCasesByCaseNo(caseNo: $caseNo) {
        id
        caseNo
        testType
        pause
        completed
        signatureBase64
        createdAt
        medicalStaff {
          id
          name
        }
        location {
          id
          name
        }
        examHistories {
          caseDate
        }
        questionaireHistories {
          caseDate
        }
      }
    }
  `,
};

export const GET_CASES_HISTORY_DATA_BY_STAFF_ID = {
  name: 'getCasesByStaffId',
  query: gql`
    query getCasesByStaffId($staffId: String!) {
      getCasesByStaffId(staffId: $staffId) {
        id
        caseNo
        testType
        pause
        completed
        signatureBase64
        createdAt
        medicalStaff {
          id
          name
        }
        location {
          id
          name
        }
        examHistories {
          caseDate
        }
        questionaireHistories {
          caseDate
        }
      }
    }
  `,
};

export const GET_CASES_HISTORY_DATA_BY_LOCATION_ID = {
  name: 'getCasesByLocationId',
  query: gql`
    query getCasesByLocationId($locationId: String!) {
      getCasesByLocationId(locationId: $locationId) {
        id
        caseNo
        testType
        pause
        completed
        signatureBase64
        createdAt
        medicalStaff {
          id
          name
        }
        location {
          id
          name
        }
        examHistories {
          caseDate
        }
        questionaireHistories {
          caseDate
        }
      }
    }
  `,
};

export const GET_CASES_HISTORY_DATA_BY_DATE = {
  name: 'getCasesByDate',
  query: gql`
    query getCasesByDate($date: String!) {
      getCasesByDate(date: $date) {
        id
        caseNo
        testType
        pause
        completed
        signatureBase64
        createdAt
        medicalStaff {
          id
          name
        }
        location {
          id
          name
        }
        examHistories {
          caseDate
        }
        questionaireHistories {
          caseDate
        }
      }
    }
  `,
};

export const GET_CASE_RESULT = {
  name: 'getCase',
  query: gql`
    query getCase($caseId: String!) {
      getCase(caseId: $caseId) {
        id
        caseNo
        testType
        pause
        completed
        signatureBase64
        createdAt
        practiceHistories {
          question {
            exists
            number0
            number1
            number2
            number3
            number4
          }
          costTime
          isCorrect
          caseDate
        }
        examHistories {
          question {
            exists
            number0
            number1
            number2
            number3
            number4
          }
          costTime
          isCorrect
          isTimeout
          caseDate
        }
        questionaireHistories {
          questionaire {
            name
          }
          questionType
          costTime
          body
          answer
          isTimeout
          caseDate
        }
        medicalStaff {
          id
          name
        }
        location {
          id
          name
        }
      }
    }
  `,
};

export const GET_LOCATIONS = {
  name: 'getLocations',
  query: gql`
    {
      getLocations {
        id
        name
      }
    }
  `,
};

export const GET_MEDICAL_STAFFS = {
  name: 'getMedicalStaffs',
  query: gql`
    {
      getMedicalStaffs {
        id
        name
      }
    }
  `,
};

export const GET_RANDOM_QUESTIONS = {
  name: 'getRandomQuestions',
  query: gql`
    query getRandomQuestions(
      $fetchCount: Int!
      $practice: Boolean!
      $fiftyFifty: Boolean!
    ) {
      getRandomQuestions(
        fetchCount: $fetchCount
        practice: $practice
        fiftyFifty: $fiftyFifty
      ) {
        id
        practice
        exists
        number0
        number1
        number2
        number3
        number4
      }
    }
  `,
};

export const GET_CASE_WITH_QUESTIONAIRE_RESULT = {
  name: 'getCaseWithResult',
  query: gql`
    query getCaseWithResult($caseId: String!) {
      getCaseWithResult(caseId: $caseId) {
        id
        caseNo
        testType
        pause
        completed
        signatureBase64
        createdAt
        questionaireHistories {
          questionaire {
            name
          }
          questionType
          costTime
          body
          answer
          isTimeout
          caseDate
        }
        medicalStaff {
          id
          name
        }
        location {
          id
          name
        }
      }
    }
  `,
};

export const GET_CASE_WITH_RESULT = {
  name: 'getCaseWithResult',
  query: gql`
    query getCaseWithResult($caseId: String!) {
      getCaseWithResult(caseId: $caseId) {
        id
        caseNo
        testType
        pause
        completed
        signatureBase64
        createdAt
        practiceHistories {
          question {
            exists
            number0
            number1
            number2
            number3
            number4
          }
          costTime
          isCorrect
          caseDate
        }
        examHistories {
          question {
            exists
            number0
            number1
            number2
            number3
            number4
          }
          costTime
          isCorrect
          isTimeout
          caseDate
        }
        questionaireHistories {
          questionaire {
            name
          }
          questionType
          costTime
          body
          answer
          isTimeout
          caseDate
        }
        medicalStaff {
          id
          name
        }
        location {
          id
          name
        }
        result {
          toalCostSeconds
          totalReactionSeconds

          formalTotalCount
          formalCorrectCount
          formalIncorrectCount
          formalCorrectRate
          formalTotalCostSeconds
          formalAvgReactSeconds
          formalAvgCorrectReactSeconds
          formalTimeoutCount
          formalCorrectJudge
          formalResTimeJudge
          formalTotalCostTimeJudge

          practiceTotalCount
          practiceCorrectCount
          practiceIncorrectCount
          practiceCorrectRate
          practiceTotalCostSeconds
          practiceAvgReactSeconds
          practiceAvgCorrectReactSeconds

          pracTotalSecondsPR
          pracCorrectCountPR
          pracCorrectAvgSecondsPR
          formalTotalSecondsPR
          formalCorrectCountPR
          formalCorrectAvgSecondsPR
        }
      }
    }
  `,
};
