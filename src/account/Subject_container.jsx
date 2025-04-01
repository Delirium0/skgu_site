import React from "react";
import cl from "./Subject_container.module.css";
import { ReactComponent as ArrowUpSvg } from './../assets/svg/arrow_down.svg'; // Предположим, что вы будете использовать эту же иконку, но визуально как стрелку вверх. Если у вас есть `arrow_up.svg`, используйте ее

const Subject_container = () => {
  return (
    <div className={cl.subject_container}>
      <div className={cl.card}>
        <div className={cl.text_container}> {/* Добавим контейнер для текста */}
          <div className={cl.subject_title}>Протоколы и интерфейсы компьютерных систем</div>
          <div className={cl.teacher_name}>Ушакова Е.В.</div>
        </div>
       <div className={cl.arrow_list}>▼</div>
      </div>
      <div className={cl.another_container}>
        <ArrowUpSvg className={cl.progress_icon} /> {/* Используем стрелку в правом контейнере */}
        <div className={cl.number_container}>100</div> {/* Добавим контейнер для числа */}
      </div>
    </div>
  );
};

export default Subject_container;