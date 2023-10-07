import React from 'react';
import ReactDOM from 'react-dom';
import { AuthProvider } from '../api/auth';
import User from './user/page';

function App() {
  return (
    <div>
      <AuthProvider>
        <User />
      </AuthProvider>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
