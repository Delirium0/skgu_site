import React, { useState } from 'react';
import cl from './Building_container_list.module.css';
import Building_contrainer from './Building_contrainer';
import universityIconSvg from './../../assets/svg/university-svgrepo-com.svg';

const Building_container_list = () => {
  const allPoints = [
    {
      title: "учебный корпус номер 6",
      address: "​Улица Абая Кунанбаева, 312а",
      time_start: "ПН-ПТ",
      time_end: "7:00-20:00",
      main_icon: universityIconSvg,
      type: "academic_building",
      typeNameRu: "Учебные корпуса"
    },
    {
      title: "Бассейн СКУ им. М. Козыбаева",
      address: "​Улица Абая Кунанбаева, 31а",
      time_start: "ПН-ПТ",
      time_end: "7:00-20:00",
      main_icon: universityIconSvg,
      type: "sport",
      typeNameRu: "Спортивные комплексы"
    },
    {
      title: "Что то еще библиотека",
      address: "​Улица Абая Кунанбаева, 31а",
      time_start: "ПН-ПТ",
      time_end: "7:00-20:00",
      main_icon: universityIconSvg,
      type: "library",
      typeNameRu: "Библиотеки"
    },
    {
      title: "Еще один спорт комплекс",
      address: "​Улица Абая Кунанбаева, 31б",
      time_start: "ПН-ПТ",
      time_end: "7:00-20:00",
      main_icon: universityIconSvg,
      type: "sport",
      typeNameRu: "Спортивные комплексы"
    }
  ];

  const [filterType, setFilterType] = useState(null);

  const handleFilterClick = (type) => {
    setFilterType(type);
  };

  const filteredPoints = filterType
    ? allPoints.filter(point => point.type === filterType)
    : allPoints;

  const buildingTypes = [...new Set(allPoints.map(point => point.type))].map(type => {
    const point = allPoints.find(p => p.type === type);
    return { type: type, typeNameRu: point.typeNameRu };
  });

  const groupedPoints = filteredPoints.reduce((acc, point) => {
    if (!acc[point.type]) {
      acc[point.type] = [];
    }
    acc[point.type].push(point);
    return acc;
  }, {});

  const buttonStyle = {
    padding: '8px 16px',
    borderRadius: '20px',
    border: 'none',
    backgroundColor: '#222',
    color: 'white',
    cursor: 'pointer',
    margin: '4px',
    fontSize: '1.1em'
  };

  const activeButton = {
    ...buttonStyle,
    backgroundColor: '#28a745',
  };

  const buttonContainerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: '16px'
  };

  const getTypeNameRu = (type) => {
    const point = allPoints.find(p => p.type === type);
    return point ? point.typeNameRu : type;
  };

  return (
    <div>
      <div style={buttonContainerStyle}>
        <button
          style={filterType === null ? activeButton : buttonStyle}
          onClick={() => handleFilterClick(null)}
        >
          Все
        </button>
        {buildingTypes.map(({ type, typeNameRu }) => (
          <button
            key={type}
            style={filterType === type ? activeButton : buttonStyle}
            onClick={() => handleFilterClick(type)}
          >
            {typeNameRu}
          </button>
        ))}
      </div>

      {Object.entries(groupedPoints).map(([type, points]) => (
        <div key={type} className={cl.typeBlock}>
          <h2 className={cl.typeTitle}>{getTypeNameRu(type)}</h2>
          {points.map(point => (
            <Building_contrainer key={point.title} point={point} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Building_container_list;