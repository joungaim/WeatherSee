import * as React from "react";
import { Text, View, StatusBar, Platform, Image } from "react-native";
import { IMG_EXCEPTION_SRC } from "../ImageSrc";
import styles from "../styles/styles";

export default function ErrorFallbackComponent(props) {
  const gubn = props.gubn;
  let isIOS, imageGubn, title, subTitle;

  if (Platform.OS === "ios") {
    isIOS = true;
  } else {
    isIOS = false;
  }

  if (gubn === "granted") {
    imageGubn = 1;
    title = `아래 방법으로
위치정보 사용을 허용해주세요.`;
    if (isIOS) {
      subTitle = `설정 > DaySee > 위치 >
'다음번에 묻기 또는 내가 공유할 때'
또는 '앱을 사용하는 동안' 선택`;
    } else {
      subTitle = "설정 > DaySee > 위치 > 허용";
    }
  } else if (gubn === "error") {
    imageGubn = 0;
    title = `날씨정보를
불러오지 못 했습니다.`;
    subTitle = "잠시 뒤 다시 시도해주세요.";
  }
  const statusBarStyle = isIOS ? "dark-content" : "auto";
  return (
    <View style={styles.container_load}>
      <StatusBar barStyle={statusBarStyle} />
      <Image style={{ resizeMode: "contain" }} source={IMG_EXCEPTION_SRC[imageGubn].image} />
      <Text style={[styles.txt_h6_r, { marginTop: 30 }]}>{title}</Text>
      <Text style={[styles.txt_subtitle2_r_g, { marginTop: 10 }]}>{subTitle}</Text>
    </View>
  );
}
