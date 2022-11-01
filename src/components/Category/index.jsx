import React from 'react';

import './styles.css';

export default function Category({ content, active = false, ...props }) {
  return <div className={'category ' + (active ? 'categoryActive' : '')} {...props}>
    {content}
  </div>;
}