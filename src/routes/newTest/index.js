import React from 'react';
import RootLayout from '../../components/RootLayout';
import NewTest from './newTest';

const title = '建立測驗';

function action(params) {
  return {
    chunks: ['newTest'],
    title,
    component: (
      <RootLayout title={title}>
        <NewTest title={title} params={params} />
      </RootLayout>
    ),
  };
}

export default action;
