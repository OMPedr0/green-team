import React from 'react';
import ReactDOM from 'react-dom';
import { AuthProvider } from '../api/auth';
import Login from './login/page';

export default function () {
  return (
    <div>
      <AuthProvider>
        <Login />
      </AuthProvider>
    </div>
  );
}


