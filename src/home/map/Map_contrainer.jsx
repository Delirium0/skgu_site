import React, { useState } from "react";
import Map from "./Map";
import Map_object_list from "./Map_object_list";
const Map_container = () => {
  const [selectedPoint, setSelectedPoint] = useState(null);
  const center_points = [54.875406, 69.135137]
  const svg_commission_skgu = (
    <svg viewBox="0 0 433 433">
      <path
        d="M423.5,179.732h-33.977v-17.073c0-18.162-9.575-34.122-23.936-43.122c7.23-7.029,11.734-16.848,11.734-27.704
	c0-21.318-17.344-38.662-38.662-38.662c-21.317,0-38.661,17.344-38.661,38.662c0,10.855,4.504,20.674,11.734,27.704
	c-14.36,9-23.936,24.959-23.936,43.122v17.073h-20.434v-17.073c0-18.162-9.575-34.122-23.936-43.122
	c7.23-7.029,11.734-16.848,11.734-27.704c0-21.318-17.344-38.662-38.661-38.662c-21.318,0-38.662,17.344-38.662,38.662
	c0,10.855,4.504,20.674,11.734,27.704c-14.361,9-23.936,24.959-23.936,43.122v17.073h-20.434v-17.073
	c0-18.162-9.575-34.122-23.936-43.122c7.23-7.029,11.734-16.848,11.734-27.704c0-21.318-17.344-38.662-38.662-38.662
	S55.677,70.516,55.677,91.834c0,10.856,4.504,20.674,11.734,27.704c-14.36,9-23.935,24.959-23.935,43.122v17.073H9.5
	c-5.247,0-9.5,4.253-9.5,9.5v127.1c0,5.247,4.253,9.5,9.5,9.5h34.008v44.497c0,5.247,4.253,9.5,9.5,9.5s9.5-4.253,9.5-9.5v-44.497
	h307.983v44.497c0,5.247,4.253,9.5,9.5,9.5s9.5-4.253,9.5-9.5v-44.497H423.5c5.247,0,9.5-4.253,9.5-9.5v-127.1
	C433,183.985,428.748,179.732,423.5,179.732z M358.322,91.834c0,10.841-8.82,19.662-19.662,19.662
	c-10.841,0-19.661-8.82-19.661-19.662s8.82-19.662,19.661-19.662C349.501,72.172,358.322,80.992,358.322,91.834z M306.796,162.659
	c0-17.57,14.294-31.864,31.863-31.864c17.57,0,31.864,14.294,31.864,31.864v38.148c0,1.374-1.118,2.491-2.492,2.491
	s-2.491-1.118-2.491-2.491v-26.909c0-5.247-4.253-9.5-9.5-9.5s-9.5,4.253-9.5,9.5v5.833H330.78v-5.833c0-5.247-4.253-9.5-9.5-9.5
	s-9.5,4.253-9.5,9.5v26.909c0,1.374-1.118,2.491-2.492,2.491s-2.491-1.118-2.491-2.491V162.659z M236.161,91.834
	c0,10.841-8.82,19.662-19.661,19.662c-10.841,0-19.662-8.82-19.662-19.662s8.82-19.662,19.662-19.662
	C227.34,72.172,236.161,80.992,236.161,91.834z M184.636,162.659c0-17.57,14.294-31.864,31.864-31.864
	c17.569,0,31.863,14.294,31.863,31.864v38.148c0,1.374-1.117,2.491-2.491,2.491s-2.492-1.118-2.492-2.491v-26.909
	c0-5.247-4.253-9.5-9.5-9.5s-9.5,4.253-9.5,9.5v5.833h-15.76v-5.833c0-5.247-4.253-9.5-9.5-9.5s-9.5,4.253-9.5,9.5v26.909
	c0,1.374-1.118,2.491-2.492,2.491s-2.492-1.118-2.492-2.491V162.659z M114,91.834c0,10.841-8.82,19.662-19.662,19.662
	s-19.662-8.82-19.662-19.662s8.82-19.662,19.662-19.662S114,80.992,114,91.834z M62.475,162.659
	c0-17.57,14.294-31.864,31.863-31.864c17.57,0,31.864,14.294,31.864,31.864v38.148c0,1.374-1.118,2.491-2.492,2.491
	c-1.374,0-2.491-1.118-2.491-2.491v-26.909c0-5.247-4.253-9.5-9.5-9.5s-9.5,4.253-9.5,9.5v5.833H86.458v-5.833
	c0-5.247-4.253-9.5-9.5-9.5s-9.5,4.253-9.5,9.5v26.909c0,1.374-1.118,2.491-2.492,2.491c-1.374,0-2.491-1.118-2.491-2.491V162.659z
	 M414,306.831H19v-108.1h24.475v2.075c0,11.85,9.641,21.491,21.492,21.491c11.85,0,21.491-9.641,21.491-21.491v-2.075h15.761v2.075
	c0,11.85,9.641,21.491,21.491,21.491c11.851,0,21.492-9.641,21.492-21.491v-2.075h20.434v2.075c0,11.85,9.641,21.491,21.492,21.491
	s21.492-9.641,21.492-21.491v-2.075h15.76v2.075c0,11.85,9.642,21.491,21.492,21.491s21.491-9.641,21.491-21.491v-2.075h20.434
	v2.075c0,11.85,9.642,21.491,21.492,21.491s21.491-9.641,21.491-21.491v-2.075h15.761v2.075c0,11.85,9.641,21.491,21.491,21.491
	s21.492-9.641,21.492-21.491v-2.075H414V306.831z"
      />
    </svg>
  );
  const svg_pool_skgu = (
    <svg viewBox="0 -20.38 122.88 122.88">

<g>

<path d="M0,66.24c7.11-2.74,13.1-0.95,21.42,1.55c2.17,0.65,4.53,1.36,6.66,1.92c1.9,0.5,4.82-0.58,7.88-1.71 c3.82-1.41,7.8-2.87,12.57-2.75c3.6,0.09,6.63,1.74,9.69,3.41c1.92,1.05,3.87,2.11,4.95,2.15c1.24,0.04,3.08-1.04,4.92-2.12 c3-1.77,6-3.54,10.17-3.68c4.48-0.15,7.95,1.39,11.39,2.92c1.96,0.87,3.91,1.74,5.54,1.86c1.54,0.12,3.6-1.2,5.6-2.47 c2.78-1.78,5.51-3.52,9.1-3.92c4.27-0.47,8.93,1.54,12.89,3.24l0.1,0.05c0,4.05,0,8.11,0,12.16c-0.85-0.25-1.73-0.59-2.64-0.96 c-0.63-0.26-1.28-0.54-1.94-0.82c-2.71-1.16-5.9-2.54-7.17-2.4c-1.02,0.11-2.63,1.14-4.27,2.19c-0.6,0.38-1.21,0.77-1.82,1.15 c-3.04,1.85-6.34,3.43-10.69,3.1c-3.54-0.27-6.42-1.55-9.31-2.84l-0.25-0.11c-2.16-0.96-4.33-1.89-6.17-1.83 c-1.13,0.04-2.75,0.95-4.39,1.91l-0.38,0.22c-3.25,1.92-6.51,3.84-11.08,3.67c-3.73-0.14-6.87-1.84-9.96-3.53l-0.39-0.21 c-1.72-0.94-3.37-1.8-4.16-1.82c-2.42-0.06-5.21,0.91-7.92,1.91l-0.47,0.17c-4.74,1.75-9.26,3.41-14.62,2.01 c-2.88-0.75-5.06-1.41-7.06-2.01l-0.06-0.02c-7.25-2.18-11.98-3.58-17.65,0.13c-0.15,0.1-0.31,0.2-0.47,0.31v-0.31V66.24L0,66.24z M87.91,17.06l14.16-2.15c8.81-1.32,6.16-17.18-5.13-14.64l-32.11,5.3c-3.48,0.57-9.45,1.01-12.05,3.33 c-1.49,1.33-2.11,3.18-1.77,5.49c0.48,3.27,3.21,7.37,4.85,10.34l3.97,7.14c2.89,5.19,4.44,5.69-0.91,8.56L22.45,59.99l2.67,0.79 l8.01,0.12c0.91-0.3,1.86-0.65,2.83-1.01c3.82-1.41,7.8-2.87,12.57-2.75c3.6,0.09,6.63,1.74,9.69,3.41l1.38,0.74l7.06,0.11 c0.47-0.26,0.95-0.54,1.42-0.82c3-1.77,6-3.54,10.17-3.68c4.48-0.15,7.95,1.39,11.39,2.92c1.96,0.87,3.91,1.74,5.54,1.86 c0.37,0.03,0.77-0.03,1.19-0.14L77.79,28.5c-1.58-2.81-4.42-6.36-4.01-8.5c0.14-0.72,1.1-1.01,2.27-1.19 C80.01,18.24,83.95,17.66,87.91,17.06L87.91,17.06z M103.21,24.42c7.77,0,14.07,6.3,14.07,14.07c0,7.77-6.3,14.07-14.07,14.07 c-7.77,0-14.07-6.3-14.07-14.07C89.15,30.71,95.44,24.42,103.21,24.42L103.21,24.42z"/>

</g>

</svg>
  );

  const points = [
    {
      lat: 54.875406,
      lng: 69.135137,
      title: "Kozybaev University, приемная комиссия",
      type: "square",
      id: 1,
      time_start: "ПН-ПТ",
      time_end: "12:00-18:00",
      main_icon: svg_commission_skgu,
      address: "СКУ им. М. Козыбаева, улица Магжана Жумабаева, 114, Петропавловск",
      bounds: [
        [54.875796, 69.135683],
        [54.875714, 69.135829],
        [54.875011, 69.134577],
        [54.87512, 69.134431],
      ],
    },
    {
      lat: 54.876545,
      lng: 69.134236,
      title: "Бассейн СКУ им. М. Козыбаева",
      type: "square",
      address: "​Улица Абая Кунанбаева, 31а",
      time_start: "ПН-ПТ",
      time_end: "7:00-20:00",
      main_icon: svg_pool_skgu,

      bounds: [
        [54.876976, 69.134204],
        [54.87663, 69.133618],
        [54.876192, 69.134321],

        [54.876501, 69.134962],
      ],
    },
  ];

  const handlePointClick = (point) => {
    setSelectedPoint(point);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <Map points={points} selectedPoint={selectedPoint} center_points={center_points} zoom_size={13}/>
      <Map_object_list
        points={points}
        selectedPoint={selectedPoint}
        handlePointClick={handlePointClick}
      ></Map_object_list>
   
    </div>
  );
};

export default Map_container;
