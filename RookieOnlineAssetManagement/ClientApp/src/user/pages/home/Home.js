import axios from 'axios';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';
import { useEffect, useRef, useState } from 'react';
import queryString from 'query-string';
import AssignmentTable from './AssignmentTable';
import LayoutUser from '../layout/LayoutUser';
import ConfirmModal from './ConfirmModal';
import AssignmentDetailModal from './AssignmentDetailModal';
import { modalCustomStyle } from '../../../admin/pages/ModalCustomStyles';
// import "../Assignment./Assignment.css";

Modal.setAppElement('#root');

const userInfoJSON = window.localStorage.getItem('userInfo');
const userInfo = window.JSON.parse(userInfoJSON);

function Assignment() {
  const [assignments, setAssignments] = useState([]);
  const [assignment, setAssignment] = useState();
  const [loading, setLoading] = useState(false);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [confirmAcceptModal, setConfirmAcceptModal] = useState(false);
  const [confirmDeclineModal, setConfirmDeclineModal] = useState(false);
  const [confirmReturnModal, setConfirmReturnModal] = useState(false);
  const [pagination, setPaginaion] = useState({
    totalPages: 0,
    pageNumber: 1,
  });
  const [filters, setFilters] = useState({
    PageNumber: 1,
    PageSize: 10,
    sortBy: null,
    asc: true,
  });

  const assignmentIdRef = useRef(null);

  const callAssignmentsAPI = () => {
    const paramString = queryString.stringify(filters);
    axios
      .get(`api/Assignments/ForUser/${userInfo.userId}?${paramString}`)
      .then((res) => {
        setAssignments(res.data.data);
        setPaginaion({
          totalPages: res.data.totalPages,
          pageNumber: res.data.pageNumber,
        });
        setLoading(false);
        console.log(res.data.data);
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

  const handleAcceptAssignment = (value) => {
    axios
      .put(`api/Assignments/${assignmentIdRef.current}/UserAcceptAssignment`)
      .then((res) => {
        callAssignmentsAPI();
        setConfirmAcceptModal(false);
        toast.success('Accept Successfully');
      })
      .catch((err) => {
        setConfirmAcceptModal(false);
        toast.error('Accept Failed, please contact to admin');
      });
  };

  const handleCreateReturnRequest = () => {
    axios
      .post('api/Returns', {
        requestedByUserId: userInfo.userId,
        assignmentId: assignmentIdRef.current,
      })
      .then((res) => {
        callAssignmentsAPI();
        setConfirmReturnModal(false);
        toast.success('Create Request for Returning Successfully');
      })
      .catch((err) => {
        setConfirmReturnModal(false);
        if (err.response.status === 400) {
          toast.error('Create Fail');
        }
      });
  };

  const handleClickReturnRequest = (value) => {
    const assignmentId = value.original.assignmentId;
    if (assignmentId) {
      assignmentIdRef.current = assignmentId;
    }
    setConfirmReturnModal(true);
  };

  const handleClickDeclineBtn = (value) => {
    const assignmentId = value.original.assignmentId;
    if (assignmentId) {
      assignmentIdRef.current = assignmentId;
    }
    setConfirmDeclineModal(true);
  };

  const handleClickAcceptBtn = (value) => {
    const assignmentId = value.original.assignmentId;
    if (assignmentId) {
      assignmentIdRef.current = assignmentId;
    }
    setConfirmAcceptModal(true);
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

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleOnClickAssignment = async (value) => {
    await axios
      .get(`api/Assignments/${value.assignmentId}`)
      .then((res) => {
        setAssignment(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    openModal();
  };

  const handleDeclineAssignment = () => {
    axios
      .put(`api/Assignments/${assignmentIdRef.current}/UserDeclineAssignment`)
      .then((res) => {
        callAssignmentsAPI();
        setConfirmDeclineModal(false);
        toast.success('Decline Successfully');
      })
      .catch((err) => {
        setConfirmDeclineModal(false);
        toast.error('Decline Failed, please contact to admin');
      });
  };

  return (
    <LayoutUser>
      <AssignmentTable
        // columns={columns}
        data={assignments}
        loading={loading}
        filters={filters}
        onClickAssignment={handleOnClickAssignment}
        onSortBy={handleSortBy}
        onSortIcon={handleSortIcon}
        onAcceptAssignment={handleClickAcceptBtn}
        onDeclineAssignment={handleClickDeclineBtn}
        onClickReturnRequest={handleClickReturnRequest}
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
      {assignment && (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={modalCustomStyle}
        >
          <AssignmentDetailModal
            closeModal={closeModal}
            assignment={assignment}
          />
        </Modal>
      )}
      <Modal isOpen={confirmDeclineModal} style={modalCustomStyle}>
        <ConfirmModal
          closeModal={() => setConfirmDeclineModal(false)}
          handleFunction={handleDeclineAssignment}
          title='Are you sure decline this assignment?'
          acceptBtn='Yes'
          cancelBtn='No'
        />
      </Modal>

      <Modal isOpen={confirmAcceptModal} style={modalCustomStyle}>
        <ConfirmModal
          closeModal={() => setConfirmAcceptModal(false)}
          handleFunction={handleAcceptAssignment}
          title='Do you want to accept this assignment?'
          acceptBtn='Yes'
          cancelBtn='No'
        />
      </Modal>

      <Modal isOpen={confirmReturnModal} style={modalCustomStyle}>
        <ConfirmModal
          closeModal={() => setConfirmReturnModal(false)}
          handleFunction={handleCreateReturnRequest}
          title='Do you want to create a returning request for this asset?'
          acceptBtn='Yes'
          cancelBtn='No'
        />
      </Modal>
    </LayoutUser>
  );
}

export default Assignment;
