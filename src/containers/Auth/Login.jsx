import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Button from '../../components/Button';

import { Text } from '../../components/Inputs';
import { useForm } from '../../helpers/hooks';
import { required } from '../../helpers/validation';

import { Container } from './components';
import { fetchLogin } from '../../store/usersSlice';

export default function Login() {
  const dispatch = useDispatch();

  const form = useForm({
    init: {
      login: '',
      password: '',
    },
    validation: {
      login: required('Login'),
      password: required('Password'),
    },
  });

  const onSignIn = () => {
    dispatch(fetchLogin(form.value));
  };

  return <Container
    bottom={<>{'Don\'t have account?'}<Link className="loginLink linkBottom" to={'/register'}>Sign Up</Link></>}
  >
    <Text
      placeholder="Login"
      name="login"
      form={form}
    />
    <Text
      type="password"
      placeholder="Password"
      name="password"
      form={form}
    />
    <Link className="loginLink loginLinkForgot" to={'/reset.password'}>Forgot password</Link>
    <Button
      onClick={onSignIn}
      height="60px"
    >Sign In</Button>
  </Container>;
}