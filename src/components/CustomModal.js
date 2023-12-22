import React, { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Modal, Dimensions } from "react-native";
import { format } from "date-fns";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Keyboard,
  Button,
  Platform,
  TouchableOpacity,
} from "react-native";
import { theme } from "../theme";
import { CalendarProvider, useCalendarContext } from "../CalendarProvider";

function CustomModal({ onModalClose }) {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");

  const width = Dimensions.get("window").width;

  const { addEvent } = useCalendarContext();

  const onChangeText = (inputText) => {
    setText(inputText);
  };

  const onChangeStart = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setOpen(Platform.OS === "ios");
    setStartDate(currentDate);
    console.log(currentDate);
  };

  const onChangeEnd = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setOpen(Platform.OS === "ios");
    setEndDate(currentDate);
    console.log(currentDate);
  };

  const onSave = () => {
    const event = { startDate, endDate, text };
    onModalClose(event);
    setOpen(false);
  };

  return (
    // <CalendarProvider>
    <View>
      <TouchableOpacity onPress={() => setOpen(true)}>
        <Text style={styles.buttontext} width={width - 30}>
          Add
        </Text>
      </TouchableOpacity>
      <Modal
        transparent={true}
        animationType="fade"
        visible={open}
        onRequestClose={() => setOpen(false)}
        style={styles.modalContainer}
      >
        <Pressable onPress={() => Keyboard.dismiss()}>
          <View style={styles.container}>
            <TextInput
              style={styles.textInput}
              placeholder="내용을 입력해주세요"
              onChangeText={onChangeText}
              value={text}
              multiline={true}
            />

            <View style={styles.datePickSection}>
              <Text style={styles.dateText}>시작일</Text>
              <DateTimePicker
                style={styles.date}
                value={startDate}
                display="calendar"
                onChange={onChangeStart}
                locale="ko"
              />
            </View>
            <View style={styles.datePickSection}>
              <Text style={styles.dateText}>종료일</Text>
              <DateTimePicker
                style={styles.date}
                value={endDate}
                display="calendar"
                onChange={onChangeEnd}
                locale="ko"
              />
            </View>
            <View style={styles.datePickSection}>
              <TouchableOpacity onPress={onSave}>
                <Text style={styles.cancelbtn}>저장</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setOpen(false)}>
                <Text style={styles.cancelbtn}>취소</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
    // </CalendarProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 30,
    paddingBottom: 200,
    backgroundColor: theme.background,
    borderColor: 'gray',
    borderWidth: 1, 
    alignItems: "center",
    justifyContent: "center",
    borderColor: 1,
    marginTop: "120%",
    borderRadius: 30,
  },
  textInput: {
    marginTop: 10,
    height: 40,
    width: "90%",
    backgroundColor: theme.weekitemBackground,
    borderColor: 'gray',
    borderWidth: 1, 
    borderRadius: 30,
    paddingTop: 15,
    paddingLeft: 20,
  },
  buttontext: {
    marginVertical: 10,
    paddingVertical: 5,
    textAlign: "center",
    color: theme.weekitemBackground,
    backgroundColor: theme.text,
    fontSize: 20,
    borderRadius: 20,
    overflow: "hidden",
  },
  cancelbtn: {
    paddingTop: 20,
    paddingRight: 20,
    fontSize: 20,
  },
  date: {},
  dateText: {
    fontSize: 20,
    marginRight: 140,
  },
  datePickSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 15,
    paddingRight: 10,
  },
  contentText: {
    paddingTop: 20,
    fontSize: 20,
  },
});

export default CustomModal;
