import LayoutAdmin from '../layout/LayoutAdmin';
import Spinner from '../../../components/Spinner';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, NavLink } from 'react-router-dom';
import axios from 'axios';
import '../TableView.css';

function AdminChangePassword() {
  const [isOldPasswordShowed, setIsOldPasswordShowed] = useState(false);
  const [isNewPasswordShowed, setNewPasswordShowed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  // const [oldPassword, setOldPassword] = useState('');
  // const [newPassword, setNewPassword] = useState('');
  const userLocalStorage = localStorage.getItem('userInfo');
  const userInfoObject = JSON.parse(userLocalStorage);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const showOldPassword = () => {
    setIsOldPasswordShowed(!isOldPasswordShowed);
  };

  const showNewPassword = () => {
    setNewPasswordShowed(!isNewPasswordShowed);
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    setIsError(false);

    const values = {
      userId: userInfoObject.userId,
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
    };

    try {
      const response = await axios.put('/api/users/ChangePassword', values);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setIsError(true);
    }
  };

  return (
    <LayoutAdmin>
      <div className='table__view'>
        <form className='form' onSubmit={handleSubmit(onSubmit)}>
          <div className='form__title'>Change password</div>

          <div className='form__field'>
            <label>Old Password</label>
            <input
              {...register('oldPassword', { required: true })}
              type={isOldPasswordShowed ? 'text' : 'password'}
              className='input'
            />
            <div style={{ margin: '0 10px' }}>
              <i className='bx bx-show' onClick={showOldPassword}></i>
            </div>
          </div>
          {errors.oldPassword && (
            <span className='form__validation'>This field is required</span>
          )}

          <div className='form__field'>
            <label>New Password</label>
            <input
              {...register('newPassword', { required: true })}
              type={isNewPasswordShowed ? 'text' : 'password'}
              className='input'
            ></input>
            <div style={{ margin: '0 10px' }}>
              <i className='bx bx-show' onClick={showNewPassword}></i>
            </div>
          </div>
          {errors.newPassword && (
            <span className='form__validation'>This field is required</span>
          )}

          <div className='form__field'>
            <input type='submit' className='btn' value='Submit' />
            <NavLink to='/admin'>
              <button className='btn__cancel'>Cancel</button>
            </NavLink>
          </div>

          {isLoading && (
            <div>
              <Spinner />
            </div>
          )}
        </form>
      </div>
    </LayoutAdmin>
  );
}

export default AdminChangePassword;
