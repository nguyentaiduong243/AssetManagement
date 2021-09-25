import axios from 'axios';
import Modal from 'react-modal';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';
import { useEffect, useRef, useState, useMemo } from 'react';
import queryString from 'query-string';

import RequestTable from './RequestTable';
import LayoutAdmin from '../layout/LayoutAdmin';
import ConfirmModal from './ConfirmModal';
import RequestDetailModal from './RequestDetailModal';
import { modalCustomStyle } from '../ModalCustomStyles';

Modal.setAppElement('#root');

const userInfoJSON = window.localStorage.getItem('userInfo');
const userInfo = window.JSON.parse(userInfoJSON);

function Assignment() {
  const [requests, setRequests] = useState([]);
  const [request, setRequest] = useState();
  const [loading, setLoading] = useState(false);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [confirmCompleteModal, setConfirmCompleteModal] = useState(false);
  const [confirmCancelModal, setConfirmCancelModal] = useState(false);
  const [returnedDate, setReturnedDate] = useState();
  const [pagination, setPaginaion] = useState({
    totalPages: 1,
    pageNumber: 1,
  });
  const [filters, setFilters] = useState({
    PageNumber: 1,
    returnedDate: null,
    state: null,
    PageSize: 10,
    keyword: null,
    sortBy: null,
    asc: true,
  });

  const requestsRef = useRef([]);
  const requestIdRef = useRef(null);
  const typingTimoutRef = useRef(null);

  const callAssignmentsAPI = async () => {
    const paramString = queryString.stringify(filters);
    axios
      .get(`api/Returns?${paramString}`)
      .then((res) => {
        requestsRef.current = res.data.data;
        setRequests(res.data.data);
        setPaginaion({
          totalPages: res.data.totalPages,
          pageNumber: res.data.pageNumber,
        });
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    setLoading(true);
    callAssignmentsAPI();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const getCurrentId = (rowIndex) => {
    const id = requestsRef.current[Number(rowIndex)].returnId;
    return id;
  };

  const handleClickTickBtn = (rowIndex) => {
    const id = getCurrentId(rowIndex);
    if (id) {
      requestIdRef.current = id;
    }
    setConfirmCompleteModal(true);
  };

  const handleClickCancelBtn = (rowIndex) => {
    const id = getCurrentId(rowIndex);
    if (id) {
      requestIdRef.current = id;
    }
    setConfirmCancelModal(true);
  };

  const handlePageClick = (data) => {
    const currentPage = data.selected;
    setFilters({
      ...filters,
      PageNumber: currentPage + 1,
    });
  };

  const handleSortIcon = (sortBy) => {
    if (filters.sortBy === sortBy) {
      if (filters.asc) {
        return <i className='fas fa-caret-down'></i>;
      }
      return <i className='fas fa-caret-up'></i>;
    }
    return <i className='fas fa-caret-down'></i>;
  };

  const handleSortBy = (sortBy) => {
    setPaginaion({
      totalPages: 0,
      pageNumber: 1,
    });
    setFilters((prev) => {
      if (prev.sortBy === sortBy) {
        return {
          ...prev,
          asc: !prev.asc,
          PageNumber: 1,
        };
      }
      return {
        ...prev,
        sortBy: sortBy,
        asc: true,
        PageNumber: 1,
      };
    });
  };

  const handleSearchChange = (value) => {
    if (typingTimoutRef.current) {
      clearTimeout(typingTimoutRef.current);
    }

    typingTimoutRef.current = setTimeout(() => {
      setPaginaion({
        pageNumber: 1,
        totalPages: 0,
      });
      setFilters({
        ...filters,
        keyword: value,
        PageNumber: 1,
      });
    }, 500);
  };

  const handleFilterReturnedDate = (value) => {
    setPaginaion({
      totalPages: 0,
    });

    if (!value) {
      setReturnedDate(null);
      setFilters({
        ...filters,
        PageNumber: 1,
        returnedDate: null,
      });
    } else {
      const date = format(new Date(value), 'dd/MM/yyyy');
      setReturnedDate(value);
      setFilters({
        ...filters,
        PageNumber: 1,
        returnedDate: date,
      });
    }
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleOnClickAssignment = (value) => {
    setRequest(value);
    openModal();
  };

  const handleSelectState = (event) => {
    setPaginaion({
      totalPages: 0,
    });
    if (!event) {
      event = {
        target: '',
        value: null,
      };
    }
    setFilters({
      ...filters,
      state: event.value,
      PageNumber: 1,
    });
  };

  const handleCompleteRequest = () => {
    axios
      .put(
        `/api/Returns/${requestIdRef.current}/Completed?acceptedByUserId=${userInfo.userId}`
      )
      .then((res) => {
        callAssignmentsAPI();
        setConfirmCompleteModal(false);
        toast.success('Completed Request for Returning Successfully');
      })
      .catch((err) => {
        setConfirmCompleteModal(false);
        toast('Completed Request for Returning Failed');
        console.log(err);
      });
  };

  const handleCancelRequest = () => {
    axios
      .put(
        `/api/Returns/${requestIdRef.current}/Declined?acceptedByUserId=${userInfo.userId}`
      )
      .then((res) => {
        callAssignmentsAPI();
        setConfirmCancelModal(false);
        toast.success('Cancel Request for Returning Successfully');
      })
      .catch((err) => {
        setConfirmCancelModal(false);
        toast('Cancel Request for Returning Failed');
        console.log(err);
      });
  };

  const handleState = (value) => {
    if (value === 0) return 'WaitingForReturning';
    if (value === 1) return 'Completed';
    if (value === 2) return 'Declined';
    return null;
  };

  const columns = useMemo(
    () => [
      {
        Header: 'No.',
        Cell: ({ row }) => {
          return <div>{row.index + 1 + (pagination.pageNumber - 1) * 10}</div>;
        },
      },
      {
        Header: () => {
          return (
            <div
              className='table-header'
              onClick={() => handleSortBy('assetCode')}
            >
              <span>Asset Code</span>
              {handleSortIcon('assetCode')}
            </div>
          );
        },
        accessor: 'assetCode',
      },
      {
        Header: () => {
          return (
            <div
              className='table-header'
              onClick={() => handleSortBy('assetName')}
            >
              <span>Asset Name</span>
              {handleSortIcon('assetName')}
            </div>
          );
        },
        accessor: 'assetName',
      },
      {
        Header: () => {
          return (
            <div
              className='table-header'
              onClick={() => handleSortBy('requestedBy')}
            >
              <span>Requested By</span>
              {handleSortIcon('requestedBy')}
            </div>
          );
        },
        accessor: 'requestBy',
      },
      {
        Header: () => {
          return (
            <div
              className='table-header'
              onClick={() => handleSortBy('assignedDate')}
            >
              <span>Assigned Date</span>
              {handleSortIcon('assignedDate')}
            </div>
          );
        },
        accessor: 'assignedDate',
        Cell: ({ value }) => {
          if (!value) return null;
          return format(new Date(value), 'dd/MM/yyyy');
        },
      },
      {
        Header: () => {
          return (
            <div
              className='table-header'
              onClick={() => handleSortBy('acceptedBy')}
            >
              <span>Accepted by</span>
              {handleSortIcon('acceptedBy')}
            </div>
          );
        },
        accessor: 'acceptedBy',
      },
      {
        Header: () => {
          return (
            <div
              className='table-header'
              onClick={() => handleSortBy('returnedDate')}
            >
              <span>Returned Date</span>
              {handleSortIcon('returnedDate')}
            </div>
          );
        },
        accessor: 'returnedDate',
        Cell: ({ value }) => {
          if (!value) return null;
          return format(new Date(value), 'dd/MM/yyyy');
        },
      },
      {
        id: 'state',
        Header: () => {
          return (
            <div className='table-header' onClick={() => handleSortBy('state')}>
              <span>State</span>
              {handleSortIcon('state')}
            </div>
          );
        },
        accessor: (d) => <div>{handleState(d.state)}</div>,
      },
      {
        Header: 'Actions',
        accessor: 'actions',
        Cell: ({ row }) => {
          const rowIdx = row.id;

          return (
            <div id='actions' style={{ display: 'flex' }}>
              {row.original.state === 0 ? (
                <>
                  <span
                    className='font'
                    onClick={() => handleClickTickBtn(rowIdx)}
                  >
                    <i className='fas fa-check'></i>
                  </span>
                  &emsp;
                  <span
                    className='font'
                    onClick={() => handleClickCancelBtn(rowIdx)}
                  >
                    <i className='fas fa-times '></i>
                  </span>
                </>
              ) : (
                <>
                  <span
                    className='font'
                    style={{ color: 'rgba(0, 0, 0, 0.2)' }}
                  >
                    <i className='fas fa-check'></i>
                  </span>
                  &emsp;
                  <span
                    className='font'
                    style={{ color: 'rgba(0, 0, 0, 0.2)' }}
                  >
                    <i className='fas fa-times '></i>
                  </span>
                </>
              )}
            </div>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filters, pagination]
  );

  return (
    <LayoutAdmin>
      <RequestTable
        columns={columns}
        data={requests}
        loading={loading}
        filterReturnedDate={returnedDate}
        onSearch={handleSearchChange}
        onClickRequest={handleOnClickAssignment}
        onFilterReturnedDate={handleFilterReturnedDate}
        onSelectStateOption={handleSelectState}
      />
      <div className='paging-box'>
        {pagination.totalPages > 0 && (
          <ReactPaginate
            previousLabel={'Previous'}
            nextLabel={'Next'}
            breakLabel={'...'}
            breakClassName={'break-me'}
            pageCount={pagination.totalPages}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            containerClassName={'pagination'}
            activeClassName={'active'}
          />
        )}
      </div>
      {request && (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={modalCustomStyle}
        >
          <RequestDetailModal closeModal={closeModal} request={request} />
        </Modal>
      )}
      <Modal isOpen={confirmCompleteModal} style={modalCustomStyle}>
        <ConfirmModal
          closeDeleteModal={() => setConfirmCompleteModal(false)}
          onRequest={handleCompleteRequest}
          title="Do you want to mark this returning request as 'Completed' "
        />
      </Modal>

      <Modal isOpen={confirmCancelModal} style={modalCustomStyle}>
        <ConfirmModal
          closeDeleteModal={() => setConfirmCancelModal(false)}
          onRequest={handleCancelRequest}
          title='Do you want to cancel this returning request'
        />
      </Modal>
    </LayoutAdmin>
  );
}

export default Assignment;
