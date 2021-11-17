import React, { useEffect, useReducer, useMemo } from "react";
import { Alert } from "react-native";

import * as Location from "expo-location";
import "moment/locale/ko";
import firebase from "firebase/app";
import Loading from "./Loading";
import HeaderComponent from "./src/components/HeaderComponent";
import AddressComponent from "./src/components/AddressComponent";
import WeatherComponent from "./src/components/WeatherComponent";
import { useFonts, NotoSans_300Regular } from "@expo-google-fonts/noto-sans";
import { UltSrtWeather, SrtWeather, Srt10Weather, MidLandWeather, MidTaWeather } from "./src/UltStrWeather";
import { API_KEY } from "./src/ApiKey";
import { ultSrtBaseDate, ultSrtBaseTime, srtBaseDate, srtBaseTime, midBaseDateTime } from "./src/Time";
import { Address } from "./src/Address";
import { RegId } from "./src/RegId";
import { GridXY } from "./src/GridXY";

import { NotoSansKR_300Light, NotoSansKR_400Regular, NotoSansKR_500Medium, NotoSansKR_700Bold, NotoSansKR_900Black } from "@expo-google-fonts/noto-sans-kr";
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

  const initialState = {
    // [로딩화면 boolean 값 : 데이터 다 받아오면 false 할당]
    isLoading: true,

    latitude: 0,
    longitude: 0,

    // [위,경도에 해당하는 한글 주소값 객체 (시,군,구)]
    addrObj: {},

    // [초단기예보 조회용 변수]
    ultSrtWeatherObj: {},

    // [단기예보 조회용 변수]
    srtWeatherObj: {},

    // [단기 3일예보 노출용 변수]
    // *3일 예보는 단기예보 데이터 그대로 사용. 10일 예보는 baseTime을 0200으로 세팅하여 단기예보 API 따로 한번 더 호출하여 사용
    srtWeatherTmpObj: {},
    srtWeatherSkyObj: {},
    srtWeatherPtyObj: {},
    srtWeatherPopObj: {},

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

    // 옷차림 예보
    clothesArr: {},
    onRctngle: {},
    clothesTitle: "",
    clothesSub: "",
    onText: "",
  };

  function reducer(state, action) {
    switch (action.type) {
      case "SET_ISLOADING":
        return { ...state, isLoading: false };
      case "SET_LOCATION":
        return {
          ...state,
          latitude: action.latitude,
          longitude: action.longitude,
        };
      case "SET_ADDR_OBJ":
        return { ...state, addrObj: action.addrObj };
      case "SET_SRT_WEATHER_OBJ":
        return {
          ...state,
          srtWeatherObj: action.srtWeatherObj,
          srtWeatherTmpObj: action.srtWeatherTmpObj,
          srtWeatherSkyObj: action.srtWeatherSkyObj,
          srtWeatherPtyObj: action.srtWeatherPtyObj,
          srtWeatherPopObj: action.srtWeatherPopObj,
        };
      case "SET_SRT_WEATHER10_OBJ":
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
      case "SET_CLOTHES":
        return {
          ...state,
          clothesArr: action.clothesArr,
          onRctngle: action.onRctngle,
          clothesTitle: action.clothesTitle,
          clothesSub: action.clothesSub,
          onText: action.onText,
        };
      default:
        throw new Error();
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);

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

    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({});

    dispatch({
      type: "SET_LOCATION",
      latitude: latitude,
      longitude: longitude,
    });

    const { addrText, addrGu, addrDong } = await Address(latitude, longitude);

    dispatch({
      type: "SET_ADDR_OBJ",
      addrObj: { addrText, addrGu, addrDong },
    });

    // const midRegId = await RegId(addrText);

    // const { gridX, gridY } = await GridXY(latitude, longitude); // 위도,경도를 기상청 api에 활용 가능한 x,y로 바꾸는 함수

    // const weather10Arr = await Srt10Weather(API_KEY, gridX, gridY);

    // const { midLandData, midLandArr } = await MidLandWeather(API_KEY, midBaseDateTime, midRegId.midLand);

    // dispatch({
    //   type: "SET_MID_LAND_WEATHER_OBJ",
    //   midLandWeatherObj: midLandData,
    // });

    // const { midTaData, midTaArr } = await MidTaWeather(API_KEY, midBaseDateTime, midRegId.midTa);

    // dispatch({
    //   type: "SET_MID_TA_WEATHER_OBJ",
    //   midTaWeatherObj: midTaData,
    // });

    // for (let i = 0; i < 7; i++) {
    //   midLandArr[i].tmn = midTaArr[i].tmn;
    //   midLandArr[i].tmx = midTaArr[i].tmx;
    // }

    // const weatherArr = [...weather10Arr, ...midLandArr];

    // dispatch({
    //   type: "SET_WEATHER10_OBJ",
    //   weather10Arr: weatherArr,
    // });

    dispatch({
      type: "SET_ISLOADING",
    });
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
   * 빈 배열을 넣어 주면 처음 랜더링 될 때 한번만 실행 된다. 넣지 않으면 모든 업데이트에서 실행되며
   * 배열안에 [count] 같이 인자를 넣어주면 해당 인자가 업데이트 될 때 마다 실행된다.
   */
  useEffect(() => {
    getLocation();
  }, []);

  return state.isLoading ? (
    <Loading />
  ) : (
    <HeaderComponent>
      <AddressComponent addrObj={state.addrObj} />
      <WeatherComponent addrObj={state.addrObj} latitude={state.latitude} longitude={state.longitude} />
    </HeaderComponent>
  );
}
