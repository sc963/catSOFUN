/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* eslint-disable global-require */

// The top-level (parent) route
const routes = {
  path: '',

  // Keep in mind, routes are evaluated in order
  children: [
    {
      path: '',
      load: () => import(/* webpackChunkName: 'welcome' */ './welcome'),
    },

    {
      path: '/testSwitch',
      load: () => import(/* webpackChunkName: 'testSwitch' */ './testSwitch'),
    },

    {
      path: '/newTest',
      load: () => import(/* webpackChunkName: 'newTest' */ './newTest'),
    },

    {
      path: '/historicalRecords',
      load: () =>
        import(
          /* webpackChunkName: 'historicalRecords' */ './historicalRecords'
        ),
    },

    // ============ CDVT ============
    {
      path: '/cdvtPractice',
      load: () =>
        import(
          /* webpackChunkName: 'cdvtPractice' */ './allTests/cdvt/practice'
        ),
    },

    {
      path: '/cdvtFormalTest',
      load: () =>
        import(
          /* webpackChunkName: 'cdvtFormalTest' */ './allTests/cdvt/formalTest'
        ),
    },

    {
      path: '/result',
      load: () =>
        import(/* webpackChunkName: 'result' */ './allTests/cdvt/result'),
    },

    {
      path: '/cdvtTutorial',
      load: () =>
        import(
          /* webpackChunkName: 'cdvtTutorial' */ './allTests/cdvt/tutorial'
        ),
    },

    // ============ LeisureActivity ============
    {
      path: '/leisureIntro',
      load: () =>
        import(
          /* webpackChunkName: 'leisureIntro' */ './allTests/leisureActivity/intro'
        ),
    },
    {
      path: '/leisureFormalTest',
      load: () =>
        import(
          /* webpackChunkName: 'leisureFormalTest' */ './allTests/leisureActivity/formalTest'
        ),
    },

    // ============ SocialParticipate ============
    {
      path: '/socialParticipateIntro',
      load: () =>
        import(
          /* webpackChunkName: 'socialParticipateIntro' */ './allTests/socialParticipate/intro'
        ),
    },
    {
      path: '/socialParticipateFormalTest',
      load: () =>
        import(
          /* webpackChunkName: 'socialParticipateFormalTest' */ './allTests/socialParticipate/formalTest'
        ),
    },

    // ============ ToolingLife ============
    {
      path: '/toolingLifeIntro',
      load: () =>
        import(
          /* webpackChunkName: 'toolingLifeIntro' */ './allTests/toolingLife/intro'
        ),
    },
    {
      path: '/toolingLifeFormalTest',
      load: () =>
        import(
          /* webpackChunkName: 'toolingLifeFormalTest' */ './allTests/toolingLife/formalTest'
        ),
    },

    // ============ Emotional ============
    {
      path: '/emotionalIntro',
      load: () =>
        import(
          /* webpackChunkName: 'emotionalIntro' */ './allTests/emotional/intro'
        ),
    },
    {
      path: '/emotionalFormalTest',
      load: () =>
        import(
          /* webpackChunkName: 'emotionalFormalTest' */ './allTests/emotional/formalTest'
        ),
    },

    // ============ CAAT ============
    {
      path: '/caatIntro',
      load: () =>
        import(/* webpackChunkName: 'caatIntro' */ './allTests/caat/intro'),
    },
    {
      path: '/caatFormalTest',
      load: () =>
        import(
          /* webpackChunkName: 'caatFormalTest' */ './allTests/caat/formalTest'
        ),
    },

    // ============ SQOL ============
    {
      path: '/sqolIntro',
      load: () =>
        import(/* webpackChunkName: 'sqolIntro' */ './allTests/sqol/intro'),
    },
    {
      path: '/sqolFormalTest',
      load: () =>
        import(
          /* webpackChunkName: 'sqolFormalTest' */ './allTests/sqol/formalTest'
        ),
    },

    // Wildcard routes, e.g. { path: '(.*)', ... } (must go last)
    {
      path: '(.*)',
      load: () => import(/* webpackChunkName: 'not-found' */ './not-found'),
    },
  ],

  async action({ next }) {
    // Execute each child route until one of them return the result
    const route = await next();

    // Provide default values for title, description etc.
    route.title = `${route.title || '職能評估測驗系統'}`;
    route.description = route.description || '';

    return route;
  },
};

// The error page is available by permanent url for development mode
if (__DEV__) {
  routes.children.unshift({
    path: '/error',
    action: require('./error').default,
  });
}

export default routes;
