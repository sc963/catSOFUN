import gql from 'graphql-tag';

export const schema = [
  gql`
    type Pr {
      id: ID!
      prType: String
      prValue: Int
      count: Int
      isFormal: Boolean
    }
  `,
];

export const resolvers = {};
