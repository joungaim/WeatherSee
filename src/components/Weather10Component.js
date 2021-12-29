import React, { useEffect, useReducer } from "react";
import styles from "../styles/styles";
import { View, Image, Text, AsyncStorage } from "react-native";
import { IMG_WEATHER10_SRC } from "../ImageSrc";
import { RegId } from "../../src/RegId";
import GetWeatherImage from "../GetWeatherImage";
import { midBaseDateTime } from "../../src/Time";
import { API_KEY } from "../../src/ApiKey";
import checkNotNull from "../CheckNotNull";
import { MidLandWeather, MidTaWeather } from "../../src/UltStrWeather";
import ErrorComponent from "../../src/components/ErrorComponent";
import moment from "moment";

function Weather10Component(props) {
  const srtWeather0200Arr = props.srtWeather0200Arr;
  const isNotNullSrt = checkNotNull(srtWeather0200Arr);

  const addrText = props.addrObj.addrText;
  const addrSi = props.addrObj.addrSi; //level1
  const addrGu = props.addrObj.addrGu; //level2

  const initialState = {
    weather10Arr: null,
    isPop: 0,
    midLandArr: null,
  };

  function reducer(state, action) {
    switch (action.type) {
      case "SET_WEATHER10_OBJ":
        return {
          ...state,
          weather10Arr: action.weather10Arr,
          isPop: action.isPop,
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
      const weatherItem = await AsyncStorage.getItem("@midWeather2");
      const dateItem = await AsyncStorage.getItem("@midBaseDateTime");
      const addrItem = await AsyncStorage.getItem("@addrText");
      console.log("중기 예보 쿠키 dateItem : ", dateItem, "/ addrItem : ", addrItem);
      console.log("중기 예보 현재 midBaseDateTime : ", midBaseDateTime, " / addrSi + addrGu : ", addrSi + addrGu);

      if (midBaseDateTime == dateItem && addrItem == addrSi + addrGu && weatherItem !== null) {
        midLandArr = JSON.parse(weatherItem);
      } else {
        const midRegId = await RegId(addrText);
        midLandArr = await MidLandWeather(API_KEY, midBaseDateTime, midRegId.midLand);
        const midTaArr = await MidTaWeather(API_KEY, midBaseDateTime, midRegId.midTa);
        if (checkNotNull(midLandArr) && checkNotNull(midTaArr)) {
          for (let i = 0; i < 7; i++) {
            midLandArr[i].tmn = midTaArr[i].tmn;
            midLandArr[i].tmx = midTaArr[i].tmx;
          }

          const midWeather = ["@midWeather2", JSON.stringify(midLandArr)];
          const midDateTime = ["@midBaseDateTime", midBaseDateTime];
          const addr = ["@addrText", addrSi + addrGu];

          await AsyncStorage.multiSet([midWeather, midDateTime, addr]);
        } else {
          midLandArr = "";
        }
      }
    } catch (e) {
      // error reading value
    }
    return midLandArr;
  };

  getWeather10 = async () => {
    // midLandArr 값은 조회되기 전이고, 부모 컴포넌트에서 10일 예보만 받아왔을 때
    if (state.midLandArr === null && isNotNullSrt) {
      let weather10Arr = "";
      const midLandArr = await getMidWeather();
      if (checkNotNull(midLandArr)) {
        weather10Arr = [...srtWeather0200Arr, ...midLandArr];
      }
      dispatch({
        type: "SET_WEATHER10_OBJ",
        weather10Arr: weather10Arr,
      });
      // midLandArr 값이 조회되기 전이고, 부모 컴포넌트에서 10일 예보값을 받아오지 못했을 때
    } else if (checkNotNull(state.midLandArr) && isNotNullSrt) {
      const weather10Arr = [...srtWeather0200Arr, ...state.midLandArr];
      const isPop = weather10Arr.filter((ele) => {
        return ele.popAm >= 40 || ele.popPm >= 40;
      }).length;
      dispatch({
        type: "SET_WEATHER10_OBJ",
        isPop: isPop,
        weather10Arr: weather10Arr,
      });
    } else {
      // console.log("state.midLandArr.length : " + state.midLandArr.length + ", srtWeather0200Arr : " + srtWeather0200Arr);
    }
  };

  useEffect(() => {
    getWeather10();
  }, [srtWeather0200Arr, state.midLandArr]);

  if (isNotNullSrt && checkNotNull(state.weather10Arr)) {
    return (
      <View style={[styles.ractangle_bg, { paddingBottom: 4 }]}>
        <View style={styles.content_padding}>
          <Text style={styles.txt_h6_b_weather10}>10일 예보</Text>

          {state.weather10Arr.map((arr, i) => (
            <>
              <View style={[styles.content_row]}>
                <View style={[styles.margin_weather10, { flex: 5, flexDirection: "row", alignItems: "center" }]}>
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

                <View style={[styles.margin_weather10, { flex: 1.5, alignItems: "center", justifyContent: "center" }]}>
                  <Image style={{ resizeMode: "contain" }} source={IMG_WEATHER10_SRC[GetWeatherImage(arr.sky)].image} />
                </View>
                {state.isPop > 0 && (
                  <View style={{ flex: 2, alignItems: "flex-start", justifyContent: "center" }}>
                    {arr.popAm >= 40 && <Text style={styles.txt_caption_r}>오전 {arr.popAm}%</Text>}
                    {arr.popPm >= 40 && <Text style={styles.txt_caption_r}>오후 {arr.popPm}%</Text>}
                  </View>
                )}

                <View style={[styles.margin_weather10, { flex: 4, flexDirection: "row", alignItems: "center", justifyContent: "flex-end" }]}>
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
  } else if ((!state.weather10Arr && state.weather10Arr === "") || (!srtWeather0200Arr && srtWeather0200Arr === "")) {
    return <ErrorComponent title="10일 예보" />;
  } else {
    return null;
  }
}

export default Weather10Component;
