import React from 'react';

import './styles.css';

export default function Button({ children, width = '100%', height='40px', ...props }) {
  return <button className="defaultButton" style={{ width, height }} {...props} >
    {children}
  </button>;
}