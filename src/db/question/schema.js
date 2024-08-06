import gql from 'graphql-tag';

export const schema = [
  gql`
    type Question {
      id: ID!
      number0: Int!
      number1: Int!
      number2: Int!
      number3: Int!
      number4: Int!
      exists: Boolean!
      practice: Boolean!
    }
  `,
];

export const resolvers = {
  // getAllQuestion: async () => {
  //   const allQ = await Question.find({});
  //   return allQ;
  // },
};
