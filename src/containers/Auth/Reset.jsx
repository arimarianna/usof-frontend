import React from 'react';
import { useDispatch } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import Button from '../../components/Button';

import { Text } from '../../components/Inputs';
import { useForm } from '../../helpers/hooks';
import { required } from '../../helpers/validation';
import { fetchPasswordResetConfirm } from '../../store/usersSlice';

import { Container } from './components';

export default function Reset() {
  const { token } = useParams();
  const dispatch = useDispatch();

  const form = useForm({
    init: {
      password: '',
    },
    validation: {
      password: required('Password'),
    },
  });

  const onReset = () => {
    dispatch(fetchPasswordResetConfirm({ data: form.value, token }));
  };

  return <Container
    bottom={'Set your new password'}
  >
    <Text
      type="password"
      placeholder="Password"
      name="password"
      form={form}
    />
    <Button
      onClick={onReset}
      height="60px"
    >Sign In</Button>
  </Container>;
}