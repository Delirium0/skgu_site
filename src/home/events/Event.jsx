import React from "react";
import Event_bookmark from "./Event_bookmark";
import Eventcreator from "./Eventcreator";
import "./Event.css";
import Down_info_block from "./Down_info_block";
const Event = ({ event_info }) => {
  return (
    <div className="event_contrainer">
      <div className="background_event_block">
        <div
          className="background_event"
          style={{ backgroundImage: `url(${event_info.image_background})` }}
        >
          <Event_bookmark />
        </div>
      </div>
      <div className="event_creator_block_overlay">
        <Eventcreator
          event_creator_name={event_info.event_creator_name}
          event_creator_image={event_info.event_creator_image}
        />
      </div>

      <Down_info_block
        time={event_info.event_time}
        raiting={event_info.event_raiting}
      />
    </div>
  );
};

export default Event;
