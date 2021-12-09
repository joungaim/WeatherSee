import React from "react";
import styles from "../styles/styles";
import { Text } from "react-native";

function AddressComponent(props) {
  let address = "대한민국";

  const addrSi = props.addrObj.addrSi;
  const addrGu = props.addrObj.addrGu;
  const addrDong = props.addrObj.addrDong;

  if (addrGu == "" && addrDong == "") {
    if (addrSi != "") {
      address = addrSi;
    }
  } else {
    address = addrGu + " " + addrDong;
  }

  return <Text style={[styles.txt_h5_b, { marginBottom: 25 }]}>{address}</Text>;
}

export default AddressComponent;
