import { Switch, Route, useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Home from './admin/pages/Home/Home';
import User from './admin/pages/user/User';
import CreateUser from './admin/pages/user/CreateUser';
import EditUser from './admin/pages/user/EditUser';
import Asset from './admin/pages/asset/Asset';
import CreateAsset from './admin/pages/asset/CreateAsset';
import EditAsset from './admin/pages/asset/EditAsset';
import Assignment from './admin/pages/assignment/Assignment';
import CreateAssignment from './admin/pages/assignment/CreateAssignment';
import EditAssignment from './admin/pages/assignment/EditAssignment';
import RequestForReturning from './admin/pages/request/RequestForReturning';
import Report from './admin/pages/report/Report';
import Login from './login/Login';
import { ToastContainer } from 'react-toastify';
import UserHome from './user/pages/home/Home';
import 'react-datepicker/dist/react-datepicker.css';
import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/js/all.js';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const history = useHistory();

  const userLocalStorage = localStorage.getItem('userInfo');
  const userInfoObject = JSON.parse(userLocalStorage);

  // If a user is logged in, redirect that user to pages according to their role
  useEffect(() => {
    if (userLocalStorage) {
      if (userInfoObject.role === 'Admin') {
        setIsAdminLoggedIn(true);
      }
      if (userInfoObject.role === 'User') {
        setIsUserLoggedIn(true);
      }
    }
  }, [history, userInfoObject, userLocalStorage]);

  // If a user is not logged in, redirect that user to login page
  useEffect(() => {
    if (!userLocalStorage || userLocalStorage === null) {
      setIsUserLoggedIn(false);
      setIsAdminLoggedIn(false);
      history.push('/login');
    }
  }, [history, userLocalStorage]);

  return isAdminLoggedIn ? (
    <>
      <ToastContainer position='top-center' hideProgressBar />
      <Switch>
        <Route path='/admin' exact component={Home} />
        <Route path='/admin/users' exact component={User} />
        <Route path='/admin/users/create' component={CreateUser} />
        <Route path='/admin/users/edit/:id' component={EditUser} />
        <Route path='/admin/assets' exact component={Asset} />
        <Route path='/admin/assets/edit/:id' component={EditAsset} />
        <Route path='/admin/assets/create' component={CreateAsset} />
        <Route path='/admin/assignments' exact component={Assignment} />
        <Route path='/admin/assignments/create' component={CreateAssignment} />
        <Route path='/admin/assignments/:id/edit' component={EditAssignment} />
        <Route
          path='/admin/requests-for-returning'
          exact
          component={RequestForReturning}
        />
        <Route path='/admin/reports' exact component={Report} />
      </Switch>
    </>
  ) : isUserLoggedIn ? (
    <>
      <ToastContainer position='top-center' hideProgressBar />
      {/* Add Pages for normal users later */}
      <Switch>
        <Route path='/' exact component={UserHome} />
      </Switch>
    </>
  ) : (
    <Switch>
      <Route path='/login' exact component={Login} />
    </Switch>
  );
}

export default App;
