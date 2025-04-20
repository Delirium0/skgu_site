// Test.js
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import styles from './Test.module.css';

const Test = () => {
  const [scriptsLoaded, setScriptsLoaded] = useState(false);
  const [currentRoom, setCurrentRoom] = useState('');
  const [mindFileUrl, setMindFileUrl] = useState('');
  const [loadingConfig, setLoadingConfig] = useState(false);
  const [buildingNumber, setBuildingNumber] = useState('6');
  const [floorNumber, setFloorNumber] = useState('1');
  const [error, setError] = useState(null);
  const [arConfigNotFound, setArConfigNotFound] = useState(false);
  const [configLoadedSuccessfully, setConfigLoadedSuccessfully] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  const buildingOptions = ['6', '7', '8'];
  const floorOptions = ['1', '2', '3', '4', '5'];

  const sceneRef = useRef(null);

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
        // Проверяем, загружены ли уже AFRAME и MINDAR
        if (!window.AFRAME) {
          await injectScript('https://aframe.io/releases/1.6.0/aframe.min.js');
        }
        if (!window.MINDAR) {
          await injectScript('https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-aframe.prod.js');
        }
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
        setArConfigNotFound(false);
        setConfigLoadedSuccessfully(false);
        setShowCamera(false);

        console.log("useEffect сработал:", { buildingNumber, floorNumber });
        try {
            console.log("Начинаю запрос к API:", `${process.env.REACT_APP_API_URL}/ar/config`, { buildingNumber, floorNumber }); 
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/ar/config`,
                {
                    params: {
                        building_number: buildingNumber,
                        floor_number: floorNumber,
                    },
                    responseType: 'blob',
                }
            );
        const blobUrl = URL.createObjectURL(response.data);
        setMindFileUrl(blobUrl);
        setConfigLoadedSuccessfully(true);
        setShowCamera(true);
        console.log("Конфигурация успешно загружена");

      } catch (error) {
        console.error('Ошибка загрузки AR конфигурации:', error);
        if (error.response && error.response.status === 404) {
          console.log("Обнаружена 404 ошибка");
          setArConfigNotFound(true);
          setConfigLoadedSuccessfully(false);
          setShowCamera(false);
          setMindFileUrl('');
        } else {
          setError(error);
          setArConfigNotFound(false);
          setConfigLoadedSuccessfully(false);
          setShowCamera(false);
        }
      } finally {
        setLoadingConfig(false);
      }
    };

    fetchArConfig();
  }, [scriptsLoaded, buildingNumber, floorNumber]);

  useEffect(() => {
    if (arConfigNotFound) {
      const scanningOverlay = document.querySelector('.mindar-ui-overlay.mindar-ui-scanning');
      const compatibilityOverlay = document.querySelector('.mindar-ui-overlay.mindar-ui-compatibility');
      const loadingOverlay = document.querySelector('.mindar-ui-overlay.mindar-ui-loading');

      if (scanningOverlay && scanningOverlay.parentNode) {
        scanningOverlay.parentNode.removeChild(scanningOverlay);
      }
      if (compatibilityOverlay && compatibilityOverlay.parentNode) {
        compatibilityOverlay.parentNode.removeChild(compatibilityOverlay);
      }
      if (loadingOverlay && loadingOverlay.parentNode) {
        loadingOverlay.parentNode.removeChild(loadingOverlay);
      }
    }
  }, [arConfigNotFound]);

  useEffect(() => {
    if (!scriptsLoaded || !mindFileUrl || !configLoadedSuccessfully || arConfigNotFound || !showCamera) return;

    const scene = sceneRef.current;
    if (!scene) {
      console.error('Сцена не найдена');
      return;
    }

    const targets = scene.querySelectorAll('[mindar-image-target]');
    targets.forEach(targetEl => {
      targetEl.replaceWith(targetEl.cloneNode(true));
    });

    const handleTargetEvents = () => {
      const targets = scene.querySelectorAll('[mindar-image-target]');
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
  }, [scriptsLoaded, mindFileUrl, configLoadedSuccessfully, arConfigNotFound, showCamera]);

  useEffect(() => {
    return () => {
      const cleanupDelay = 500; // Задержка в 100 миллисекунд (можете настроить)

      setTimeout(() => {
        const scanningOverlay = document.querySelector('.mindar-ui-overlay.mindar-ui-scanning');
        const compatibilityOverlay = document.querySelector('.mindar-ui-overlay.mindar-ui-compatibility');
        const loadingOverlay = document.querySelector('.mindar-ui-overlay.mindar-ui-loading');

        if (scanningOverlay && scanningOverlay.parentNode) {
          scanningOverlay.parentNode.removeChild(scanningOverlay);
        }
        if (compatibilityOverlay && compatibilityOverlay.parentNode) {
          compatibilityOverlay.parentNode.removeChild(compatibilityOverlay);
        }
        if (loadingOverlay && loadingOverlay.parentNode) {
          loadingOverlay.parentNode.removeChild(loadingOverlay);
        }
      }, cleanupDelay); // Задержка перед выполнением очистки
    };
  }, []);


  const handleBuildingChange = (e) => {
    setBuildingNumber(e.target.value);
  };

  const handleFloorChange = (e) => {
    setFloorNumber(e.target.value);
  };


  return (
    <div className={styles.arPage}>
      <div className={styles.arSelectors}>
        <div className={styles.arSelectorGroup}>
          <label htmlFor="buildingNumber" className={styles.arLabel}>Корпус:</label>
          <select
            id="buildingNumber"
            className={styles.arSelect}
            value={buildingNumber}
            onChange={handleBuildingChange}
          >
            <option value="" disabled>Выберите корпус</option>
            {buildingOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        <div className={styles.arSelectorGroup}>
          <label htmlFor="floorNumber" className={styles.arLabel}>Этаж:</label>
          <select
            id="floorNumber"
            className={styles.arSelect}
            value={floorNumber}
            onChange={handleFloorChange}
          >
            <option value="" disabled>Выберите этаж</option>
            {floorOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>

      {loadingConfig && <div className={styles.loading}>Загрузка AR...</div>}

      {arConfigNotFound && (
        <div className={`${styles.error}`}>
          AR конфигурация не найдена для данного корпуса и этажа.
          Пожалуйста, выберите другие параметры.
        </div>
      )}

      {error && !arConfigNotFound && (
        <div className={`${styles.error}`}>Ошибка: {error.message}</div>
      )}

      {showCamera && !loadingConfig && !arConfigNotFound && !error && (
        <>
          {currentRoom ? (
            <h1 className={styles.arMessage}>
              Кабинет {currentRoom}
            </h1>
          ) : (
            <h1 className={styles.arMessage}>
              Наведите камеру на маркер
            </h1>
          )}

          <div className={styles.arCameraContainer}>
            {mindFileUrl && scriptsLoaded && configLoadedSuccessfully && !arConfigNotFound && (
              <a-scene
                ref={sceneRef}
                mindar-image={`imageTargetSrc: ${mindFileUrl}; autoStart: true;`}
                color-space="sRGB"
                renderer="colorManagement: true, physicallyCorrectLights"
                vr-mode-ui="enabled: false"
                device-orientation-permission-ui="enabled: false"
                className={arConfigNotFound ? styles['ar-config-not-found'] : ''}
              >
                <a-assets></a-assets>
                <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>
                <a-entity mindar-image-target="targetIndex: 0"></a-entity>
                <a-entity mindar-image-target="targetIndex: 1"></a-entity>
              </a-scene>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Test;