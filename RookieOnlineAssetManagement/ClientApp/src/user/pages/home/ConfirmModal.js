function ConfirmModal({ closeModal = () => {}, handleFunction = () => {}, title, acceptBtn, cancelBtn }) {
  return (
    <div className='confirm-modal'>
      <div className='confirm-close-btn' onClick={closeModal}>
        <i className='fas fa-times'></i>
      </div>
      <div className='confirm-modal-body'>
        <div>{title}</div>
      </div>
      <div className='confirm-modal-footer'>
        <div className='confirm-btn cancel' onClick={closeModal}>
          {cancelBtn}
        </div>
        <div className='confirm-btn delete' onClick={handleFunction}>
          {acceptBtn}
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
