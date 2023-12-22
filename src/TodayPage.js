//TodayPage.js
import React, { useState, useEffect } from "react";
import {
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  Modal,
  StyleSheet,
  Pressable,
} from "react-native";
import styled, { ThemeProvider } from "styled-components/native";
import moment from "moment";
import OneWeek from "./components/OneWeek";
import { theme } from "./theme";
import { images } from "./images";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ScheduleItem from "./components/ScheduleItem";

const Container = styled.SafeAreaView`
  flex: 1;
  align-items: center;
  background-color: ${({ theme }) => theme.dayitemBackground};
`;

const SelectedDateContainer = styled.View`
  align-items: center;
  margin-top: 10%;
`;

const SelectedDateText = styled.Text`
  font-size: 20px;
`;

const NavigationButton = styled.TouchableOpacity`
  position: absolute;
  top: 9%;
  margin-top: 20%;
  padding: 10px;
`;

const LeftNavigationButton = styled(NavigationButton)`
  left: 0px;
`;

const RightNavigationButton = styled(NavigationButton)`
  right: 0px;
`;

const TimelineWrapper = styled(View)`
  flex-direction: row;
  flex: 1;
  margin-top: 10px;
  overflow: hidden;
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

const AddButton = styled(Button).attrs({
  color: theme.dayitemBackground,
})`
  padding: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
  font-size: 16px;
`;

const InputContainer = styled(View)`
  align-items: center;
  margin-bottom: 10px;
  padding: 2px;
  background-color: ${({ theme }) => theme.text};
  width: 90%;
  border-radius: 20px;
`;

const ModalContainer = styled(Modal)`
  margin-top: 50%;
  align-items: center;
`;

const ModalContent = styled(View)`
  background-color: ${({ theme }) => theme.background};
  align-items: center;
  padding: 20px;
  border-radius: 30px;
  margin-top: 120%;
`;

const TextInputStyled = styled(TextInput)`
  height: 35px;
  width: 200px;
  background-color: ${({ theme }) => theme.dayitemBackground};
  border-color: gray;
  border-width: 1px;
  border-radius: 20px;
  width: 100%;
  margin-bottom: 10px;
  padding-left: 7px;
`;

const TimeText = styled(Text)`
  color: ${({ theme }) => theme.text};
  font-size: 15px;
  padding-top: 10px;
  justify-content: center;
