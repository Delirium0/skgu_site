import React, { useState } from 'react';
import Event from './events/Event';
import event_background from './events/1111.png'
import event_creator_image from './events/2222.png'
const Home = () => {
    const [event, setEvent] = useState({id: 1, image_background: event_background, event_creator_name: 'Vyacheslav Savinkov', event_creator_image: event_creator_image})



    return (
        <div>
            {/* <Card></Card> */}
            <Event event_info={event}></Event>
        </div>
    );
};

export default Home;