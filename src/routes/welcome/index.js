import React from 'react';
import RootLayout from '../../components/RootLayout';
import Welcome from './welcome';

const title = '職能評估測驗系統';

function action() {
  return {
    chunks: ['welcome'],
    title,
    component: (
      <RootLayout>
        <Welcome title={title} />
      </RootLayout>
    ),
  };
}

export default action;
