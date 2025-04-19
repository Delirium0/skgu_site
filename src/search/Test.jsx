import React, { useEffect, useState } from 'react';

const Test = () => {
  const [scriptsLoaded, setScriptsLoaded] = useState(false);

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

      setScriptsLoaded(true);
    };

    loadScripts();
  }, []);

  useEffect(() => {
    if (!scriptsLoaded) return;

    const handleTargetEvents = () => {
      const scene = document.querySelector('a-scene');

      if (!scene) {
        console.warn('Сцена не найдена!');
        return;
      }

      const setupListeners = () => {
        const targets = document.querySelectorAll('[mindar-image-target]');
        targets.forEach((targetEl, index) => {
          targetEl.addEventListener('loaded', () => {
            console.log(`Target ${index} loaded`);

            targetEl.addEventListener('targetFound', () => {
              console.log(`Найден кабинет ${index === 0 ? '207' : '209'}`);
              document.body.style.backgroundColor = index === 0 ? 'blue' : 'red';
            });

            targetEl.addEventListener('targetLost', () => {
              console.log(`Потерян кабинет ${index === 0 ? '207' : '209'}`);
              document.body.style.backgroundColor = '';
            });
          });
        });
      };

      // Подождём немного, чтобы элементы точно появились
      setTimeout(setupListeners, 500);
    };

    // Дождаться события отрисовки сцены
    const scene = document.querySelector('a-scene');
    if (scene) {
      scene.addEventListener('renderstart', handleTargetEvents);
    }
  }, [scriptsLoaded]);

  if (!scriptsLoaded) {
    return <div>Загрузка AR...</div>;
  }

  return (
    <a-scene
      mindar-image="imageTargetSrc: /targets_207_209.mind;"
      color-space="sRGB"
      renderer="colorManagement: true, physicallyCorrectLights"
      vr-mode-ui="enabled: false"
      device-orientation-permission-ui="enabled: false"
      embedded
    >
      <a-assets></a-assets>

      <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>

      <a-entity mindar-image-target="targetIndex: 0">
        <a-plane position="0 0 0" width="1" height="1" color="blue" rotation="0 0 0"></a-plane>
      </a-entity>

      <a-entity mindar-image-target="targetIndex: 1">
        <a-plane position="0 0 0" width="1" height="1" color="red" rotation="0 0 0"></a-plane>
      </a-entity>
    </a-scene>
  );
};

export default Test;
