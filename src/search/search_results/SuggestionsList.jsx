import React from 'react';
import cl from './SuggestionsList.module.css';
import searchIcon from './../../Components/Footer/search-svgrepo-com.svg'; // путь к вашей иконке

const SuggestionsList = ({ suggestions, onSelect }) => {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <ul className={cl.suggestionsList}>
      {suggestions.map((sugg) => (
        <li
          key={sugg.id}
          onClick={() => onSelect(sugg)}
          className={cl.suggestionItem}
        >
          <img
            src={searchIcon}
            alt="иконка"
            className={cl.suggestionIcon}
          />
          {sugg.name}
        </li>
      ))}
    </ul>
  );
};

export default SuggestionsList;
