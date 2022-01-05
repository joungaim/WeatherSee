import React, { useCallback, useEffect, useReducer } from "react";
import { View, ScrollView, RefreshControl, Alert } from "react-native";
import styles from "../styles/styles";
import * as Location from "expo-location";
import { Address } from "../Address";
import { GridXY } from "../GridXY";
import checkNotNull from "../CheckNotNull";
import LoadingComponent from "../components/LoadingComponent";
import WeatherComponent from "../components/WeatherComponent";
import ModalComponent from "../components/ModalComponent";
import ErrorFallbackComponent from "../components/ErrorFallbackComponent";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

function HeaderComponent(props) {
  const initialState = {
    isGranted: true,
    isError: false,

    isLoading: "doing",
    isRefreshed: false,
    refreshing: false,

    uniqueValue: 1,

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
        return { ...state, isLoading: "done" };
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
      case "SET_REFRESHING_TRUE":
        return { ...state, refreshing: true };
      case "SET_REFRESHING_FALSE":
        return { ...state, refreshing: false };
      case "SET_ISREFRESHED":
        return { ...state, isRefreshed: true };
      case "SET_UNIQUEVALUE":
        return { ...state, uniqueValue: action.uniqueValue };
      case "SET_GRANTED":
        return { ...state, isLoading: "fail", isGranted: false };
      case "SET_ERROR":
        return { ...state, isLoading: "fail", isError: true };
      default:
        throw new Error();
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  /**
   * 새로고침 로직 [Start]
   */
  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

  const onRefresh = useCallback(async (uniqueValue) => {
    dispatch({
      type: "SET_REFRESHING_TRUE",
    });
    await getLocation();
    wait(2000).then(async () => {
      dispatch({
        type: "SET_REFRESHING_FALSE",
      });
      dispatch({
        type: "SET_UNIQUEVALUE",
        uniqueValue: uniqueValue + 1,
      });
      dispatch({
        type: "SET_ISREFRESHED",
      });
    });
  }, []);
  //새로고침 로직 [End]

  getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    // 위치정보 허용 안했을 때
    if (status !== "granted") {
      dispatch({
        type: "SET_GRANTED",
      });
      return;
    }
    try {
      // 다른 지역 테스트 코드 : 끝나면 풀기
      const {
        coords: { latitude, longitude },
      } = await Location.getCurrentPositionAsync({});

      // 다른 지역 테스트 코드 : 끝나면 삭제
      // const latitude = null;
      // const longitude = 129.0337727390025;

      const { gridX, gridY } = await GridXY(latitude, longitude);

      dispatch({
        type: "SET_LOCATION",
        latitude: latitude,
        longitude: longitude,
        gridX: gridX,
        gridY: gridY,
      });

      const { addrText, addrSi, addrGu, addrDong } = await Address(latitude, longitude);

      if (!checkNotNull(latitude) || !checkNotNull(longitude) || !checkNotNull(addrText)) {
        dispatch({
          type: "SET_ERROR",
        });
      }

      dispatch({
        type: "SET_ADDR_OBJ",
        addrObj: { addrText, addrSi, addrGu, addrDong },
      });

      dispatch({
        type: "SET_ISLOADING",
      });
    } catch {
      dispatch({
        type: "SET_ERROR",
      });
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  if (state.isLoading === "doing" && !state.isRefreshed) {
    return <LoadingComponent />;
  }
  if (!state.isGranted) {
    return <ErrorFallbackComponent gubn="granted" />;
  }
  if (state.isError) {
    return <ErrorFallbackComponent gubn="error" />;
  }
  return (
    state.isLoading === "done" && (
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={state.refreshing} onRefresh={() => onRefresh(state.uniqueValue)} />}
          >
            <StatusBar style="auto" />
            <View style={styles.header} />
            <View style={styles.content} key={state.uniqueValue}>
              <WeatherComponent isRefreshed={state.isRefreshed} addrObj={state.addrObj} gridX={state.gridX} gridY={state.gridY} latitude={state.latitude} longitude={state.longitude} />
              {props.isFirstLaunch && <ModalComponent />}
            </View>
          </ScrollView>
        </SafeAreaView>
      </SafeAreaProvider>
    )
  );
}
export default HeaderComponent;
