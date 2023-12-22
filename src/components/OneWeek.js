import { View, Text, TouchableOpacity } from "react-native";
import moment from "moment";
import styled from "styled-components/native";
import React, { useState } from "react";

const Container = styled.View`
  margin: 10px;
  flex-direction: row;
  margin-left: 25px;
  margin-right: 25px;
  padding-bottom: 15px;
  background-color: ${({ theme }) => theme.background};
  border-color: gray;
  border-width: 1px;
  elevation: 4;
  border-radius: 20px;
`;

const TableCell = styled.View`
  flex: 1;
  align-items: center;
  margin: 0;
`;

const WeekdayText = styled.Text`
  margin-top: 20px;
  margin-bottom: 5px;
  color: gray;
  font-size: 12px;
  border-bottom-width: 1px;
  border-bottom-color: #d3d3d3;
`;

const DayText = styled.Text`
  font-size: 20px;
  font-weight: ${(props) => (props.isToday ? "bold" : "normal")};
`;

const SelectedDay = styled.View`
  background-color: #efdbd9;
  border-radius: 20px;
  padding-left: 2px;
  padding-right: 2px;
`;

const SelectedDayText = styled.Text`
  font-size: 20px;
  font-weight: ${(props) => (props.isToday ? "bold" : "normal")};
`;

const OneWeek = ({ selectedDate, onDayPress, todayDate }) => {
  const [selectedDay, setSelectedDay] = useState(selectedDate);

  const renderDays = (startOfWeek) => {
    const weekdays = moment.weekdaysShort();
    const days = [];

    for (let i = 0; i < 7; i++) {
      const day = moment(startOfWeek).add(i, "days");
      days.push(
        <TableCell key={i}>
          <WeekdayText>{weekdays[i]}</WeekdayText>

          <TouchableOpacity onPress={() => handleDayPress(day)}>
            {renderDay(day)}
          </TouchableOpacity>
        </TableCell>
      );
    }

    return days;
  };

  const handleDayPress = (day) => {
    onDayPress(day.format("YYYY-MM-DD"));
    setSelectedDay(day.format("YYYY-MM-DD"));
  };

  const renderDay = (day) => {
    const isToday = day.format("YYYY-MM-DD") === moment().format("YYYY-MM-DD");
    const isSelected = day.format("YYYY-MM-DD") === selectedDay;
    const isTodayPageDate = day.format("YYYY-MM-DD") === todayDate;

    return (
      <View>
        {isSelected ? (
          <SelectedDay isTodayPageDate={isTodayPageDate}>
            <SelectedDayText isToday={isToday}>
              {day.format("D")}
            </SelectedDayText>
          </SelectedDay>
        ) : (
          <DayText isToday={isToday}>{day.format("D")}</DayText>
        )}
      </View>
    );
  };

  return (
    <Container>
      {renderDays(moment(selectedDate, "MMMM, D").startOf("week"))}
      <View style={{ marginTop: 20, alignItems: "center" }}>
        {/* 추가적인 컴포넌트나 내용이 있다면 여기에 추가할 수 있습니다. */}
      </View>
    </Container>
  );
};

export default OneWeek;
