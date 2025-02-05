import React, { useEffect, useRef, useState } from 'react';

const Map = () => {
  const mapRef = useRef(null);
  const [apiLoaded, setApiLoaded] = useState(false);

  const points = [
    { lat: 54.98, lng: 82.89, title: 'Пин 1' },
    { lat: 54.97, lng: 82.90, title: 'Пин 2' },
    { lat: 54.99, lng: 82.88, title: 'Пин 3' },
    { lat: 54.985, lng: 82.895, title: 'Пин 4' },
    { lat: 54.975, lng: 82.885, title: 'Пин 5' },
    { lat: 55.00, lng: 82.90, title: 'Пин 6' },
    { lat: 54.96, lng: 82.87, title: 'Пин 7' },
    { lat: 54.995, lng: 82.91, title: 'Пин 8' },
    { lat: 54.98, lng: 82.875, title: 'Пин 9' },
    { lat: 54.97, lng: 82.895, title: 'Пин 10' },
  ];


  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://maps.api.2gis.ru/2.0/loader.js?pkg=full';
    script.async = true;
    script.onload = () => {
      console.log("2GIS API loaded successfully!");
      setApiLoaded(true);
    };
    script.onerror = () => {
      console.error("Error loading 2GIS API");
    };
    document.head.appendChild(script);


    const initializeMap = () => {
      if (window.DG) {
        window.DG.then(() => {
          const map = window.DG.map(mapRef.current, {
            center: [54.98, 82.89],
            zoom: 13
          });

          // Добавляем пины из массива
          points.forEach(point => {
            window.DG.marker([point.lat, point.lng])
              .addTo(map)
              .bindPopup(point.title);
          });

        });
      } else {
        setTimeout(initializeMap, 500);
        console.warn("2GIS API not loaded yet. Retrying...");
      }
    };


    if (apiLoaded) {
      initializeMap();
    }

    return () => {
      // Cleanup (optional)
    };
  }, [apiLoaded, points]); // Важно: points добавлен как зависимость

  return apiLoaded ? (
    <div
      id="map"
      ref={mapRef}
      style={{ width: '500px', height: '400px' }}
    />
  ) : (
    <div>Загрузка карты...</div>
  );
};

export default Map;