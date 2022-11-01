import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import Loading from '../../components/Loading';
import { fetchConfirmRegistration } from '../../store/usersSlice';

export default function Confirm() {
  const { token } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchConfirmRegistration(token));
  }, []);

  return <div className="confirmRegister">
    <Loading />
  </div>;
}