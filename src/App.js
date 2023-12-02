import React, { useState, useEffect } from 'react';
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import './App.css';

const App = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const itemsPerPage = 10;

  useEffect(() => {
    // Fetch data from the given API
    fetch('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json')
      .then((response) => response.json())
      .then((result) => {
        setData(result);
        setFilteredData(result);
      });
  }, []);

  const handleSearch = () => {
    const filtered = data.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredData(filtered);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleCheckboxChange = (id) => {
    const updatedSelectedRows = [...selectedRows];
    const index = updatedSelectedRows.indexOf(id);
    if (index === -1) {
      updatedSelectedRows.push(id);
    } else {
      updatedSelectedRows.splice(index, 1);
    }
    setSelectedRows(updatedSelectedRows);
  };

  const handleDeleteSelected = () => {
    const updatedData = data.filter((item) => !selectedRows.includes(item.id));
    setData(updatedData);
    setFilteredData(updatedData);
    setSelectedRows([]);
  };
  const handleEdit = (id) => {
    // Implement edit logic here
    console.log(`Edit item with ID ${id}`);
  };

  const handleDelete = (id) => {
    // Implement delete logic here
    const updatedData = data.filter((item) => item.id !== id);
    setData(updatedData);
    setFilteredData(updatedData);
    setSelectedRows(selectedRows.filter((selectedId) => selectedId !== id));
  };

  return (
    <div className="app">
      <div className="search-bar">
        <input
          className="search-input"
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="search-icon" onClick={handleSearch}>
          Search
        </button>
      </div>
      <table>
        {/* Table Header */}
        <thead>
          <tr>
            <th>Select All</th>
            <th>Name</th>
            <th>Email</th>
            <th>Roles</th>
            <th>Action</th>
          </tr>
        </thead>
        {/* Table Body */}
        <tbody>
          {filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((item) => (
            <tr key={item.id} className={selectedRows.includes(item.id) ? 'selected' : ''}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedRows.includes(item.id)}
                  onChange={() => handleCheckboxChange(item.id)}
                />
              </td>
              <td>{item.name}</td>
              <td>{item.email}</td>
              <td>{item.role}</td>
              <td>
                <button className="edit">
                  <i className="fa fa-edit" onClick={() => handleEdit(item.id)}><AiFillEdit /></i>
                </button>
                <button className="delete" onClick={() => handleDelete(item.id)}>
                  <i className="fa fa-trash"> <AiFillDelete /></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination */}
      <div className="pagination">
        <button className="first-page" onClick={() => handlePageChange(1)}>
          First Page
        </button>
        <button
          className="previous-page"
          onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
        >
          Previous Page
        </button>
        {[...Array(Math.ceil(filteredData.length / itemsPerPage)).keys()].map((page) => (
          <button
            key={page + 1}
            className={currentPage === page + 1 ? 'active-page' : ''}
            onClick={() => handlePageChange(page + 1)}
          >
            {page + 1}
          </button>
        ))}
        <button
          className="next-page"
          onClick={() => handlePageChange(Math.min(currentPage + 1, Math.ceil(filteredData.length / itemsPerPage)))}
        >
          Next Page
        </button>
        <button
          className="last-page"
          onClick={() => handlePageChange(Math.ceil(filteredData.length / itemsPerPage))}
        >
          Last Page
        </button>
      </div>
      {/* Delete Selected Button */}
      <button className="delete-selected" onClick={handleDeleteSelected}>
        Delete Selected
      </button>
    </div>
  );
};

export default App;
