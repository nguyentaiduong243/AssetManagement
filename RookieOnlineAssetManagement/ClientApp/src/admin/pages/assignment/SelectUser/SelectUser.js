import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Waypoint } from 'react-waypoint';
import queryString from 'query-string'

import SelectUserTable from './SelectUserTable';

function SelectUser({ onSelectUser, onSaveUserModal, onCancelUserModal }) {
  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    sortBy: null,
    asc: true,
    PageNumber: 1,
    PageSize: 10,
    keyword: null,
  })

  const typingTimoutRef = useRef(null)

  useEffect(() => {
    const paramString = queryString.stringify(filters)
      axios
        .get(`api/Users?${paramString}`)
        .then((res) => {
          setTotalPages(res.data.totalPages);
          setUsers((prevState) => {
            return [...prevState, ...res.data.data];
          });
        })
        .catch((err) => {
          console.log(err);
        });
  }, [filters]);

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
    setUsers([]);
    setFilters((prev) => {
      if (prev.sortBy === sortBy) {
        return {
          ...prev,
          asc: !prev.asc,
          PageNumber: 1
        };
      } else {
        return {
          ...prev,
          sortBy: sortBy,
          asc: true,
          PageNumber: 1
        };
      }
    });
  };

  const handleSearchChange = (value) => {
    if (typingTimoutRef.current) {
      clearTimeout(typingTimoutRef.current);
    }

    typingTimoutRef.current = setTimeout(() => {
      setUsers([])
      setFilters({
        ...filters,
        keyword: value,
        pageNumber: 1,
      });
    }, 500);
  };

  const columns = React.useMemo(
    () => [
      {
        Header: ' ',
        Cell: (d) => (
          <>
            <Waypoint
              onEnter={() => {
                if (
                  users.length - 1 === Number(d.row.id) &&
                  filters.PageNumber < totalPages
                ) {
                  setFilters(prev => {
                    return {
                      ...prev,
                      PageNumber: prev.PageNumber + 1
                    }
                  });
                }
              }}
            />
            <input type='radio' name='selectUser' id={d.row.id} />
          </>
        ),
      },
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
        id: 'roles',
        Header: () => {
          return (
            <div className='table-header' onClick={() => handleSortBy('roles')}>
              <span>Type</span>
              {handleSortIcon('roles')}
            </div>
          );
        },
        accessor: (d) => <div>{d.roles[0]}</div>,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [users]
  );
  return (
    <SelectUserTable
      columns={columns}
      data={users}
      onSelectUser={onSelectUser}
      onSaveUserModal={onSaveUserModal}
      onCancelUserModal={onCancelUserModal}
      onSearchChange={handleSearchChange}
    />
  );
}

export default SelectUser;
