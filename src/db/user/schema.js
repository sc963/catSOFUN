import gql from 'graphql-tag';
import User from './model';
import { TYPE_MEDICAL_STAFF } from '../../constants/models/user';

export const schema = [
  gql`
    type User {
      id: ID!
      type: String!
      name: String!
    }
  `,
];

export const resolvers = {
  // getAllMedicalStaff: async () => {
  //   const staff = await User.find({ type: TYPE_MEDICAL_STAFF });
  //   return staff;
  // },
};
