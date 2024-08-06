import React from 'react';
import RootLayout from '../../../../components/RootLayout';
import Intro from './intro';

const title = 'SQOLC生活品質量表';

function action(params) {
  return {
    chunks: ['sqolIntro'],
    title,
    component: (
      <RootLayout>
        <Intro title={title} params={params} />
      </RootLayout>
    ),
  };
}

export default action;
