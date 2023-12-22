//WeekPage.js
import React, { useEffect, useState } from "react";
import styled, { ThemeProvider } from "styled-components/native";
import { theme } from "./theme";
import { Dimensions, StatusBar, View, Text, StyleSheet } from "react-native";
import CustomModal from "./components/CustomModal";
import Calendar from "./Calendar";
import { useCalendarContext } from "./CalendarProvider";
import IconButton from "./components/IconButton";
import { images } from "./images";

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) => theme.weekitemBackground};
  align-items: center;
  justify-content: flex-start;

`;

const List = styled.ScrollView`
  flex: 1;
  width: ${({ width }) => width - 40}px;
`;

const EventContainer = styled.View`
  background-color: ${({ theme }) => theme.background};
  border-color: gray;
  border-width: 1px;
  flex-direction: row;
  align-items: center;
  border-radius: 30px;
  margin-bottom: 5px;
  padding: 3px;
`;

const EventText = styled.Text`
  flex: 1;
  font-size: 16px;
  padding-left: 10px;
  margin-top: 4px;
`;

const CalendarView = styled.View`
  padding-top: 20px;
`;

function WeekPage({ navigation }) {
  const { events, addEvent, updateEvent, deleteEvent } = useCalendarContext();
  const width = Dimensions.get("window").width;
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [monthTasks, setMonthTasks] = useState("");

  const handleModalClose = ({ text, startDate, endDate }) => {
    if (selectedEvent) {
      updateEvent(selectedEvent.id, { text, startDate, endDate }); // 업데이트된 부분
    } else {
      const newEvent = {
        id: Date.now().toString(),
        startDate,
        endDate,
        text,
      };
      addEvent(newEvent);
    }
    // 모달 닫기
    setSelectedEvent(null);
    const newTaskObject = {
      id: Date.now().toString(),
      text,
      completed: false,
    };
    setMonthTasks(newTaskObject);
    console.log(text, startDate, endDate);
  };

  const handleUpdatePress = (event) => {
    // 업데이트 아이콘 클릭 시 해당 이벤트 정보를 모달에 전달하여 열기
    setSelectedEvent(event);
  };

  const handleDeletePress = (eventId) => {
    // 삭제 아이콘 클릭 시 해당 이벤트 삭제
    deleteEvent(eventId);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <StatusBar
          barStyle="light-content"
          backgroundColor={theme.background}
        />
        <CalendarView>
          <Calendar
            onDayPress={(day) => {
              setSelectedDate(day.dateString);
            }}
          />
        </CalendarView>

        <CustomModal onModalClose={handleModalClose}></CustomModal>

        <List width={width} style={styles.list}>
          {events.map((event) => (
            <EventContainer key={event.id} style={styles.eventContainer}>
              <EventText style={styles.eventText}>
                {event?.startDate?.toLocaleDateString("en-US", {
                  month: "numeric",
                  day: "numeric",
                })}{" "}
                -{" "}
                {event?.endDate?.toLocaleDateString("en-US", {
                  month: "numeric",
                  day: "numeric",
                })}
                {"     "}
                {event.text}
              </EventText>
              <IconButton
                type={images.update}
                onPressOut={() => handleUpdatePress(event)}
              />
              <IconButton
                type={images.delete}
                onPressOut={() => handleDeletePress(event.id)}
              />
            </EventContainer>
          ))}
        </List>
      </Container>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    width: "95%",
    marginTop: 20,
  },
  eventContainer: {
    backgroundColor: theme.background,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 30,
    marginBottom: 5,
    padding: 12,
  },
  eventText: {
    flex: 1,
    fontSize: 16,
    paddingLeft: 10,
    marginTop: 4,
  },
  calendarVeiw: {
    paddingTop: 20,
  },
});

export default WeekPage;
