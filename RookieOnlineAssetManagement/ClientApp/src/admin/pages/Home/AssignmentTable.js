import { useTable, usePagination } from 'react-table';
import React, { useMemo } from 'react';
import { format } from 'date-fns';

const AssignmentsTable = ({
  data = [],
  loading,
  filters,
  onClickAssignment = () => {},
  onSortBy = () => {},
  onSortIcon = () => {},
  onAcceptAssignment = () => {},
  onDeclineAssignment = () => {},
  onClickReturnRequest = () => {},
}) => {
  const handleState = (value) => {
    if (value === 0) return 'Waiting For Acceptance';
    if (value === 1) return 'Accepted';
    if (value === 2) return 'Declined';
    if (value === 3) return 'Waiting For Returning';
    if (value === 4) return 'Returned';
    return null;
  };

  const columns = useMemo(
    () => [
      {
        Header: 'Id',
        accessor: 'assignmentId',
      },
      {
        Header: () => {
          return (
            <div className='table-header' onClick={() => onSortBy('assetCode')}>
              <span>Asset Code</span>
              {onSortIcon('assetCode')}
            </div>
          );
        },
        accessor: 'assetCode',
      },
      {
        Header: () => {
          return (
            <div className='table-header' onClick={() => onSortBy('assetName')}>
              <span>Asset Name</span>
              {onSortIcon('assetName')}
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
              onClick={() => onSortBy('assignedBy')}
            >
              <span>Assign by</span>
              {onSortIcon('assignedBy')}
            </div>
          );
        },
        accessor: 'assignedBy',
      },
      {
        Header: () => {
          return (
            <div
              className='table-header'
              onClick={() => onSortBy('assignedDate')}
            >
              <span>Assigned Date</span>
              {onSortIcon('assignedDate')}
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
        id: 'state',
        Header: () => {
          return (
            <div className='table-header' onClick={() => onSortBy('state')}>
              <span>State</span>
              {onSortIcon('state')}
            </div>
          );
        },
        accessor: (d) => <div>{handleState(d.state)}</div>,
      },
      {
        Header: 'Actions',
        accessor: 'actions',
        Cell: ({ row }) => {
          const rowIdx = row;
          return (
            <div id='actions' style={{ display: 'flex' }}>
              {row.original.state === 0 ? (
                <>
                  <span
                    className='font'
                    onClick={() => onAcceptAssignment(rowIdx)}
                  >
                    <i className='fas fa-check'></i>
                  </span>
                  &emsp;
                  <span
                    className='font'
                    onClick={() => onDeclineAssignment(rowIdx)}
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
              &emsp;
              {row.original.state === 1 ? (
                <span
                  className='font undo-icon'
                  onClick={() => onClickReturnRequest(rowIdx)}
                >
                  <i className='fas fa-undo'></i>
                </span>
              ) : (
                <span
                  className='font undo-icon'
                  style={{ color: 'rgba(0, 0, 0, 0.2)' }}
                >
                  <i className='fas fa-undo'></i>
                </span>
              )}
            </div>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filters]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data }, usePagination);

  return (
    <div>
      <div className='table__view'>
        <h2>My Assignment</h2>
        <div>
          <table {...getTableProps()}>
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th {...column.getHeaderProps()}>
                      {column.render('Header')}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            {loading ? (
              <div className='spinner'>
                <i className='fas fa-spinner fa-spin'></i>
              </div>
            ) : (
              <tbody {...getTableBodyProps()}>
                {rows.map((row, index) => {
                  prepareRow(row);
                  return (
                    <tr
                      id='tr-hover'
                      {...row.getRowProps()}
                      onClick={(e) => {
                        if (!e.target.closest('#actions')) {
                          onClickAssignment(row.original);
                        }
                      }}
                    >
                      {row.cells.map((cell) => {
                        return (
                          <td id={cell.column.Header} {...cell.getCellProps()}>
                            {cell.render('Cell')}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            )}
          </table>
        </div>
      </div>
    </div>
  );
};

export default AssignmentsTable;
