import React from "react";
import styles from "../styles/styles";
import { View, Image, Text } from "react-native";
import { IMG_WEATHER_SRC } from "../../src/ImageSrc";

function WeatherNowComponent(props) {
  return (
    <View style={styles.content_padding}>
      <View style={styles.ractangle1}>
        <Image style={styles.img_weathericon} source={IMG_WEATHER_SRC[props.imageVar].image} />
        <View style={styles.content_weather}>
          <Text style={styles.txt_weather}>{props.crtTemp}°</Text>
          <Text style={[styles.txt_subtitle2_r_w, { marginTop: 5, marginLeft: 5 }]}>
            최고:{Math.round(props.weather10Arr.tmx)}° 최저:{Math.round(props.weather10Arr.tmn)}°
          </Text>
        </View>
      </View>
    </View>
  );
}

export default WeatherNowComponent;
