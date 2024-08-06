import merge from 'lodash/merge';
import { makeExecutableSchema } from 'graphql-tools';
import { schema as rootSchema, resolvers as rootResolvers } from './rootSchema';
import {
  schema as questionSchema,
  resolvers as questionResolvers,
} from './question/schema';
import {
  schema as userSchema,
  resolvers as userResolvers,
} from './user/schema';
import {
  schema as caseSchema,
  resolvers as caseResolvers,
} from './case/schema';
import {
  schema as locationSchema,
  resolvers as locationResolvers,
} from './location/schema';
import {
  schema as questionaireSchema,
  resolvers as questionaireResolvers,
} from './questionaire/schema';

export const schemas = [
  ...rootSchema,
  ...questionSchema,
  ...userSchema,
  ...caseSchema,
  ...locationSchema,
  ...questionaireSchema,
];
export const resolvers = merge(
  rootResolvers,
  questionResolvers,
  userResolvers,
  caseResolvers,
  locationResolvers,
  questionaireResolvers,
);

const executableSchema = makeExecutableSchema({
  typeDefs: [...schemas],
  resolvers: { ...resolvers },
});

export default executableSchema;
