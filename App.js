import React, { useEffect, useReducer, useMemo } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Animated,
} from "react-native";
import * as Location from "expo-location";
import axios from "axios";
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
    //ultSrtBaseTime: "0000",
    //ultSrtBaseDate: "",
    ultSrtWeatherObj: {},

    // [단기예보 조회용 변수]
    //srtBaseTime: "0200",
    //srtBaseDate: "",
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
    //midBaseDateTime: "",
    midLandWeatherObj: {},
    midTaWeatherObj: {},

    weater10Arr: {},

    // [현재 날씨 노출용 변수] (crtTemp:현재 기온 / crtWindSpd:현재 풍속 / feelTemp:체감 온도 / humidity:습도 / imageVar:현재 기온 아이콘)
    crtTemp: "",
    crtWindSpd: "",
    feelTemp: "",
    humidity: "",
    imageVar: 0,
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
          weater10Arr: action.weater10Arr,
        };
      case "SET_CRNT_WEATHER":
        return {
          ...state,
          crtTemp: action.crtTemp,
          crtWindSpd: action.crtWindSpd,
          feelTemp: action.feelTemp,
          humidity: action.humidity,
          imageVar: action.imageVar,
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

    const weaterArr = [...weather10Arr, ...midLandArr];

    dispatch({
      type: "SET_WEATHER10_OBJ",
      weater10Arr: weaterArr,
    });
    console.log(weaterArr);
    // await getWeather(gridX, gridY, midRegId); // 좌표 값 사용하여 날씨데이터 받아오는 함수

    /**
     * 현재 기온 및 상세 예보용
     */
    const temp = ultStrWeather[25].fcstValue; // 현재 기온
    const wind = ultStrWeather[55].fcstValue; // 현재 풍속
    const humidity = ultStrWeather[31].fcstValue; // 현재 습도
    const sky = ultStrWeather[19].fcstValue; // 현재 하늘 상태
    const pty = ultStrWeather[7].fcstValue; // 현재 강수 코드
    const lgy = ultStrWeather[1].fcstValue; // 현재 낙뢰 코드
    let icon = 0; // 현재 기온 아이콘 이름

    const feelTemp = Math.round(
      13.12 +
        0.6215 * temp -
        11.37 * wind ** 0.16 +
        0.3965 * wind ** 0.16 * temp
    );

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

    dispatch({
      type: "SET_CRNT_WEATHER",
      crtTemp: temp,
      crtWindSpd: wind,
      feelTemp: feelTemp,
      humidity: humidity,
      imageVar: icon,
    });

    dispatch({
      type: "SET_ISLOADING",
    });
  };

  /**
   * 10일 예보 날씨 아이콘 표시
   */
  getWeather10Img = (wfCode, ptyCode = 0) => {
    let code;
    if (isNaN(wfCode)) {
      const obj = state.midLandWeatherObj;
      const sky = obj[wfCode];

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
        if (wfCode == 1) {
          code = 0;
        } else if (wfCode == 3) {
          code = 2;
        } else if (wfCode == 4) {
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
   * {Math.round(ultSrtWeatherObj[3].obsrValue)}
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
                { marginTop: 5, marginLeft: 6 },
              ]}
            >
              최고:{Math.round(state.srtWeather10Obj[2].fcstValue)}° 최저:
              {Math.round(state.srtWeather10Obj[0].fcstValue)}°
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.content_padding_row}>
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
          style={[styles.ractangle_w_r, { height: 90, marginLeft: "2.5%" }]}
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
          <View style={styles.content_weather10_first}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text
                style={[styles.txt_subtitle1_b, styles.color_weather10_1st]}
              >
                {moment().add(0, "days").format("dddd")}
              </Text>

              <Text
                style={[
                  styles.txt_weather10_1st,
                  styles.color_weather10_1st,
                  { marginLeft: 5, width: 30 },
                ]}
              >
                오늘
              </Text>
            </View>
            <View>
              <Image
                style={{ resizeMode: "contain" }}
                source={
                  IMG_WEATHER10_SRC[
                    getWeather10Img(state.srtWeather10Obj[1].fcstValue)
                  ].image
                }
              />
            </View>

            <View style={{ flexDirection: "row" }}>
              <View style={styles.content_weather10_taMax}>
                <Text style={styles.txt_subtitle1_b}>
                  {Math.round(state.srtWeather10Obj[2].fcstValue)}°
                </Text>
              </View>
              <View style={styles.content_weather10_taMin}>
                <Text style={[styles.txt_subtitle1_r_g]}>
                  {Math.round(state.srtWeather10Obj[0].fcstValue)}°
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.devider_weather10}></View>

          <View style={styles.content_weather10}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text
                style={[styles.txt_subtitle1_b_r, styles.color_weather10_2nd]}
              >
                {moment().add(1, "days").format("dddd")}
              </Text>
              <Text
                style={[
                  styles.txt_caption_r_r,
                  styles.color_weather10_2nd,
                  { marginLeft: 5, width: 30 },
                ]}
              >
                내일
              </Text>
            </View>
            <View>
              <Image
                style={{ resizeMode: "contain" }}
                source={
                  IMG_WEATHER10_SRC[
                    getWeather10Img(state.srtWeather10Obj[4].fcstValue)
                  ].image
                }
              />
            </View>
            <View style={{ flexDirection: "row" }}>
              <View style={styles.content_weather10_taMax}>
                <Text style={styles.txt_subtitle1_b}>
                  {Math.round(state.srtWeather10Obj[5].fcstValue)}°
                </Text>
              </View>
              <View style={styles.content_weather10_taMin}>
                <Text style={[styles.txt_subtitle1_r_g]}>
                  {Math.round(state.srtWeather10Obj[3].fcstValue)}°
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.devider_weather10}></View>

          <View style={styles.content_weather10}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text
                style={[styles.txt_subtitle1_b_r, styles.color_weather10_3rd]}
              >
                {moment().add(2, "days").format("dddd")}
              </Text>
              <Text
                style={[
                  styles.txt_caption_r_r,
                  styles.color_weather10_3rd,
                  { marginLeft: 5, width: 30 },
                ]}
              >
                모레
              </Text>
            </View>
            <View>
              <Image
                style={{ resizeMode: "contain" }}
                source={
                  IMG_WEATHER10_SRC[
                    getWeather10Img(state.srtWeather10Obj[7].fcstValue)
                  ].image
                }
              />
            </View>
            <View style={{ flexDirection: "row" }}>
              <View style={styles.content_weather10_taMax}>
                <Text style={styles.txt_subtitle1_b}>
                  {Math.round(state.srtWeather10Obj[8].fcstValue)}°
                </Text>
              </View>

              <View style={styles.content_weather10_taMin}>
                <Text style={[styles.txt_subtitle1_r_g]}>
                  {Math.round(state.srtWeather10Obj[6].fcstValue)}°
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.devider_weather10}></View>

          <View style={styles.content_weather10}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text
                style={[styles.txt_subtitle1_b, styles.color_weather10_4th]}
              >
                {moment().add(3, "days").format("dddd")}
              </Text>
              <Text
                style={[
                  styles.txt_caption_r_b,
                  styles.color_weather10_4th,
                  { marginLeft: 5, width: 30 },
                ]}
              >
                {moment().add(3, "days").format("MM.DD")}
              </Text>
            </View>
            <View>
              <Image
                style={{ resizeMode: "contain" }}
                source={IMG_WEATHER10_SRC[getWeather10Img("wf3Am")].image}
              />
            </View>
            <View style={{ flexDirection: "row" }}>
              <View style={styles.content_weather10_taMax}>
                <Text style={styles.txt_subtitle1_b}>
                  {state.midTaWeatherObj.taMax3}°
                </Text>
              </View>
              <View style={styles.content_weather10_taMin}>
                <Text style={[styles.txt_subtitle1_r_g]}>
                  {state.midTaWeatherObj.taMin3}°
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.devider_weather10}></View>

          <View style={styles.content_weather10}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text
                style={[styles.txt_subtitle1_b, styles.color_weather10_5th]}
              >
                {moment().add(4, "days").format("dddd")}
              </Text>
              <Text
                style={[
                  styles.txt_caption_r_b,
                  styles.color_weather10_5th,
                  { marginLeft: 5, width: 30 },
                ]}
              >
                {moment().add(4, "days").format("MM.DD")}
              </Text>
            </View>
            <View>
              <Image
                style={{ resizeMode: "contain" }}
                source={IMG_WEATHER10_SRC[getWeather10Img("wf4Am")].image}
              />
            </View>
            <View style={{ flexDirection: "row" }}>
              <View style={styles.content_weather10_taMax}>
                <Text style={styles.txt_subtitle1_b}>
                  {state.midTaWeatherObj.taMax4}°
                </Text>
              </View>
              <View style={styles.content_weather10_taMin}>
                <Text style={[styles.txt_subtitle1_r_g]}>
                  {state.midTaWeatherObj.taMin4}°
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.devider_weather10}></View>

          <View style={styles.content_weather10}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text
                style={[styles.txt_subtitle1_b, styles.color_weather10_6th]}
              >
                {moment().add(5, "days").format("dddd")}
              </Text>
              <Text
                style={[
                  styles.txt_caption_r_b,
                  styles.color_weather10_6th,
                  { marginLeft: 5, width: 30 },
                ]}
              >
                {moment().add(5, "days").format("MM.DD")}
              </Text>
            </View>
            <View>
              <Image
                style={{ resizeMode: "contain" }}
                source={IMG_WEATHER10_SRC[getWeather10Img("wf5Am")].image}
              />
            </View>
            <View style={{ flexDirection: "row" }}>
              <View style={styles.content_weather10_taMax}>
                <Text style={styles.txt_subtitle1_b}>
                  {state.midTaWeatherObj.taMax5}°
                </Text>
              </View>
              <View style={styles.content_weather10_taMin}>
                <Text style={[styles.txt_subtitle1_r_g]}>
                  {state.midTaWeatherObj.taMin5}°
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.devider_weather10}></View>

          <View style={styles.content_weather10}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text
                style={[styles.txt_subtitle1_b, styles.color_weather10_7th]}
              >
                {moment().add(6, "days").format("dddd")}
              </Text>
              <Text
                style={[
                  styles.txt_caption_r_b,
                  styles.color_weather10_7th,
                  { marginLeft: 5, width: 30 },
                ]}
              >
                {moment().add(6, "days").format("MM.DD")}
              </Text>
            </View>
            <View>
              <Image
                style={{ resizeMode: "contain" }}
                source={IMG_WEATHER10_SRC[getWeather10Img("wf6Am")].image}
              />
            </View>
            <View style={{ flexDirection: "row" }}>
              <View style={styles.content_weather10_taMax}>
                <Text style={styles.txt_subtitle1_b}>
                  {state.midTaWeatherObj.taMax6}°
                </Text>
              </View>
              <View style={styles.content_weather10_taMin}>
                <Text style={[styles.txt_subtitle1_r_g]}>
                  {state.midTaWeatherObj.taMin6}°
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.devider_weather10}></View>

          <View style={styles.content_weather10}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text
                style={[styles.txt_subtitle1_b, styles.color_weather10_8th]}
              >
                {moment().add(7, "days").format("dddd")}
              </Text>
              <Text
                style={[
                  styles.txt_caption_r_b,
                  styles.color_weather10_8th,
                  { marginLeft: 5, width: 30 },
                ]}
              >
                {moment().add(7, "days").format("MM.DD")}
              </Text>
            </View>
            <View>
              <Image
                style={{ resizeMode: "contain" }}
                source={IMG_WEATHER10_SRC[getWeather10Img("wf7Am")].image}
              />
            </View>
            <View style={{ flexDirection: "row" }}>
              <View style={styles.content_weather10_taMax}>
                <Text style={styles.txt_subtitle1_b}>
                  {state.midTaWeatherObj.taMax7}°
                </Text>
              </View>
              <View style={styles.content_weather10_taMin}>
                <Text style={[styles.txt_subtitle1_r_g]}>
                  {state.midTaWeatherObj.taMin7}°
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.devider_weather10}></View>

          <View style={styles.content_weather10}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text
                style={[styles.txt_subtitle1_b_r, styles.color_weather10_9th]}
              >
                {moment().add(8, "days").format("dddd")}
              </Text>
              <Text
                style={[
                  styles.txt_caption_r_r,
                  styles.color_weather10_9th,
                  { marginLeft: 5, width: 30 },
                ]}
              >
                {moment().add(8, "days").format("MM.DD")}
              </Text>
            </View>
            <View>
              <Image
                style={{ resizeMode: "contain" }}
                source={IMG_WEATHER10_SRC[getWeather10Img("wf8")].image}
              />
            </View>
            <View style={{ flexDirection: "row" }}>
              <View style={styles.content_weather10_taMax}>
                <Text style={styles.txt_subtitle1_b}>
                  {state.midTaWeatherObj.taMax8}°
                </Text>
              </View>
              <View style={styles.content_weather10_taMin}>
                <Text style={[styles.txt_subtitle1_r_g]}>
                  {state.midTaWeatherObj.taMin8}°
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.devider_weather10}></View>

          <View style={styles.content_weather10}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text
                style={[styles.txt_subtitle1_b_r, styles.color_weather10_10th]}
              >
                {moment().add(9, "days").format("dddd")}
              </Text>
              <Text
                style={[
                  styles.txt_caption_r_r,
                  styles.color_weather10_10th,
                  { marginLeft: 5, width: 30 },
                ]}
              >
                {moment().add(9, "days").format("MM.DD")}
              </Text>
            </View>
            <View>
              <Image
                style={{ resizeMode: "contain" }}
                source={IMG_WEATHER10_SRC[getWeather10Img("wf9")].image}
              />
            </View>
            <View style={{ flexDirection: "row" }}>
              <View style={styles.content_weather10_taMax}>
                <Text style={styles.txt_subtitle1_b}>
                  {state.midTaWeatherObj.taMax9}°
                </Text>
              </View>
              <View style={styles.content_weather10_taMin}>
                <Text style={[styles.txt_subtitle1_r_g]}>
                  {state.midTaWeatherObj.taMin9}°
                </Text>
              </View>
            </View>
          </View>
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
          <View style={[styles.ractangle_detail, { marginLeft: "2.5%" }]}>
            <Image
              style={styles.img_detail_wind}
              source={require("./assets/img/windspeed.png")}
            />
            <View style={[styles.contain_detail, { marginLeft: "3%" }]}>
              <Text style={[styles.txt_caption_r, { marginBottom: "3%" }]}>
                서풍
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
        <Text style={styles.txt_h6_b}>미세먼지 단계</Text>
      </View> */}

      <View style={styles.content_padding}>
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
      </View>
    </HeaderComponent>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },

  header: {
    height: 10,
  },

  content: {
    flex: 1,
  },

  content_weather: {
    flex: 1,
    paddingTop: "10%",
    paddingBottom: "20%",
    marginLeft: "5%",
    alignItems: "flex-start",
  },

  content_padding: {
    paddingLeft: "4.5%",
    paddingRight: "4.5%",
  },

  content_padding_row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: "4.5%",
    paddingRight: "4.5%",
  },

  content_weather10_first: {
    paddingTop: "5%",
    justifyContent: "space-between",
    flexDirection: "row",
  },

  content_weather10: {
    paddingTop: "4%",
    justifyContent: "space-between",
    flexDirection: "row",
  },

  content_weather10_taMax: {
    width: 30,
    alignItems: "flex-end",
  },

  content_weather10_taMin: {
    width: 32,
    alignItems: "flex-end",
  },

  content_umbrella: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  devider: {
    borderBottomColor: "#CCCCCC",
    borderBottomWidth: 0.6,
    paddingTop: "5%",
  },

  devider_weather10: {
    borderBottomColor: "#CCCCCC",
    borderBottomWidth: 0.6,
    paddingTop: "4%",
  },

  txt_weather: {
    fontFamily: "NotoSansKR_300Light",
    fontSize: 85,
    color: "white",
    height: 105,
    margin: 0,
    padding: 0,
  },

  txt_h5_b: {
    fontFamily: "NotoSansKR_700Bold",
    fontSize: 24,
    color: "black",
    paddingLeft: "4.5%",
  },

  txt_h6_b: {
    fontSize: 20,
    color: "black",
    fontFamily: "NotoSansKR_700Bold",
    paddingTop: "5%",
  },

  txt_subtitle1_b: {
    fontFamily: "NotoSansKR_700Bold",
    fontSize: 18,
    color: "black",
    lineHeight: 22,
  },

  txt_subtitle1_b_r: {
    fontFamily: "NotoSansKR_700Bold",
    fontSize: 18,
    color: "#FF3B30",
    lineHeight: 22,
  },

  txt_subtitle1_r: {
    fontFamily: "NotoSansKR_400Regular",
    fontSize: 18,
    color: "black",
    lineHeight: 22,
  },

  txt_subtitle1_r_g: {
    fontFamily: "NotoSansKR_400Regular",
    fontSize: 18,
    color: "#8A8A8E",
    lineHeight: 22,
  },

  txt_subtitle2_r: {
    fontFamily: "NotoSansKR_500Medium",
    fontSize: 14,
    color: "black",
  },

  txt_subtitle2_r_w: {
    fontFamily: "NotoSansKR_500Medium",
    fontSize: 14,
    color: "white",
    height: 16,
  },

  txt_body2_r: {
    fontFamily: "NotoSansKR_400Regular",
    fontSize: 14,
    color: "#8A8A8E",
    lineHeight: 19,
  },

  txt_body2_b: {
    fontFamily: "NotoSansKR_700Bold",
    fontSize: 14,
    color: "black",
    lineHeight: 19,
  },

  txt_caption_r: {
    fontSize: 12,
    color: "#85858C",
    fontFamily: "NotoSansKR_400Regular",
    lineHeight: 15,
  },

  txt_caption_sb: {
    fontSize: 12,
    color: "#0E0E0E",
    fontFamily: "NotoSansKR_500Medium",
    lineHeight: 15,
  },

  txt_caption_r_r: {
    fontSize: 12,
    color: "#FF3B30",
    fontFamily: "NotoSansKR_400Regular",
    lineHeight: 15,
  },

  txt_caption_r_b: {
    fontSize: 12,
    color: "black",
    fontFamily: "NotoSansKR_400Regular",
    lineHeight: 15,
  },

  txt_caption_b: {
    fontSize: 12,
    color: "black",
    fontFamily: "NotoSansKR_700Bold",
    lineHeight: 15,
  },

  txt_overline_r: {
    fontSize: 10,
    color: "#85858C",
    fontFamily: "NotoSansKR_400Regular",
    lineHeight: 14,
  },

  txt_weather10_1st: {
    fontSize: 12,
    color:
      moment().format("dddd") == ("토요일" || "일요일") ? "#FF3B30" : "black",
    fontFamily: "NotoSansKR_400Regular",
    lineHeight: 15,
  },

  color_weather10_1st: {
    color:
      moment().format("dddd") == "토요일" || moment().format("dddd") == "일요일"
        ? "#FF3B30"
        : "black",
  },

  color_weather10_2nd: {
    color:
      moment().add(1, "days").format("dddd") == "토요일" ||
      moment().add(1, "days").format("dddd") == "일요일"
        ? "#FF3B30"
        : "black",
  },

  color_weather10_3rd: {
    color:
      moment().add(2, "days").format("dddd") == "토요일" ||
      moment().add(2, "days").format("dddd") == "일요일"
        ? "#FF3B30"
        : "black",
  },

  color_weather10_4th: {
    color:
      moment().add(3, "days").format("dddd") == "토요일" ||
      moment().add(3, "days").format("dddd") == "일요일"
        ? "#FF3B30"
        : "black",
  },

  color_weather10_5th: {
    color:
      moment().add(4, "days").format("dddd") == "토요일" ||
      moment().add(4, "days").format("dddd") == "일요일"
        ? "#FF3B30"
        : "black",
  },

  color_weather10_6th: {
    color:
      moment().add(5, "days").format("dddd") == "토요일" ||
      moment().add(5, "days").format("dddd") == "일요일"
        ? "#FF3B30"
        : "black",
  },

  color_weather10_7th: {
    color:
      moment().add(6, "days").format("dddd") == "토요일" ||
      moment().add(6, "days").format("dddd") == "일요일"
        ? "#FF3B30"
        : "black",
  },

  color_weather10_8th: {
    color:
      moment().add(7, "days").format("dddd") == "토요일" ||
      moment().add(7, "days").format("dddd") == "일요일"
        ? "#FF3B30"
        : "black",
  },

  color_weather10_9th: {
    color:
      moment().add(8, "days").format("dddd") == "토요일" ||
      moment().add(8, "days").format("dddd") == "일요일"
        ? "#FF3B30"
        : "black",
  },

  color_weather10_10th: {
    color:
      moment().add(9, "days").format("dddd") == "토요일" ||
      moment().add(9, "days").format("dddd") == "일요일"
        ? "#FF3B30"
        : "black",
  },

  ractangle1: {
    backgroundColor: "#007AFF",
    flexDirection: "row",
    borderRadius: 14,
    height: 203,
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 25,
    marginBottom: 10,
    paddingLeft: "5%",
    paddingRight: "5%",
  },

  /**
   * 흰색 배경
   */
  ractangle_bg: {
    backgroundColor: "white",
    width: "100%",
    marginTop: 10,
  },

  /**
   * 흰색 배경 가로 정렬 (비/눈 예보 영역)
   */
  ractangle_bg_row: {
    backgroundColor: "white",
    flexDirection: "row",
    width: "100%",
    marginTop: 10,
    alignItems: "center",
  },

  /**
   * 흰색 라운드 박스
   */
  ractangle_w_r: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "white",
    width: "100%",
    borderRadius: 14,
    marginTop: 10,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  ractangle_detail: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    backgroundColor: "#F3F3F9",
    width: "100%",
    borderRadius: 14,
    marginTop: 20,
    height: 68,
  },

  ractangle_weather3: {
    flex: 1,
    backgroundColor: "#F3F3F9",
    borderRadius: 14,
    marginTop: 20,
    width: 80,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },

  ractangle_weather3_margin: {
    flex: 1,
    backgroundColor: "#F3F3F9",
    borderRadius: 14,
    marginTop: 20,
    width: 80,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },

  contain_detail: {
    flex: 1.3,
    alignItems: "flex-start",
  },

  img_weathericon: {
    flex: 1,
    resizeMode: "contain",
  },

  img_detail: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    resizeMode: "contain",
  },

  img_detail_wind: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    resizeMode: "contain",
    marginLeft: "3%",
  },

  img_weather3: {
    flex: 1,
    resizeMode: "contain",
    marginLeft: "15%",
    marginRight: "15%",
    marginTop: "15%",
    marginBottom: "10%",
  },

  img_contain: {
    resizeMode: "contain",
  },

  img_contain_clothes: {
    resizeMode: "contain",
    marginBottom: 5,
  },

  img_clothes: {
    width: "100%",
    resizeMode: "stretch",
    marginTop: "7%",
    paddingBottom: 5,
    paddingTop: 5,
  },
});
