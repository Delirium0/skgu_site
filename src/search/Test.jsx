import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Test = () => {
  const [scriptsLoaded, setScriptsLoaded] = useState(false);
  const [currentRoom, setCurrentRoom] = useState('');
  const [mindFileUrl, setMindFileUrl] = useState(''); // Теперь храним Blob URL
  const [loadingConfig, setLoadingConfig] = useState(false);
  const [buildingNumber, setBuildingNumber] = useState('6');
  const [floorNumber, setFloorNumber] = useState('1');
  const [error, setError] = useState(null);

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
        setError(error);
      }
    };

    loadScripts();
  }, []);

  useEffect(() => {
    if (!scriptsLoaded) return;

    const fetchArConfig = async () => {
      setLoadingConfig(true);
      setError(null);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/ar/config`,
          {
            params: {
              building_number: buildingNumber,
              floor_number: floorNumber,
            },
            responseType: 'blob', // Ожидаем Blob
          }
        );

        // Создаем URL для Blob
        const blobUrl = URL.createObjectURL(response.data);
        setMindFileUrl(blobUrl);
      } catch (error) {
        console.error('Ошибка загрузки AR конфигурации:', error);
        setError(error);
      } finally {
        setLoadingConfig(false);
      }
    };

    fetchArConfig();
  }, [scriptsLoaded, buildingNumber, floorNumber]);

  useEffect(() => {
    if (!scriptsLoaded || !mindFileUrl) return;

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
          setCurrentRoom(room);
          document.body.style.backgroundColor = index === 0 ? 'blue' : 'red';
        });

        targetEl.addEventListener('targetLost', () => {
          console.log(`Потерян кабинет ${index === 0 ? '207' : '209'}`);
          setCurrentRoom('');
          document.body.style.backgroundColor = '';
        });
      });
    };

    if (scene.hasLoaded) {
      handleTargetEvents();
    } else {
      scene.addEventListener('loaded', handleTargetEvents);
    }
  }, [scriptsLoaded, mindFileUrl]);

  const handleBuildingChange = (e) => {
    setBuildingNumber(e.target.value);
  };

  const handleFloorChange = (e) => {
    setFloorNumber(e.target.value);
  };

  if (!scriptsLoaded || loadingConfig) {
    return <div>Загрузка AR...</div>;
  }

  if (error) {
    return <div>Ошибка: {error.message}</div>;
  }

  return (
    <div>
      <div>
        <label htmlFor="buildingNumber">Корпус:</label>
        <input
          type="text"
          id="buildingNumber"
          value={buildingNumber}
          onChange={handleBuildingChange}
        />
      </div>
      <div>
        <label htmlFor="floorNumber">Этаж:</label>
        <input
          type="text"
          id="floorNumber"
          value={floorNumber}
          onChange={handleFloorChange}
        />
      </div>

      {currentRoom ? (
      <h1 style={{ color: 'white', textAlign: 'center' }}>
        Кабинет {currentRoom}
      </h1>
    ) : (
      <h1 style={{ color: 'white', textAlign: 'center' }}>
        Наведите камеру на маркер
      </h1>
    )}

    {mindFileUrl && ( // Условный рендеринг a-scene
      <a-scene
        mindar-image={`imageTargetSrc: ${mindFileUrl}; autoStart: true;`}
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
    )}
  </div>
);};

export default Test;