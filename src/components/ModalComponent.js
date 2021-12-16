import React, { useState } from "react";
import { View, Text, Modal, TouchableHighlight, Image } from "react-native";
import styles from "../styles/styles";

function ModalComponent(props) {
  const [permiClose, setPermiClose] = useState(true);
  const [coachClose, setCoachClose] = useState(false);
  const onPress = () => {
    setPermiClose(false);
    setCoachClose(true);
  };
  const onPressCoach = () => {
    setCoachClose(false);
  };

  return (
    <>
      <Modal transparent={true} visible={permiClose}>
        <View style={styles.container_madal}>
          <View style={styles.ractangle_modal}>
            <Image style={{ resizeMode: "contain", marginTop: 30 }} source={require("../../assets/img/permission/sun.png")} />
            <Text style={[styles.txt_subtitle1_b, { marginTop: 20, marginBottom: 10 }]}>Day See 앱 접근권한 안내</Text>

            <View style={[styles.devider_modal, { marginBottom: 20 }]} />

            <View style={styles.content_modal}>
              <Image style={{ resizeMode: "contain", width: "20%" }} source={require("../../assets/img/permission/memo.png")} />
              <View style={{ marginLeft: "3%" }}>
                <Text style={styles.txt_subtitle2_r}>기기 및 앱기록 (필수)</Text>
                <Text style={[styles.txt_caption_r, { marginTop: 6 }]}>앱 오류 확인 및 사용성 개선</Text>
              </View>
            </View>

            <View style={[styles.devider_modal, { marginBottom: 25 }]} />

            <View style={[styles.content_modal, { marginBottom: 30 }]}>
              <Image style={{ resizeMode: "contain", width: "20%" }} source={require("../../assets/img/permission/location.png")} />
              <View style={{ marginLeft: "3%" }}>
                <Text style={styles.txt_subtitle2_r}>위치 (선택)</Text>
                <Text style={[styles.txt_caption_r, { marginTop: 6 }]}>사용자 위치 기반 날씨 정보</Text>
              </View>
            </View>
            <View style={{ flexDirection: "row" }}>
              <TouchableHighlight style={{ width: "100%" }} onPress={onPress}>
                <View style={{ backgroundColor: "#0A84FF", borderBottomLeftRadius: 14, borderBottomRightRadius: 14, height: 60, justifyContent: "center", alignItems: "center" }}>
                  <Text style={{ color: "white", fontFamily: "NotoSansKR_700Bold", fontSize: 16, lineHeight: 18 }}>확인</Text>
                </View>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </Modal>

      <Modal transparent={true} visible={coachClose}>
        <View style={styles.container_madal_coach}>
          <TouchableHighlight onPress={onPressCoach} style={{ alignItems: "flex-end", justifyContent: "flex-start" }}>
            <Image style={{ resizeMode: "contain", marginTop: "10%", marginRight: "4.5%" }} source={require("../../assets/img/coachmark/close.png")} />
          </TouchableHighlight>
          <View style={{ alignItems: "center", justifyContent: "flex-start", marginTop: "30%" }}>
            <Image style={{ resizeMode: "contain" }} source={require("../../assets/img/coachmark/txt.png")} />
          </View>
        </View>
      </Modal>
    </>
  );
}

export default ModalComponent;
