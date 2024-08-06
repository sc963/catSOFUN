import React from 'react';
import RootLayout from '../../../../components/RootLayout';
import FormalTest from './formalTest';

const title = '電腦化交替性注意力測驗';

function action(params) {
  return {
    chunks: ['caatFormalTest'],
    title,
    component: (
      <RootLayout>
        <FormalTest title={title} params={params} />
      </RootLayout>
    ),
  };
}

export default action;
