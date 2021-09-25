import { useEffect, useMemo, useState } from 'react';
import LayoutAdmin from '../layout/LayoutAdmin';
import { getApiReport } from './reportApi';
import ReportTable from './ReportTable';
import queryString from 'query-string';

function Report() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    sortBy: null,
    asc: true,
  });
  const fileName = 'Report File';

  const getreports = () => {
    setLoading(true);
    const paramString = queryString.stringify(filters);
    getApiReport
      .getReports(paramString)
      .then((res) => {
        setReports(res.data);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };

  useEffect(getreports, [filters]);

  const handleSortBy = (sortBy) => {
    setFilters((prev) => {
      if (prev.sortBy === sortBy) {
        return {
          ...prev,
          asc: !prev.asc,
        };
      }
      return {
        ...prev,
        sortBy: sortBy,
        asc: true,
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

  
  const columns = useMemo(
    () => [
      {
        Header: () => {
          return (
            <div
              className='table-header'
              onClick={() => handleSortBy('category')}
            >
              <span>Category</span>
              {handleSortIcon('category')}
            </div>
          );
        },
        accessor: 'categoryName',
      },
      {
        Header: () => {
          return (
            <div className='table-header' onClick={() => handleSortBy('total')}>
              <span>Total</span>
              {handleSortIcon('total')}
            </div>
          );
        },
        accessor: 'total',
      },
      {
        Header: () => {
          return (
            <div
              className='table-header'
              onClick={() => handleSortBy('assgined')}
            >
              <span>Assgined</span>
              {handleSortIcon('assgined')}
            </div>
          );
        },
        accessor: 'assgined',
      },
      {
        Header: () => {
          return (
            <div
              className='table-header'
              onClick={() => handleSortBy('available')}
            >
              <span>Available</span>
              {handleSortIcon('available')}
            </div>
          );
        },
        accessor: 'available',
      },
      {
        Header: () => {
          return (
            <div
              className='table-header'
              onClick={() => handleSortBy('notAvailable')}
            >
              <span>Not Available</span>
              {handleSortIcon('notAvailable')}
            </div>
          );
        },
        accessor: 'notAvailable',
      },
      {
        Header: () => {
          return (
            <div
              className='table-header'
              onClick={() => handleSortBy('waitingForApproval')}
            >
              <span>Waiting For Approval</span>
              {handleSortIcon('waitingForApproval')}
            </div>
          );
        },
        accessor: 'waitingForApproval',
      },
      {
        Header: () => {
          return (
            <div
              className='table-header'
              onClick={() => handleSortBy('waitingForRecycling')}
            >
              <span>Waiting For Recycling</span>
              {handleSortIcon('waitingForRecycling')}
            </div>
          );
        },
        accessor: 'waitingForRecycling',
      },
      {
        Header: () => {
          return (
            <div
              className='table-header'
              onClick={() => handleSortBy('recycled')}
            >
              <span>Recycled</span>
              {handleSortIcon('recycled')}
            </div>
          );
        },
        accessor: 'recycled',
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filters]
  );

  return (
    <LayoutAdmin>
      <div className='table__view'>
        <ReportTable
          columns={columns}
          data={reports}
          loading={loading}
          fileName={fileName}
        />
      </div>
    </LayoutAdmin>
  );
}

export default Report;
