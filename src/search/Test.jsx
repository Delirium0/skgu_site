import React, { useEffect, useState } from 'react';

const Test = () => {
  const [roomNumber, setRoomNumber] = useState(null); // Состояние для хранения номера комнаты

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
        };
      } else {
        const mindarScript = document.createElement('script');
        mindarScript.src = 'https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-aframe.prod.js';
        mindarScript.async = true;
        document.head.appendChild(mindarScript);
      }
    };

    loadScripts();
  }, []);

  const handleTargetFound = (targetIndex) => {
    if (targetIndex === 0) {
      setRoomNumber('207');
    } else if (targetIndex === 1) {
      setRoomNumber('209');
    }
  };

  const handleTargetLost = () => {
    setRoomNumber(null); // Сбрасываем номер комнаты, когда мишень потеряна
  };

  return (
    <div style={{ position: 'relative' }}>
      <a-scene
        mindar-image="imageTargetSrc: /office_207.mind, /office_209.mind;" // Указываем оба файла .mind
        color-space="sRGB"
        renderer="colorManagement: true, physicallyCorrectLights"
        vr-mode-ui="enabled: false"
        device-orientation-permission-ui="enabled: false"
        onTargetFound={(e) => handleTargetFound(e.detail.targetIndex)} // Обработчик для targetFound
        onTargetLost={handleTargetLost} // Обработчик для targetLost
      >
        <a-assets>
          <a-asset-item
            id="avatarModel"
            src="https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.2.5/examples/image-tracking/assets/card-example/softmind/scene.gltf"
          ></a-asset-item>
        </a-assets>

        <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>

        {/* Первая мишень (targetIndex: 0) - office_207.mind */}
        <a-entity mindar-image-target="targetIndex: 0">
          {/* Здесь можно добавить 3D контент для первой мишени, если нужно */}
        </a-entity>

        {/* Вторая мишень (targetIndex: 1) - office_209.mind */}
        <a-entity mindar-image-target="targetIndex: 1">
          {/* Здесь можно добавить 3D контент для второй мишени, если нужно */}
        </a-entity>

      </a-scene>

      {/* HTML элемент для текста, позиционированный поверх сцены, отображается условно */}
      {roomNumber && (
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          // Изменяем цвет текста на синий
          color: 'blue',
          padding: '10px',
          borderRadius: '5px',
          zIndex: 10,
          textAlign: 'center'
        }}>
          Room {roomNumber}<br />
          Information Systems Department
        </div>
      )}
    </div>
  );
};

export default Test;