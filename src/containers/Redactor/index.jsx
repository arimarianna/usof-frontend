import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from '../../helpers/hooks';
import { Button, Select, Text, Textarea } from '../../components/Inputs';
import './styles.css';
import Category from '../../components/Category';
import { useParams } from 'react-router-dom';
import { fetchCreatePost, fetchPostsById, fetchUpdatePost } from '../../store/postsSlice';
import { fetchAddCategories } from '../../store/categoriesSlice';
import { required } from '../../helpers/validation';

export default function Redactor() {
  const [ show, setShow ] = useState(false);

  const dispatch = useDispatch();
  const data = useSelector((state) => state.posts?.activePost || {});
  const categoriesList = useSelector((state) => state.categories.entities?.undefined || []).map(({ id, title }) => ({
    value: id,
    title,
  }));

  categoriesList.unshift({
    title: '',
    value: null,
  });

  const { post } = useParams();
  const isUpdate = post !== 'new';

  const form = useForm({
    init: {
      title: (isUpdate && data.title) || '',
      content: (isUpdate && data.content) || '',
      categories: (isUpdate && data.categories?.join(',')) || '',
      _category: '',
    },
    validation: {
      title: required('Title'),
      content: required('Content'),
    },
  });

  useEffect(() => {
    if (isUpdate) {
      dispatch(fetchPostsById(post));
    }
  }, []);

  const categories = form.value.categories?.split?.(',') || [];

  const addNewCat = ({ target }) => {
    let value = target.value || form.value._category;

    if (form.value._category && !target.value) {
      dispatch(fetchAddCategories(value));
    } else if (target.value) {
      value = categoriesList.find(({ value: v }) => `${v}` === value)?.title;
    }

    const newCat = [ ...new Set([ ...categories, value ]) ];

    form.setState((p) => {
      p.categories = newCat.filter(Boolean).join(',');

      return { ...p };
    });

    setShow(false);
  };

  const onSubmit = () => {
    let value = { ...form.value };

    if (!value.title || !value.content) {
      return;
    }

    delete value._category;

    if (isUpdate) {
      delete value.categories;
    }

    if (value.categories) {
      value.categories = value.categories.split(',').reduce((acc, title) => {
        const id = categoriesList.find(({ title: t }) => title === t).value;

        if (id !== -1) {
          acc.push(id);
        }

        return acc;
      }, []);
    }

    if (isUpdate) {
      dispatch(fetchUpdatePost({ id: post,value }));
    } else {
      dispatch(fetchCreatePost(value));
    }
  };

  return <div className="container redactor">
    <Text shadow label="Title" name="title" placeholder="Enter your question" form={form} />
    <Textarea shadow label="Content" name="content" placeholder="Type something..." form={form} />
    {!isUpdate && <div className="defaultWrapper">
      <label>Categories</label>
      <div className="card categories">
        <button onClick={() => setShow(true)} className="categoriesAdd">+</button>
        {categories.map((value) => value ? <Category key={value} active content={value} /> : null)}
      </div>
      {show && <div className="card categoriesAddModal"> 
        <Select shadow name="_category" form={form} list={categoriesList} onChange={addNewCat} />
        <div className="new"> 
          <Text name="_category" placeholder="New"  form={form} shadow />
          <Button onClick={addNewCat}>Add</Button>
        </div>
        <div className="buttonClose">
          <Button onClick={() => setShow(false)}>Close</Button>
        </div>
      </div>}
    </div>}
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <Button onClick={onSubmit}>{isUpdate ? 'Update' : 'Create'}</Button>
    </div>
  </div>;
}