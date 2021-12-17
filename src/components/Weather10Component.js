import React, { useEffect, useReducer } from "react";
import styles from "../styles/styles";
import { View, Image, Text, AsyncStorage } from "react-native";
import { IMG_WEATHER10_SRC } from "../ImageSrc";
import { RegId } from "../../src/RegId";
import GetWeatherImage from "../GetWeatherImage";
import { midBaseDateTime } from "../../src/Time";
import { API_KEY } from "../../src/ApiKey";
import { MidLandWeather, MidTaWeather } from "../../src/UltStrWeather";
import moment from "moment";

function Weather10Component(props) {
  const srtWeather0200Arr = props.srtWeather0200Arr;
  const addrText = props.addrObj.addrText;
  const addrSi = props.addrObj.addrSi; //level1
  const addrGu = props.addrObj.addrGu; //level2

  const initialState = {
    weather10Arr: {},
    midLandArr: [],
    loaded: false,
  };

  function reducer(state, action) {
    switch (action.type) {
      case "SET_WEATHER10_OBJ":
        return {
          ...state,
          weather10Arr: action.weather10Arr,
          loaded: action.loaded,
        };
      case "SET_MID_WEATHER_OBJ":
        return {
          ...state,
          midLandArr: action.midLandArr,
        };
      default:
        throw new Error();
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  getMidWeather = async () => {
    let midLandArr;

    try {
      const weatherItem = await AsyncStorage.getItem("@midWeather");
      const dateItem = await AsyncStorage.getItem("@midBaseDateTime");
      const addrItem = await AsyncStorage.getItem("@addrText");
      console.log("중기 예보 쿠키 dateItem", dateItem);
      console.log("중기 예보 현재 midBaseDateTime", midBaseDateTime);

      console.log("addrItem :", addrItem);
      console.log("addrSi + addrGu :", addrSi + addrGu);
      console.log("weatherItem :", weatherItem);

      if (midBaseDateTime == dateItem && addrItem == addrSi + addrGu && weatherItem !== null) {
        midLandArr = JSON.parse(weatherItem);
      } else {
        const midRegId = await RegId(addrText);
        midLandArr = await MidLandWeather(API_KEY, midBaseDateTime, midRegId.midLand);
        const midTaArr = await MidTaWeather(API_KEY, midBaseDateTime, midRegId.midTa);

        for (let i = 0; i < 7; i++) {
          midLandArr[i].tmn = midTaArr[i].tmn;
          midLandArr[i].tmx = midTaArr[i].tmx;
        }

        const midWeather = ["@midWeather", JSON.stringify(midLandArr)];
        const midDateTime = ["@midBaseDateTime", midBaseDateTime];
        const addr = ["@addrText", addrSi + addrGu];

        await AsyncStorage.multiSet([midWeather, midDateTime, addr]);
      }
    } catch (e) {
      // error reading value
    }
    return midLandArr;
  };

  getWeather10 = async () => {
    if (state.midLandArr.length < 1 && srtWeather0200Arr != "empty") {
      const midLandArr = await getMidWeather();
      const weather10Arr = [...srtWeather0200Arr, ...midLandArr];

      dispatch({
        type: "SET_WEATHER10_OBJ",
        weather10Arr: weather10Arr,
        loaded: true,
      });
    } else if (state.midLandArr.length < 1 && srtWeather0200Arr == "empty") {
      const midLandArr = await getMidWeather();

      dispatch({
        type: "SET_MID_WEATHER_OBJ",
        midLandArr: midLandArr,
      });
    } else if (state.midLandArr.length > 1 && srtWeather0200Arr != "empty") {
      const weather10Arr = [...srtWeather0200Arr, ...state.midLandArr];

      dispatch({
        type: "SET_WEATHER10_OBJ",
        weather10Arr: weather10Arr,
        loaded: true,
      });
    } else {
      // console.log("state.midLandArr.length : " + state.midLandArr.length + ", srtWeather0200Arr : " + srtWeather0200Arr);
    }
  };

  useEffect(() => {
    getWeather10();
  }, [srtWeather0200Arr, state.midLandArr]);

  return (
    state.loaded && (
      <View style={[styles.ractangle_bg, { height: 550 }]}>
        <View style={styles.content_padding}>
          <Text style={styles.txt_h6_b}>10일 예보</Text>

          {state.weather10Arr.map((arr, i) => (
            <>
              <View style={[styles.content_row, { marginTop: i == 0 ? 0 : 13.2, marginBottom: 13.2 }]}>
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
                      { marginLeft: 5, width: 35 },
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
                    width: "20%",
                    marginLeft: "5%",
                  }}
                >
                  <Image style={{ resizeMode: "contain" }} source={IMG_WEATHER10_SRC[GetWeatherImage(arr.sky)].image} />
                  {(arr.popAm >= 40 || arr.popPm >= 40) && (
                    <View style={{ marginLeft: 8 }}>
                      {arr.popAm >= 40 && <Text style={styles.txt_caption_r}>오전 {arr.popAm}%</Text>}
                      {arr.popPm >= 40 && <Text style={styles.txt_caption_r}>오후 {arr.popPm}%</Text>}
                    </View>
                  )}
                </View>

                <View style={{ flexDirection: "row", alignItems: "center" }}>
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
    )
  );
}

export default Weather10Component;
