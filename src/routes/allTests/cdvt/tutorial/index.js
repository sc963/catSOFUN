import React from 'react';
import RootLayout from '../../../../components/RootLayout';
import Tutorial from './tutorial';

const title = '測驗說明';

function action(params) {
  return {
    chunks: ['cdvtTutorial'],
    title,
    component: (
      <RootLayout>
        <Tutorial title={title} params={params} />
      </RootLayout>
    ),
  };
}

export default action;
