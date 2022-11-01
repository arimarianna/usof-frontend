import React from 'react';

import './styles.css';

export default function Button({ children, ...props }) {
  return <button className="button" {...props}>{children}</button>;
}