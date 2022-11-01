import React, { useEffect, useState } from 'react';
import { ReactComponent as Logo } from '../../assets/icons/logo.svg';
import { useForm } from '../../helpers/hooks';
import { Text } from '../Inputs';
import { ReactComponent as Logout } from '../../assets/icons/logout.svg';
import { ReactComponent as Profile } from '../../assets/icons/bin.svg';

import './styles.css';
import { useNavigate } from 'react-router-dom';
import { fetchLogout, fetchUserById } from '../../store/usersSlice';
import { fetchCategories } from '../../store/categoriesSlice';
import { useDispatch, useSelector } from 'react-redux';
import { url } from '../../helpers/consts';

const defaultImg = 'https://i.picsum.photos/id/237/200/300.jpg?hmac=TmmQSbShHz9CdQm0NkEjx1Dyh_Y984R9LpNrpvH2D_U';

export default function Header({ children }) {
  const [ show, setShow ] = useState(false);

  const dispatch = useDispatch();
  const navigator = useNavigate();
  const userSelf = useSelector((state) => state.users.selfUser || {});

  useEffect(() => {
    const user_id = localStorage.getItem('usof.user_id');

    if (user_id) {
      dispatch(fetchUserById({ id: user_id, self: true }));
      dispatch(fetchCategories());
    }
  }, []);

  const form = useForm({
    init: {
      search: '',
    },
  });

  const logout = () => dispatch(fetchLogout());

  return <div className="mainContainer">
    <header className="header">
      <Logo height="35px" onClick={() => navigator('/')}/>
      <Text shadow form={form} placeholder="Search"/>
      {!userSelf?.name ? <div/> : 
        <div className="profile" onClick={() => setShow((p) => !p)}>
          <img className="profileImg" src={userSelf.avatar ? `${url}/avatars/${userSelf.avatar}` : defaultImg}/>
          <div className="name">
            <p>{userSelf.name}</p>
            <span>@{userSelf.login}</span>
          </div>
          {show && <nav className="card actionList">
            <div onClick={() => navigator('/profile/self')}>
              <Profile width="14px" height="15px" className="actionIcon" />
              <span>Profile</span>
            </div>
            <div onClick={logout}>
              <Logout className="actionIcon" />
              <span>Log Out</span>
            </div>
          </nav>}
        </div>
      }
    </header>
    <div className="content">
      {children}
    </div>
  </div>;
}