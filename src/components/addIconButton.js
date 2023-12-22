import React from "react";
import { TouchableOpacity } from "react-native";
import styled from "styled-components";
import propTypes from "prop-types";
import { images } from "../images";
import "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

const Icon = styled.Image`
  tint-color: ${({ theme }) => theme.text};
  width: 20px;
  height: 20px;
  margin: 5px 15px;
`;

const AddIconButton = ({ type, onPressOut, id }) => {
  const navigation = useNavigation();

  const _onPressOut = () => {
    onPressOut(id, navigation);
  };

  return (
    <TouchableOpacity onPressOut={_onPressOut}>
      <Icon source={type} />
    </TouchableOpacity>
  );
};
AddIconButton.defaultProps = {
  onPressOut: () => {},
};

AddIconButton.propTypes = {
  type: propTypes.oneOf(Object.values(images)).isRequired,
  onPressOut: propTypes.func,
  id: propTypes.string,
};

export default AddIconButton;
