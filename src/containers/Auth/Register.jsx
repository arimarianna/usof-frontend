import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/Button';

import { Text } from '../../components/Inputs';
import { useForm } from '../../helpers/hooks';
import { required } from '../../helpers/validation';

import { useDispatch } from 'react-redux';

import { Container } from './components';
import { fetchRegister } from '../../store/usersSlice';

export default function Register() {
  const dispatch = useDispatch();

  const form = useForm({
    init: {
      email: '',
      login: '',
      name: '',
      password: '',
    },
    validation: {
      email: required('Email'),
      login: required('Login'),
      password: required('Password'),
      name: required('Fullname'),
    },
  });

  const onSignIn = () => {
    dispatch(fetchRegister(form.value));
  };

  return <Container
    bottom={<>{'Already have an account?'}<Link className="loginLink linkBottom" to={'/login'}>Sign In</Link></>}
  >
    <Text
      placeholder="Email"
      name="email"
      form={form}
    />
    <Text
      placeholder="Login"
      name="login"
      form={form}
    />
    <Text
      placeholder="Fullname"
      name="name"
      form={form}
    />
    <Text
      placeholder="Password"
      name="password"
      form={form}
    />
    <Button
      onClick={onSignIn}
      height="60px"
    >Sign In</Button>
  </Container>;
}