`;

const getScheduleKey = (date) => `schedule_${date}`;

const TodayPage = () => {
  const [selectedDate, setSelectedDate] = useState(moment().format("MMMM, D"));
  const [scheduleData, setScheduleData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [eventName, setEventName] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);

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

  const onDayPress = (date) => {
    const formattedDate = moment(date).format("MMMM, D");
    setSelectedDate(formattedDate);
  };

  const updateWeek = (direction) => {
    const increment = direction === "next" ? 7 : -7;
    setSelectedDate((prevDate) =>
      moment(prevDate, "MMMM, D").add(increment, "days").format("MMMM, D")
    );
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  const handleAddSchedule = () => {
    const newSchedule = {
      startTime,
      endTime,
      eventName,
      notes,
    };

    const updatedScheduleData = [...scheduleData, newSchedule].sort((a, b) =>
      a.startTime.localeCompare(b.startTime)
    );
    setScheduleData(updatedScheduleData);

    setStartTime(" ");
    setEndTime(" ");
    setEventName(" ");
    setNotes(" ");

    setModalVisible(false);
    setIsEditMode(false);
    saveScheduleData(selectedDate, updatedScheduleData);
  };

  const handleDeleteSchedule = (index) => {
    const updatedScheduleData = [...scheduleData];
    updatedScheduleData.splice(index, 1);
    setScheduleData(updatedScheduleData);
    saveScheduleData(selectedDate, updatedScheduleData);
  };

  const handleEditSchedule = (editedSchedule) => {
    setStartTime(editedSchedule.startTime);
    setEndTime(editedSchedule.endTime);
    setEventName(editedSchedule.eventName);
    setNotes(editedSchedule.notes);

    setModalVisible(true);
    setIsEditMode(true);
  };

  const saveScheduleData = async (date, data) => {
    try {
      await AsyncStorage.setItem(getScheduleKey(date), JSON.stringify(data));
    } catch (error) {
      console.error("스케줄 데이터 저장 오류:", error);
    }
  };

  const handleUpdateSchedule = () => {
    const updatedSchedule = {
      startTime,
      endTime,
      eventName,
      notes,
    };

    // 해당 일정의 인덱스 찾기
    const index = scheduleData.findIndex(
      (item) =>
        item.startTime === updatedSchedule.startTime &&
        item.endTime === updatedSchedule.endTime
    );

    // 수정된 일정 정보로 업데이트
    if (index !== -1) {
      const updatedScheduleData = [...scheduleData];
      updatedScheduleData[index] = updatedSchedule;

      // 스케줄 데이터 업데이트
      setScheduleData(updatedScheduleData);

      // AsyncStorage에도 업데이트된 스케줄 데이터 저장
      saveScheduleData(selectedDate, updatedScheduleData);
    }

    setModalVisible(false);
    setStartTime("");
    setEndTime("");
    setEventName("");
    setNotes("");
  };

  const initValue = () => {
    setModalVisible(true);
    setStartTime("");
    setEndTime("");
    setEventName("");
    setNotes("");
  };

  // renderTimeline 함수 내부 수정
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
              <TimeText>{time}</TimeText>
              <ScheduleItem
                key={`${time}_${schedule.startTime}`}
                schedule={schedule}
                onDelete={() =>
                  handleDeleteSchedule(scheduleData.indexOf(schedule))
                }
                onEdit={handleEditSchedule}
                duration={duration} // duration 프롭 전달
              />
            </TimeSlot>
          );
        }
      } else {
        timeline.push(
          <TimeSlot key={time}>
            <TimeText>{time}</TimeText>
          </TimeSlot>
        );
      }
    }
    return timeline;
  };

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <SelectedDateContainer>
          <SelectedDateText>{selectedDate}</SelectedDateText>
        </SelectedDateContainer>
        <OneWeek selectedDate={selectedDate} onDayPress={onDayPress} />
        <LeftNavigationButton onPress={() => updateWeek("prev")}>
          <Image source={images.pre} style={{ width: 15, height: 15 }} />
        </LeftNavigationButton>
        <RightNavigationButton onPress={() => updateWeek("next")}>
          <Image source={images.next} style={{ width: 15, height: 15 }} />
        </RightNavigationButton>

        <InputContainer>
          <AddButton
            title="Add Scedule "
            onPress={() => setModalVisible(true)}
          />
        </InputContainer>

        <ScrollView>
          <TimelineWrapper>
            <TimeColumn>{renderTimeline()}</TimeColumn>
          </TimelineWrapper>
        </ScrollView>

        <ModalContainer
          visible={modalVisible}
          transparent
          animationType="slide"
        >
          <Pressable onPress={() => Keyboard.dismiss()}>
            <View>
              <ModalContent>
                <Text>시작 시간</Text>
                <TextInputStyled
                  value={startTime}
                  onChangeText={(text) => setStartTime(text)}
                  keyboardType="numeric"
                />
                <Text>끝나는 시간</Text>
                <TextInputStyled
                  value={endTime}
                  onChangeText={(text) => setEndTime(text)}
                  keyboardType="numeric"
                />
                <Text>일정 이름</Text>
                <TextInputStyled
                  value={eventName}
                  onChangeText={(text) => setEventName(text)}
                />
                <Text>기타 사항</Text>
                <TextInputStyled
                  value={notes}
                  onChangeText={(text) => setNotes(text)}
                />
                {/* 수정 완료 버튼 추가 */}
                <InputContainer>
                  {isEditMode ? (
                    <>
                      <Button
                        title="Update Schedule"
                        onPress={handleUpdateSchedule}
                      />
                      <Button
                        title="닫기"
                        onPress={() => setModalVisible(false)}
                      />
                    </>
                  ) : (
                    <>
                      <AddButton
                        title="Add Schedule"
                        onPress={handleAddSchedule}
                      />
                      <Button
                        title="닫기"
                        onPress={() => setModalVisible(false)}
                      />
                    </>
                  )}
                </InputContainer>
              </ModalContent>
            </View>
          </Pressable>
        </ModalContainer>
      </Container>
    </ThemeProvider>
  );
};

export default TodayPage;
