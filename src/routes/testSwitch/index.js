import React from 'react';
import RootLayout from '../../components/RootLayout';
import TestSwitch from './testSwitch';

const title = '請選擇要執行的測驗';

function action(params) {
  return {
    chunks: ['testSwitch'],
    title,
    component: (
      <RootLayout>
        <TestSwitch title={title} params={params} />
      </RootLayout>
    ),
  };
}

export default action;
