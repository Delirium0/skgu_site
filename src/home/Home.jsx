import React, { useState } from 'react';
import Event from './events/Event';
import event_background from './events/1111.png'
import event_creator_image from './events/ава.png'
import './../Main.css'
const Home = () => {
    const [event, setEvent] = useState({
        id: 1,
        image_background: event_background,
        event_creator_name: 'Vyachesla Savinkov',
        event_creator_image: event_creator_image,
        event_raiting: 4.2,
        event_time: new Date('2025-02-26T18:00:00'),
      });


    return (
        <div>
            <Event event_info={event}></Event>
            <Event event_info={event}></Event>
            <Event event_info={event}></Event>
            </div>
    );
};

export default Home;