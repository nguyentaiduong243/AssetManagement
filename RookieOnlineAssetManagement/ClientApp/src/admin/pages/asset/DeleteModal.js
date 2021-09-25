function DeleteModal({ closeDeleteModal, onDeleteAsset = () => {}, title }) {
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
          Cancel
        </div>
        <div className='confirm-btn delete' onClick={onDeleteAsset}>
          Delete
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;
