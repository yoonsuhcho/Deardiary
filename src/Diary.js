//Diary.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Button,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { theme } from "./theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styled, { ThemeProvider } from "styled-components/native";
import { images } from "./images";

const Container = styled.View`
  flex: 1;
  padding: 16px;
  background-color: ${({ theme }) => theme.diaryitemBackground};
`;

const DiaryEntryContainer = styled.View`
  margin-top: 10px;
  padding: 10px;
  border-color: gray;
  border-width: 1px;
  background-color: ${({ theme }) => theme.background};
  border-radius: 30px;
`;

const ImageContainer = styled.Image`
  margin-left: 25%;
  width: 50%;
  height: 200px;
  border-radius: 15px;
  margin-bottom: 10px;
`;

const TextInputStyled = styled.TextInput`
  flex: 1;
  height: 40px;
  border-color: gray;
  border-width: 1px;
  background-color: ${({ theme }) => theme.background};
  margin-vertical: 10px;
  padding-horizontal: 8px;
  border-radius: 15px;
`;

const CameraButton = styled.TouchableOpacity`
  margin-top: 20%;
  width: 10%;
  margin-left: 45%;
`;

const CameraIcon = styled.Image`
  width: 25px;
  height: 25px;
`;
const ButtonContainer = styled.View`
  flex-direction: row;
  //margin-left: 70%;
`;

const DeleteButton = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.background};
  border-color: gray;
  border-width: 1px;
  padding-vertical: 5px;
  padding-horizontal: 10px;
  border-radius: 30px;
  margin-top: 5px;
  margin-left: 2px;
  width: 50%;
`;

const DeleteButtonText = styled.Text`
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  text-align: center;
`;

const EditButton = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.background};
  border-color: gray;
  border-width: 1px;
  padding-vertical: 5px;
  padding-horizontal: 10px;
  border-radius: 30px;
  margin-top: 5px;
  width: 50%;
`;

const EditButtonText = styled.Text`
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  text-align: center;
`;

const SaveButton = styled.TouchableOpacity`
  border-color: gray;
  border-width: 1px;
  background-color: ${({ theme }) => theme.point};
  padding-vertical: 10px;
  padding-horizontal: 20px;
  border-radius: 30px;
  margin-top: 10px;
`;

const SaveButtonText = styled.Text`
  color: ${({ theme }) => theme.diaryitemBackground};
  font-size: 16px;
  text-align: center;
`;

const SectionHeader = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-top: 20px;
`;

const Diary = ({ route, navigation }) => {
  const { selectedDate } = route.params;
  const [image, setImage] = useState(null);
  const [text, setText] = useState("");
  const [diaryEntries, setDiaryEntries] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    retrieveData();
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("카메라 롤 권한이 필요합니다!");
      }
    })();
  }, [selectedDate]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const handleSave = async () => {
    const newEntry = { text, image, date: selectedDate };
    const entriesForSelectedDate = diaryEntries.filter(
      (entry) => entry.date === selectedDate
    );
    setDiaryEntries([...entriesForSelectedDate, newEntry]);
    await saveData([...entriesForSelectedDate, newEntry]);
    setText("");
    setImage(null);
  };

  const handleUpdate = async () => {
    const updatedEntries = [...diaryEntries];
    updatedEntries[editingIndex] = { text, image, date: selectedDate };
    await saveData(updatedEntries);
    setDiaryEntries(updatedEntries);
    setText("");
    setImage(null);
    setEditingIndex(null);
  };

  const saveData = async (entries) => {
    try {
      await AsyncStorage.setItem("diaryEntries", JSON.stringify(entries));
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const retrieveData = async () => {
    try {
      const storedEntries = await AsyncStorage.getItem("diaryEntries");
      if (storedEntries !== null) {
        const parsedEntries = JSON.parse(storedEntries);
        const entriesForSelectedDate = parsedEntries.filter(
          (entry) => entry.date === selectedDate
        );
        setDiaryEntries(entriesForSelectedDate);
      }
    } catch (error) {
      console.error("Error retrieving data:", error);
    }
  };

  const confirmDelete = (index) => {
    Alert.alert(
      "일기 삭제",
      "정말 삭제하시겠습니까?",
      [
        {
          text: "취소",
          style: "cancel",
        },
        { text: "OK", onPress: () => handleDelete(index) },
      ],
      { cancelable: false }
    );
  };

  const handleDelete = async (index) => {
    const updatedEntries = [...diaryEntries];
    updatedEntries.splice(index, 1);
    await saveData(updatedEntries);
    setDiaryEntries(updatedEntries);
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    const entryToEdit = diaryEntries[index];
    setText(entryToEdit.text);
    setImage(entryToEdit.image);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container>
      <CameraButton onPress={pickImage}>
          <CameraIcon source={images.Camera} />
        </CameraButton>
        {image && <ImageContainer source={{ uri: image }} />}
        

        <TextInputStyled
          placeholder="오늘의 일기를 작성해주세요!"
          onChangeText={(value) => setText(value)}
          value={text}
        />

        {editingIndex !== null ? (
          <SaveButton onPress={handleUpdate}>
            <SaveButtonText>Update</SaveButtonText>
          </SaveButton>
        ) : (
          <SaveButton onPress={handleSave}>
            <SaveButtonText>Save</SaveButtonText>
          </SaveButton>
        )}

        <SectionHeader>{selectedDate}</SectionHeader>
        <FlatList
          data={diaryEntries}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <DiaryEntryContainer>
              <ImageContainer source={{ uri: item.image }} />
              <Text>{item.text}</Text>
              <ButtonContainer>
                <EditButton onPress={() => handleEdit(index)}>
                  <EditButtonText>Edit</EditButtonText>
                </EditButton>
                <DeleteButton onPress={() => confirmDelete(index)}>
                  <DeleteButtonText>Delete</DeleteButtonText>
                </DeleteButton>
              </ButtonContainer>
            </DiaryEntryContainer>
          )}
        />
      </Container>
    </ThemeProvider>
  );
};

export default Diary;
