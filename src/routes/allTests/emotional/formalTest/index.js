import React from 'react';
import RootLayout from '../../../../components/RootLayout';
import FormalTest from './formalTest';

const title = '表情測驗';

function action(params) {
  return {
    chunks: ['emotionalFormalTest'],
    title,
    component: (
      <RootLayout>
        <FormalTest title={title} params={params} />
      </RootLayout>
    ),
  };
}

export default action;
