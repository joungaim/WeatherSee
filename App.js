import React, { useEffect, useReducer, useMemo } from "react";
import { Alert, Text, View, Image, ScrollView, Animated } from "react-native";
import Swiper from "react-native-swiper";
import * as Location from "expo-location";
import moment from "moment";
import Loading from "./Loading";
import firebase from "firebase/app";
import HeaderComponent from "./src/components/HeaderComponent";
import { useFonts, NotoSans_300Regular } from "@expo-google-fonts/noto-sans";
import {
  UltStrWeather,
  StrWeather,
  Str10Weather,
  MidLandWeather,
  MidTaWeather,
} from "./src/UltStrWeather";
import styles from "./src/styles/styles";
import { Time } from "./src/Time";
import { Address } from "./src/Address";
import { RegId } from "./src/RegId";
import { GridXY } from "./src/GridXY";
import "moment/locale/ko";
import {
  NotoSansKR_300Light,
  NotoSansKR_400Regular,
  NotoSansKR_500Medium,
  NotoSansKR_700Bold,
  NotoSansKR_900Black,
} from "@expo-google-fonts/noto-sans-kr";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const config = {
  apiKey: "AIzaSyAZ_6n2gMd3MKedZ6DO3auqsn9ZVyDYcdw",
  authDomain: "weathersee-40c91.firebaseapp.com",
  projectId: "weathersee-40c91",
  storageBucket: "weathersee-40c91.appspot.com",
  messagingSenderId: "1015441262442",
  appId: "1:1015441262442:web:a6b5595f00eb2b93fe4713",
  measurementId: "G-PYZPZDBNZG",
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

export default function App() {
  /**
   * 폰트 로딩
   */
  let [fontsLoaded] = useFonts({
    NotoSans_300Regular,
    NotoSansKR_300Light,
    NotoSansKR_400Regular,
    NotoSansKR_500Medium,
    NotoSansKR_700Bold,
    NotoSansKR_900Black,
  });

  /**
   * 기상청 조회용 API 키
   */
  const API_KEY =
    "Skm8Sx%2BhuSd8PBsZeDzGPZVXFlXODLxEJR2MRRajPQqn1aID2DYuEYoMC97NhdpJ4AzetqrX2xTDHtIUKnTX1g%3D%3D";

  const initialState = {
    // [로딩화면 boolean 값 : 데이터 다 받아오면 false 할당]
    isLoading: true,

    // [위,경도에 해당하는 한글 주소값 객체 (시,군,구)]
    addrObj: {},

    // [초단기예보 조회용 변수]
    ultSrtWeatherObj: {},

    // [단기예보 조회용 변수]
    srtWeatherObj: {},

    // [단기 3일예보 노출용 변수]
    // *3일 예보는 단기예보 데이터 그대로 사용. 10일 예보는 baseTime을 0200으로 세팅하여 단기예보 API 따로 한번 더 호출하여 사용
    strWeatherTmpObj: {},
    strWeatherSkyObj: {},
    strWeatherPtyObj: {},
    strWeatherPopObj: {},

    // [단기 10일예보 조회용 변수]
    srtWeather10Obj: {},

    // [중기예보 조회용 변수] ( midLandWeatherObj : 중기육상예보조회용 객체 / midTaWeatherObj : 중기기온예보조회용 객체 )
    midLandWeatherObj: {},
    midTaWeatherObj: {},

    weather10Arr: {},

    // [현재 날씨 노출용 변수] (crtTemp:현재 기온 / crtWindSpd:현재 풍속 / feelTemp:체감 온도 / humidity:습도 / imageVar:현재 기온 아이콘)
    crtTemp: "",
    crtWindSpd: "",
    feelTemp: "",
    humidity: "",
    imageVar: 0,
    windIconDegree: "360",
    windTitle: "",
  };

  function reducer(state, action) {
    switch (action.type) {
      case "SET_ISLOADING":
        return { ...state, isLoading: false };
      case "SET_ADDR_OBJ":
        return { ...state, addrObj: action.addrObj };
      case "SET_STR_WEATHER_OBJ":
        return {
          ...state,
          srtWeatherObj: action.srtWeatherObj,
          strWeatherTmpObj: action.strWeatherTmpObj,
          strWeatherSkyObj: action.strWeatherSkyObj,
          strWeatherPtyObj: action.strWeatherPtyObj,
          strWeatherPopObj: action.strWeatherPopObj,
        };
      case "SET_STR_WEATHER10_OBJ":
        return {
          ...state,
          srtWeather10Obj: action.srtWeather10Obj,
        };
      case "SET_MID_LAND_WEATHER_OBJ":
        return {
          ...state,
          midLandWeatherObj: action.midLandWeatherObj,
        };
      case "SET_MID_TA_WEATHER_OBJ":
        return {
          ...state,
          midTaWeatherObj: action.midTaWeatherObj,
        };
      case "SET_WEATHER10_OBJ":
        return {
          ...state,
          weather10Arr: action.weather10Arr,
        };
      case "SET_CRNT_WEATHER":
        return {
          ...state,
          crtTemp: action.crtTemp,
          crtWindSpd: action.crtWindSpd,
          feelTemp: action.feelTemp,
          humidity: action.humidity,
          imageVar: action.imageVar,
          windIconDegree: action.windIconDegree,
          windTitle: action.windTitle,
        };
      default:
        throw new Error();
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  /**
   * 초단기실황조회용 변수 (사용안함)
   */
  // const [ultraSrtLiveBaseDate, setultraSrtLiveBaseDate] = useState(null);
  // const [ultraSrtLiveBaseTime, setUltraSrtLiveBaseTime] = useState("0000");
  // const [ultSrtLiveWeatherObj, setUltSrtLiveWeatherObj] = useState({});

  const IMG_WEATHER_SRC = [
    {
      image: require("./assets/img/weather/sun.png"),
    },
    {
      image: require("./assets/img/weather/cloudy.png"),
    },
    {
      image: require("./assets/img/weather/slightly-cloudy.png"),
    },
    {
      image: require("./assets/img/weather/rainy.png"),
    },
    {
      image: require("./assets/img/weather/snowy.png"),
    },
    {
      image: require("./assets/img/weather/thunder.png"),
    },
    {
      image: require("./assets/img/weather/rainy-thunder.png"),
    },
  ];

  const IMG_WEATHER10_SRC = [
    {
      image: require("./assets/img/weather10/sun.png"),
    },
    {
      image: require("./assets/img/weather10/cloudy.png"),
    },
    {
      image: require("./assets/img/weather10/slightly-cloudy.png"),
    },
    {
      image: require("./assets/img/weather10/rainy.png"),
    },
    {
      image: require("./assets/img/weather10/snowy.png"),
    },
    {
      image: require("./assets/img/weather10/thunder.png"),
    },
    {
      image: require("./assets/img/weather10/rainy-thunder.png"),
    },
  ];

  const IMG_WEATHER3_SRC = [
    {
      image: require("./assets/img/weather3/sun.png"),
    },
    {
      image: require("./assets/img/weather3/cloudy.png"),
    },
    {
      image: require("./assets/img/weather3/slightly-cloudy.png"),
    },
    {
      image: require("./assets/img/weather3/rainy.png"),
    },
    {
      image: require("./assets/img/weather3/snowy.png"),
    },
    {
      image: require("./assets/img/weather3/thunder.png"),
    },
    {
      image: require("./assets/img/weather3/rainy-thunder.png"),
    },
  ];

  /**
   * 1. 위도, 경도 얻은 후
   * 2. getAddress 호출하여 한글 주소 얻음
   * 3. 위,경도를 getGridGPS 호출하여 좌표값으로 바꾼후 getWeather 호출
   */
  getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission to access location was denied");
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    const latitude = location.coords.latitude;
    const longitude = location.coords.longitude;

    const { addrText, addrGu, addrDong } = await Address(latitude, longitude);

    dispatch({
      type: "SET_ADDR_OBJ",
      addrObj: {
        addrText,
        addrGu,
        addrDong,
      },
    });

    const midRegId = await RegId(addrText);

    const { gridX, gridY } = await GridXY(latitude, longitude); // 위도,경도를 기상청 api에 활용 가능한 x,y로 바꾸는 함수

    const {
      ultSrtBaseTime,
      ultSrtBaseDate,
      srtBaseTime,
      srtBaseDate,
      midBaseDateTime,
    } = await Time();

    const ultStrWeather = await UltStrWeather(
      API_KEY,
      ultSrtBaseDate,
      ultSrtBaseTime,
      gridX,
      gridY
    );

    const [
      strWeather,
      strWeatherTmpObj,
      strWeatherSkyObj,
      strWeatherPtyObj,
      strWeatherPopObj,
    ] = await StrWeather(API_KEY, srtBaseDate, srtBaseTime, gridX, gridY);

    dispatch({
      type: "SET_STR_WEATHER_OBJ",
      srtWeatherObj: strWeather,
      strWeatherTmpObj: strWeatherTmpObj,
      strWeatherSkyObj: strWeatherSkyObj,
      strWeatherPtyObj: strWeatherPtyObj,
      strWeatherPopObj: strWeatherPopObj,
    });

    const { weather10Data, weather10Arr } = await Str10Weather(
      API_KEY,
      gridX,
      gridY
    );

    dispatch({
      type: "SET_STR_WEATHER10_OBJ",
      srtWeather10Obj: weather10Data,
    });

    const { midLandData, midLandArr } = await MidLandWeather(
      API_KEY,
      midBaseDateTime,
      midRegId.midLand
    );

    dispatch({
      type: "SET_MID_LAND_WEATHER_OBJ",
      midLandWeatherObj: midLandData,
    });

    const { midTaData, midTaArr } = await MidTaWeather(
      API_KEY,
      midBaseDateTime,
      midRegId.midTa
    );

    dispatch({
      type: "SET_MID_TA_WEATHER_OBJ",
      midTaWeatherObj: midTaData,
    });

    for (let i = 0; i < 7; i++) {
      midLandArr[i].tmn = midTaArr[i].tmn;
      midLandArr[i].tmx = midTaArr[i].tmx;
    }

    const weatherArr = [...weather10Arr, ...midLandArr];

    dispatch({
      type: "SET_WEATHER10_OBJ",
      weather10Arr: weatherArr,
    });

    console.log(weatherArr);

    /**
     * 현재 기온 및 상세 예보용
     */
    const temp = ultStrWeather[24].fcstValue; // 현재 기온
    const wind = ultStrWeather[54].fcstValue; // 현재 풍속
    const windDirct = Number(ultStrWeather[48].fcstValue); // 현재 풍향
    const humidity = ultStrWeather[30].fcstValue; // 현재 습도
    const sky = ultStrWeather[18].fcstValue; // 현재 하늘 상태
    const pty = ultStrWeather[6].fcstValue; // 현재 강수 코드
    const lgy = ultStrWeather[0].fcstValue; // 현재 낙뢰 코드
    let icon = 0; // 현재 기온 아이콘 이름

    const feelTemp = Math.round(
      13.12 +
        0.6215 * temp -
        11.37 * wind ** 0.16 +
        0.3965 * wind ** 0.16 * temp
    );

    // 현재 날씨 아이콘 구하는 기능. 추후 함수로 바꾸기
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
    // 상세예보의 풍향 아이콘 회전 각도 구하는 기능. 추후 함수로 바꾸기
    const windIconDirct = Math.floor((windDirct + 22.5 * 0.5) / 22.5);
    const windIconDegree = windIconDirctArr[windIconDirct].degree;
    const windTitle = windIconDirctArr[windIconDirct].title;

    dispatch({
      type: "SET_CRNT_WEATHER",
      crtTemp: temp,
      crtWindSpd: wind,
      feelTemp: feelTemp,
      humidity: humidity,
      imageVar: icon,
      windIconDegree: windIconDegree,
      windTitle: windTitle,
    });

    dispatch({
      type: "SET_ISLOADING",
    });
  };

  /**
   * 10일 예보 날씨 아이콘 표시
   * 하늘상태(SKY) 코드  : 맑음(1), 구름많음(3), 흐림(4)
   * 강수형태(PTY) 코드 : (초단기) 없음(0), 비(1), 비/눈(2), 눈(3), 빗방울(5), 빗방울눈날림(6), 눈날림(7)
   * 		                 (단기) 없음(0), 비(1), 비/눈(2), 눈(3), 소나기(4)
   * 중기예보 : 맑음 / 구름많음, 구름많고 비, 구름많고 눈, 구름많고 비/눈, 구름많고 소나기 / 흐림, 흐리고 비, 흐리고 눈, 흐리고 비/눈, 흐리고 소나기 / 소나기
   */
  getWeather10Img = (sky, ptyCode = 0) => {
    let code;
    if (isNaN(sky)) {
      // const obj = state.midLandWeatherObj;
      // const sky = obj[wfCode];

      if (sky == "맑음") {
        code = 0;
      } else if (sky == "흐림") {
        code = 1;
      } else if (sky == "구름많음") {
        code = 2;
      } else if (
        sky == "구름많고 비" ||
        sky == "구름많고 소나기" ||
        sky == "흐리고 비" ||
        sky == "흐리고 소나기" ||
        sky == "구름많고 비/눈" ||
        sky == "흐리고 비/눈"
      ) {
        code = 3;
      } else if (sky == "구름많고 눈" || sky == "흐리고 눈") {
        code = 4;
      }
    } else {
      if (ptyCode > 0) {
        if (ptyCode == 1 || ptyCode == 2 || ptyCode == 4) {
          code = 3;
        } else if (ptyCode == 3) {
          code = 4;
        }
      } else {
        if (sky == 1) {
          code = 0;
        } else if (sky == 3) {
          code = 2;
        } else if (sky == 4) {
          code = 1;
        }
      }
    }
    return code;
  };

  /**
   * 배열에서 최빈 값 구하는 함수
   */
  // function getMode(array) {
  //   // 1. 출연 빈도 구하기
  //   const counts = array.reduce((pv, cv) => {
  //     pv[cv] = (pv[cv] || 0) + 1;
  //     return pv;
  //   }, {});
  //   // 2. 최빈값 구하기
  //   const keys = Object.keys(counts);
  //   let mode = keys[0];
  //   keys.forEach((val, idx) => {
  //     if (counts[val] > counts[mode]) {
  //       mode = val;
  //     }
  //   });
  //   console.log("mode = " + mode);
  //   return mode;
  // }

  // const strings = ["a", "b", "b", "c", "c", "c", "d", "d", "d", "d"];
  // getMode(strings);

  /**
   * 클래스 생명주기 메서드 중 componentDidMount() 와 동일한 기능을 한다.
   * useEffect는첫번째 렌더링과 이후의 모든 업데이트에서 수행됩니다.
   */
  useEffect(() => {
    getLocation();
  }, []);

  /**
   * 빈 배열을 넣어 주면 처음 랜더링 될 때 한번만 실행 된다. 넣지 않으면 모든 업데이트에서 실행되며
   * 배열안에 [count] 같이 인자를 넣어주면 해당 인자가 업데이트 될 때 마다 실행된다.
   */
  return state.isLoading ? (
    <Loading />
  ) : (
    <HeaderComponent>
      <Text style={[styles.txt_h5_b]}>
        {state.addrObj.addrGu} {state.addrObj.addrDong}
      </Text>

      <View style={styles.content_padding}>
        <View style={styles.ractangle1}>
          <Image
            style={styles.img_weathericon}
            source={IMG_WEATHER_SRC[state.imageVar].image}
          />
          <View style={styles.content_weather}>
            <Text style={styles.txt_weather}>{state.crtTemp}°</Text>
            <Text
              style={[
                styles.txt_subtitle2_r_w,
                { marginTop: 5, marginLeft: 5 },
              ]}
            >
              최고:{Math.round(state.srtWeather10Obj[2].fcstValue)}° 최저:
              {Math.round(state.srtWeather10Obj[0].fcstValue)}°
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.content_padding_row}>
        <Swiper style={styles.wrapper} showsPagination={false}>
          <View style={styles.slide1}>
            <View style={[styles.ractangle_wrapper]}>
              <View style={[styles.ractangle_w_r, { height: 90 }]}>
                <Image
                  style={styles.img_contain}
                  source={require("./assets/img/dust/reallybad.png")}
                />
                <View style={{ marginLeft: "6%" }}>
                  <Text style={[styles.txt_body2_r, { marginBottom: "1%" }]}>
                    미세먼지
                  </Text>
                  <Text style={styles.txt_subtitle1_b}>많이 나쁨</Text>
                </View>
              </View>

              <View
                style={[
                  styles.ractangle_w_r,
                  { height: 90, marginLeft: "2.5%" },
                ]}
              >
                <Image
                  style={styles.img_contain}
                  source={require("./assets/img/dust/verybad.png")}
                />
                <View style={{ marginLeft: "6%" }}>
                  <Text style={[styles.txt_body2_r, { marginBottom: "1%" }]}>
                    초미세먼지
                  </Text>
                  <Text style={styles.txt_subtitle1_b}>아주 나쁨</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.slide2}>
            <View style={[styles.ractangle_wrapper]}>
              <View style={[styles.ractangle_w_r, { height: 90 }]}>
                <Text style={[styles.txt_body2_r]}>전국</Text>
                <Text style={[styles.txt_subtitle1_b, { marginLeft: "3%" }]}>
                  1,597명
                </Text>
                <Image
                  style={styles.img_arrow}
                  source={require("./assets/img/up_r.png")}
                  marginLeft="3%"
                />
              </View>

              <View
                style={[
                  styles.ractangle_w_r,
                  { height: 90, marginLeft: "2.5%" },
                ]}
              >
                <Text style={[styles.txt_body2_r]}>서울</Text>
                <Text style={[styles.txt_subtitle1_b, { marginLeft: "3%" }]}>
                  697명
                </Text>
                <Image
                  style={styles.img_arrow}
                  source={require("./assets/img/down_g.png")}
                  marginLeft="3%"
                />
              </View>
            </View>
          </View>
        </Swiper>
      </View>

      <View style={[styles.ractangle_bg, { height: 195 }]}>
        <View style={styles.content_padding}>
          <Text style={styles.txt_h6_b}>3일 예보</Text>
          <ScrollView
            horizontal
            style={{ height: 120 }}
            showsHorizontalScrollIndicator={false}
          >
            {state.strWeatherTmpObj.map((arr, i) => (
              <View
                style={
                  i == 0
                    ? styles.ractangle_weather3
                    : styles.ractangle_weather3_margin
                }
                id={i}
              >
                <Text style={styles.txt_caption_sb}>
                  {Number(state.strWeatherTmpObj[i].fcstTime.substr(0, 2)) == 12
                    ? "오후 12시"
                    : Number(state.strWeatherTmpObj[i].fcstTime.substr(0, 2)) ==
                      0
                    ? "오전 12시"
                    : Number(state.strWeatherTmpObj[i].fcstTime.substr(0, 2)) <
                      12
                    ? "오전 " +
                      (Number(state.strWeatherTmpObj[i].fcstTime.substr(0, 2)) %
                        12) +
                      "시"
                    : "오후 " +
                      (Number(state.strWeatherTmpObj[i].fcstTime.substr(0, 2)) %
                        12) +
                      "시"}
                </Text>
                <Image
                  style={{ resizeMode: "contain", margin: 5 }}
                  source={
                    IMG_WEATHER3_SRC[
                      getWeather10Img(
                        state.strWeatherSkyObj[i].fcstValue,
                        state.strWeatherPtyObj[i].fcstValue
                      )
                    ].image
                  }
                  id={i}
                />
                <Text style={styles.txt_body2_b}>
                  {state.strWeatherTmpObj[i].fcstValue}°
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>

      <View style={[styles.ractangle_bg, { height: 550 }]}>
        <View style={styles.content_padding}>
          <Text style={styles.txt_h6_b}>10일 예보</Text>

          {state.weather10Arr.map((arr, i) => (
            <>
              <View
                style={
                  i == 0
                    ? styles.content_weather10_first
                    : styles.content_weather10
                }
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={[
                      styles.txt_subtitle1_b,
                      {
                        color:
                          moment().add(i, "days").format("dddd") == "토요일" ||
                          moment().add(i, "days").format("dddd") == "일요일"
                            ? "#FF3B30"
                            : "black",
                      },
                    ]}
                  >
                    {moment().add(i, "days").format("dddd")}
                  </Text>

                  <Text
                    style={[
                      styles.txt_caption_r_b,
                      {
                        color:
                          moment().add(i, "days").format("dddd") == "토요일" ||
                          moment().add(i, "days").format("dddd") == "일요일"
                            ? "#FF3B30"
                            : "black",
                      },
                      { marginLeft: 5, width: 30 },
                    ]}
                  >
                    {i == 0
                      ? "오늘"
                      : i == 1
                      ? "내일"
                      : i == 2
                      ? "모레"
                      : moment().add(i, "days").format("MM.DD")}
                  </Text>
                </View>

                <View style={{ flexDirection: "row" }}>
                  <Image
                    style={{ resizeMode: "contain" }}
                    source={IMG_WEATHER10_SRC[getWeather10Img(arr.sky)].image}
                  />
                  {(arr.popAm >= 40 || arr.popPm >= 40) && (
                    <View style={{ marginLeft: "2%" }}>
                      {arr.popAm >= 40 && (
                        <Text style={styles.txt_caption_r}>
                          낮 {arr.popAm}%
                        </Text>
                      )}
                      {arr.popPm >= 40 && (
                        <Text style={styles.txt_caption_r}>
                          밤 {arr.popPm}%
                        </Text>
                      )}
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

      <View style={[styles.ractangle_bg, { height: 170 }]}>
        <View style={styles.content_padding}>
          <Text style={styles.txt_h6_b}>상세 예보</Text>
        </View>
        <View style={styles.content_padding_row}>
          <View style={styles.ractangle_detail}>
            <Image
              style={styles.img_detail}
              source={require("./assets/img/temperatures.png")}
            />
            <View style={styles.contain_detail}>
              <Text style={[styles.txt_caption_r, { marginBottom: "3%" }]}>
                체감온도
              </Text>
              <Text style={[styles.txt_subtitle1_b]}>{state.feelTemp}°</Text>
            </View>
          </View>
          <View style={[styles.ractangle_detail, { marginLeft: "2.5%" }]}>
            <Image
              style={styles.img_detail}
              source={require("./assets/img/humidity.png")}
            />
            <View style={styles.contain_detail}>
              <Text style={[styles.txt_caption_r, { marginBottom: "3%" }]}>
                습도
              </Text>
              <Text style={styles.txt_subtitle1_b}>{state.humidity}%</Text>
            </View>
          </View>
          <View
            style={[
              styles.ractangle_detail,
              { marginLeft: "2.5%", paddingLeft: "1%" },
            ]}
          >
            <Image
              style={[
                styles.img_detail,
                { transform: [{ rotate: `${state.windIconDegree}deg` }] },
              ]}
              source={require("./assets/img/windspeed.png")}
            />
            <View style={[styles.contain_detail, { marginLeft: "3%" }]}>
              <Text style={[styles.txt_caption_r, { marginBottom: "3%" }]}>
                {state.windTitle}
              </Text>
              <Text style={styles.txt_subtitle1_b}>{state.crtWindSpd}㎧</Text>
            </View>
          </View>
        </View>
      </View>

      {/* <View style={[styles.ractangle_bg_row, { height: 50 }]}>
        <View style={styles.content_padding_row}>
          <View style={styles.content_umbrella}>
            <Image
              style={styles.img_contain}
              source={require("./assets/img/umbrella.png")}
            />
            <Text style={[styles.txt_subtitle1_b, { marginLeft: "3%" }]}>
              3시부터 비
            </Text>
            <Text style={[styles.txt_subtitle1_r, { marginLeft: 3 }]}>
              예보
            </Text>
          </View>
        </View>
      </View> */}

      <View style={[styles.ractangle_bg, { height: 250 }]}>
        <View style={styles.content_padding}>
          <Text style={styles.txt_h6_b}> 옷차림 예보 </Text>
        </View>
        <View style={styles.content_padding}>
          <Image
            style={styles.img_clothes}
            source={require("./assets/img/rectangle/rectangle_clothes1.png")}
          />
          <View
            style={{
              marginTop: "-25.5%",
              marginLeft: "5.5%",
              marginRight: "5.5%",
            }}
          >
            {/* <Text style={[styles.txt_h6_b]}>아주더움</Text> */}
            <Text style={[styles.txt_subtitle2_r, { paddingTop: "5%" }]}>
              아주더운 한여름 날씨에요!
            </Text>
            <Text style={[styles.txt_caption_r, { marginTop: 7 }]}>
              민소매, 반팔, 반바지등의 얇은 옷이좋아요
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              marginTop: "15%",
              marginLeft: "2.5%",
              marginRight: "2.5%",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flex: 1, alignItems: "center" }}>
              <Image
                style={styles.img_contain_clothes}
                source={require("./assets/img/clothes/clothes1.png")}
              />
              <Text style={styles.txt_caption_b}>28°~</Text>
            </View>

            <View style={{ flex: 1, alignItems: "center" }}>
              <Image
                style={styles.img_contain_clothes}
                source={require("./assets/img/clothes/clothes2.png")}
              />
              <Text style={styles.txt_caption_r}>23°</Text>
            </View>

            <View style={{ flex: 1, alignItems: "center" }}>
              <Image
                style={styles.img_contain_clothes}
                source={require("./assets/img/clothes/clothes3.png")}
              />
              <Text style={styles.txt_caption_r}>20°</Text>
            </View>

            <View style={{ flex: 1, alignItems: "center" }}>
              <Image
                style={styles.img_contain_clothes}
                source={require("./assets/img/clothes/clothes4.png")}
              />
              <Text style={styles.txt_caption_r}>17°</Text>
            </View>

            <View style={{ flex: 1, alignItems: "center" }}>
              <Image
                style={styles.img_contain_clothes}
                source={require("./assets/img/clothes/clothes5.png")}
              />
              <Text style={styles.txt_caption_r}>12°</Text>
            </View>
          </View>
        </View>
      </View>

      {/* <View style={styles.content_padding}>
        <Text style={[styles.txt_h6_b, { marginTop: "3%" }]}>
          코로나 19 확진자 수
        </Text>
      </View>
      <View style={styles.content_padding_row}>
        <View style={[styles.ractangle_w_r, { height: 70 }]}>
          <Text style={[styles.txt_body2_r]}>전국</Text>
          <Text style={[styles.txt_subtitle1_b, { marginLeft: "3%" }]}>
            1,597명
          </Text>
          <Image
            style={styles.img_arrow}
            source={require("./assets/img/up_r.png")}
            marginLeft="3%"
          />
        </View>

        <View
          style={[styles.ractangle_w_r, { height: 70, marginLeft: "2.5%" }]}
        >
          <Text style={[styles.txt_body2_r]}>서울</Text>
          <Text style={[styles.txt_subtitle1_b, { marginLeft: "3%" }]}>
            697명
          </Text>
          <Image
            style={styles.img_arrow}
            source={require("./assets/img/down_g.png")}
            marginLeft="3%"
          />
        </View>
      </View> */}
    </HeaderComponent>
  );
}
