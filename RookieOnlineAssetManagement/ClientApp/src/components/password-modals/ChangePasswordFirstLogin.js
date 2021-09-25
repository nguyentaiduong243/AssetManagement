import { useState } from 'react';
import Spinner from '../Spinner';
import { useForm } from 'react-hook-form';

const ChangePassword = ({
  handleChangePasswordFirstTimeLogin,
  isLoading,
  isError,
  errorMessage,
}) => {
  const [isNewPasswordShowed, setNewPasswordShowed] = useState(false);
  const showNewPassword = () => setNewPasswordShowed(!isNewPasswordShowed);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <div className='modal'>
      <div className='modal-body'>
        <h3>Change password for first time login</h3>
        <p>
          This is the first time you login. You need to change your password to
          continue.
        </p>
        <form onSubmit={handleSubmit(handleChangePasswordFirstTimeLogin)}>
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

          {errorMessage && (
            <span className='form__validation'>{errorMessage}</span>
          )}

          <div style={{ paddingTop: '25px' }}>
            <input className='btn save' type='submit' value='Save' />
            <div>{isLoading && <Spinner />}</div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
