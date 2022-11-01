import React from 'react';
import { useNavigate } from 'react-router-dom';

import { ReactComponent as Logo } from '../../../assets/icons/logo.svg';

export default function Container({ children, bottom }) {
  const navigate = useNavigate();

  return <div className="containerLoginWrapper">
    <div className="containerLogin card">
      <Logo onClick={() => navigate('/login')}/>
      <div>
        {children}
      </div>
      <div className="containerLoginBottom">
        {bottom}
      </div>
    </div>
  </div>;
}