import React from "react";
import cl from "./Subject_container.module.css";
import { ReactComponent as ArrowDownSvg } from './../assets/svg/arrow_down.svg';

const Subject_container = () => {
  return (
    <div className={cl.subject_container}>
      <div className={cl.card}>qefqef</div>
      <div className={cl.another_container}>
        {/* Передаем нужный цвет через fill */}
        <ArrowDownSvg className={cl.progress_icon} />
      </div>
    </div>
  );
};

export default Subject_container;
