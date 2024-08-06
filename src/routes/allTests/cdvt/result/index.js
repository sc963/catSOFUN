import React from 'react';
import RootLayout from '../../../../components/RootLayout';
import Result from './result';

const title = '測驗結果';

function action(params) {
  return {
    chunks: ['result'],
    title,
    component: (
      <RootLayout>
        <Result title={title} params={params} />
      </RootLayout>
    ),
  };
}

export default action;
