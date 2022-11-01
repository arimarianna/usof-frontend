import React from 'react';

import './styles.css';

export default function Textarea({ form, placeholder, label, name, className = '' }) {
  const errorMessage = form.errors[name];

  const value = form.value[name] || '';

  return <div className={'defaultWrapper ' + className}>
    {label && <label htmlFor={name}>{label}</label>}
    <textarea className="defaultInput textarea inputShadow" onChange={form.onChange} value={value} onBlur={form.onBlur} placeholder={placeholder} name={name}>
      {value}
    </textarea>
    {form.touched[name] && !!errorMessage &&
      <p className="error">
        {errorMessage}
      </p>}
  </div>;
}