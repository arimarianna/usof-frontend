import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { url } from '../../helpers/consts';

import { Button, Select, Text } from '../../components/Inputs';
import { useForm } from '../../helpers/hooks';
import PostsLess from '../Posts/PostsLess';

import './styles.css';
import { fetchAllUsers, fetchPasswordReset, fetchUpdateUser, fetchUserById } from '../../store/usersSlice';
import { required } from '../../helpers/validation';

const defaultImg = 'https://i.picsum.photos/id/237/200/300.jpg?hmac=TmmQSbShHz9CdQm0NkEjx1Dyh_Y984R9LpNrpvH2D_U';

const postPayload = {
  title: 'How to hide an <a> tag when i click a button?', 
  content: 'I want to make it so when someone clicks the escape key it will hide the tag. how would I do that? Here is my current code:', 
  originator: {
    login: 'usof',
  }, 
  createAt: new Date(),
};

const roles = [{
  value: 'user',
  title: 'User',
}, {
  value: 'admin',
  title: 'Admin',
}];

export default function Profile() {
  const navigator = useNavigate();
  const { user } = useParams();
  const [ show, setShow ] = useState(false);

  const dispatch = useDispatch();
  const userActive = useSelector((state) => state.users.activeUser || {});
  const userSelf = useSelector((state) => state.users.selfUser || {});
  const userList = useSelector((state) => state.users?.entities?.undefined || []);

  const isSelf = user === 'self';
  const isAdmin = userSelf.urole === 'admin';

  const user_id = isSelf ? localStorage.getItem('usof.user_id') : user;

  useEffect(() => {
    dispatch(fetchUserById({ id: user_id }));
  }, [ user_id ]);

  useEffect(() => {
    if (isAdmin) {
      dispatch(fetchAllUsers());
    }
  }, [ isAdmin ]);

  const form = useForm({
    init: {
      name: '',
    },
    validation: {
      name: required('Name'),
    },
  });

  const onSave = () => {
    setShow(false);
    const name = form.value.name;

    if (!name) {
      return;
    }

    dispatch(fetchUpdateUser({ user_id, data: { name } }));

    location.reload();
  };

  const onAvatar = ({ target }) => {
    const file = target.files[0];

    const formData = new FormData();
    formData.append('avatar', file, file.name);

    axios.request({
      method: 'patch',
      url: url + '/api/users/avatar',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true,
    }).then(() => {
      location.reload();
    }).catch(console.error);
  };

  const onChangeRole = (id) => ({ target }) => {
    if (!isAdmin) {
      return;
    }

    const value = target.value;

    dispatch(fetchUpdateUser({ user_id: id, data: { role_id: value === 'admin' ? 2 : 1 } }));

    location.reload();
  };

  const onClickLogin = (id) => () => {
    navigator('/profile/' + id);
  };

  const onResetPassword = () => {
    dispatch(fetchPasswordReset({ email: userSelf.email }));
  };

  return <div className="container profile">
    <div className="card user">
      <div>
        <img className="avatar" src={userActive.avatar ? `${url}/avatars/${userActive.avatar}` : defaultImg} />
        <div className="info">
          <p>{userActive.name}</p>
          <span>@{userActive.login}</span>
        </div>
      </div>
      {isSelf && <Button onClick={() => setShow(true)}>Edit Profile</Button>}
      <div>
        <p className="total">
          <span>Total likes</span>
          <span>{userActive.totalLikes}</span>
        </p>
      </div>
    </div>
    <div className="right">
      {!isAdmin ? <PostsLess payload={postPayload}/> : <div className="card adminTable">
        {userList.map(({ name, id, login, urole }) => id === userSelf.id ? null : <>
          <span>{id}</span>
          <span>{name}</span>
          <span className="login" onClick={onClickLogin(id)}>@{login}</span>
          <Select
            shadow
            name="role"
            form={{
              value: {
                role: urole,
              },
              onChange: onChangeRole(id),
            }}
            list={roles}
          />
        </>)}
      </div>}
    </div>
    {show && <div className="shadow" />}
    {show && <div className="card editProfile">
      <div>
        <Text shadow label="Name" name="name" form={form} />
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <div className="button buttonFile">
            Upload avatar
            <input accept="image/png, image/jpeg" type="file" onChange={onAvatar} />
          </div>
          <Button onClick={(onResetPassword)}>Change password</Button>
        </div>
      </div>
      <div className="buttons">
        <Button onClick={() => setShow(false)}>Close</Button>
        <Button disabled={!form.value.name} onClick={onSave}>Save</Button>
      </div>
    </div>}
  </div>;
}