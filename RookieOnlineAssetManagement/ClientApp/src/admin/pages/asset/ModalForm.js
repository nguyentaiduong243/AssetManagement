import React from 'react';
import { useForm } from 'react-hook-form';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import { getApiAssets } from './assetsApi';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

const schema = Yup.object().shape({
  categoryCode: Yup.string()
    .required('Category Code is required')
    .max(5, "Category Code has a maximum limit of 5 characters")
    .matches(/^[aA-zZ\s]+$/, 'Only alphabets are allowed for this field '),
  name: Yup.string()
    .required('Category Name is required')
    .max(30, "Category Name has a maximum limit of 30 characters")
    .matches(/^[aA-zZ\s]+$/, 'Only alphabets are allowed for this field '),
});
const ModalForm = ({ modalIsOpen, setModelIsOpen, setChanges }) => {
  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const categorySubmit = (data) => {
    handleCategory(data);
  };

  function handleCategory(category) {
    return getApiAssets
      .createCategories(category)
      .then((response) => {
        setChanges((prev) => {
          const current = !prev;
          return current;
        });
        if (response.status) {
          toast('Add Category sucessfully');
          setModelIsOpen(false);
          reset();
        }
      })
      .catch((error) => {
        if (error.response) {
          toast.error(error.response.data);
        }
      });
  }

  return (
    <Modal isOpen={modalIsOpen} style={customStyles}>
      <div className='table__view'>
        <form onSubmit={handleSubmit(categorySubmit)}>
          <div className='form__title'>Create Category</div>
          <div className='form__field'>
            <label>Category Code</label>
            <input
              {...register('categoryCode')}
              className={`input ${errors.categoryId ? 'is-invalid' : ''}`}
            />
          </div>
          <p className='invalid-feedback'>{errors.categoryCode?.message}</p>
          <div className='form__field'>
            <label>Category Name</label>
            <input
              {...register('name')}
              className={`input ${errors.categoryId ? 'is-invalid' : ''}`}
            />
          </div>
          <p className='invalid-feedback'>{errors.name?.message}</p>
          <div className='form__field control-btn'>
            <input type='submit' className='btn' />
            <button
              className='btn cancel-btn'
              onClick={() => setModelIsOpen(false)}
            >
              Cancel
            </button>
          </div>
        </form>
        <div className='close-btn' onClick={() => setModelIsOpen(false)}>
          <i class='fas fa-times'></i>
        </div>
      </div>
    </Modal>
  );
};

export default ModalForm;
