import React from "react";
import styles from "../styles/styles";
import { View, Image, Text } from "react-native";

function WeatherDetailComponent(props) {
  return (
    <View style={[styles.ractangle_bg, { height: 170 }]}>
      <View style={styles.content_padding}>
        <Text style={styles.txt_h6_b}>상세 예보</Text>
      </View>
      <View style={styles.content_padding_row}>
        <View style={styles.ractangle_detail}>
          <Image style={styles.img_detail} source={require("../../assets/img/temperatures.png")} />
          <View style={styles.contain_detail}>
            <Text style={[styles.txt_caption_r, { marginBottom: "3%" }]}>체감온도</Text>
            <Text style={[styles.txt_subtitle1_b]}>{props.feelTemp}°</Text>
          </View>
        </View>
        <View style={[styles.ractangle_detail, { marginLeft: "2.5%" }]}>
          <Image style={styles.img_detail} source={require("../../assets/img/humidity.png")} />
          <View style={styles.contain_detail}>
            <Text style={[styles.txt_caption_r, { marginBottom: "3%" }]}>습도</Text>
            <Text style={styles.txt_subtitle1_b}>{props.humidity}%</Text>
          </View>
        </View>
        <View style={[styles.ractangle_detail, { marginLeft: "2.5%", paddingLeft: "1%" }]}>
          <Image
            style={[
              styles.img_detail,
              {
                transform: [{ rotate: `${props.windIconDegree}deg` }],
                marginLeft: "6%",
              },
            ]}
            source={require("../../assets/img/windspeed.png")}
          />
          <View style={[styles.contain_detail, { marginLeft: "2%" }]}>
            <Text style={[styles.txt_caption_r, { marginBottom: "3%" }]}>{props.windTitle}</Text>
            <Text style={styles.txt_subtitle1_b}>{props.crtWindSpd}㎧</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export default WeatherDetailComponent;
