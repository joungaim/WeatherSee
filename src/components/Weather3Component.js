import React, { useReducer, useEffect } from "react";
import { View, Image, Text, ScrollView, AsyncStorage } from "react-native";
import moment from "moment";
import styles from "../styles/styles";
import GetWeatherImage from "../GetWeatherImage";
import { IMG_WEATHER3_SRC } from "../ImageSrc";
import { SrtWeather } from "../../src/UltStrWeather";
import { API_KEY } from "../../src/ApiKey";
import { srtBaseDate, srtBaseTime, todayDate, currentAclock } from "../../src/Time";
import checkNotNull from "../CheckNotNull";
import ErrorComponent from "../../src/components/ErrorComponent";

function Weather3Component(props) {
  const gridX = props.gridX;
  const gridY = props.gridY;
  const gridXYStr = String(gridX) + String(gridY);

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

      const dateItem = await AsyncStorage.getItem("@srtBaseDate1");
      const timeItem = await AsyncStorage.getItem("@srtBaseTime");
      const gridXYItem = await AsyncStorage.getItem("@srtgridXY");

      console.log("단기(3일) 예보 쿠키 baseDate, Time", dateItem, ", ", timeItem);
      console.log("단기(3일) 예보 현재 srtBaseDate, srtBaseTime", srtBaseDate, ", ", srtBaseTime);

      if (srtBaseDate == dateItem && srtBaseTime == timeItem && gridXYStr == gridXYItem && weatherTmpItem !== null && weatherSkyItem !== null && weatherPtyItem !== null && weatherPopItem !== null) {
        srtWeatherTmpObj = JSON.parse(weatherTmpItem);
        srtWeatherSkyObj = JSON.parse(weatherSkyItem);
        srtWeatherPtyObj = JSON.parse(weatherPtyItem);
        srtWeatherPopObj = JSON.parse(weatherPopItem);
      } else {
        ({ srtWeatherTmpObj, srtWeatherSkyObj, srtWeatherPtyObj, srtWeatherPopObj } = await SrtWeather(API_KEY, srtBaseDate, srtBaseTime, gridX, gridY));
        if (checkNotNull(srtWeatherTmpObj) && checkNotNull(srtWeatherSkyObj) && checkNotNull(srtWeatherPtyObj) && checkNotNull(srtWeatherPopObj)) {
          const srtWeatherTmp = ["@srtWeatherTmp", JSON.stringify(srtWeatherTmpObj)];
          const srtWeatherSky = ["@srtWeatherSky", JSON.stringify(srtWeatherSkyObj)];
          const srtWeatherPty = ["@srtWeatherPty", JSON.stringify(srtWeatherPtyObj)];
          const srtWeatherPop = ["@srtWeatherPop", JSON.stringify(srtWeatherPopObj)];

          const srtDate = ["@srtBaseDate1", srtBaseDate];
          const srtTime = ["@srtBaseTime", srtBaseTime];
          const gridXY = ["@srtgridXY", gridXYStr];

          await AsyncStorage.multiSet([srtWeatherTmp, srtWeatherSky, srtWeatherPty, srtWeatherPop, srtDate, srtTime, gridXY]);
        }
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

  if (checkNotNull(state.srtWeatherTmpObj) && checkNotNull(state.srtWeatherSkyObj) && checkNotNull(state.srtWeatherPtyObj)) {
    return (
      <View style={[styles.ractangle_bg, { height: 195 }]}>
        <View style={styles.content_padding}>
          <Text style={styles.txt_h6_b}>3일 예보</Text>
          <ScrollView horizontal style={{ height: 120 }} showsHorizontalScrollIndicator={false}>
            {state.srtWeatherTmpObj.map((arr, i) => (
              <>
                {Number(arr.fcstTime.substr(0, 2)) == 0 && Number(moment(arr.fcstDate).diff(moment(todayDate), "days")) > 0 && Number(moment(arr.fcstDate).diff(moment(todayDate), "days")) < 3 && (
                  <View style={Number(moment(arr.fcstDate).diff(moment(todayDate), "days")) == 1 && currentAclock == 23 ? styles.ractangle_weather3_text : styles.ractangle_weather3_text_margin}>
                    <View style={styles.devider_weather3} />
                    <Text style={[styles.txt_body2_b, { marginTop: 10, marginBottom: 10 }]}>{Number(moment(arr.fcstDate).diff(moment(todayDate), "days")) == 1 ? "내일" : "모레"}</Text>
                    <View style={styles.devider_weather3} />
                  </View>
                )}
                {Number(moment(arr.fcstDate).diff(moment(todayDate), "days")) < 3 && arr.fcstDate + String(arr.fcstTime) > moment().format("YYYYMMDDHHmm") && (
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
    );
  } else if (
    (state.srtWeatherTmpObj !== {} && state.srtWeatherTmpObj === "") ||
    (state.srtWeatherSkyObj !== {} && state.srtWeatherSkyObj === "") ||
    (state.srtWeatherPtyObj !== {} && state.srtWeatherPtyObj === "")
  ) {
    return <ErrorComponent title="3일 예보" />;
  } else {
    return null;
  }
}

export default Weather3Component;
