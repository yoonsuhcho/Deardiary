import React from "react";
import { TouchableOpacity } from "react-native";
import styled from "styled-components";
import propTypes from "prop-types";
import { images } from "../images";
import { useNavigation } from "@react-navigation/native";

const Icon = styled.Image`
  tint-color: ${({ theme }) => theme.text};
  width: 20px;
  height: 20px;
  margin: 10px 5px 10px 5px;
`;

const IconButton = ({ type, onPressOut, id }) => {
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
IconButton.defaultProps = {
  onPressOut: () => {},
};

IconButton.propTypes = {
  type: propTypes.oneOf(Object.values(images)).isRequired,
  onPressOut: propTypes.func,
  id: propTypes.string,
};

export default IconButton;
