import React, { useEffect, useRef, useState } from 'react';

const Map = ({ points, selectedPoint }) => {
    const mapRef = useRef(null);
    const [apiLoaded, setApiLoaded] = useState(false);
    const [mapInstance, setMapInstance] = useState(null);

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

        return () => {
            document.head.removeChild(script);
        };
    }, []);

    useEffect(() => {
        if (!apiLoaded) return;

        window.DG.then(() => {
            const map = window.DG.map(mapRef.current, {
                center: [54.875406, 69.135137],
                zoom: 13
            });
            setMapInstance(map);

            points.forEach(point => {
                let marker;
                if (point.type === 'square') {
                    if (point.bounds?.length === 4) {
                        marker = window.DG.polygon(point.bounds, {
                            color: '#ff0000',
                            fillColor: '#ff0000',
                            weight: 2,
                        });
                    }
                } else {
                    marker = window.DG.marker([point.lat, point.lng]);
                }
                
                if (marker) {
                    marker.bindPopup(point.title);
                    marker.addTo(map);
                }
            });

            return () => {
                map.remove();
            };
        });
    }, [apiLoaded, points]);

    useEffect(() => {
        if (mapInstance && selectedPoint) {
            mapInstance.setView([selectedPoint.lat, selectedPoint.lng], 17);
        }
    }, [selectedPoint, mapInstance]);

    return apiLoaded ? (
        <div
            id="map"
            ref={mapRef}
            style={{ width: '100%', height: '400px', borderRadius: '8px' }}
        />
    ) : (
        <div style={{ 
            width: '100%', 
            height: '400px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            background: '#f0f0f0',
            borderRadius: '8px'
        }}>
            Загрузка карты...
        </div>
    );
};

export default Map;