import React, { useEffect, useState, useRef } from 'react';

const Test = () => {
  const [roomDescription, setRoomDescription] = useState(null);
  const sceneRef = useRef(null);

  useEffect(() => {
    const loadScripts = async () => {
      if (!window.AFRAME) {
        const aframeScript = document.createElement('script');
        aframeScript.src = 'https://aframe.io/releases/1.6.0/aframe.min.js';
        aframeScript.async = true;
        document.head.appendChild(aframeScript);

        aframeScript.onload = () => {
          const mindarScript = document.createElement('script');
          mindarScript.src = 'https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-aframe.prod.js';
          mindarScript.async = true;
          document.head.appendChild(mindarScript);

          mindarScript.onload = () => {
            // После загрузки MindAR, добавляем обработчики событий
            const sceneEl = sceneRef.current;
            if (sceneEl) {
              sceneEl.addEventListener('targetFound', (event) => {
                document.body.style.backgroundColor = 'black'; // Меняем фон на черный
                if (event.detail.targetIndex === 0) {
                  setRoomDescription('Кабинет 207: Отдел информационных систем');
                  console.log('Обнаружена цель: Кабинет 207 (targetIndex: 0)');
                } else if (event.detail.targetIndex === 1) {
                  setRoomDescription('Кабинет 209: Описание для кабинета 209');
                  console.log('Обнаружена цель: Кабинет 209 (targetIndex: 1)');
                }
              });

              sceneEl.addEventListener('targetLost', (event) => {
                document.body.style.backgroundColor = ''; // Возвращаем фон по умолчанию (или можно установить 'white' или другой цвет)
                setRoomDescription(null);
                console.log('Цель потеряна');
              });
            }
          };
        };
      } else {
        const mindarScript = document.createElement('script');
        mindarScript.src = 'https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-aframe.prod.js';
        mindarScript.async = true;
        document.head.appendChild(mindarScript);

        mindarScript.onload = () => {
          // После загрузки MindAR, добавляем обработчики событий
          const sceneEl = sceneRef.current;
          if (sceneEl) {
            sceneEl.addEventListener('targetFound', (event) => {
                document.body.style.backgroundColor = 'black'; // Меняем фон на черный
              if (event.detail.targetIndex === 0) {
                setRoomDescription('Кабинет 207: Отдел информационных систем');
                console.log('Обнаружена цель: Кабинет 207 (targetIndex: 0)');
              } else if (event.detail.targetIndex === 1) {
                setRoomDescription('Кабинет 209: Описание для кабинета 209');
                console.log('Обнаружена цель: Кабинет 209 (targetIndex: 1)');
              }
            });

            sceneEl.addEventListener('targetLost', (event) => {
                document.body.style.backgroundColor = ''; // Возвращаем фон по умолчанию
              setRoomDescription(null);
              console.log('Цель потеряна');
            });
          }
        };
      }
    };

    loadScripts();

    return () => {
      // Очистка обработчиков событий
      const sceneEl = sceneRef.current;
      if (sceneEl) {
        sceneEl.removeEventListener('targetFound', () => {});
        sceneEl.removeEventListener('targetLost', () => {});
      }
    };
  }, []);

  return (
    <div>
      <a-scene
        ref={sceneRef}
        mindar-image="imageTargetSrc: /targets_207_209.mind;"
        color-space="sRGB"
        renderer="colorManagement: true, physicallyCorrectLights"
        vr-mode-ui="enabled: false"
        device-orientation-permission-ui="enabled: false"
      >
        {/* Удалили <a-assets> блок и все <a-entity mindar-image-target> с 3D текстом */}
        <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>

      </a-scene>

      {/* Блок для отображения синего текста на странице */}
      {roomDescription && (
        <div style={{ color: 'blue', textAlign: 'center', marginTop: '20px' }}>
          {roomDescription}
        </div>
      )}
    </div>
  );
};

export default Test;