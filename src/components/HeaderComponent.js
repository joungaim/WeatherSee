import React, { useCallback, useEffect, useReducer } from "react";
import { View, ScrollView, RefreshControl, AsyncStorage } from "react-native";
import styles from "../styles/styles";
import * as Location from "expo-location";
import { Address } from "../../src/Address";
import { GridXY } from "../../src/GridXY";
import LoadingComponent from "../../src/components/LoadingComponent";
import WeatherComponent from "../../src/components/WeatherComponent";
import ModalComponent from "../../src/components/ModalComponent";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

function HeaderComponent(props) {
  const initialState = {
    // [로딩화면 boolean 값 : 데이터 다 받아오면 false 할당]
    isLoading: true,
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
        return { ...state, isLoading: false };
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
    if (status !== "granted") {
      Alert.alert("위치정보 사용을 허용해 주세요.");
      return;
    }

    // 다른 지역 테스트 코드 : 끝나면 풀기
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({});

    // 다른 지역 테스트 코드 : 끝나면 삭제
    // const latitude = 35.19631127996341;
    // const longitude = 129.0337727390025;

    const { gridX, gridY } = await GridXY(latitude, longitude);

    // const gridXStr = String(gridX);
    // const gridYStr = String(gridY);
    // try {
    //   const gridXItem = await AsyncStorage.getItem("@gridX");
    //   const gridYItem = await AsyncStorage.getItem("@gridY");
    //   console.log("Header gridXItem : ", gridXItem, " , gridYItem: ", gridYItem);
    //   if (gridXItem === null || gridYItem === null || gridXStr !== gridXItem || gridYStr !== gridYItem) {
    //     const gridX_ = ["@gridX", gridXStr];
    //     const gridY_ = ["@gridY", gridYStr];
    //     await AsyncStorage.multiSet([gridX_, gridY_]);
    //   }
    // } catch (e) {
    //   // error reading value
    // }

    dispatch({
      type: "SET_LOCATION",
      latitude: latitude,
      longitude: longitude,
      gridX: gridX,
      gridY: gridY,
    });

    const { addrText, addrSi, addrGu, addrDong } = await Address(latitude, longitude);

    dispatch({
      type: "SET_ADDR_OBJ",
      addrObj: { addrText, addrSi, addrGu, addrDong },
    });

    dispatch({
      type: "SET_ISLOADING",
    });
  };

  useEffect(() => {
    getLocation();
  }, []);

  if (state.isLoading && !state.isRefreshed) {
    return <LoadingComponent />;
  }
  return (
    !state.isLoading && (
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
