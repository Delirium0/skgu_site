import React, { useEffect, useState } from 'react';
import Search_results from './search_results/Search_results';
import axios from 'axios';
import cl from './Search.module.css';
import Search_element from './Search_element';

const Search = () => {
  const [floorsData, setFloorsData] = useState([]);
  const [target, setTarget] = useState(null);
  const start = "1_entrance"; // или другой начальный узел

  // Отправляем запрос, когда выбран target
  useEffect(() => {
    if (!target) return;
    axios.get(`${process.env.REACT_APP_API_URL}/search/route`, {
      params: { start: start, target: target }
    })
      .then((response) => {
        const images = response.data.images.map((imgData) => ({
          floor: imgData.floor,
          image: `data:image/png;base64,${imgData.image}`,
        }));
  
        const sortedFloors = [...images].sort((a, b) => {
          return parseInt(a.floor, 10) - parseInt(b.floor, 10);
        });
  
        setFloorsData(sortedFloors);
      })
      .catch((error) => {
        console.error('Error fetching route:', error);
      });
  }, [target]);
  

  return (
    <div className={cl.main_search_block}>
      <Search_element onSelectTarget={setTarget} />
      <Search_results floorsData={floorsData} />
    </div>
  );
};

export default Search;
