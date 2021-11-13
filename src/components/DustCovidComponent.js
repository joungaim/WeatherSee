import React from "react";
import styles from "../styles/styles";
import { View, Image, Text } from "react-native";
import Swiper from "react-native-swiper";

function DustCovidComponent(props) {
  return (
    <View style={styles.content_padding_row}>
      <Swiper style={styles.wrapper} showsPagination={false}>
        <View style={styles.slide1}>
          <View style={[styles.ractangle_wrapper]}>
            <View style={[styles.ractangle_w_r, { height: 90 }]}>
              <Image style={styles.img_contain} source={require("../../assets/img/dust/reallybad.png")} />
              <View style={{ marginLeft: "6%" }}>
                <Text style={[styles.txt_body2_r, { marginBottom: "1%" }]}>미세먼지</Text>
                <Text style={styles.txt_subtitle1_b}>많이 나쁨</Text>
              </View>
            </View>

            <View style={[styles.ractangle_w_r, { height: 90, marginLeft: "2.5%" }]}>
              <Image style={styles.img_contain} source={require("../../assets/img/dust/verybad.png")} />
              <View style={{ marginLeft: "6%" }}>
                <Text style={[styles.txt_body2_r, { marginBottom: "1%" }]}>초미세먼지</Text>
                <Text style={styles.txt_subtitle1_b}>아주 나쁨</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.slide2}>
          <View style={[styles.ractangle_wrapper]}>
            <View style={[styles.ractangle_w_r, { height: 90 }]}>
              <Text style={[styles.txt_body2_r]}>전국</Text>
              <Text style={[styles.txt_subtitle1_b, { marginLeft: "3%" }]}>1,597명</Text>
              <Image style={styles.img_arrow} source={require("../../assets/img/up_r.png")} marginLeft="3%" />
            </View>

            <View style={[styles.ractangle_w_r, { height: 90, marginLeft: "2.5%" }]}>
              <Text style={[styles.txt_body2_r]}>서울</Text>
              <Text style={[styles.txt_subtitle1_b, { marginLeft: "3%" }]}>697명</Text>
              <Image style={styles.img_arrow} source={require("../../assets/img/down_g.png")} marginLeft="3%" />
            </View>
          </View>
        </View>
      </Swiper>
    </View>
  );
}

export default DustCovidComponent;
