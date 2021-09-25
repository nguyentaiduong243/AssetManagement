const ChangePasswordSuccess = ({ closePasswordChangeSuccessModal }) => {
  return (
    <div className='modal'>
      <div
        className='confirm-close-btn'
        onClick={closePasswordChangeSuccessModal}
      >
        <i className='fas fa-times'></i>
      </div>
      <div className='modal-body'>
        <h3>Change password</h3>
        <p style={{ paddingTop: '20px' }}>
          Your password has been changed successfully.
        </p>
      </div>
      <div className='modal-footer'>
        <div className='btn' onClick={closePasswordChangeSuccessModal}>
          Close
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordSuccess;
