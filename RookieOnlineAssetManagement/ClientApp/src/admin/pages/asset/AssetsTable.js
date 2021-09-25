import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import Select from 'react-select';
import { useTable } from 'react-table';

import { customStyles } from '../CustomSelectStyle';
import { getApiAssets } from './assetsApi';

const stateOptions = [
  { value: 0, label: 'Available' },
  { value: 1, label: 'Waiting For Approval' },
  { value: 2, label: 'Not Available' },
  { value: 3, label: 'Assigned' },
  { value: 4, label: 'Waiting For Recycling' },
  { value: 5, label: 'Recycled' },
];

function AssetsTable({
  columns,
  data,
  loading,
  onSearchChange = () => {},
  onSelectState = () => {},
  onSelectCategory = () => {},
  onShowAssetDetail = () => {},
}) {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });
  const [categories, setCategories] = useState([]);

  const getCategories = () => {
    getApiAssets
      .getCategories()
      .then((res) => res.data)
      .then((data) => {
        setCategories(data);
      })
      .catch((err) => err);
  };
  useEffect(getCategories, []);

  const categoryOptions =
    categories &&
    categories.map((category) => {
      return { label: category.name, value: category.name };
    });

  return (
    <div>
      <div className='table__view'>
        <h2>Manage Asset</h2>
        <div className='table__view--search'>
          <form className='search'>
            <label />
            <Select
              placeholder='State'
              isSearchable={false}
              isClearable={true}
              styles={customStyles}
              className='State'
              onChange={(e) => onSelectState(e)}
              options={stateOptions}
            />
            <i className='bx bx-filter-alt' />
          </form>
          <form className='search'>
            <label />
            <Select
              placeholder='Category'
              isSearchable={false}
              isClearable={true}
              styles={customStyles}
              className='State'
              onChange={(e) => onSelectCategory(e)}
              options={categoryOptions}
            />
            <i className='bx bx-filter-alt' />
          </form>
          <form className='search'>
            <label />
            <input
              type='text'
              placeholder='Search...'
              onChange={(e) => onSearchChange(e.target.value)}
            />
            <i className='bx bx-search' />
          </form>
          <NavLink to='/admin/assets/create'>
            <button href='assets' className='btn'>
              Create New Asset
            </button>
          </NavLink>
        </div>
        <div>
          {loading ? (
            <span className='spinner'>
              <i className='fas fa-spinner fa-spin'></i>
            </span>
          ) : (
            <table {...getTableProps()}>
              <thead>
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()} id='tr-hover'>
                    {headerGroup.headers.map((column) => (
                      <th {...column.getHeaderProps()}>
                        {column.render('Header')}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {rows.map((row) => {
                  prepareRow(row);
                  return (
                    <tr
                      {...row.getRowProps()}
                      onClick={(e) => {
                        if (!e.target.closest('#actions')) {
                          onShowAssetDetail(row.original);
                        }
                      }}
                    >
                      {row.cells.map((cell) => {
                        return (
                          <td {...cell.getCellProps()}>
                            {cell.render('Cell')}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default AssetsTable;
