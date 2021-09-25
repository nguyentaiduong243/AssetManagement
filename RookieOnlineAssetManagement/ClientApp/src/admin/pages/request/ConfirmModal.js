function DeleteModal({ closeDeleteModal = () => {}, onRequest = () => {}, title }) {
  return (
    <div className='confirm-modal'>
      <div className='confirm-close-btn' onClick={closeDeleteModal}>
        <i className='fas fa-times'></i>
      </div>
      <div className='confirm-modal-body'>
        <div>{title}</div>
      </div>
      <div className='confirm-modal-footer'>
        <div className='confirm-btn cancel' onClick={closeDeleteModal}>
          No
        </div>
        <div className='confirm-btn delete' onClick={onRequest}>
          Yes
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;
