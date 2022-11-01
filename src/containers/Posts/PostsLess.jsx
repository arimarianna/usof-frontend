import React from 'react';

import { useNavigate } from 'react-router-dom';

export default function PostsLess({ payload: { id, title, content, originator = {}, createdAt } }) {
  const navigate = useNavigate();
  const date = new Date(createdAt);

  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const year = date.getUTCFullYear();

  const createAtNew = `${year}.${month}.${day}`;

  const onClick = () => navigate('/post/' + id);

  return <div className="card postLess" onClick={onClick}>
    <div>
      <h2>{title}</h2>
      <p>{content}</p>
    </div>
    <div className="bottom">
      <span className="date">{createAtNew}</span>
      <span className="originator">@{originator.login}</span>
    </div>
  </div>;
}