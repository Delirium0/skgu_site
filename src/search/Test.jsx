import React, { useEffect } from 'react';

const Test = () => {
  useEffect(() => {
    // Загружаем A-Frame и mindar-image после монтирования компонента
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
        };
      } else {
        const mindarScript = document.createElement('script');
        mindarScript.src = 'https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-aframe.prod.js';
        mindarScript.async = true;
        document.head.appendChild(mindarScript);
      }
    };

    loadScripts();

    // Обработчик для изменения фона и вывода в консоль
    const handleTargetFound = (targetIndex) => {
      if (targetIndex === 0) {
        document.body.style.backgroundColor = 'red';
        console.log('207');
      } else if (targetIndex === 1) {
        document.body.style.backgroundColor = 'blue';
        console.log('209');
      }
    };

    // Добавляем слушатели событий для таргетов
    const scene = document.querySelector('a-scene');
    if (scene && scene.hasLoaded) {
      setupEventListeners();
    } else {
      scene?.addEventListener('loaded', setupEventListeners);
    }

    function setupEventListeners() {
      const target0 = document.querySelector('a-entity[mindar-image-target][targetIndex="0"]');
      const target1 = document.querySelector('a-entity[mindar-image-target][targetIndex="1"]');

      target0?.addEventListener('targetFound', () => handleTargetFound(0));
      target1?.addEventListener('targetFound', () => handleTargetFound(1));

      // Сбрасываем фон, если таргет потерян
      target0?.addEventListener('targetLost', () => {
        document.body.style.backgroundColor = '';
      });
      target1?.addEventListener('targetLost', () => {
        document.body.style.backgroundColor = '';
      });
    }

    // Очистка при размонтировании
    return () => {
      scene?.removeEventListener('loaded', setupEventListeners);
    };
  }, []);

  return (
    <a-scene
      mindar-image="imageTargetSrc: /office_207_209.mind;" // Укажите ваш .mind файл с двумя таргетами
      color-space="sRGB"
      renderer="colorManagement: true, physicallyCorrectLights"
      vr-mode-ui="enabled: false"
      device-orientation-permission-ui="enabled: false"
    >
      <a-assets>
        <a-asset-item
          id="avatarModel"
          src="https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.2.5/examples/image-tracking/assets/card-example/softmind/scene.gltf"
        ></a-asset-item>
      </a-assets>

      <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>

      {/* Таргет для кабинета 207 */}
      <a-entity mindar-image-target="targetIndex: 0">
        <a-entity
          text="value: Room 207\nInformation Systems Department; align: center; color: white; width: 2"
          position="0 -0.3 0.01"
          geometry="primitive: plane; width: 2.1; height: auto"
          material="color: rgba(0, 0, 0, 0.7)"
        ></a-entity>
      </a-entity>

      {/* Таргет для кабинета 209 */}
      <a-entity mindar-image-target="targetIndex: 1">
        <a-entity
          text="value: Room 209\nComputer Science Department; align: center; color: white; width: 2"
          position="0 -0.3 0.01"
          geometry="primitive: plane; width: 2.1; height: auto"
          material="color: rgba(0, 0, 0, 0.7)"
        ></a-entity>
      </a-entity>
    </a-scene>
  );
};

export default Test;