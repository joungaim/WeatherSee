import React from "react";
import styles from "../styles/styles";
import { View, Image, Text } from "react-native";
import moment from "moment";
import { IMG_WEATHER_SRC } from "../ImageSrc";
import checkNotNull from "../CheckNotNull";

function WeatherNowComponent(props) {
  const ultSrtWeatherArr = props.ultSrtWeatherArr;
  const isNotNullUlt = checkNotNull(ultSrtWeatherArr);
  let icon = 0;
  let temp = "";
  let sky = "";
  let pty = "";
  let lgy = "";
  let ultSrtLoaded = false;
  const crtTime = moment().format("HH");

  //사용 위치 : 날씨 아이콘, 현재 기온
  if (isNotNullUlt) {
    temp = Math.round(ultSrtWeatherArr[24].fcstValue); // 현재 기온
    sky = ultSrtWeatherArr[18].fcstValue; // 현재 하늘 상태
    pty = ultSrtWeatherArr[6].fcstValue; // 현재 강수 코드
    lgy = ultSrtWeatherArr[0].fcstValue; // 현재 낙뢰 코드
    ultSrtLoaded = true;

    if (pty > 0) {
      if (lgy > 0) {
        icon = 6;
      } else {
        if (pty == 1 || pty == 2 || pty == 5 || pty == 6) {
          icon = 3;
        } else if (pty == 3 || pty == 7) {
          icon = 4;
        }
      }
    } else {
      if (lgy > 0) {
        icon = 5;
      } else {
        if (sky == 1) {
          icon = 0;
        } else if (sky == 3) {
          icon = 2;
        } else if (sky == 4) {
          icon = 1;
        }
      }
    }

    if ((0 <= crtTime && crtTime <= 7) || 18 <= crtTime) {
      if (icon === 0) {
        icon = 7;
      } else if (icon === 2) {
        icon = 8;
      }
    }
  }

  const srtWeather0200Arr = props.srtWeather0200Arr;
  const isNotNullSrt = checkNotNull(srtWeather0200Arr);
  let tmx = 0;
  let tmn = 0;
  let srtWeather0200Loaded = false;

  if (isNotNullSrt) {
    tmx = Math.round(srtWeather0200Arr[0].tmx);
    tmn = Math.round(srtWeather0200Arr[0].tmn);
    srtWeather0200Loaded = true;
  }

  if (isNotNullUlt && isNotNullSrt) {
    return (
      <View style={styles.content_padding}>
        <View style={styles.ractangle1}>
          {ultSrtLoaded && <Image style={styles.img_weathericon} source={IMG_WEATHER_SRC[icon].image} />}
          <View style={styles.content_weather}>
            {ultSrtLoaded && <Text style={styles.txt_weather}>{temp}°</Text>}
            {srtWeather0200Loaded && (
              <Text style={[styles.txt_subtitle2_r_w, { marginTop: 1, marginLeft: 5 }]}>
                최고:{tmx}° 최저:{tmn}°
              </Text>
            )}
          </View>
        </View>
      </View>
    );
  } else if ((!ultSrtWeatherArr && ultSrtWeatherArr === "") || (!srtWeather0200Arr && srtWeather0200Arr === "")) {
    return (
      <View style={styles.content_padding}>
        <View style={styles.ractangle1}>
          {/* <Image style={styles.img_weathericon} source={IMG_WEATHER_SRC[1].image} /> */}
          <View style={styles.content_weather_err}>
            <Text style={[styles.txt_subtitle1_b_w]}>현재 온도를 불러오지 못했습니다.</Text>
            <Text style={[styles.txt_body2_r_w, { marginTop: 3 }]}>잠시 뒤 다시 시도해주세요.</Text>
          </View>
        </View>
      </View>
    );
  } else {
    return null;
  }
}

export default WeatherNowComponent;
