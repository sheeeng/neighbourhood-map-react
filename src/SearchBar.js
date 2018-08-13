import React from "react";
import PropTypes from "prop-types";

function SearchBar(props) {
  return (
    <div>
      <label htmlFor="search-place">Search A Place</label>
      <input
        id="search-venue"
        onChange={props.onQueryChange}
        onClick={props.onInputClick}
        type="text"
        placeholder="Type some text..."
        value={props.currentVal}
      />
    </div>
  );
}

SearchBar.propTypes = {
  onQueryChange: PropTypes.func.isRequired,
  currentVal: PropTypes.string.isRequired,
  onInputClick: PropTypes.func.isRequired
};

export default SearchBar;
