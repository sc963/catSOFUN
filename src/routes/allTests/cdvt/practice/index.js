import React from 'react';
import RootLayout from '../../../../components/RootLayout';
import Practice from './practice';

const title = '練習測驗';

function action(params) {
  return {
    chunks: ['cdvtPractice'],
    title,
    component: (
      <RootLayout>
        <Practice title={title} params={params} />
      </RootLayout>
    ),
  };
}

export default action;
