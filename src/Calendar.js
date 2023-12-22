//Calendar.js
import React, { useContext, useState } from "react";
import { format } from "date-fns";
import { Calendar } from "react-native-calendars";
import { StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useCalendarContext } from "./CalendarProvider";
import { theme } from "./theme";
import styled, { ThemeProvider } from "styled-components/native";

const ColoredDayText = styled.Text`
  color: ${({ theme }) => theme.text};
`;

const CustomDayContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: white;
`;

const CustomCalendar = styled(Calendar)`
  margin-top: 15%;
  margin-bottom: 10px;
  width: 350px;
  height: 370px;
  border-radius: 30px;
  background-color: white;
  border-color: gray;
  border-width: 1px;
`;

function CalendarView() {
  const { events } = useCalendarContext();

  const navigation = useNavigation();

  const handleDayPress = (day) => {
    navigation.navigate("diary", { selectedDate: day.dateString });
  };

  const posts = events.map((event) => {
    return {
      id: event.id,
      title: "제목입니다.",
      contents: "내용입니다.",
      startDate: event.startDate.toISOString("en-US"),
      endDate: event.endDate.toISOString("en-US"),
    };
  });

  const markedDates = posts.reduce((acc, current) => {
    const startDate = new Date(current.startDate);
    const endDate = new Date(current.endDate);

    for (
      let date = startDate;
      date <= endDate;
      date.setDate(date.getDate() + 1)
    ) {
      const formattedDate = format(date, "yyyy-MM-dd");
      acc[formattedDate] = { marked: true };
    }

    return acc;
  }, {});

  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );
  const markedSelectedDates = {
    ...markedDates,
    [selectedDate]: {
      selected: true,
      marked: markedDates[selectedDate]?.marked,
    },
  };

  return (
    <ThemeProvider theme={theme}>
      <CustomCalendar
        markedDates={markedSelectedDates}
        theme={{
          arrowColor: theme.diaryitemBackground,
          dotColor: theme.weekitemBackground,
          backgroundColor: theme.background,
        }}
        renderDay={(day, item) => {
          // 추가: 선택된 날짜 스타일링
          const isSelected = item && item.selected;
          // 추가: 오늘 날짜 스타일링
          const isToday = day.dateString === format(new Date(), "yyyy-MM-dd");

          return (
            <CustomDayContainer>
              {isSelected ? (
                <ColoredDayText style={{ color: "red" }}>
                  {day.day}
                </ColoredDayText>
              ) : isToday ? (
                <ColoredDayText style={{ color: "red" }}>
                  {day.day}
                </ColoredDayText>
              ) : (
                <ColoredDayText>{day.day}</ColoredDayText>
              )}
            </CustomDayContainer>
          );
        }}
        onDayPress={handleDayPress}
      />
    </ThemeProvider>
  );
}

export default CalendarView;
