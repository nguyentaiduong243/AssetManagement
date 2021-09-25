import { useTable } from 'react-table';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

function ReportTable({ columns, data, loading, fileName }) {
  const fileType =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = '.xlsx';

  const exportToCSV = (data, fileName) => {
    const ws = XLSX.utils.json_to_sheet(data);
    ws['!cols'] = [{ width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 } ];
    ws.A1.v = "Category ";
    ws.B1.v = "Total ";
    ws.C1.v = "Assgined ";
    ws.D1.v = "Available ";
    ws.E1.v = "Not Available ";
    ws.F1.v = "Waiting For Recycling";
    ws.G1.v = "Waiting For Approval"
    ws.H1.v = "Recycle"
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const datatype = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(datatype, fileName + fileExtension);
  };
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <div>
      <div className='table__view'>
        <h2>Report</h2>
        <button onClick={(e) => exportToCSV(data, fileName)} className='btn'>
          Export
        </button>
        <div className='table__view--search'></div>
        <div>
          <table id='table' {...getTableProps()}>
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
                {rows.map((row) => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()}>
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
            )}
          </table>
        </div>
      </div>
    </div>
  );
}

export default ReportTable;
