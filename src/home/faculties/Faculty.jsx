import React from 'react';
import './Faculty.css'
const Faculty = ({event_info}) => {
    return (
        <div className="faculties">
            <div className="faculty-icon">
                {event_info.icon}
            </div>
            <div>
            {event_info.faculty_name}

            </div>
        </div>
    );
};

export default Faculty;