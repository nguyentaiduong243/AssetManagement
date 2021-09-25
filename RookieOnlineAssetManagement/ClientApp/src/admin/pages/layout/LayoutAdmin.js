import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { SidebarData } from './SidebarDataAdmin';
import ChangePassword from '../../../components/password-modals/ChangePassword';
import ChangePasswordFirstLogin from '../../../components/password-modals/ChangePasswordFirstLogin';
import ChangePasswordSuccess from '../../../components/password-modals/ChangePasswordSuccess';
import Modal from 'react-modal';
import axios from 'axios';
import './Navbar.css';

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

function LayoutAdmin({ children }) {
  const [sidebar, setSidebar] = useState(false);
  const [dropDown, setDropdown] = useState(false);

  const showSidebar = () => setSidebar(!sidebar);
  const showDropdown = () => setDropdown(!dropDown);
  const autoHideDropdown = () => {
    setTimeout(() => {
      setDropdown(false);
    }, 4000);
  };

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('isChangePasswordFirstTimeLoginSuccess');
    window.location.reload();
  };

  const userLocalStorage = localStorage.getItem('userInfo');
  const userInfoObject = JSON.parse(userLocalStorage);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [
    isPasswordChangeSuccessModalOpen,
    setIsPasswordChangeSuccessModalOpen,
  ] = useState(false);

  const openChangePasswordModal = () => setIsPasswordModalOpen(true);
  const closeChangePasswordModal = () => setIsPasswordModalOpen(false);
  const closePasswordChangeSuccessModal = () =>
    setIsPasswordChangeSuccessModalOpen(false);

  const handleChangePassword = async (data) => {
    setIsLoading(true);
    setIsError(false);

    const values = {
      userId: userInfoObject.userId,
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
    };

    try {
      // eslint-disable-next-line no-unused-vars
      const response = await axios.put('/api/users/ChangPassword', null, {
        params: values,
      });
      setIsLoading(false);
      setIsPasswordModalOpen(false);
      setIsPasswordChangeSuccessModalOpen(true);
    } catch (error) {
      setIsLoading(false);
      setIsError(true);
      setErrorMessage(error.response.data);
    }
  };

  // Start logic for changing password for users when they first login
  const [isPasswordFirstTimeLoginModalOpen, setIsPasswordFirstTimeModalOpen] =
    useState(false);
  const [
    isChangePasswordFirstTimeLoginSuccess,
    setIsChangePasswordFirstTimeLoginSuccess,
  ] = useState(
    localStorage.getItem('isChangePasswordFirstTimeLoginSuccess') || false
  );
  const firstTimeLogin = 1;

  useEffect(() => {
    if (userLocalStorage) {
      if (
        userInfoObject.countLogin === firstTimeLogin &&
        isChangePasswordFirstTimeLoginSuccess === false
      ) {
        setIsPasswordFirstTimeModalOpen(true);

        setIsChangePasswordFirstTimeLoginSuccess(
          isChangePasswordFirstTimeLoginSuccess
        );

        if (isPasswordChangeSuccessModalOpen === true) {
          setIsPasswordFirstTimeModalOpen(false);
          setIsChangePasswordFirstTimeLoginSuccess(true);
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChangePasswordFirstTimeLogin = async (data) => {
    setIsLoading(true);
    setIsError(false);

    const values = {
      userId: userInfoObject.userId,
      newPassword: data.newPassword,
    };

    try {
      // eslint-disable-next-line no-unused-vars
      const response = await axios.put(
        '/api/users/ChangPasswordFirstLogin',
        null,
        { params: values }
      );
      setIsLoading(false);
      setIsPasswordFirstTimeModalOpen(false);

      localStorage.setItem('isChangePasswordFirstTimeLoginSuccess', true);

      setIsPasswordChangeSuccessModalOpen(true);
    } catch (error) {
      setIsLoading(false);
      setIsError(true);
      setErrorMessage(error.response.data);
    }
  };
  // End logic for changing password for users when they first login

  return (
    <div className='container'>
      {/* Start Layout */}
      <nav className={sidebar ? 'nav active' : 'nav'}>
        {/* Render each item of the side bar */}
        <ul>
          <li key={'abc123'}>
            <Link className='link' exact to='/admin'>
              <span className='icon'>
                <i className='bx bxs-dashboard'></i>
              </span>
              <span className='title'>Asset Management</span>
            </Link>
          </li>
          {SidebarData.map((item, index) => {
            return (
              <li key={index}>
                <NavLink
                  className='link'
                  exact
                  to={item.path}
                  activeStyle={{
                    color: 'white',
                    backgroundColor: 'var(--secondary-color)',
                  }}
                >
                  <span className='icon'>
                    <i className={item.icon}></i>
                  </span>
                  <span className='title'>{item.title}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
      {/* End Layout */}

      <main className={sidebar ? 'main active' : 'main'}>
        <div className='topbar'>
          <div className='toggle' onClick={showSidebar}>
            <i className='bx bx-menu'></i>
          </div>

          <div className='dropdown'>
            <span className='dropdown-username'>{userInfoObject.userName}</span>
            <span style={{ paddingRight: '10px' }}>
              <i
                className='bx bxs-chevron-down'
                onClick={showDropdown}
                onMouseLeave={autoHideDropdown}
                style={{ fontSize: '23px' }}
              ></i>
            </span>
            <div
              className={
                dropDown ? 'dropdown-content show' : 'dropdown-content'
              }
            >
              <button className='dropbtn' onClick={openChangePasswordModal}>
                <i className='bx bxs-lock-alt icon-dropdown'></i>
                Change password
              </button>
              <NavLink to='/login' className='dropbtn' onClick={handleLogout}>
                <i className='bx bx-log-out-circle icon-dropdown'></i>
                Logout
              </NavLink>
            </div>
          </div>
        </div>

        {/* The rest of the page */}
        <div className='main__wrapper'>
          {children}

          {/* --- Modals --- */}
          {/* Change password */}
          <Modal isOpen={isPasswordModalOpen} style={customStyles}>
            <ChangePassword
              handleChangePassword={handleChangePassword}
              closeChangePasswordModal={closeChangePasswordModal}
              isLoading={isLoading}
              isError={isError}
              errorMessage={errorMessage}
            />
          </Modal>

          {/* Change password for users when they login for the first time */}
          <Modal
            isOpen={isPasswordFirstTimeLoginModalOpen}
            style={customStyles}
          >
            <ChangePasswordFirstLogin
              handleChangePasswordFirstTimeLogin={
                handleChangePasswordFirstTimeLogin
              }
              isLoading={isLoading}
              isError={isError}
              errorMessage={errorMessage}
            />
          </Modal>

          {/* If changing password is success, pop up a message to user */}
          <Modal isOpen={isPasswordChangeSuccessModalOpen} style={customStyles}>
            <ChangePasswordSuccess
              closePasswordChangeSuccessModal={closePasswordChangeSuccessModal}
            />
          </Modal>
        </div>
      </main>
    </div>
  );
}

export default LayoutAdmin;
