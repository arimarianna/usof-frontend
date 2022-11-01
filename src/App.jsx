import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';

import Main from './containers/Main';
import { Login, Register, Reset, Confirm, SendReset } from './containers/Auth';

import './helpers/axios';

import './styles/global.css';
import { Provider } from 'react-redux';
import { store } from './store';

function App() {
  return <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset.password" element={<SendReset />} />
        <Route path="/reset.password/:token" element={<Reset />} />
        <Route path="/con.register/:token" element={<Confirm />} />
        <Route path="/*" element={<Main />} />
      </Routes>
    </BrowserRouter>
  </Provider>;
}

export default App;