import React from 'react'

const EventList = ({ events, onClose }) => {
    return (
      <div className="event-list absolute bg-white shadow-lg rounded-lg p-4 w-80" style={{ zIndex: 1000 }}>
        {events.map((event) => (
          <div key={event.id} className="border-l-4 border-blue-500 p-2 mb-2 bg-gray-100 rounded">
            <h3 className="font-bold text-gray-800">{event.user_det.job_id.jobRequest_Title}</h3>
            <p className="text-sm text-gray-600">{event.summary}</p>
            <p className="text-xs text-gray-500">
              <strong>Interviewer:</strong> {event.user_det.handled_by.firstName} {event.user_det.handled_by.lastName}
            </p>
            <p className="text-xs text-gray-500">
              <strong>Time:</strong>{" "}
              {new Date(event.start).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} -{" "}
              {new Date(event.end).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </p>
            <a href={event.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-xs">
              Meeting Link
            </a>
          </div>
        ))}
        <button onClick={onClose} className="bg-red-500 text-white px-3 py-1 rounded w-full mt-2">
          Close
        </button>
      </div>
    );
  };
  

export default EventList
