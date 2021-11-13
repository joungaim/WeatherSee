import React from "react";
import { View, Image, Text, ScrollView } from "react-native";
import moment from "moment";
import styles from "../styles/styles";
import { IMG_WEATHER3_SRC } from "../ImageSrc";
import GetWeatherImage from "../GetWeatherImage";

function Weather3Component(props) {
  return (
    <View style={[styles.ractangle_bg, { height: 195 }]}>
      <View style={styles.content_padding}>
        <Text style={styles.txt_h6_b}>3일 예보</Text>
        <ScrollView horizontal style={{ height: 120 }} showsHorizontalScrollIndicator={false}>
          {props.srtWeatherTmpObj.map((arr, i) => (
            <>
              {Number(arr.fcstTime.substr(0, 2)) == 0 &&
                Number(arr.fcstDate) - Number(props.srtWeatherTmpObj[0].fcstDate) > 0 &&
                Number(arr.fcstDate) - Number(props.srtWeatherTmpObj[0].fcstDate) < 3 && (
                  <View style={styles.ractangle_weather3_text}>
                    <View style={styles.devider_weather3} />
                    <Text style={[styles.txt_body2_b, { marginTop: 10, marginBottom: 10 }]}>{Number(arr.fcstDate) - Number(props.srtWeatherTmpObj[0].fcstDate) == 1 ? "내일" : "모레"}</Text>
                    <View style={styles.devider_weather3} />
                  </View>
                )}
              {Number(arr.fcstDate) - Number(props.srtWeatherTmpObj[0].fcstDate) < 3 && arr.fcstDate + String(arr.fcstTime) > moment().format("YYYYMMDDHHmm") && (
                <View style={i == 0 ? styles.ractangle_weather3 : styles.ractangle_weather3_margin} id={i}>
                  <Text style={styles.txt_caption_sb}>
                    {Number(arr.fcstTime.substr(0, 2)) == 12
                      ? "오후 12시"
                      : Number(arr.fcstTime.substr(0, 2)) == 0
                      ? "오전 12시"
                      : Number(arr.fcstTime.substr(0, 2)) < 12
                      ? "오전 " + (Number(arr.fcstTime.substr(0, 2)) % 12) + "시"
                      : "오후 " + (Number(arr.fcstTime.substr(0, 2)) % 12) + "시"}
                  </Text>
                  <Image
                    style={{ resizeMode: "contain", margin: 5 }}
                    source={IMG_WEATHER3_SRC[GetWeatherImage(props.srtWeatherSkyObj[i].fcstValue, props.srtWeatherPtyObj[i].fcstValue)].image}
                    id={i}
                  />
                  <Text style={styles.txt_body2_b}>{arr.fcstValue}°</Text>
                </View>
              )}
            </>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

export default Weather3Component;
