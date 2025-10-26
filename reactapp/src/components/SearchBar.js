import React from 'react';

const SearchBar = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="🔍 Search posts..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="input search-input"
      />
    </div>
  );
};

export default SearchBar;