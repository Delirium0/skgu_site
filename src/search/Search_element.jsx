import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import searchIcon from './../Components/Footer/search-svgrepo-com.svg';
import cl from './Search_element.module.css';
import SuggestionsList from './search_results/SuggestionsList';

const Search_element = ({ onSelectTarget }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const inputRef = useRef(null);

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Debounce ввода пользователя
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);

  // Запрос подсказок при изменении debouncedSearchTerm
  useEffect(() => {
    if (debouncedSearchTerm) {
      axios
        .get(`http://localhost:8000/suggest?term=${debouncedSearchTerm}`)
        .then((response) => {
          setSuggestions(response.data.suggestions);
        })
        .catch((error) => {
          console.error('Error fetching suggestions:', error);
        });
    } else {
      setSuggestions([]);
    }
  }, [debouncedSearchTerm]);

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.name);
    setSuggestions([]);
    // Передаём выбранный target (например, "2_office_214")
    onSelectTarget(suggestion.id);
  };

  const handleBlockClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleIconClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className={cl.searchContainer}>
      <div className={cl.search_block} onClick={handleBlockClick}>
        <img
          className={cl.search_icon}
          src={searchIcon}
          alt="search icon"
          onClick={handleIconClick}
        />
        <input
          type="text"
          value={searchTerm}
          onChange={handleChange}
          placeholder="Найти объект или кабинет"
          ref={inputRef}
        />
      </div>
      <SuggestionsList suggestions={suggestions} onSelect={handleSuggestionClick} />
    </div>
  );
};

export default Search_element;
