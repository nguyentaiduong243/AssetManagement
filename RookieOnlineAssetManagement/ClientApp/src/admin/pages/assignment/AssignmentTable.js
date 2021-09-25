import { useTable, usePagination } from "react-table";
import ReactDatePicker from "react-datepicker";
import { NavLink } from "react-router-dom";
import Select from "react-select";
import React from "react";

import "./Assignment.css";
import { customStyles } from "../CustomSelectStyle"

const options = [
  { value: 0, label: "Waiting For Acceptance" },
  { value: 1, label: "Accepted" },
  { value: 2, label: "Declined" },
  { value: 3, label: "Waiting For Returning" },
];

const AssignmentsTable = ({
  columns,
  data = [],
  loading,
  filterAssignedDate,
  onSearch = () => {},
  onClickAssignment = () => {},
  onFilterAssignedDate = () => {},
  onSelectStateOption = () => {},
}) => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data }, usePagination);

  return (
    <div>
      <div className="table__view">
        <h2>Manage Assignment</h2>
        <div className="table__view--search">
          <div className="search">
            <div className="filter-state">
              <Select
                placeholder="State"
                isSearchable={false}
                isClearable={true}
                styles={customStyles}
                className="State"
                onChange={(e) => onSelectStateOption(e)}
                options={options}
              />
              <i className="bx bx-filter-alt" />
            </div>
          </div>
          <div className="search">
            <div className="filter-state">
              <ReactDatePicker
                selected={filterAssignedDate}
                onChange={(e) => onFilterAssignedDate(e)}
                placeholderText="Assigned Date"
                isClearable
                withPortal
                showYearDropdown
                showMonthDropdown
                dateFormat="dd/MM/yyyy"
                yearDropdownItemNumber={100}
                scrollableYearDropdown
                dropdownMode="select"
                className="input"
              />
              <i className="bx bx-filter-alt" />
            </div>
          </div>
          <div className="search">
            <label />
            <input
              type="text"
              placeholder="Name"
              id="search"
              onChange={(e) => onSearch(e.target.value)}
            />
            <i className="bx bx-search" />
          </div>
          <NavLink to="/admin/assignments/create">
            <button className="btn">Create New Assignment</button>
          </NavLink>
        </div>
        <div>
          <table {...getTableProps()}>
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th {...column.getHeaderProps()}>
                      {column.render("Header")}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            {loading ? (
              <div className="spinner">
                <i className="fas fa-spinner fa-spin"></i>
              </div>
            ) : (
              <tbody {...getTableBodyProps()}>
                {rows.map((row, index) => {
                  prepareRow(row);
                  return (
                    <tr
                      id="tr-hover"
                      {...row.getRowProps()}
                      onClick={(e) => {
                        if (!e.target.closest("#actions")) {
                          onClickAssignment(row.original);
                        }
                      }}
                    >
                      {row.cells.map((cell) => {
                        return (
                          <td id={cell.column.Header} {...cell.getCellProps()}>
                            {cell.render("Cell")}
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
