//Modall.js
import React, { useState} from "react";
import styled, { ThemeProvider } from "styled-components/native";
import { theme } from "./theme";
import { Dimensions, StatusBar, View, Text, StyleSheet } from "react-native";
import CustomModal from "./components/CustomModal";

function modall () {
    return(
        <CustomModal></CustomModal>
    );
};

export default modall;