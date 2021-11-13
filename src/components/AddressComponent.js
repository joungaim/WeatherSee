import React from "react";
import styles from "../styles/styles";
import { Text } from "react-native";

function AddressComponent(props) {
  return (
    <Text style={[styles.txt_h5_b, { marginBottom: 25 }]}>
      {props.addrObj.addrGu} {props.addrObj.addrDong}
    </Text>
  );
}

export default AddressComponent;
