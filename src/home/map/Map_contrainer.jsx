import React, { useState } from 'react';
import Map from './Map';

const Map_container = () => {
    const [selectedPoint, setSelectedPoint] = useState(null);

    const points = [
        {
            lat: 54.875406,
            lng: 69.135137,
            title: 'Kozybaev University, приемная комиссия',
            type: 'square',
            bounds: [
                [54.875796, 69.135683],
                [54.875714, 69.135829],
                [54.875011, 69.134577],
                [54.87512, 69.134431],
            ],
        },
        {
            lat: 54.876545,
            lng: 69.134236,  
            title: 'Бассейн СКУ им. М. Козыбаева',
            type: 'square',
            bounds: [
                [54.876976, 69.134204],
                [54.87663, 69.133618],  
                [54.876192, 69.134321] ,

                [54.876501, 69.134962],
            ],
        },
    ];

    const handlePointClick = (point) => {
        setSelectedPoint(point);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <Map points={points} selectedPoint={selectedPoint} />
            
            <div style={{ padding: '20px', background: '#f5f5f5', borderRadius: '8px' }}>
                <h3>Список объектов:</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {points.map((point, index) => (
                        <li 
                            key={index}
                            style={{
                                padding: '10px',
                                cursor: 'pointer',
                                background: selectedPoint === point ? '#e0e0e0' : 'transparent',
                                borderRadius: '4px',
                                marginBottom: '8px'
                            }}
                            onClick={() => handlePointClick(point)}
                        >
                            {point.title}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Map_container;