import React from 'react';
import RootLayout from '../../components/RootLayout';
import HistoricalRecords from './historicalRecords';

const title = 'C-DVT查詢測驗結果';

function action() {
  return {
    chunks: ['historicalRecords'],
    title,
    component: (
      <RootLayout title={title}>
        <HistoricalRecords title={title} />
      </RootLayout>
    ),
  };
}

export default action;
