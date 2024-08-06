import React from 'react';
import RootLayout from '../../../../components/RootLayout';
import Intro from './intro';

const title = '休閒生活滿意度量表';

function action(params) {
  return {
    chunks: ['leisureIntro'],
    title,
    component: (
      <RootLayout>
        <Intro title={title} params={params} />
      </RootLayout>
    ),
  };
}

export default action;
