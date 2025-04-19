import React, { useEffect } from 'react';

const Test = () => {
  useEffect(() => {
    const loadScripts = async () => {
      const injectScript = (src) =>
        new Promise((resolve) => {
          const script = document.createElement('script');
          script.src = src;
          script.async = true;
          script.onload = resolve;
          document.head.appendChild(script);
        });

      if (!window.AFRAME) {
        await injectScript('https://aframe.io/releases/1.6.0/aframe.min.js');
      }
      await injectScript('https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-aframe.prod.js');

      // Обработчик после загрузки скриптов
      const handleTargetEvents = () => {
        const scene = document.querySelector('a-scene');

        scene.addEventListener('renderstart', () => {
          const targets = document.querySelectorAll('[mindar-image-target]');
          targets.forEach((targetEl, index) => {
            targetEl.addEventListener('targetFound', () => {
              if (index === 0) {
                console.log('207');
                document.body.style.backgroundColor = 'red';
              } else if (index === 1) {
                console.log('209');
                document.body.style.backgroundColor = 'blue';
              }
            });

            targetEl.addEventListener('targetLost', () => {
              document.body.style.backgroundColor = ''; // сброс
            });
          });
        });
      };

      // Подождём чуть-чуть и добавим обработчики
      setTimeout(handleTargetEvents, 1000);
    };

    loadScripts();
  }, []);

  return (
    <a-scene
      mindar-image="imageTargetSrc: /targets_207_209.mind;"
      color-space="sRGB"
      renderer="colorManagement: true, physicallyCorrectLights"
      vr-mode-ui="enabled: false"
      device-orientation-permission-ui="enabled: false"
    >
      <a-assets></a-assets>

      <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>

      <a-entity mindar-image-target="targetIndex: 0">
      <a-entity
  text="value: Room 207; align: center; color: white; width: 2"
  position="0 -0.3 0.01"
  geometry="primitive: plane; width: 2.1; height: 0.5"
  material="color: rgba(0, 0, 0, 0.7)"
></a-entity>

      </a-entity>

      <a-entity mindar-image-target="targetIndex: 1">
        <a-entity
          text="value: Room 209; align: center; color: white; width: 2"
          position="0 -0.3 0.01"
          geometry="primitive: plane; width: 2.1; height: 0.5"
          material="color: rgba(0, 0, 0, 0.7)"
        ></a-entity>
      </a-entity>
    </a-scene>
  );
};

export default Test;
