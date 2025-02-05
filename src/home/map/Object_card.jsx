import React from "react";
import "./Object_card.css";
import Text_and_icon from "./Text_and_icon";
import cl from "./Text_and_icon.module.css";

const Object_card = ({point, isSelected, handlePointClick}) => {


  const svg_geo_marker = (
    <svg viewBox="0 0 527.678 527.678" fill="white">
      <g>
        <g>
          <path
            d="M263.877,0C169.782,0,93.512,76.271,93.512,170.213c0,93.941,159.197,349.834,159.197,349.834
			c6.196,10.175,16.217,10.175,22.338,0c0,0,159.119-255.816,159.119-349.834C434.166,76.194,357.973,0,263.877,0z M263.877,264.537
			c-61.583,0-111.384-49.878-111.384-111.384c0-61.506,49.801-111.461,111.384-111.461c61.582,0,111.384,49.878,111.384,111.384
			S325.459,264.537,263.877,264.537z"
          />
          <ellipse cx="263.877" cy="153.153" rx="69.844" ry="69.844" />
        </g>
      </g>
    </svg>
  );

  const svgIconStar = (
    <svg className="svg_time">
      <path d="M12,2C6.477,2,2,6.477,2,12c0,5.523,4.477,10,10,10s10-4.477,10-10C22,6.477,17.523,2,12,2z M14.586,16l-3.293-3.293 C11.105,12.519,11,12.265,11,12V7c0-0.552,0.448-1,1-1h0c0.552,0,1,0.448,1,1v4.586l3,3c0.39,0.39,0.39,1.024,0,1.414l0,0 C15.61,16.39,14.976,16.39,14.586,16z" />
    </svg>
  );
  return (
    <div
      className={`card ${isSelected ? 'selected' : ''}`}
      onClick={() => handlePointClick(point)}  // Вызываем handlePointClick с point
    >
      <div className="svg_block">
        <div className="svg_card_main">{point.main_icon}</div>
      </div>
      <div className="main_info_block">
        <div className={cl.text_and_icon}>
          <div className={cl.text}>{point.title}</div>
        </div>
        <div className={cl.text_and_icon}>
          {svgIconStar && <div className={cl.icon}>{svgIconStar}</div>}
          <span className={cl.text_time}>{point.time_start}</span>
          <span className={cl.text_time}>{point.time_end}</span>
        </div>
        <div className={cl.text_and_icon}>
          {svgIconStar && <div className={cl.icon_geo}>{svg_geo_marker}</div>}
          <div className={cl.text_geo}>{point.address}</div>
        </div>
      </div>
    </div>
  );
};

export default Object_card;
