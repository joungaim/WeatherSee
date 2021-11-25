import React, { useReducer, useEffect } from "react";
import { View, Image, Text, ScrollView, AsyncStorage } from "react-native";
import moment from "moment";
import styles from "../styles/styles";
import GetWeatherImage from "../GetWeatherImage";
import { IMG_WEATHER3_SRC } from "../ImageSrc";
import { SrtWeather } from "../../src/UltStrWeather";
import { API_KEY } from "../../src/ApiKey";
import { srtBaseDate, srtBaseTime } from "../../src/Time";

function Weather3Component(props) {
  const gridX = props.gridX;
  const gridY = props.gridY;
  const gridXStr = String(gridX);
  const gridYStr = String(gridY);

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
    let srtWeatherTmpObj, srtWeatherSkyObj, srtWeatherPtyObj, srtWeatherPopObj;

    try {
      const weatherTmpItem = await AsyncStorage.getItem("@srtWeatherTmp");
      const weatherSkyItem = await AsyncStorage.getItem("@srtWeatherSky");
      const weatherPtyItem = await AsyncStorage.getItem("@srtWeatherPty");
      const weatherPopItem = await AsyncStorage.getItem("@srtWeatherPop");

      const dateItem = await AsyncStorage.getItem("@srtBaseDate");
      const timeItem = await AsyncStorage.getItem("@srtBaseTime");
      const gridXItem = await AsyncStorage.getItem("@gridX");
      const gridYItem = await AsyncStorage.getItem("@gridY");

      console.log("단기(3일) 예보 쿠키 baseDate, Time", dateItem, ", ", timeItem);
      console.log("단기(3일) 예보 현재 srtBaseDate, srtBaseTime", srtBaseDate, ", ", srtBaseTime);

      if (
        srtBaseDate == dateItem &&
        srtBaseTime == timeItem &&
        gridXStr == gridXItem &&
        gridYStr == gridYItem &&
        weatherTmpItem !== null &&
        weatherSkyItem !== null &&
        weatherPtyItem !== null &&
        weatherPopItem !== null
      ) {
        srtWeatherTmpObj = JSON.parse(weatherTmpItem);
        srtWeatherSkyObj = JSON.parse(weatherSkyItem);
        srtWeatherPtyObj = JSON.parse(weatherPtyItem);
        srtWeatherPopObj = JSON.parse(weatherPopItem);
      } else {
        ({ srtWeatherTmpObj, srtWeatherSkyObj, srtWeatherPtyObj, srtWeatherPopObj } = await SrtWeather(API_KEY, srtBaseDate, srtBaseTime, gridX, gridY));
        const srtWeatherTmp = ["@srtWeatherTmp", JSON.stringify(srtWeatherTmpObj)];
        const srtWeatherSky = ["@srtWeatherSky", JSON.stringify(srtWeatherSkyObj)];
        const srtWeatherPty = ["@srtWeatherPty", JSON.stringify(srtWeatherPtyObj)];
        const srtWeatherPop = ["@srtWeatherPop", JSON.stringify(srtWeatherPopObj)];

        const srtDate = ["@srtBaseDate", srtBaseDate];
        const srtTime = ["@srtBaseTime", srtBaseTime];

        await AsyncStorage.multiSet([srtWeatherTmp, srtWeatherSky, srtWeatherPty, srtWeatherPop, srtDate, srtTime]);
      }
    } catch (e) {
      // error reading value
    }

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
  }, []);

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
                      source={IMG_WEATHER3_SRC[GetWeatherImage(state.srtWeatherSkyObj[i].fcstValue, state.srtWeatherPtyObj[i].fcstValue, String(arr.fcstTime), true)].image}
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
