import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Category from '../../components/Category';
import { ReactComponent as Comment } from '../../assets/icons/comment.svg';
import { ReactComponent as Like } from '../../assets/icons/like.svg';
import { Button, Textarea } from '../../components/Inputs';
import { useForm } from '../../helpers/hooks';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPostsById } from '../../store/postsSlice';
import { fetchPostSetLike, fetchPostLikes, fetchPostUnsetLike, fetchCommentLikes, fetchCommentUnsetLike, fetchCommentSetLike } from '../../store/likesSlice';

import './styles.css';
import { fetchAddComment, fetchComments } from '../../store/commentsSlice';
import { fetchCategoriesPost } from '../../store/categoriesSlice';

export default function Post() {
  const { post } = useParams();
  const dispatch = useDispatch();

  const { createdAt, title, content, originator: { login } = {} } = useSelector((state) => state.posts?.activePost || {});
  const comments = useSelector((state) => state.comments.entities?.undefined || []);
  const like = useSelector((state) => state.likes.active || []);
  const likeComments = useSelector((state) => state.likes.comments || []);
  const userSelf = useSelector((state) => state.users.selfUser || {});
  const categories = useSelector((state) => state.categories.postCategories || []);

  useEffect(() => {
    dispatch(fetchPostsById(post));
    dispatch(fetchPostLikes(post));
    dispatch(fetchComments(post));
    dispatch(fetchCategoriesPost(post));
  }, []);

  useEffect(() => {
    comments?.forEach(({ id }) => dispatch(fetchCommentLikes(id)));
  }, [ comments ]);

  const form = useForm({
    init: {
      comment: '',
    },
  });

  const parseDate = (createdAt) => {
    const date = new Date(createdAt);

    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();
    const year = date.getUTCFullYear();

    return `${year}.${month}.${day}`;
  };

  const countComp = (count, Icon, onClick, highlight) => <span className={'left ' + (highlight ? 'highlight' : '')}  onClick={onClick}>
    <Icon/>
    <span>{count}</span>
  </span>;

  const sendComment = () => {
    if (!form.value.comment) return;

    dispatch(fetchAddComment({
      post_id: post,
      data: {
        content: form.value.comment,
      },
    }));
  };

  const isLikedPost = like.some(({ originator_id }) => originator_id === userSelf.id);

  const onClickLike = () => {
    if (isLikedPost) {
      dispatch(fetchPostUnsetLike(post));
    } else {
      dispatch(fetchPostSetLike(post)); 
    }
  };

  const findCommentLike = (id) => likeComments.find(([ { comment_id } = {} ] = []) => comment_id === id);

  const isCommentLikes = (id) => findCommentLike(id)?.some?.(({ originator_id }) => originator_id === userSelf.id);

  const onClickLikeComment = (id) => () => {
    if (isCommentLikes(id)) {
      dispatch(fetchCommentUnsetLike(id));
    } else {
      dispatch(fetchCommentSetLike(id)); 
    }
  };


  return <div className="container post">
    <h1>{title}</h1>
    <div className="card postCard">
      <p>{content}</p>
      <div>
        <div className="categories">{categories.map(({ category: { id, title } = {} }) => <Category key={id} content={title} />)}</div>
        <div className="bottom">
          <div>
            {countComp(like.length, Like, onClickLike, isLikedPost)}
            {countComp(comments.length, Comment)}
            <span className="left">{parseDate(createdAt)}</span>
          </div>
          <span className="originator">@{login}</span>
        </div>
      </div>
    </div>
    <h2>Comments</h2>
    {comments.map(({ content, originator: { login } = {}, id, createdAt }) => <div key={id} className="comments">
      <div className="card comment">
        <div>
          <div className="originator">@{login}</div>
          <p>{content}</p>
        </div>
        <div className="bottom">
          <div>
            {countComp(findCommentLike(id)?.length || 0, Like, onClickLikeComment(id), isCommentLikes(id))}
            <span className="left">{parseDate(createdAt)}</span>
          </div>
        </div>
      </div>
    </div>)
    }
    <Textarea form={form} name="comment" placeholder="Write your comment..." />
    <div className="send">
      <Button onClick={sendComment}>Send</Button>
    </div>
  </div>;
}