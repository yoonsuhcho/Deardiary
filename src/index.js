//index.js
import React, { useState, useEffect } from "react";
import styled, { ThemeProvider } from "styled-components/native";
import { theme } from "./theme";
import { Dimensions, StatusBar, View, StyleSheet, Text } from "react-native";
import MonthTask from "./components/MonthTask";
import TodayTask from "./components/DayTask";
import AddIconButton from "./components/addIconButton";
import { images } from "./images";
import CalendarView from "./Calendar";
import IconButton from "./components/IconButton";
import { useCalendarContext } from "./CalendarProvider";
import ScheduleItem from "./components/ScheduleItem";
import moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) => theme.background};
  align-items: center;
  justify-content: flex-start;
`;
const Title = styled.Text`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.done};
  align-self: flex-start;
  margin: 0px 20px;
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

const TimeColumn = styled(View)`
  flex-direction: column;
  width: 100%;
`;

const TimeSlot = styled(View)`
  padding: 8px;
  align-items: center;
  flex-direction: row;
  flex-shrink: 0;
  color: white;
`;

const TimeText = styled(Text)`
  color: ${({ theme }) => theme.text};
  font-size: 15px;
  padding-top: 10px;
  justify-content: center;
`;

function IndexScreen({ navigation }) {
  const { events, deleteEvent } = useCalendarContext();

  const [todayTasks, setTodayTasks] = useState([]);

  const [scheduleData, setScheduleData] = useState([]);
  const [loading, setLoading] = useState(true);

  const width = Dimensions.get("window").width;

  const today = new Date();
  const selectedDate = moment(today).format("MMMM, D");

  const getScheduleKey = (today) => `schedule_${today}`;

  useEffect(() => {
    const loadScheduleData = async () => {
      try {
        const data = await AsyncStorage.getItem(getScheduleKey(selectedDate));
        if (data) {
          setScheduleData(JSON.parse(data));
        } else {
          setScheduleData([]);
        }
      } catch (error) {
        console.error("스케줄 데이터 로드 오류:", error);
      } finally {
        setLoading(false);
      }
    };

    loadScheduleData();
  }, [selectedDate]);

  //Month Plan 삭제
  const handleDeletePress = (eventId) => {
    deleteEvent(eventId);
  };

  const _handleTextChange = (text) => {
    setNewTask(text);
  };

  const saveScheduleData = async (date, data) => {
    try {
      await AsyncStorage.setItem(getScheduleKey(date), JSON.stringify(data));
    } catch (error) {
      console.error("스케줄 데이터 저장 오류:", error);
    }
  };

  const handleDeleteSchedule = (index) => {
    const updatedScheduleData = [...scheduleData];
    updatedScheduleData.splice(index, 1);
    setScheduleData(updatedScheduleData);
    saveScheduleData(selectedDate, updatedScheduleData);
  };

  const renderTimeline = () => {
    const timeline = [];
    for (let hour = 0; hour < 24; hour++) {
      const time = `${hour}:00`;
      const schedulesInHour = scheduleData.filter(
        (item) => item.startTime <= hour && item.endTime > hour
      );

      if (schedulesInHour.length > 0) {
        for (const schedule of schedulesInHour) {
          const duration = moment(schedule.endTime, "HH:mm").diff(
            moment(schedule.startTime, "HH:mm"),
            "hours"
          );

          timeline.push(
            <TimeSlot key={`${time}_${schedule.startTime}`}>
              <ScheduleItem
                key={`${time}_${schedule.startTime}`}
                schedule={schedule}
                onDelete={() =>
                  handleDeleteSchedule(scheduleData.indexOf(schedule))
                }
                onEdit={() => {
                  navigation.navigate("today");
                }}
                duration={duration} // duration 프롭 전달
              />
            </TimeSlot>
          );
        }
      }
    }
    return timeline;
  };

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <StatusBar
          barStyle="light-content"
          backgroundColor={theme.background}
        />
        <CalendarView />

        {/* 월별 계획 섹션 */}
        <View style={{ flexDirection: "row", marginBottom: 5 }}>
          <View style={{ flex: 1, marginLeft: 5 }}>
            <Title>Month Plan</Title>
          </View>
          <View style={{ flex: 1, alignItems: "flex-end", marginRight: 20 }}>
            <AddIconButton
              IconButton
              type={images.Add}
              onPressOut={(id, navigation) => {
                navigation.navigate("week");
              }}
            />
          </View>
        </View>
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
                onPressOut={() => {
                  navigation.navigate("week");
                }}
              />
              <IconButton
                type={images.delete}
                onPressOut={() => handleDeletePress(event.id)}
              />
            </EventContainer>
          ))}
        </List>

        {/* 오늘의 계획 섹션 */}
        <View style={{ flexDirection: "row", marginBottom: 5 }}>
          <View style={{ flex: 1, marginLeft: 5 }}>
            <Title>Today Plan</Title>
          </View>
          <View style={{ flex: 1, alignItems: "flex-end", marginRight: 20 }}>
            <AddIconButton
              IconButton
              type={images.Add}
              onPressOut={(id, navigation) => {
                navigation.navigate("today");
              }}
            />
          </View>
        </View>
        <TimeColumn>{renderTimeline()}</TimeColumn>
      </Container>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    width: "95%",
  },
  eventContainer: {
    backgroundColor: theme.weekitemBackground,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 30,
    marginBottom: 5,
    padding: 5,
  },
  eventText: {
    flex: 1,
    fontSize: 16,
    paddingLeft: 10,
  },
});

export default IndexScreen;
