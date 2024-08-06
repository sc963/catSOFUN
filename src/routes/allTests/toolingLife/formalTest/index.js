import React from 'react';
import RootLayout from '../../../../components/RootLayout';
import FormalTest from './formalTest';

const title = '工具性日常生活活動量表';

function action(params) {
  return {
    chunks: ['toolingLifeFormalTest'],
    title,
    component: (
      <RootLayout>
        <FormalTest title={title} params={params} />
      </RootLayout>
    ),
  };
}

export default action;
