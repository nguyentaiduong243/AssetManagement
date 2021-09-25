function AssignmentDetailModal({ closeModal, request }) {
  const handleState = (value) => {
    if (value === 0) return "WaitingForReturning";
    if (value === 1) return "Completed";
    return null;
  };

  return (
    <div className='modal-wrapper'>
      <div className='modal-close-btn' onClick={closeModal}>
        <i className='fas fa-times'></i>
      </div>
      <div className='modal-header'>
        <span>Request Details</span>
      </div>
      <div className='modal-body'>
        <div className='body-row'>
          <div className='row-title'>Asset Code</div>
          <div className='row-value'>{request.assetCode}</div>
        </div>
        <div className='body-row'>
          <div className='row-title'>Asset Name</div>
          <div className='row-value'>{request.assetName}</div>
        </div>
        <div className='body-row'>
          <div className='row-title'>Requested By</div>
          <div className='row-value'>{request.requestBy}</div>
        </div>
        <div className='body-row'>
          <div className='row-title'>Accepted by</div>
          <div className='row-value'>{request.acceptedBy}</div>
        </div>
        <div className='body-row'>
          <div className='row-title'>Assigned Date</div>
          <div className='row-value'>{request.assignedDate?.slice(0, 10)}</div>
        </div>
        <div className='body-row'>
          <div className='row-title'>Returned Date</div>
          <div className='row-value'>{request.returnedDate?.slice(0, 10)}</div>
        </div>
        <div className='body-row'>
          <div className='row-title'>State</div>
          <div className='row-value'>{handleState(request.state)}</div>
        </div>
      </div>
    </div>
  );
}

export default AssignmentDetailModal;
