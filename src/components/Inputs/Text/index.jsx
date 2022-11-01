import React from 'react';

export default function Text({ form, label, type = 'text', name, placeholder = '', className = '', shadow }) {
  const errorMessage = form.errors[name];

  return <div className={'defaultWrapper ' + className}>
    {label && <label htmlFor={name}>{label}</label>}
    <input
      id={name}
      name={name}
      type={type}
      value={form.value[name]}
      onChange={form.onChange}
      onBlur={form.onBlur}
      placeholder={placeholder}
      className={'defaultInput ' + (shadow ? 'inputShadow' : '')}
    />
    {form.touched[name] && !!errorMessage && 
      <p className="error">
        {errorMessage}
      </p>}
  </div>;
}