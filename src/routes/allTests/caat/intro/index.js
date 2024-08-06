import React from 'react';
import RootLayout from '../../../../components/RootLayout';
import Intro from './intro';

const title = '電腦化交替性注意力測驗';

function action(params) {
  return {
    chunks: ['caatIntro'],
    title,
    component: (
      <RootLayout>
        <Intro title={title} params={params} />
      </RootLayout>
    ),
  };
}

export default action;
