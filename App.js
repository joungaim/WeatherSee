import React, { useEffect, useReducer } from "react";
import { Text } from "react-native";
import "moment/locale/ko";
import firebase from "firebase/app";
import HeaderComponent from "./src/components/HeaderComponent";
import checkFirstLaunch from "./src/CheckFirstLaunch";
import { useFonts } from "expo-font";
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
  const [fontsLoaded] = useFonts({
    NotoSans_400Regular: require("./assets/fonts/NotoSans_400Regular.ttf"),
    NotoSans_700Bold: require("./assets/fonts/NotoSans_700Bold.ttf"),
    NotoSansKR_300Light: require("./assets/fonts/NotoSansKR_300Light.ttf"),
    NotoSansKR_400Regular: require("./assets/fonts/NotoSansKR_400Regular.ttf"),
    NotoSansKR_500Medium: require("./assets/fonts/NotoSansKR_500Medium.ttf"),
    NotoSansKR_700Bold: require("./assets/fonts/NotoSansKR_700Bold.ttf"),
    NotoSansKR_900Black: require("./assets/fonts/NotoSansKR_900Black.ttf"),
  });

  const initialState = {
    // [로딩화면 boolean 값 : 데이터 다 받아오면 false 할당]
    isLoading: true,
    isFirstLaunch: false,

    latitude: 0,
    longitude: 0,
    gridX: 0,
    gridY: 0,

    // [위,경도에 해당하는 한글 주소값 객체 (시,군,구)]
    addrObj: {},
  };

  function reducer(state, action) {
    switch (action.type) {
      case "SET_ISLOADING":
        return { ...state, isLoading: false };
      case "SET_ISFIRSTLAUNCH":
        return { ...state, isFirstLaunch: true };
      case "SET_LOCATION":
        return {
          ...state,
          latitude: action.latitude,
          longitude: action.longitude,
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
    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;
  };

  getCheckFirstLaunch = async () => {
    const isFirstLaunch = await checkFirstLaunch();
    console.log("isFirstLaunch: " + JSON.stringify(isFirstLaunch));
    if (isFirstLaunch) {
      console.log("앱 최초 실행 여부 : " + isFirstLaunch.toString());
      dispatch({
        type: "SET_ISFIRSTLAUNCH",
      });
    }
  };

  /**
   * 클래스 생명주기 메서드 중 componentDidMount() 와 동일한 기능을 한다.
   * useEffect는첫번째 렌더링과 이후의 모든 업데이트에서 수행됩니다.
   * 빈 배열을 넣어 주면 처음 랜더링 될 때 한번만 실행 된다. 넣지 않으면 모든 업데이트에서 실행되며
   * 배열안에 [count] 같이 인자를 넣어주면 해당 인자가 업데이트 될 때 마다 실행된다.
   */
  useEffect(() => {
    getCheckFirstLaunch();
    getLocation();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return <HeaderComponent isFirstLaunch={state.isFirstLaunch} />;
}
