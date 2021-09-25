import { format } from "date-fns";

function AssetDetailModal({ closeModal, asset, assetHistories }) {
  const handleState = (value) => {
    if (value === 0) return "Available";
    if (value === 1) return "Waiting For Approval";
    if (value === 2) return "Not Available";
    if (value === 3) return "Assigned";
    if (value === 4) return "Waiting For Recycling";
    if (value === 5) return "Recycled";
    return null;
  };

  const handleAssignState = (value) => {
    if (value === 0) return "Waiting For Approval";
    if (value === 1) return "Accepted";
    if (value === 2) return "Declined";
    if (value === 3) return "Waiting For Returning";
    if (value === 4) return "Returned";
    return null;
  };
  return (
    <>
      {assetHistories && (
        <div className="modal-wrapper">
          <div className="modal-close-btn" onClick={closeModal}>
            <i className="fas fa-times"></i>
          </div>
          <div className="modal-header">
            <span>Asset Details</span>
          </div>
          <div className="modal-body">
            <div className="body-row">
              <div className="row-title">Asset Code</div>
              <div className="row-value">{asset.assetCode}</div>
            </div>
            <div className="body-row">
              <div className="row-title">Asset Name</div>
              <div className="row-value">{asset.assetName}</div>
            </div>
            <div className="body-row">
              <div className="row-title">Category Name</div>
              <div className="row-value">{asset.categoryName}</div>
            </div>
            <div className="body-row">
              <div className="row-title">Specification</div>
              <div className="row-value row-value-specification">{asset.specification}</div>
            </div>
            <div className="body-row">
              <div className="row-title">Asset State</div>
              <div className="row-value">{handleState(asset.state)}</div>
            </div>
            <div className="body-row history-row">
              <div className="row-title history-title">Asset History</div>
              <div className="row-value0 history-value">
                <table>
                  <thead>
                    <tr>
                      <th width="10%">No.</th>
                      <th width="20%">Assign By</th>
                      <th width="20%">Assign To</th>
                      <th width="20%">Assign Date</th>
                      <th width="30%">Assign State</th>
                    </tr>
                  </thead>
                  <tbody className="asset-history-tbody">
                    {assetHistories.map((item, index) => (
                      <>
                        {item.assignBy ? (
                          <tr key={index}>
                            <td width="10%">{index + 1}</td>
                            <td width="20%">{item.assignBy}</td>
                            <td width="20%">{item.assignTo}</td>
                            <td width="20%">
                              {format(
                                new Date(item.assignDate || null),
                                "dd/MM/yyyy"
                              )}
                            </td>
                            <td width="30%">{handleAssignState(item.assignState)}</td>
                          </tr>
                        ) : (
                          <tr className="table-no-history">No History</tr>
                        )}
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AssetDetailModal;
