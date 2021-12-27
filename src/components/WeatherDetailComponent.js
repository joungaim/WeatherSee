import React from "react";
import styles from "../styles/styles";
import { View, Image, Text } from "react-native";

function WeatherDetailComponent(props) {
  const ultSrtWeatherArr = props.ultSrtWeatherArr;
  let temp = 0; // 기온
  let wind = 0; // 풍속
  let feelTemp = 0; // 체감온도

  let humidity = ""; // 습도

  let windDirct = 0; // 풍향
  let windIconDegree = "360";
  let windIconDirct = 0;
  let windTitle = "";

  let loaded = false;

  // 풍향 아이콘 각도, 타이틀
  const windIconDirctArr = [
    { title: "북풍", degree: "180" },
    { title: "북북동풍", degree: "202.5" },
    { title: "북동풍", degree: "225" },
    { title: "동북동풍", degree: "247.5" },
    { title: "동풍", degree: "270" },
    { title: "동남동풍", degree: "292.5" },
    { title: "남동풍", degree: "315" },
    { title: "남남동풍", degree: "337.5" },
    { title: "남풍", degree: "360" },
    { title: "남남서풍", degree: "22.5" },
    { title: "남서풍", degree: "45" },
    { title: "서남서풍", degree: "67.5" },
    { title: "서풍", degree: "90" },
    { title: "서북서풍", degree: "112.5" },
    { title: "북서풍", degree: "135" },
    { title: "북북서풍", degree: "157.5" },
    { title: "북풍", degree: "180" },
  ];

  if (ultSrtWeatherArr !== "empty") {
    loaded = true;

    temp = ultSrtWeatherArr[24].fcstValue;
    wind = ultSrtWeatherArr[54].fcstValue;
    feelTemp = Math.round(13.12 + 0.6215 * temp - 11.37 * wind ** 0.16 + 0.3965 * wind ** 0.16 * temp);

    humidity = ultSrtWeatherArr[30].fcstValue;

    // 풍향 아이콘 회전 각도 구하는 기능.
    windDirct = Number(ultSrtWeatherArr[48].fcstValue);
    windIconDirct = Math.floor((windDirct + 22.5 * 0.5) / 22.5);
    windIconDegree = windIconDirctArr[windIconDirct].degree;
    windTitle = windIconDirctArr[windIconDirct].title;
  }

  return (
    loaded && (
      <View style={[styles.ractangle_bg, { height: 170 }]}>
        <View style={styles.content_padding}>
          <Text style={styles.txt_h6_b}>상세 예보</Text>
        </View>
        <View style={styles.content_padding_row}>
          <View style={styles.ractangle_detail}>
            <Image style={styles.img_detail} source={require("../../assets/img/temperatures.png")} />
            <View style={styles.contain_detail}>
              <Text style={[styles.txt_caption_r, { marginBottom: "3%" }]}>체감온도</Text>
              <Text style={[styles.txt_subtitle1_b]}>{feelTemp}°</Text>
            </View>
          </View>
          <View style={[styles.ractangle_detail, { marginLeft: "2.5%" }]}>
            <Image style={styles.img_detail} source={require("../../assets/img/humidity.png")} />
            <View style={styles.contain_detail}>
              <Text style={[styles.txt_caption_r, { marginBottom: "3%" }]}>습도</Text>
              <Text style={styles.txt_subtitle1_b}>{humidity}%</Text>
            </View>
          </View>
          <View style={[styles.ractangle_detail, { marginLeft: "2.5%", paddingLeft: "1%" }]}>
            <Image
              style={[
                styles.img_detail,
                {
                  transform: [{ rotate: `${windIconDegree}deg` }],
                  marginLeft: "6%",
                },
              ]}
              source={require("../../assets/img/windspeed.png")}
            />
            <View style={[styles.contain_detail, { marginLeft: "2%" }]}>
              <Text style={[styles.txt_caption_r, { marginBottom: "3%" }]}>{windTitle}</Text>
              <Text style={styles.txt_subtitle1_b}>{wind}㎧</Text>
            </View>
          </View>
        </View>
      </View>
    )
  );
}

export default WeatherDetailComponent;
