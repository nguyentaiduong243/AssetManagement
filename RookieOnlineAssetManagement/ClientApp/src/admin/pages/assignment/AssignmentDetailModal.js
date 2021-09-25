function AssignmentDetailModal({ closeModal, assignment }) {
  return (
    <div className='modal-wrapper'>
      <div className='modal-close-btn' onClick={closeModal}>
        <i className='fas fa-times'></i>
      </div>
      <div className='modal-header'>
        <span>Assignment Details</span>
      </div>
      <div className='modal-body'>
        <div className='body-row'>
          <div className='row-title'>Asset Code</div>
          <div className='row-value'>{assignment.assetCode}</div>
        </div>
        <div className='body-row'>
          <div className='row-title'>Asset Name</div>
          <div className='row-value'>{assignment.assetName}</div>
        </div>
        <div className='body-row'>
          <div className='row-title'>Assigned to</div>
          <div className='row-value'>{assignment.assignTo}</div>
        </div>
        <div className='body-row'>
          <div className='row-title'>Assigned by</div>
          <div className='row-value'>{assignment.assignBy}</div>
        </div>
        <div className='body-row'>
          <div className='row-title'>Assigned Date</div>
          <div className='row-value'>{assignment.assignDate.slice(0, 10)}</div>
        </div>
        <div className='body-row'>
          <div className='row-title'>State</div>
          <div className='row-value'>{assignment.state}</div>
        </div>
        <div className='body-row'>
          <div className='row-title'>Note</div>
          <div className='row-value row-value-note'>{assignment.note}</div>
        </div>
      </div>
    </div>
  );
}

export default AssignmentDetailModal;
