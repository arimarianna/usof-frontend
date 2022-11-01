import React from 'react';
import { fetchPasswordReset } from '../../store/usersSlice';
import { useDispatch } from 'react-redux';

import { Container } from './components';
import { useForm } from '../../helpers/hooks';
import { required } from '../../helpers/validation';
import { Text } from '../../components/Inputs';
import Button from '../../components/Button';

export default function Confirm() {
  const dispatch = useDispatch();

  const form = useForm({
    init: {
      email: '',
    },
    validation: {
      email: required('Email'),
    },
  });

  const onSend = () => {
    if (!form.value.email) {
      return;
    }
    dispatch(fetchPasswordReset({ email: form.value.email }));
  };

  return <Container bottom={''}>
    <Text placeholder="Email" form={form} name="email"/>
    <Button height="60px" onClick={onSend}>Send</Button>
  </Container>;
}