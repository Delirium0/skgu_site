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
                if (event.detail.targetIndex === 0) {
                  setRoomDescription('Кабинет 207: Отдел информационных систем');
                  console.log('Обнаружена цель: Кабинет 207 (targetIndex: 0)');
                } else if (event.detail.targetIndex === 1) {
                  setRoomDescription('Кабинет 209: Описание для кабинета 209');
                  console.log('Обнаружена цель: Кабинет 209 (targetIndex: 1)');
                }
              });

              sceneEl.addEventListener('targetLost', (event) => {
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
              if (event.detail.targetIndex === 0) {
                setRoomDescription('Кабинет 207: Отдел информационных систем');
                console.log('Обнаружена цель: Кабинет 207 (targetIndex: 0)');
              } else if (event.detail.targetIndex === 1) {
                setRoomDescription('Кабинет 209: Описание для кабинета 209');
                console.log('Обнаружена цель: Кабинет 209 (targetIndex: 1)');
              }
            });

            sceneEl.addEventListener('targetLost', (event) => {
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
        {/* Удалили блок <a-assets> */}

        <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>

        {/* Таргет для кабинета 207 */}
        <a-entity mindar-image-target="targetIndex: 0">
        <a-entity
            text="value: Кабинет 207\nОтдел информационных систем; align: center; color: white; width: 2"
            position="0 -0.3 0.01"
            // Удалили geometry="primitive: plane; width: 2.1; height: auto"
            material="color: rgba(0, 0, 0, 0.7)"
          ></a-entity>
          {/* Удалили <a-entity gltf-model="#avatarModel"> */}
        </a-entity>

        {/* Таргет для кабинета 209 */}
        <a-entity mindar-image-target="targetIndex: 1">
        <a-entity
            text="value: Кабинет 209\nОписание для кабинета 209; align: center; color: white; width: 2"
            position="0 -0.3 0.01"
            // Удалили geometry="primitive: plane; width: 2.1; height: auto"
            material="color: rgba(0, 0, 0, 0.7)"
          ></a-entity>
          {/* Удалили <a-entity gltf-model="#avatarModel"> */}
        </a-entity>

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