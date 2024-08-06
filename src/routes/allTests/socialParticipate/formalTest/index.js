import React from 'react';
import RootLayout from '../../../../components/RootLayout';
import FormalTest from './formalTest';

const title = '社會參與度量表';

function action(params) {
  return {
    chunks: ['socialParticipateFormalTest'],
    title,
    component: (
      <RootLayout>
        <FormalTest title={title} params={params} />
      </RootLayout>
    ),
  };
}

export default action;
