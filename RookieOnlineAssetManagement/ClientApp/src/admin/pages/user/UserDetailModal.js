function UserDetailModal({ closeModal, user }) {
  return (
    <div className='modal-wrapper'>
      <div className='modal-close-btn' onClick={closeModal}>
        <i className='fas fa-times'></i>
      </div>
      <div className='modal-header'>
        <span>User Details</span>
      </div>
      <div className='modal-body'>
        <div className='body-row'>
          <div className='row-title'>Staff Code</div>
          <div className='row-value'>{user.staffCode}</div>
        </div>
        <div className='body-row'>
          <div className='row-title'>Full Name</div>
          <div className='row-value'>{user.firstName + ' ' + user.lastName}</div>
        </div>
        <div className='body-row'>
          <div className='row-title'>Username</div>
          <div className='row-value'>{user.userName}</div>
        </div>
        <div className='body-row'>
          <div className='row-title'>Date of Birth</div>
          <div className='row-value'>{user.doB.slice(0, 10)}</div>
        </div>
        <div className='body-row'>
          <div className='row-title'>Gender</div>
          <div className='row-value'>{user.gender}</div>
        </div>
        <div className='body-row'>
          <div className='row-title'>Type</div>
          <div className='row-value'>{user.roles[0]}</div>
        </div>
        <div className='body-row'>
          <div className='row-title'>Location</div>
          <div className='row-value'>{user.location}</div>
        </div>
      </div>
    </div>
  );
}

export default UserDetailModal;
