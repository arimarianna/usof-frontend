import React from 'react';

import { ReactComponent as Arrow } from '../../../assets/icons/arrow.svg';

import './styles.css';

export default function Select({ placeholder, form, list = [], label, name, imitate, shadow, ...props }) {
  return <div className="selectWrapper">
    {label && <label htmlFor={name}>{label}</label>}
    {!imitate && <select 
      className={'defaultInput select ' + (shadow ? 'inputShadow' : '')} 
      placeholder={placeholder} 
      name={name} 
      id={name}
      value={form.value[name]} 
      onChange={form.onChange} {...props}
    >
      {list.map(({ value, title }) => <option key={value} value={value}>{title}</option>)}
    </select>}
    {imitate && <div className={'defaultInput select ' + (shadow ? 'inputShadow' : '')} {...props}>
      <span className="placeholder">{placeholder}</span>
    </div>}
    <Arrow className="icon" />
  </div>;
}