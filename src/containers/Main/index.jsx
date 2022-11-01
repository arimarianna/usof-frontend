import React from 'react';
import Header from '../../components/Header';
import {
  Routes,
  Route
} from 'react-router-dom';

import './styles.css';
import Posts from '../Posts';
import Redactor from '../Redactor';
import Post from '../Post';
import Profile from '../Profile';

export default function Main() {
  return <Header>
    <Routes>
      <Route path="/" element={<Posts/>}/>
      <Route path="/posts/redactor/:post" element={<Redactor />} />
      <Route path="/post/:post" element={<Post />} />
      <Route path="/profile/:user" element={<Profile/>} />
    </Routes>
  </Header>;
}