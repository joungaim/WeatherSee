import React, { useEffect, useReducer, useMemo } from "react";
import { Alert, AsyncStorage } from "react-native";

import * as Location from "expo-location";
import "moment/locale/ko";
import firebase from "firebase/app";
import Loading from "./Loading";
import HeaderComponent from "./src/components/HeaderComponent";
import AddressComponent from "./src/components/AddressComponent";
import WeatherComponent from "./src/components/WeatherComponent";
import { useFonts, NotoSans_300Regular } from "@expo-google-fonts/noto-sans";
import { Address } from "./src/Address";
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

    gridX: 0,
    gridY: 0,

    // [위,경도에 해당하는 한글 주소값 객체 (시,군,구)]
    addrObj: {},
  };

  function reducer(state, action) {
    switch (action.type) {
      case "SET_ISLOADING":
        return { ...state, isLoading: false };
      case "SET_LOCATION":
        return {
          ...state,
          gridX: action.gridX,
          gridY: action.gridY,
        };
      case "SET_ADDR_OBJ":
        return { ...state, addrObj: action.addrObj };
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

    const { gridX, gridY } = await GridXY(latitude, longitude);

    const gridXStr = String(gridX);
    const gridYStr = String(gridY);

    try {
      const gridXItem = await AsyncStorage.getItem("@gridX");
      const gridYItem = await AsyncStorage.getItem("@gridY");
      if (gridXItem === null || gridYItem === null || gridXStr !== gridXItem || gridYStr !== gridYItem) {
        const gridX_ = ["@gridX", gridXStr];
        const gridY_ = ["@gridY", gridYStr];
        await AsyncStorage.multiSet([gridX_, gridY_]);
      }
    } catch (e) {
      // error reading value
    }

    dispatch({
      type: "SET_LOCATION",
      gridX: gridX,
      gridY: gridY,
    });

    const { addrText, addrGu, addrDong } = await Address(latitude, longitude);

    dispatch({
      type: "SET_ADDR_OBJ",
      addrObj: { addrText, addrGu, addrDong },
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
      <WeatherComponent addrObj={state.addrObj} gridX={state.gridX} gridY={state.gridY} />
    </HeaderComponent>
  );
}
