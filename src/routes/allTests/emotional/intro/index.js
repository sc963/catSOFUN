import React from 'react';
import RootLayout from '../../../../components/RootLayout';
import Intro from './intro';

const title = '表情測驗';

function action(params) {
  return {
    chunks: ['emotionalIntro'],
    title,
    component: (
      <RootLayout>
        <Intro title={title} params={params} />
      </RootLayout>
    ),
  };
}

export default action;
