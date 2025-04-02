// AccountBlock.js (или Faculty.js, если вы переименовали)
import React from "react";
import cl from "./Account.module.css"; // Используем Account.module.css для стилей

const AccountBlock = ({ blockInfo }) => {
  // blockInfo вместо event_info для ясности
  return (
    <a href={blockInfo.linkTo} className={cl.faculties}>
      <div className={cl.faculties}>
        {/* Используем стили из Account.module.css через cl */}
        <div className={cl.faculty_icon}>
          {/* Используем стили из Account.module.css через cl */}
          <blockInfo.SvgComponent className={cl.progress_icon} />
          {/* Вставляем SVG и применяем класс */}
        </div>
        <div>
          {blockInfo.name}
          {/* Предполагаем, что в blockInfo будет свойство name */}
        </div>
      </div>
    </a>
  );
};

export default AccountBlock;
