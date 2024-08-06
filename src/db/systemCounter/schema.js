import gql from 'graphql-tag';

export const schema = [
  gql`
    type SystemCounter {
      id: ID!
      counterType: String
      counterValue: Int
    }
  `,
];

export const resolvers = {};
