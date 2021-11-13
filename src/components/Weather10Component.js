import React from "react";
import styles from "../styles/styles";
import { View, Image, Text, ScrollView } from "react-native";
import { IMG_WEATHER10_SRC } from "../ImageSrc";
import GetWeatherImage from "../GetWeatherImage";
import moment from "moment";

function Weather10Component(props) {
  return (
    <View style={[styles.ractangle_bg, { height: 550 }]}>
      <View style={styles.content_padding}>
        <Text style={styles.txt_h6_b}>10일 예보</Text>

        {props.weather10Arr.map((arr, i) => (
          <>
            <View style={i == 0 ? styles.content_weather10_first : styles.content_weather10}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  style={[
                    styles.txt_subtitle1_b,
                    {
                      color: moment().add(i, "days").format("dddd") == "토요일" || moment().add(i, "days").format("dddd") == "일요일" ? "#FF3B30" : "black",
                    },
                  ]}
                >
                  {moment().add(i, "days").format("dddd")}
                </Text>

                <Text
                  style={[
                    styles.txt_caption_r_b,
                    {
                      color: moment().add(i, "days").format("dddd") == "토요일" || moment().add(i, "days").format("dddd") == "일요일" ? "#FF3B30" : "black",
                    },
                    { marginLeft: 5, width: 30 },
                  ]}
                >
                  {i == 0 ? "오늘" : i == 1 ? "내일" : i == 2 ? "모레" : moment().add(i, "days").format("MM.DD")}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  width: "15%",
                  marginLeft: "7%",
                }}
              >
                <Image style={{ resizeMode: "contain" }} source={IMG_WEATHER10_SRC[GetWeatherImage(arr.sky)].image} />
                {(arr.popAm >= 40 || arr.popPm >= 40) && (
                  <View style={{ marginLeft: 8 }}>
                    {arr.popAm >= 40 && <Text style={styles.txt_caption_r}>낮 {arr.popAm}%</Text>}
                    {arr.popPm >= 40 && <Text style={styles.txt_caption_r}>밤 {arr.popPm}%</Text>}
                  </View>
                )}
              </View>

              <View style={{ flexDirection: "row" }}>
                <View style={styles.content_weather10_taMax}>
                  <Text style={styles.txt_subtitle1_b}>{arr.tmx}°</Text>
                </View>
                <View style={styles.content_weather10_taMin}>
                  <Text style={[styles.txt_subtitle1_r_g]}>{arr.tmn}°</Text>
                </View>
              </View>
            </View>
            {i != 9 && <View style={styles.devider_weather10}></View>}
          </>
        ))}
      </View>
    </View>
  );
}

export default Weather10Component;
