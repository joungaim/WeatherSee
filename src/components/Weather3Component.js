import React, { useReducer, useEffect } from "react";
import { View, Image, Text, ScrollView } from "react-native";
import moment from "moment";
import styles from "../styles/styles";
import GetWeatherImage from "../GetWeatherImage";
import { IMG_WEATHER3_SRC } from "../ImageSrc";
import { SrtWeather } from "../../src/UltStrWeather";
import { API_KEY } from "../../src/ApiKey";
import { GridXY } from "../../src/GridXY";
import { srtBaseDate, srtBaseTime } from "../../src/Time";

function Weather3Component(props) {
  const initialState = {
    srtWeatherTmpObj: {},
    srtWeatherSkyObj: {},
    srtWeatherPtyObj: {},
    srtWeatherPopObj: {},

    loaded: false,
  };

  function reducer(state, action) {
    switch (action.type) {
      case "SET_SRT_WEATHER_OBJ":
        return {
          ...state,
          srtWeatherTmpObj: action.srtWeatherTmpObj,
          srtWeatherSkyObj: action.srtWeatherSkyObj,
          srtWeatherPtyObj: action.srtWeatherPtyObj,
          srtWeatherPopObj: action.srtWeatherPopObj,
          loaded: action.loaded,
        };
      default:
        throw new Error();
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  getSrtWeather = async () => {
    const { gridX, gridY } = await GridXY(props.latitude, props.longitude);
    const [srtWeather, srtWeatherTmpObj, srtWeatherSkyObj, srtWeatherPtyObj, srtWeatherPopObj] = await SrtWeather(API_KEY, srtBaseDate, srtBaseTime, gridX, gridY);

    dispatch({
      type: "SET_SRT_WEATHER_OBJ",
      srtWeatherTmpObj: srtWeatherTmpObj,
      srtWeatherSkyObj: srtWeatherSkyObj,
      srtWeatherPtyObj: srtWeatherPtyObj,
      srtWeatherPopObj: srtWeatherPopObj,
      loaded: true,
    });
  };

  useEffect(() => {
    getSrtWeather();
  }, [props.latitude, props.longitude]);

  return (
    state.loaded && (
      <View style={[styles.ractangle_bg, { height: 195 }]}>
        <View style={styles.content_padding}>
          <Text style={styles.txt_h6_b}>3일 예보</Text>
          <ScrollView horizontal style={{ height: 120 }} showsHorizontalScrollIndicator={false}>
            {state.srtWeatherTmpObj.map((arr, i) => (
              <>
                {Number(arr.fcstTime.substr(0, 2)) == 0 &&
                  Number(arr.fcstDate) - Number(state.srtWeatherTmpObj[0].fcstDate) > 0 &&
                  Number(arr.fcstDate) - Number(state.srtWeatherTmpObj[0].fcstDate) < 3 && (
                    <View style={styles.ractangle_weather3_text}>
                      <View style={styles.devider_weather3} />
                      <Text style={[styles.txt_body2_b, { marginTop: 10, marginBottom: 10 }]}>{Number(arr.fcstDate) - Number(state.srtWeatherTmpObj[0].fcstDate) == 1 ? "내일" : "모레"}</Text>
                      <View style={styles.devider_weather3} />
                    </View>
                  )}
                {Number(arr.fcstDate) - Number(state.srtWeatherTmpObj[0].fcstDate) < 3 && arr.fcstDate + String(arr.fcstTime) > moment().format("YYYYMMDDHHmm") && (
                  <View style={arr.fcstDate + String(arr.fcstTime).substring(0, 2) == moment().add(1, "h").format("YYYYMMDDHH") ? styles.ractangle_weather3 : styles.ractangle_weather3_margin} id={i}>
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
                      source={IMG_WEATHER3_SRC[GetWeatherImage(state.srtWeatherSkyObj[i].fcstValue, state.srtWeatherPtyObj[i].fcstValue)].image}
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
    )
  );
}

export default Weather3Component;
