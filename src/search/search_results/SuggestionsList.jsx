import React from 'react';
import cl from './SuggestionsList.module.css'; // Здесь можете задать свои стили

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
          {sugg.name}
        </li>
      ))}
    </ul>
  );
};

export default SuggestionsList;
