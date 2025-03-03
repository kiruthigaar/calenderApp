import React, { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import Modal from "react-modal";
import { FaPlus } from "react-icons/fa";
import EventList from "./EventList";

const calendarData = [
  {
    id: 1,
    summary: "1st Round",
    desc: "1st Round",
    start: "2024-08-29T18:00:00+05:30",
    end: "2024-08-29T18:40:00+05:30",
    link: "http://www.hhh.com",
    user_det: {
      handled_by: { firstName: "Vinodhini", lastName: "HR" },
      job_id: { jobRequest_Title: "Django Developer", jobRequest_Role: "Software Engineer" },
    },
  },
  {
    id: 2,
    summary: "Test",
    desc: "Test",
    start: "2024-08-29T18:00:00+05:30",
    end: "2024-08-29T18:40:00+05:30",
    link: "http://www.hhh.com",
    user_det: {
      handled_by: { firstName: "Vinodhini", lastName: "HR" },
      job_id: { jobRequest_Title: "Django Developer", jobRequest_Role: "Software Engineer" },
    },
  },
  {
    id: 3,
    summary: "2nd Round",
    desc: "2nd Round",
    start: "2024-08-29T20:00:00+05:30",
    end: "2024-08-29T21:00:00+05:30",
    link: "http://www.hhh.com",
    user_det: {
      handled_by: { firstName: "Vinodhini", lastName: "HR" },
      job_id: { jobRequest_Title: "Django Developer", jobRequest_Role: "Software Engineer" },
    },
  },
];

const CalendarApp = () => {
  const [events, setEvents] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [eventCount, setEventCount] = useState(0);
  const calendarRef = useRef(null);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [detailsCardPosition, setDetailsCardPosition] = useState([]);
  const [cardPosition, setCardPosition] = useState({ x: 0, y: 0 });
  const [showCard, setShowCard] = useState(false);
  const [groupedEvents, setGroupedEvents] = useState({});
  const [showDetailsCard, setShowDetailsCard] = useState(false);
  const [selectedEventDetails, setSelectedEventDetails] = useState(null);

  useEffect(() => {
    const dateCounts = {};
    const timeSlotCounts = {};

    const groupEventsByView = (events, currentView) => {
      const groupedData = {};

      events.forEach((event) => {
        const eventDate = event.start.split("T")[0]; 
        const eventTimeSlot = event.start.substring(0, 16); 
        const interviewer = `${event.user_det.handled_by.firstName} ${event.user_det.handled_by.lastName}`;

        
        dateCounts[eventDate] = (dateCounts[eventDate] || 0) + 1;
      
        timeSlotCounts[eventTimeSlot] = (timeSlotCounts[eventTimeSlot] || 0) + 1;

        if (!groupedData[eventDate]) {
          groupedData[eventDate] = {}; 
        }

        if (!groupedData[eventDate][interviewer]) {
          groupedData[eventDate][interviewer] = []; 
        }

        groupedData[eventDate][interviewer].push(event); 
      });

      return groupedData;
    };

    
    const updateEvents = (currentView) => {
      const groupedEvents = groupEventsByView(calendarData, currentView);
      setGroupedEvents(groupedEvents);
      
      const formattedEvents = Object.entries(groupedEvents).flatMap(([date, interviewers]) =>
        Object.entries(interviewers).flatMap(([interviewer, events]) =>
          events.map((event) => {
            const eventTimeSlot = event.start.substring(0, 16); 

            return {
              id: event.id,
              title: `${event.user_det.job_id.jobRequest_Title} (${interviewer})`,
              start: event.start,
              end: event.end,
              extendedProps: {
                description: event.desc,
                link: event.link,
                interviewer,
                jobTitle: event.user_det.job_id.jobRequest_Title,
                jobRole: event.user_det.job_id.jobRequest_Role,
                totalEventsOnDate: dateCounts[date], 
                totalEventsInTimeSlot: timeSlotCounts[eventTimeSlot],
              },
            };
          })
        )
      );

      setEvents(formattedEvents);
      setEventCount(formattedEvents.length);
    };

    updateEvents("dayGridMonth");

  }, [calendarData]);

  const openEventModal = () => {
    setFilteredEvents(events);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const changeYear = (event) => {
    const newYear = event.target.value;
    setSelectedYear(newYear);
    if (calendarRef.current) {
      calendarRef.current.getApi().gotoDate(`${newYear}-01-01`);
    }
  };

  const eventClassNames = (eventInfo) => ["custom-event", "event-count"];

  //   const currentView = viewInfo.view.type;

  //   console.log("Current View Changed:", currentView);

  //   if (currentView === "dayGridMonth") {
  //     // Group events by date
  //     const groupedByDate = {};
  //     events.forEach((event) => {
  //       const eventDate = event.start.split("T")[0];

  //       if (!groupedByDate[eventDate]) {
  //         groupedByDate[eventDate] = [];
  //       }
  //       groupedByDate[eventDate].push(event);
  //     });

  //     setGroupedEvents(groupedByDate);
  //   } else {
   
  //     const groupedByTime = {};
  //     events.forEach((event) => {
  //       const eventTimeSlot = event.start.substring(0, 16);

  //       if (!groupedByTime[eventTimeSlot]) {
  //         groupedByTime[eventTimeSlot] = [];
  //       }
  //       groupedByTime[eventTimeSlot].push(event);
  //     });

  //     setGroupedEvents(groupedByTime);
  //   }
  // };

  const renderEventContent = (eventInfo) => {
    const calendarApi = calendarRef.current?.getApi();
    const currentView = calendarApi?.view.type;

    const count =
      currentView === "dayGridMonth"
        ? eventInfo.event.extendedProps.totalEventsOnDate
        : eventInfo.event.extendedProps.totalEventsInTimeSlot;

    return (
      <div className="custom-event relative bg-blue-500 text-white p-2 rounded shadow-md">
        <strong>{eventInfo.event.title}</strong>
        <p className="text-sm">Interviewer: {eventInfo.event.extendedProps.interviewer}</p>
        <p className="text-sm">
          Time:{" "}
          {new Date(eventInfo.event.start).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} -{" "}
          {new Date(eventInfo.event.end).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </p>
        {count > 1 && <span className="event-count">{count}</span>}
      </div>
    );
  };

   const handleEventClick = (info) => {
    console.log("Event Clicked:", info.event);
    const calendarApi = calendarRef.current?.getApi();
    const currentView = calendarApi?.view.type;
    let key;
    const interviewer = info.event.extendedProps.interviewer;

    if (currentView === "dayGridMonth") {
      key = info.event.startStr.split("T")[0];
      if (groupedEvents[key] && groupedEvents[key][interviewer]) {
        console.log("hiiiiiiiiiii")
        setSelectedEvents(groupedEvents[key][interviewer]);
        setCardPosition({ x: info.jsEvent.clientX, y: info.jsEvent.clientY });
        setShowCard(true);
      } else {
        console.log("No matching events found in month view");
        setShowCard(false);
      }
    } else {
      
      key = new Date(info.event.start).toISOString().substring(0, 16);

      const eventsInSlot = events.filter((evt) => {
        const evtStartStr = new Date(evt.start).toISOString().substring(0, 16);
        return evtStartStr === key;
      });

      const filtered = eventsInSlot.filter((evt) => evt.extendedProps.interviewer === interviewer);

      if (filtered.length > 0) {
        setSelectedEvents(filtered);
        setCardPosition({ x: info.jsEvent.clientX, y: info.jsEvent.clientY });
        setShowCard(true);
      } else {
        console.log("No matching events found in day/week view for this interviewer");
        setShowCard(false);
      }
    }
  };
  useEffect(() => {
    console.log("Selected Events Updated:", selectedEvents);
    if (selectedEvents.length > 0) {
      setShowCard(true);
    }
  }, [selectedEvents]);

  const handleClick = (event, cardPosition) => {
    setSelectedEventDetails(event);
    setShowDetailsCard(true);

    setDetailsCardPosition({
      x: cardPosition?.x + 20,
      y: cardPosition?.y + 20,  
    });
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header flex justify-between items-center p-4 bg-gray-100 shadow-md">
        <h2 className="text-lg font-bold">Your To-Do's</h2>
        <select value={selectedYear} onChange={changeYear} className="border p-1 rounded">
          {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i).map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <button className="event-count-button bg-blue-600 text-white px-3 py-1 rounded" onClick={openEventModal}>
          Events: {eventCount}
        </button>
      </div>

      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={events}
        eventClassNames={eventClassNames}
        eventContent={renderEventContent}
        eventClick={handleEventClick}
        height="100vh"
      />

      {showDetailsCard && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-md z-50"
          onClick={() => setShowDetailsCard(false)}
        ></div>
      )}

      {showCard && selectedEvents && (
        <span
          className="custom-event absolute bg-white text-black p-3 rounded shadow-lg border border-gray-200"
          style={{
            top: cardPosition?.y + "px",
            left: cardPosition?.x + "px",
            position: "absolute",
            zIndex: 1000,
            width: "300px",
            backgroundColor: "#fff",
            boxShadow: "0px 4px 8px rgba(0,0,0,0.2)",
            borderRadius: "8px",
            padding: "10px"

          }}
        >
          <h3 className="font-bold border-b pb-2 mb-2 text-gray-800">
            {selectedEvents[0]?.user_det?.job_id?.jobRequest_Title ||
              selectedEvents[0]?.extendedProps?.jobTitle || "Unknown Job Title"}
          </h3>
         
          {selectedEvents.map((event) => {
            const interviewerName = event.user_det?.handled_by
              ? `${event.user_det.handled_by.firstName} ${event.user_det.handled_by.lastName}`
              : event.extendedProps?.interviewer || "Unknown Interviewer";

            const discription = event.summary
              ? event.summary
              : event.extendedProps?.description || "Unknown description";

            return (
              <div key={event.id} className="mb-3 pb-2 border-b border-gray-300">
                <a href={event.url} onClick={() => handleClick(event)}>
                  {discription}
                </a>
                <br />
                <span className="text-sm text-gray-600">
                  Interviewer: {interviewerName}
                </span>
                <span className="block text-sm">
                  Date: {new Date(event.start).toLocaleDateString()}
                </span>
                <span className="block text-sm">
                  Time: {new Date(event.start).toLocaleTimeString()} - {new Date(event.end).toLocaleTimeString()}
                </span>
              </div>
            );
          })}

          <button onClick={() => setShowCard(false)} style={{ backgroundColor: "#f44336", color: "#fff", border: "none", padding: "8px 12px", borderRadius: "5px", cursor: "pointer" }}>
            Close
          </button>
        </span>
      )}


      {showDetailsCard && selectedEventDetails && (
        <div
          className="custom-event absolute bg-white text-black p-3 rounded shadow-lg border border-gray-200"
          style={{
            top: cardPosition?.y + "px",
            left: cardPosition?.x + "px",
            position: "absolute",
            zIndex: 1000,
            width: "300px",
            backgroundColor: "#fff",
            boxShadow: "0px 4px 8px rgba(0,0,0,0.2)",
            borderRadius: "8px",
            padding: "10px"

          }}
        >        
          <button style={{ float: "right" }}
            onClick={() => setShowDetailsCard(false)}        
          >
            ×
          </button>   
          <div className="flex flex-row">          
            <div className="w-1/2 p-4">
              <h3 className="font-bold text-gray-800 mb-2">
                Interview With: {selectedEventDetails?.user_det?.handled_by?.firstName}
              </h3>
              <p className="text-sm mb-1">
                <strong>Position:</strong> {selectedEventDetails?.user_det?.job_id?.jobRequest_Title}
              </p>
              <p className="text-sm mb-1">
                <strong>Created By:</strong>
              </p>
              <p className="text-sm mb-1">
                <strong>Interview Date:</strong> {new Date(selectedEventDetails.start).toLocaleDateString()}
              </p>
              <p className="text-sm mb-1">
                <strong>Interview Time:</strong>{" "}
                {new Date(selectedEventDetails.start).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} -{" "}
                {new Date(selectedEventDetails.end).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
              <p className="text-sm mb-1">
                <strong>Interview Via:</strong> Google Meet
              </p>
            </div>

            <div className="w-1/2 p-4 flex flex-col items-center justify-start">
              <img
                src="googleMeet.png"
                alt="Google Meet"
                width="183px"
                className="my-2"
              />

              <button className="bg-blue-500 text-white px-4 py-2 rounded mb-3" style={{ float: "right" }}
                onClick={() => window.open(selectedEventDetails.link, "_blank")}
              >
                JOIN
              </button>

              <div className="flex flex-col w-full space-y-2">
                <button className="flex items-center justify-between bg-gray-200 px-2 py-1 rounded">
                  <span>Resume.docx</span>
                  <i className="fa fa-eye ml-2"></i>
                </button>
                <button className="flex items-center justify-between bg-gray-200 px-2 py-1 rounded">
                  <span>Audio Call</span>
                  <i className="fa fa-eye ml-2"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarApp;
