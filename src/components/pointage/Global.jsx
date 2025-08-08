import React, { Suspense } from 'react';
import Header from './Header';
import { Outlet } from 'react-router-dom';
import { Spin } from 'antd';

const Global = () => {
  return (
    <div>
      <Header />
      <div style={{ paddingTop: '100px' }}>
        <Suspense fallback={
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <Spin size="large" tip="Chargement..." />
          </div>
        }>
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
};

export default Global;
