import { useEffect, useState, useMemo, useRef } from 'react';
import { Waypoint } from 'react-waypoint';
import queryString from 'query-string'
import axios from 'axios';

import SelectAssetTable from './SelectAssetTable';

function SelectAsset({ onSelectAsset, onSaveAssetModal, onCancelAssetModal }) {
  const [assets, setAssets] = useState([]);
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
      let url = `api/Assets/GetAssetAvailable?${paramString}`;
      axios
        .get(url)
        .then((res) => {
          setTotalPages(res.data.totalPages)
          setAssets((prevState) => [...prevState, ...res.data.data]);
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
    setAssets([]);
    setFilters((prev) => {
      if (prev.sortBy === sortBy) {
        return {
          ...prev,
          asc: !prev.asc,
          PageNumber: 1
        };
      }
      return {
        ...prev,
        sortBy: sortBy,
        asc: true,
        PageNumber: 1
      };
    });
  };

  const handleSearchChange = (value) => {
    if (typingTimoutRef.current) {
      clearTimeout(typingTimoutRef.current);
    }

    typingTimoutRef.current = setTimeout(() => {
      setAssets([])
      setFilters({
        ...filters,
        keyword: value,
        pageNumber: 1,
      });
    }, 500);
  };

  const columns = useMemo(
    () => [
      {
        Header: ' ',
        Cell: (d) => (
          <>
            <Waypoint
              onEnter={() => {
                if (
                  assets.length - 1 === Number(d.row.id) &&
                  filters.PageNumber < totalPages - 1
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
            <input type='radio' name='selectAsset' id={d.row.id} />
          </>
        ),
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
              onClick={() => handleSortBy('assetName')}
            >
              <span>Category</span>
              {handleSortIcon('assetName')}
            </div>
          );
        },
        accessor: 'categoryName',
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [assets]
  );
  return (
    <SelectAssetTable
      columns={columns}
      data={assets}
      onSelectAsset={onSelectAsset}
      onSaveAssetModal={onSaveAssetModal}
      onCancelAssetModal={onCancelAssetModal}
      onSearchChange={handleSearchChange}
    />
  );
}

export default SelectAsset;
