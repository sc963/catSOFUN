import gql from 'graphql-tag';
// import Location from './model';

export const schema = [
  gql`
    type Location {
      id: ID!
      name: String!
    }
  `,
];

export const resolvers = {
  // getLocations: async () => {
  //   const locations = await Location.find({});
  //   return locations;
  // },
};
