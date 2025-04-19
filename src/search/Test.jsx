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

      scene.addEventListener('renderstart', () => {
        const targets = document.querySelectorAll('[mindar-image-target]');
        targets.forEach((targetEl, index) => {
          targetEl.addEventListener('targetFound', () => {
            if (index === 0) {
              console.log('Найден кабинет 207');
              document.body.style.backgroundColor = 'blue';
            } else if (index === 1) {
              console.log('Найден кабинет 209');
              document.body.style.backgroundColor = 'red';
            }
          });

          targetEl.addEventListener('targetLost', () => {
            document.body.style.backgroundColor = ''; // сброс цвета
          });
        });
      });
    };

    setTimeout(handleTargetEvents, 1000);
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
    >
      <a-assets></a-assets>

      <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>

      <a-entity mindar-image-target="targetIndex: 0"></a-entity>
      <a-entity mindar-image-target="targetIndex: 1"></a-entity>
    </a-scene>
  );
};

export default Test;
