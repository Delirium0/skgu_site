import React, { useState } from "react";
import cl from "./Subject_container.module.css";
import { ReactComponent as ArrowUpSvg } from './../assets/svg/arrow_down.svg';

const Subject_container = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // Данные для текущего предмета (жестко заданы для примера)
  const currentSubjectData = {
    'subject_name': 'Протоколы и интерфейсы компьютерных систем',
    'teacher': 'Ушакова Екатерина Вячеславовна',
    '1': '33', '2': '100|100|100', '3': '0', '4': '100|0', '5': '95|85|84', '6': '78', '7': '78', '8': '65', '9': '95', // Добавим оценки для 9-16 модулей для примера
    '10': '94', '11': '96', '12': '-', '13': '97', '14': '91', '15': '95|85|84', '16': '88',
    'average_grade': '98'
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const moduleKeys = Object.keys(currentSubjectData)
      .filter(key => parseInt(key) >= 1 && parseInt(key) <= 16) // Теперь до 16 модулей

  const firstRowModules = moduleKeys.slice(0, 8);
  const secondRowModules = moduleKeys.slice(8, 16);

  // Функция для определения цвета оценки
  const getGradeColor = (grade) => {
    if (grade === '-' || isNaN(parseInt(grade))) {
      return null; // Возвращаем null, чтобы использовался цвет по умолчанию из CSS
    }
    const gradeValue = parseInt(grade, 10);
    if (gradeValue < 50) {
      return '#F44336'; // Красный
    } else if (gradeValue < 70) {
      return '#FF9800'; // Желтый
    } else if (gradeValue < 90) {
      return '#00DF09'; // Зеленый
    } else if (gradeValue <= 100) {
      return '#3AE8FF'; // Голубой
    }
    return null; // Цвет по умолчанию, если оценка вне диапазона
  };


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
        <div className={[cl.dropdown_list, isDropdownOpen ? cl.open : null].filter(Boolean).join(' ')}>
        <div className={cl.dropdown_item}>
              <div className={cl.dropdown_grades_rows_container}> {/* Контейнер для рядов оценок */}
                  <div className={cl.dropdown_grades_row}> {/* Первый ряд оценок */}
                      {firstRowModules.map(key => (
                          <div key={key} className={cl.dropdown_grade_item}>
                              <div className={cl.dropdown_grade_number}>{key}</div>
                              <div className={cl.dropdown_grade_value}>
                                  {currentSubjectData[key]?.includes('|') ? (
                                      currentSubjectData[key].split('|').map((grade, index, array) => (
                                          <React.Fragment key={index}>
                                              <span style={{ color: getGradeColor(grade) }}>{grade}</span>
                                              {index < array.length - 1 && <span style={{ color: '#888' }}>|</span>} {/* Серый разделитель */}
                                          </React.Fragment>
                                      ))
                                  ) : (
                                      <span style={{ color: getGradeColor(currentSubjectData[key]) }}>{currentSubjectData[key] || '-'}</span>
                                  )}
                              </div>
                          </div>
                      ))}
                  </div>
                  <div className={cl.dropdown_grades_row}> {/* Второй ряд оценок */}
                      {secondRowModules.map(key => (
                          <div key={key} className={cl.dropdown_grade_item}>
                              <div className={cl.dropdown_grade_number}>{key}</div>
                              <div className={cl.dropdown_grade_value}>
                                  {currentSubjectData[key]?.includes('|') ? (
                                      currentSubjectData[key].split('|').map((grade, index, array) => (
                                          <React.Fragment key={index}>
                                              <span style={{ color: getGradeColor(grade) }}>{grade}</span>
                                              {index < array.length - 1 && <span style={{ color: '#888' }}>|</span>} {/* Серый разделитель */}
                                          </React.Fragment>
                                      ))
                                  ) : (
                                      <span style={{ color: getGradeColor(currentSubjectData[key]) }}>{currentSubjectData[key] || '-'}</span>
                                  )}
                              </div>
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