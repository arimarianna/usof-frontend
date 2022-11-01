import { useEffect, useState } from 'react';

export const useForm = (config) => {
  const { init, validation = {} } = config;
  
  const [ state, setState ] = useState(init);
  const [ errors, setErrors ] = useState({});
  const [ touched, setTouched ] = useState({});

  useEffect(() => {
    setState(init);
    setErrors({}),
    setTouched({});
  }, Object.values(init));

  const onChange = ({ target }) => {
    const { name, value } = target;

    setState((p) => {
      p[name] = value;

      return { ...p };
    });
  };

  const onBlur = ({ target }) => {
    const { name, value } = target;

    setTouched((p) => {
      p[name] = true;

      return { ...p };
    });

    setErrors((p) => {
      p[name] = validation[name]?.(value)?.toString() || null;

      return { ...p };
    });
  };

  return { value: state, errors, touched, onBlur, setState, onChange };
};