import React, { useEffect, useReducer, useMemo } from "react";
import { Alert } from "react-native";

import * as Location from "expo-location";
import moment from "moment";
import "moment/locale/ko";
import firebase from "firebase/app";
import Loading from "./Loading";
import HeaderComponent from "./src/components/HeaderComponent";
import AddressComponent from "./src/components/AddressComponent";
import WeatherComponent from "./src/components/WeatherComponent";
import { useFonts, NotoSans_300Regular } from "@expo-google-fonts/noto-sans";
import { UltSrtWeather, SrtWeather, Srt10Weather, MidLandWeather, MidTaWeather } from "./src/UltStrWeather";
import { IMG_CLOTHES_ON_SRC, IMG_CLOTHES_RCTNGL_SRC } from "./src/ImageSrc";
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

    const midRegId = await RegId(addrText);

    const { gridX, gridY } = await GridXY(latitude, longitude); // 위도,경도를 기상청 api에 활용 가능한 x,y로 바꾸는 함수

    const ultSrtWeather = await UltSrtWeather(API_KEY, ultSrtBaseDate, ultSrtBaseTime, gridX, gridY);

    const [srtWeather, srtWeatherTmpObj, srtWeatherSkyObj, srtWeatherPtyObj, srtWeatherPopObj] = await SrtWeather(API_KEY, srtBaseDate, srtBaseTime, gridX, gridY);

    dispatch({
      type: "SET_SRT_WEATHER_OBJ",
      srtWeatherObj: srtWeather,
      srtWeatherTmpObj: srtWeatherTmpObj,
      srtWeatherSkyObj: srtWeatherSkyObj,
      srtWeatherPtyObj: srtWeatherPtyObj,
      srtWeatherPopObj: srtWeatherPopObj,
    });

    const weather10Arr = await Srt10Weather(API_KEY, gridX, gridY);

    // dispatch({
    //   type: "SET_SRT_WEATHER10_OBJ",
    //   srtWeather10Obj: weather10Data,
    // });

    const { midLandData, midLandArr } = await MidLandWeather(API_KEY, midBaseDateTime, midRegId.midLand);

    dispatch({
      type: "SET_MID_LAND_WEATHER_OBJ",
      midLandWeatherObj: midLandData,
    });

    const { midTaData, midTaArr } = await MidTaWeather(API_KEY, midBaseDateTime, midRegId.midTa);

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

    /**
     * 옷차림 예보용
     * 1. 28도 이상 (여름) 아주더운 한여름 날씨에요! 민소매, 반팔 반바지, 스커트 등의 얇은 옷이 좋아요.
     * 2. 23~ 27도 (초여름)  버틸만한 더위에요! 반팔, 얇은 셔츠, 반바지, 면바지 등이 좋겠어요.
     * 3. 18~ 22도 (초가을)  활동하기 너무 좋은 날씨에요! 긴팔티, 청바지, 면바지에 쌀쌀하면 가디건도 괜찮아요.
     * 4. 12~ 17도 (봄, 가을)  밤에는 추워요! 맨투맨, 니트, 가디건, 재킷, 야상, 스타킹 등이 좋아요.
     * 5. 6~ 11도 (겨울)  쌀쌀해졌어요! 트렌치코트, 경량 패딩, 가죽자켓, 내복, 레깅스 등이 좋겠어요.
     * 6. 5도 ~ -1도 (겨울)  춥다 추워! 두꺼운 코트, 패딩, 목도리, 모자, 기모 제품이 필요해요
     * 7. -1 ~ (한겨울)  무장이 필요해요! 롱패딩, 내복, 털모자, 목도리, 장갑으로 무장해요.
     */
    const crntMnth = moment().format("MM"); //현재 달
    const tmx = weatherArr[0].tmx; //오늘 최고기온
    const tmn = weatherArr[0].tmn; //오늘 최저기온
    const basedTemp = tmx - (tmx - tmn) / 2; //오늘 평균 기온 ex. 31 28일때, 중간온도를 구하기 위해 31-28=3 / 3/2=1.5 / 31-1.5=29.5가 오늘의 평균 기온이다.
    let onIcon = 0; //활성화 시킬 아이콘
    let onText; // 활성화 시킬 아이콘 밑 텍스트
    let onRctngle; //활성화 시킬 말풍선
    let clothesTitle = ""; //말풍선 안에 들어갈 제목
    let clothesSub = ""; // 말풍선 안에 들어갈 설명
    // 옷차림 예보 비활성화 옷(회색) 아이콘 경로
    let IMG_CLOTHES_OFF_SRC = [
      {
        text: "민소매",
        image: require("./assets/img/clothes/clothes0_g.png"),
      },
      {
        text: "반팔",
        image: require("./assets/img/clothes/clothes1_g.png"),
      },
      {
        text: "긴팔",
        image: require("./assets/img/clothes/clothes2_g.png"),
      },
      {
        text: "맨투맨",
        image: require("./assets/img/clothes/clothes3_g.png"),
      },
      {
        text: "자켓",
        image: require("./assets/img/clothes/clothes4_g.png"),
      },
      {
        text: "코트",
        image: require("./assets/img/clothes/clothes5_g.png"),
      },
      {
        text: "롱패딩",
        image: require("./assets/img/clothes/clothes6_g.png"),
      },
    ];

    if (basedTemp >= 28) {
      onIcon = 0;
      clothesTitle = "아주더운 한여름 날씨에요!";
      clothesSub = "민소매, 반팔 반바지, 스커트 등의 얇은 옷이 좋아요.";
    } else if (23 <= basedTemp && basedTemp < 28) {
      onIcon = 1;
      clothesTitle = "버틸만한 더위에요!";
      clothesSub = "반팔, 얇은 셔츠, 반바지, 면바지로 시원하게 입어요.";
    } else if (18 <= basedTemp && basedTemp < 23) {
      onIcon = 2;
      clothesTitle = "활동하기 너무 좋은 날씨에요!";
      clothesSub = "긴팔티, 청바지, 면바지에 쌀쌀하면 가디건도 괜찮아요.";
    } else if (12 <= basedTemp && basedTemp < 18) {
      onIcon = 3;
      clothesTitle = "밤에는 추워요!";
      clothesSub = "맨투맨, 니트, 가디건, 재킷, 야상으로 멋도 열도 잡아요";
    } else if (6 <= basedTemp && basedTemp < 12) {
      onIcon = 4;
      clothesTitle = "쌀쌀해요!";
      clothesSub = "트렌치코트, 경량 패딩, 가죽자켓, 레깅스로 따뜻하게 입어요.";
    } else if (-1 <= basedTemp && basedTemp < 6) {
      onIcon = 5;
      clothesTitle = "춥다 추워!";
      clothesSub = "두꺼운 코트, 패딩, 목도리, 모자, 기모 제품이 필요해요.";
    } else if (basedTemp < -1) {
      onIcon = 6;
      clothesTitle = "무장이 필요해요!";
      clothesSub = "롱패딩, 내복, 털모자, 목도리, 장갑으로 무장해요.";
    }

    IMG_CLOTHES_OFF_SRC[onIcon].image = IMG_CLOTHES_ON_SRC[onIcon].image;
    if (4 <= crntMnth && crntMnth <= 10) {
      onRctngle = IMG_CLOTHES_RCTNGL_SRC[onIcon].image;
      IMG_CLOTHES_OFF_SRC = IMG_CLOTHES_OFF_SRC.slice(0, 5);
      onText = onIcon;
    } else {
      onRctngle = IMG_CLOTHES_RCTNGL_SRC[onIcon - 2].image;
      IMG_CLOTHES_OFF_SRC = IMG_CLOTHES_OFF_SRC.slice(2);
      onText = onIcon - 2;
    }

    dispatch({
      type: "SET_CLOTHES",
      clothesArr: IMG_CLOTHES_OFF_SRC,
      onRctngle: onRctngle,
      clothesTitle: clothesTitle,
      clothesSub: clothesSub,
      onText: onText,
    });

    /**
     * 현재 기온 및 상세 예보용
     */
    const temp = ultSrtWeather[24].fcstValue; // 현재 기온
    const wind = ultSrtWeather[54].fcstValue; // 현재 풍속
    const windDirct = Number(ultSrtWeather[48].fcstValue); // 현재 풍향
    const humidity = ultSrtWeather[30].fcstValue; // 현재 습도
    const sky = ultSrtWeather[18].fcstValue; // 현재 하늘 상태
    const pty = ultSrtWeather[6].fcstValue; // 현재 강수 코드
    const lgy = ultSrtWeather[0].fcstValue; // 현재 낙뢰 코드
    let icon = 0; // 현재 기온 아이콘 이름

    const feelTemp = Math.round(13.12 + 0.6215 * temp - 11.37 * wind ** 0.16 + 0.3965 * wind ** 0.16 * temp);

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

    // [상세 예보] 풍향 정보
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
      <WeatherComponent
        addrObj={state.addrObj}
        latitude={state.latitude}
        longitude={state.longitude}
        imageVar={state.imageVar}
        crtTemp={state.crtTemp}
        srtWeatherTmpObj={state.srtWeatherTmpObj}
        srtWeatherSkyObj={state.srtWeatherSkyObj}
        srtWeatherPtyObj={state.srtWeatherPtyObj}
        weather10Arr={state.weather10Arr}
        feelTemp={state.feelTemp}
        humidity={state.humidity}
        windIconDegree={state.windIconDegree}
        windTitle={state.windTitle}
        crtWindSpd={state.crtWindSpd}
        onRctngle={state.onRctngle}
        clothesTitle={state.clothesTitle}
        clothesSub={state.clothesSub}
        clothesArr={state.clothesArr}
        onText={state.onText}
      />
    </HeaderComponent>
  );
}
