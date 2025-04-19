import React, { useEffect, useState } from 'react';

const Test = () => {
  const [scriptsLoaded, setScriptsLoaded] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(''); // Состояние для текста (207, 209 или пусто)

  useEffect(() => {
    const loadScripts = async () => {
      const injectScript = (src) =>
        new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = src;
          script.async = true;
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });

      try {
        if (!window.AFRAME) {
          await injectScript('https://aframe.io/releases/1.6.0/aframe.min.js');
        }
        await injectScript('https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-aframe.prod.js');
        setScriptsLoaded(true);
      } catch (error) {
        console.error('Ошибка загрузки скриптов:', error);
      }
    };

    loadScripts();
  }, []);

  useEffect(() => {
    if (!scriptsLoaded) return;

    const scene = document.querySelector('a-scene');
if (!scene) {
      console.error('Сцена не найдена');
      return;
    }

    const handleTargetEvents = () => {
      const targets = document.querySelectorAll('[mindar-image-target]');
      if (targets.length === 0) {
        console.error('Цели MindAR не найдены');
        return;
      }

      targets.forEach((targetEl, index) => {
        targetEl.addEventListener('targetFound', () => {
          const room = index === 0 ? '207' : '209';
          console.log(`Найден кабинет ${room}`);
          setCurrentRoom(room); // Устанавливаем текст для отображения
          document.body.style.backgroundColor = index === 0 ? 'blue' : 'red';
        });

        targetEl.addEventListener('targetLost', () => {
          console.log(`Потерян кабинет ${index === 0 ? '207' : '209'}`);
          setCurrentRoom(''); // Сбрасываем текст
          document.body.style.backgroundColor = '';
        });
      });
    };

    if (scene.hasLoaded) {
      handleTargetEvents();
    } else {
      scene.addEventListener('loaded', handleTargetEvents);
    }
  }, [scriptsLoaded]);

  if (!scriptsLoaded) {
    return <div>Загрузка AR...</div>;
  }

  return (
    <div>
      {/* Текст на странице */}
      {currentRoom ? (
        <h1 style={{ color: 'white', textAlign: 'center' }}>Кабинет {currentRoom}</h1>
      ) : (
        <h1 style={{ color: 'white', textAlign: 'center' }}>Наведите камеру на маркер</h1>
      )}

      {/* AR-сцена */}
      <a-scene
        mindar-image="imageTargetSrc: /targets_207_209.mind; autoStart: true;"
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
    </div>
  );
};

export default Test;