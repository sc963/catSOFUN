import React from 'react';
import RootLayout from '../../../../components/RootLayout';
import Intro from './intro';

const title = '社會參與度量表';

function action(params) {
  return {
    chunks: ['socialParticipateIntro'],
    title,
    component: (
      <RootLayout>
        <Intro title={title} params={params} />
      </RootLayout>
    ),
  };
}

export default action;
