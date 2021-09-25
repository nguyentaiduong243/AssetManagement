import { useEffect, useState, useRef, useMemo } from 'react';
import LayoutAdmin from '../layout/LayoutAdmin';
import UsersTable from './UsersTable';
import { useHistory } from 'react-router-dom';
import { format } from 'date-fns';
import { useCreateUser } from './UserHooks';
import { toast } from 'react-toastify';
import Modal from 'react-modal';
import queryString from 'query-string';
import ReactPaginate from 'react-paginate';
import UserDetailModal from './UserDetailModal';
import { modalCustomStyle } from '../ModalCustomStyles';
import DeleteModal from './DeleteModal';

const userInfoJSON = window.localStorage.getItem('userInfo');
const userInfo = window.JSON.parse(userInfoJSON);

const User = () => {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [changes, setChanges] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState({
    PageNumber: 1,
    PageSize: 10,
    filterUser: null,
    keyword: null,
    sortBy: null,
    asc: true,
    location: userInfo.location,
  });

  const usersRef = useRef(null);
  const userIdRef = useRef(null);
  const typingTimoutRef = useRef(null);
  const history = useHistory();

  const getusers = () => {
    setLoading(true);

    const paramString = queryString.stringify(filters);
    useCreateUser
      .getall(paramString)
      .then((res) => {
        usersRef.current = res.data.data;
        setUsers(res.data.data);
        setTotalPages(res.data.totalPages);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };

  useEffect(getusers, [changes, filters]);

  const getUserId = (rowIndex) => {
    if (!usersRef.current) return;
    const id = usersRef.current[rowIndex].id;
    if (id) {
      history.push(`/admin/users/edit/${id}`);
    }
  };

  const handlePageClick = (data) => {
    const currentPage = data.selected;
    setFilters({
      ...filters,
      PageNumber: currentPage + 1,
    });
  };

  const handleSortBy = (sortBy) => {
    setTotalPages(0);
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

  const handleSortIcon = (sortBy) => {
    if (filters.sortBy === sortBy) {
      if (filters.asc) {
        return <i className='fas fa-caret-down'></i>;
      }
      return <i className='fas fa-caret-up'></i>;
    }
    return <i className='fas fa-caret-down'></i>;
  };

  const handleSearchChange = (value) => {
    if (typingTimoutRef.current) {
      clearTimeout(typingTimoutRef.current);
    }

    typingTimoutRef.current = setTimeout(() => {
      setTotalPages(0);
      setFilters({
        ...filters,
        keyword: value,
        PageNumber: 1,
      });
    }, 500);
  };

  const handleSelectType = (event) => {
    setTotalPages(0);
    if (!event) {
      event = {
        target: '',
        value: null,
      };
    }
    setFilters({
      ...filters,
      filterUser: event.value,
      PageNumber: 1,
    });
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const closeDeleteModal = () => {
    setDeleteModal(false);
  };

  const handleShowUserDetail = (value) => {
    setUser(value);
    openModal();
  };

  const handleClickDisableUserBtn = (rowIndex) => {
    if (!usersRef.current) return;
    const id = usersRef.current[rowIndex].id;
    if (id) {
      userIdRef.current = id;
    }
    setDeleteModal(true);
  };

  const handleDisableUser = () => {
    useCreateUser
      .disable(userIdRef.current)
      .then((res) => {
        setChanges((prev) => {
          const current = !prev;
          return current;
        });
        setDeleteModal(false);
        if (res.status === 200) {
          toast.success('Disable user successfully');
        }
      })
      .catch((error) => {
        setDeleteModal(false);
        if (error.response.status === 400) {
          toast.error('Cannot Disable User');
        }
      });
  };

  const columns = useMemo(
    () => [
      {
        Header: () => {
          return (
            <div
              className='table-header'
              onClick={() => handleSortBy('staffCode')}
            >
              <span>Staff Code</span>
              {handleSortIcon('staffCode')}
            </div>
          );
        },
        accessor: 'staffCode',
      },
      {
        id: 'firstName',
        Header: () => {
          return (
            <div
              className='table-header'
              onClick={() => handleSortBy('firstName')}
            >
              <span>Full Name</span>
              {handleSortIcon('firstName')}
            </div>
          );
        },
        accessor: (d) => <div>{d.firstName + ' ' + d.lastName}</div>,
      },
      {
        Header: () => {
          return (
            <div
              className='table-header'
              onClick={() => handleSortBy('userName')}
            >
              <span>Username</span>
              {handleSortIcon('userName')}
            </div>
          );
        },
        accessor: 'userName',
      },
      {
        Header: () => {
          return (
            <div
              className='table-header'
              onClick={() => handleSortBy('joinedDate')}
            >
              <span>Joined Date</span>
              {handleSortIcon('joinedDate')}
            </div>
          );
        },
        accessor: 'joinedDate',
        Cell: ({ value }) => {
          return format(new Date(value), 'dd/MM/yyyy');
        },
      },
      {
        Header: () => {
          return (
            <div className='table-header' onClick={() => handleSortBy('roles')}>
              <span>Type</span>
              {handleSortIcon('roles')}
            </div>
          );
        },
        accessor: 'roles',
      },
      {
        Header: 'Actions',
        accessor: 'actions',
        Cell: (props) => {
          const rowIdx = props.row.id;

          return (
            <div id='actions' style={{ display: 'flex' }}>
              <span className='font' onClick={() => getUserId(rowIdx)}>
                <i className='bx bx-edit'></i>
              </span>
              &emsp;
              <span
                className='font'
                onClick={() => handleClickDisableUserBtn(rowIdx)}
              >
                <i className='fas fa-times'></i>
              </span>
            </div>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filters]
  );

  return (
    <>
      <LayoutAdmin>
        <UsersTable
          columns={columns}
          data={users}
          loading={loading}
          onSearchChange={handleSearchChange}
          onSelectType={handleSelectType}
          onShowUserDetail={handleShowUserDetail}
        />
        <div className='paging-box'>
          {totalPages > 0 && (
            <ReactPaginate
              previousLabel={'Previous'}
              nextLabel={'Next'}
              breakLabel={'...'}
              breakClassName={'break-me'}
              pageCount={totalPages || 1}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePageClick}
              containerClassName={'pagination'}
              activeClassName={'active'}
            />
          )}
        </div>
      </LayoutAdmin>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={modalCustomStyle}
      >
        <UserDetailModal user={user} closeModal={closeModal} />
      </Modal>

      <Modal isOpen={deleteModal} style={modalCustomStyle}>
        <DeleteModal
          closeDeleteModal={closeDeleteModal}
          onDisableUser={handleDisableUser}
          title='Do you want to disable this user?'
        />
      </Modal>
    </>
  );
};

export default User;
