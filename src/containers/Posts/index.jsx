import React, { useEffect, useState } from 'react';
import { Button, Select, Text } from '../../components/Inputs';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import './styles.css';

import { useForm } from '../../helpers/hooks';
import PostsLess from './PostsLess';
import { fetchPosts } from '../../store/postsSlice';

const sortList = [{
  title: 'Descending',
  value: 'DESC',
}, {
  title: 'Ascending',
  value: 'ASC',
}];


export default function Posts() {
  const [ show, setShow ] = useState(false);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { result: posts = [], pages = 1 } = useSelector((state) => state.posts.entities?.undefined || {});

  const categoriesList = useSelector((state) => state.categories.entities?.undefined || []).map(({ id, title }) => ({
    value: id,
    title,
  }));

  categoriesList.unshift({
    title: '',
    value: null,
  });

  const form = useForm({
    init: {
      sort: 'ASC',
      category: 'null',
      start: null,
      end: null,
      page: 1,
    },
  });

  useEffect(() => {
    const { start, end } = form.value;
    if (start && !end) {
      form.setState((p) => {
        const month = new Date().getUTCMonth() + 1;
        const day = new Date().getUTCDate();
        const year = new Date().getUTCFullYear();
        p.end = `${year}-${month}-${day}`;

        return p;
      });
    }

    if (end && !start) {
      form.setState((p) => {
        const month = new Date().getUTCMonth() + 1;
        const day = new Date().getUTCDate();
        const year = new Date().getUTCFullYear();
        p.start = `${year}-${month}-${day}`;

        return p;
      });
    }

  }, [ form.value.start, form.value.end ]);

  const nextPage = () => form.setState((p) => {
    if (p.page >= pages) {
      return p;
    }

    p.page++;
    return { ...p };
  });

  const prevPage = () => form.setState((p) => {
    if (p.page <= 1) {
      return p;
    }

    p.page--;
    return { ...p };
  });

  useEffect(() => {
    const { sort, category, start, end, page } = form.value;
    const date = start && end ? `${start}--${end}` : '';
    dispatch(fetchPosts({
      filter: `${category !== 'null' && category ? category : ''}||${date}`,
      sort,
      page,
    }));
  }, [ form.value.start, form.value.end, form.value.page, form.value.sort, form.value.category ]);

  const pagesList = Array.from(new Array(pages || 1).keys()).map((key) => ({
    title: key + 1,
    value: key + 1,
  }));

  return <div className="container posts">
    <div className="toolbar">
      <div className="filters">
        <Select onClick={() => setShow(true)} placeholder="Filter" shadow imitate />
        <Select form={form} shadow placeholder="Sort" list={sortList} name="sort" />
        {show && <div className="filtersMore card">
          <Select label="Category" name="category" list={categoriesList} form={form} shadow />
          <div className="dates">
            <Text type="date" label="Start" name="start" form={form} shadow />
            <span></span>
            <Text type="date" label="End" name="end" form={form} shadow />
          </div>
          <div className="buttonClose">
            <Button onClick={() => setShow(false)}>Close</Button>
          </div>
        </div>}
      </div>
      <Button onClick={() => navigate('/posts/redactor/new')}>Add posts</Button>
    </div>
    <div>
      {posts.map((payload) => <PostsLess key={payload.id} payload={payload} />)}
    </div>
    <div className="pagination">
      <span onClick={prevPage}>Prev</span>
      <Select name="page" list={pagesList} form={form} />
      <span onClick={nextPage}>Next</span>
    </div>
  </div>;
}