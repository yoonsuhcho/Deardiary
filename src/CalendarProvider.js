//CalendarProvier.js
import React, { createContext, useContext, useState } from "react";

const CalendarContext = createContext();

export const useCalendarContext = () => {
  return useContext(CalendarContext);
};

export const CalendarProvider = ({ children }) => {
  const [events, setEvents] = useState([]);

  const addEvent = (event) => {
    setEvents((prevEvents) => [...prevEvents, event]);
  };

  const updateEvent = (eventId, updatedEvent) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === eventId ? { ...event, ...updatedEvent } : event
      )
    );
  };

  const deleteEvent = (eventId) => {
    setEvents((prevEvents) =>
      prevEvents.filter((event) => event.id !== eventId)
    );
  };

  return (
    <CalendarContext.Provider
      value={{ events, addEvent, updateEvent, deleteEvent }}
    >
      {children}
    </CalendarContext.Provider>
  );
};
