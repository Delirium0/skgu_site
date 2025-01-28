import React from "react";
import Event_bookmark from "./Event_bookmark";
import Eventcreator from "./Eventcreator";
import "./Event.css";
const Event = ({ event_info}) => {
    console.log(event_info)
  return (
    <div>
        <Eventcreator event_creator_name={event_info.event_creator_name} event_creator_image={event_info.event_creator_image}></Eventcreator>
      <div className="event_contrainer">
        <div
          className="background_event"
          style={{ backgroundImage: `url(${event_info.image_background})` }}
        >
          <Event_bookmark></Event_bookmark>
        </div>
      </div>
    </div>
  );
};

export default Event;
