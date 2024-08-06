import React from 'react';
import RootLayout from '../../../../components/RootLayout';
import FormalTest from './formalTest';

const title = '正式測驗-CDVT';

function action(params) {
  return {
    chunks: ['cdvtFormalTest'],
    title,
    component: (
      <RootLayout>
        <FormalTest title={title} params={params} />
      </RootLayout>
    ),
  };
}

export default action;
