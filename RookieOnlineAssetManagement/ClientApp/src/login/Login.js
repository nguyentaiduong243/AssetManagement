import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const userLocalStorage = localStorage.getItem('userInfo');
  const userInfoObject = JSON.parse(userLocalStorage);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onLogin = async (data) => {
    setIsLoading(true);
    setIsError(false);
    try {
      const response = await axios.post('api/users/login', {
        username: data.username,
        password: data.password,
      });
      const result = await response.data;
      setIsLoading(false);

      // get userInfo from response and put it into localStorage
      localStorage.setItem('userInfo', JSON.stringify(result));
    } catch (error) {
      setIsLoading(false);
      setIsError(true);
    }
  };

  // Redirect users to different URL according to their roles
  useEffect(() => {
    if (userLocalStorage) {
      if (userInfoObject.role === 'Admin') {
        history.push('/admin');
        window.location.reload();
      } else if (userInfoObject.role === 'User') {
        history.push('/');
        window.location.reload();
      } else {
        history.push('/login');
        window.location.reload();
      }
    }
  }, [history, userInfoObject, userLocalStorage]);

  return (
    <div>
      <div className='wrapper-form'>
        <form className='form__login' onSubmit={handleSubmit(onLogin)}>
          <h2 className='form__title'>Login</h2>

          <div className='form__field'>
            <label htmlFor='username'>Username</label>
            <input
              className='input'
              {...register('username', { required: true })}
            />
          </div>
          {errors.username && (
            <span className='form__validation'>This field is required</span>
          )}

          <div className='form__field'>
            <label htmlFor='password'>Password</label>
            <input
              className='input'
              {...register('password', { required: true })}
              type='password'
            />
          </div>
          {errors.password && (
            <span className='form__validation'>This field is required</span>
          )}

          <input className='btn' type='submit' value='Login' />
        </form>
      </div>

      {isError && (
        <span
          className='form__validation'
          style={{ position: 'absolute', top: '80%', right: '40%' }}
        >
          Username or password is incorrect. Please try again.
        </span>
      )}

      {isLoading && (
        <span
          className='spinner'
          style={{ position: 'absolute', top: '500px' }}
        >
          <i className='fas fa-spinner fa-spin'></i>
        </span>
      )}
    </div>
  );
}

export default Login;

// const onLogin = (data) => {
//   api
//     .post('/users/login', {
//       username: data.username,
//       password: data.password,
//     })
//     .then((response) => {
//       if (!response.data) {
//         setIsLoggedIn(false);
//       }
//       localStorage.setItem('userInfo', JSON.stringify(response.data));

//       if (response.ok) {
//       }
//       setIsLoggedIn(true);
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// };
