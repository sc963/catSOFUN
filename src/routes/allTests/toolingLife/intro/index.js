import React from 'react';
import RootLayout from '../../../../components/RootLayout';
import Intro from './intro';

const title = '工具性日常生活活動量表';

function action(params) {
  return {
    chunks: ['toolingLifeIntro'],
    title,
    component: (
      <RootLayout>
        <Intro title={title} params={params} />
      </RootLayout>
    ),
  };
}

export default action;
