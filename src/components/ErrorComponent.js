import React from "react";
import styles from "../styles/styles";
import { View, Image, Text } from "react-native";

export default function ErrorComponent(props) {
  const title = props.title;

  return (
    <View style={[styles.ractangle_bg, { height: 200 }]}>
      <View style={styles.content_padding}>
        <Text style={styles.txt_h6_b}>{title}</Text>
      </View>
      <View style={styles.content_padding}>
        <View style={styles.ractangle_err}>
          <Text style={styles.txt_body2_b}>{title}를 불러오지 못했습니다.</Text>
          <Text style={[styles.txt_caption_r, { marginTop: 3 }]}>잠시 뒤 다시 시도해주세요.</Text>
        </View>
      </View>
    </View>
  );
}

export function ErrorComponentWhite(props) {
  const title = props.title;

  return (
    <>
      <View style={[styles.ractangle_err_w, { height: 90 }]}>
        <Text style={styles.txt_body2_b}>{title}를 불러오지 못했습니다.</Text>
        <Text style={[styles.txt_caption_r, { marginTop: 3 }]}>잠시 뒤 다시 시도해주세요.</Text>
      </View>
    </>
  );
}
