import { useTable } from 'react-table';

const SelectAssetTable = ({
  columns,
  data = [],
  onSelectAsset,
  onSaveAssetModal,
  onCancelAssetModal,
  onSearchChange,
}) => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <div>
      <div className='table__view select-user-table'>
        <div className='user-header'>
          <div className='modal-header'>
            <span>Select Asset</span>
          </div>
          <div className='table__view--search select-user-search'>
            <form className='search'>
              <label />
              <input
                type='text'
                placeholder='Name'
                onChange={(e) => onSearchChange(e.target.value)}
              />
              <i className='bx bx-search' />
            </form>
          </div>
        </div>
        <div className='table-wrapper'>
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
            <tbody {...getTableBodyProps()} className='table-body'>
              {rows.map((row, index) => {
                prepareRow(row);
                return (
                  <tr
                    {...row.getRowProps()}
                    onClick={() => onSelectAsset(row.original)}
                  >
                    <label htmlFor={index}>
                      {row.cells.map((cell) => {
                        return (
                          <td {...cell.getCellProps()}>
                            {cell.render('Cell')}
                          </td>
                        );
                      })}
                    </label>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className='user-control'>
          <div className='user-btn save' onClick={onSaveAssetModal}>
            Save
          </div>
          <div className='user-btn cancel' onClick={onCancelAssetModal}>
            Cancel
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectAssetTable;
