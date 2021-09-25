import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Spinner from '../Spinner';

const ChangePassword = ({
  handleChangePassword,
  closeChangePasswordModal,
  isLoading,
  isError,
  errorMessage,
}) => {
  // Manage password input types (password <-> text)
  const [isOldPasswordShowed, setIsOldPasswordShowed] = useState(false);
  const [isNewPasswordShowed, setNewPasswordShowed] = useState(false);

  const showOldPassword = () => setIsOldPasswordShowed(!isOldPasswordShowed);
  const showNewPassword = () => setNewPasswordShowed(!isNewPasswordShowed);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <div className='modal'>
      <div className='confirm-close-btn' onClick={closeChangePasswordModal}>
        <i className='fas fa-times'></i>
      </div>
      <div className='modal-body'>
        <h3>Change password</h3>
        <p></p>
        <form onSubmit={handleSubmit(handleChangePassword)}>
          <div className='form__field' style={{ padding: '10px 0' }}>
            <label>Old Password</label>
            <input
              {...register('oldPassword', { required: true })}
              type={isOldPasswordShowed ? 'text' : 'password'}
              className='input'
            ></input>
            <div style={{ margin: '0 10px' }}>
              <i
                className='bx bx-show cursor-pointer'
                onClick={showOldPassword}
              ></i>
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
              <i
                className='bx bx-show cursor-pointer'
                onClick={showNewPassword}
              ></i>
            </div>
          </div>
          {errors.newPassword && (
            <span className='form__validation'>This field is required</span>
          )}

          {errorMessage && (
            <span className='form__validation'>{errorMessage}</span>
          )}

          <div style={{ paddingTop: '15px' }}>
            <input className='btn save' type='submit' value='Save' />
            <div>{isLoading && <Spinner />}</div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
