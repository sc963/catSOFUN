import expressGraphQL from 'express-graphql';
import { schemas } from './index';

export default function initGraphQLServer(app) {
  app.use(
    '/graphql',
    expressGraphQL(req => ({
      schemas,
      graphiql: __DEV__,
      rootValue: { request: req },
      pretty: __DEV__,
    })),
  );
}
