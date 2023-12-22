import React from "react";
import { View, Text } from "react-native";
import styled, { ThemeProvider } from "styled-components/native";
import { images } from "../images";
import IconButton from "./IconButton";
import PropTypes from "prop-types";

const ScheduleInfoWrapper = styled.View`
  background-color: ${({ theme }) => theme.background};
  border-color: gray;
  border-width: 1px;
  flex-direction: row;
  padding: 7px;
  padding-left: 15px;
  border-radius: 30px;
  margin-left: 5px;
  width: 85%;
  height: ${({ duration }) => duration * 40}px;
`;

const ScheduleTextWrapper = styled(View)`
  flex-direction: column;
  flex: 65%;
`;

const ScheduleTimeText = styled(Text)`
  color: gray;
  font-size: 14px;
`;

const EventNameText = styled(Text)`
  color: black;
  font-size: 15px;
`;

const NotesText = styled(Text)`
  color: gray;
  font-size: 12px;
`;

const ButtonWrapper = styled(View)`
  align-items: flex-end;
  flex-direction: row;
  flex: 1;
`;

const ScheduleItem = ({ schedule, onDelete, onEdit }) => {
  const handleEdit = () => {
    // Call the onEdit function provided by the parent component
    onEdit(schedule);
  };

  return (
    <ScheduleInfoWrapper>
      <ScheduleTextWrapper>
        <ScheduleTimeText>{`${schedule.startTime}:00-${schedule.endTime}:00`}</ScheduleTimeText>
        <EventNameText>{schedule.eventName}</EventNameText>
        <NotesText>{schedule.notes}</NotesText>
      </ScheduleTextWrapper>
      <ButtonWrapper>
        <IconButton
          type={images.update}
          onPressOut={handleEdit}
          style={{ marginRight: 10 }}
        />
        <IconButton type={images.delete} onPressOut={onDelete} />
      </ButtonWrapper>
    </ScheduleInfoWrapper>
  );
};

export default ScheduleItem;
