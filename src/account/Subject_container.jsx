import React, { useState } from "react";
import cl from "./Subject_container.module.css";
import { ReactComponent as ArrowUpSvg } from './../assets/svg/arrow_down.svg';

const Subject_container = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // Данные для текущего предмета (жестко заданы для примера)
  const currentSubjectData = {
    'subject_name': 'Протоколы и интерфейсы компьютерных систем',
    'teacher': 'преподаватель: Ушакова Екатерина Вячеславовна',
    '1': '33', '2': '45', '3': '-', '4': '100', '5': '90', '6': '78', '7': '78', '8': '65', '9': '95', // Добавим оценки для 9-16 модулей для примера
    '10': '94', '11': '96', '12': '95', '13': '97', '14': '91', '15': '100', '16': '88',
    'average_grade': 'N/A'
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const moduleKeys = Object.keys(currentSubjectData)
      .filter(key => parseInt(key) >= 1 && parseInt(key) <= 16) // Теперь до 16 модулей

  const firstRowModules = moduleKeys.slice(0, 8);
  const secondRowModules = moduleKeys.slice(8, 16);


  return (
    <div className={cl.subject_container} onClick={toggleDropdown}>
      <div className={cl.card}>
        <div className={cl.text_container}>
          <div className={cl.subject_title}>Протоколы и интерфейсы компьютерных систем</div>
          <div className={cl.teacher_name}>Ушакова Е.В.</div>
        </div>
       <div className={cl.arrow_list} style={{ transform: isDropdownOpen ? 'scaleY(-0.7)' : 'scaleY(0.7)' }}>▼</div>
      </div>
      <div className={cl.another_container}>
        <ArrowUpSvg className={cl.progress_icon} />
        <div className={cl.number_container}>100</div>
      </div>

      {isDropdownOpen && (
        <div className={`${cl.dropdown_list} ${isDropdownOpen ? 'open' : ''}`}> {/* Добавляем класс 'open' */}
            <div className={cl.dropdown_item}>
              <div className={cl.dropdown_subject_name}>{currentSubjectData.subject_name}</div>
              <div className={cl.dropdown_teacher_name}>{currentSubjectData.teacher}</div>
              <div className={cl.dropdown_grades_rows_container}> {/* Контейнер для рядов оценок */}
                  <div className={cl.dropdown_grades_row}> {/* Первый ряд оценок */}
                      {firstRowModules.map(key => (
                          <div key={key} className={cl.dropdown_grade_item}>
                              <div className={cl.dropdown_grade_number}>{key}</div>
                              <div className={cl.dropdown_grade_value}>{currentSubjectData[key] || '-'}</div>
                          </div>
                      ))}
                  </div>
                  <div className={cl.dropdown_grades_row}> {/* Второй ряд оценок */}
                      {secondRowModules.map(key => (
                          <div key={key} className={cl.dropdown_grade_item}>
                              <div className={cl.dropdown_grade_number}>{key}</div>
                              <div className={cl.dropdown_grade_value}>{currentSubjectData[key] || '-'}</div>
                          </div>
                      ))}
                  </div>
              </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Subject_container;