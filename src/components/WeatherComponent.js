import React, { useReducer, useEffect } from "react";
import { AsyncStorage } from "react-native";
import WeatherNowComponent from "../../src/components/WeatherNowComponent";
import DustCovidComponent from "../../src/components/DustCovidComponent";
import Weather3Component from "../../src/components/Weather3Component";
import Weather10Component from "../../src/components/Weather10Component";
import WeatherDetailComponent from "../../src/components/WeatherDetailComponent";
import WeatherClothesComponent from "../../src/components/WeatherClothesComponent";
import { UltSrtWeather, Srt10Weather } from "../../src/UltStrWeather";
import { API_KEY } from "../../src/ApiKey";
import { GridXY } from "../../src/GridXY";
import { ultSrtBaseDate, ultSrtBaseTime } from "../../src/Time";

function WeatherComponent(props) {
  const initialState = {
    // [초단기예보 조회용 변수]
    ultSrtWeatherArr: {},

    // [단기 예보 2시 조회용 변수]
    srtWeather0200Arr: {},
  };

  function reducer(state, action) {
    switch (action.type) {
      case "SET_ULT_SRT_WEATHER":
        return {
          ...state,
          ultSrtWeatherArr: action.ultSrtWeatherArr,
        };
      case "SET_WEATHER10":
        return {
          ...state,
          srtWeather0200Arr: action.srtWeather0200Arr,
        };
      default:
        throw new Error();
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  /**
   * 초단기 예보 API
   * 사용 컴포넌트 : <WeatherNowComponent>, <WeatherDetailComponent>
   * 사용 데이터 :
   *  <WeatherNowComponent> : SKY (하늘 상태 : 날씨 아이콘), T1H (현재 기온)
   *  <WeatherDetailComponent> : T1H (현재 기온 : 체감온도 구할 때), REH (현재 습도), VEC (풍향), WSD (풍속), SKY (하늘 상태 : 날씨 아이콘),
   *                             PTY (강수 형태 : 날씨 아이콘), LGT (낙뢰 : 날씨 아이콘)
   */
  getUltSrtWeather = async (gridX, gridY) => {
    const ultSrtWeatherArr = await UltSrtWeather(API_KEY, ultSrtBaseDate, ultSrtBaseTime, gridX, gridY);
    dispatch({
      type: "SET_ULT_SRT_WEATHER",
      ultSrtWeatherArr: ultSrtWeatherArr,
    });
  };

  /**
   * 단기 예보 2시 API (최고, 최저기온 불러오기 위해 BaseTime 0200으로 조회)
   * 사용 컴포넌트 : <WeatherNowComponent>, <Weather10Component>, <WeatherClothesComponent>
   * 사용 데이터 :
   *  <WeatherNowComponent> : TMX (최고기온), TMN (최저기온)
   *  <Weather10Component> : TMX (최고기온), TMN (최저기온), SKY (하늘상태)
   *  <WeatherClothesComponent> : TMX (최고기온), TMN (최저기온) : 오늘의 평균 기온 구해서 기온에 알맞은 옷차림 알림
   */
  getSrtWeather0200 = async (gridX, gridY) => {
    let srtWeather0200Arr;
    try {
      const value = await AsyncStorage.getItem("@storage_Key");
      if (value !== null) {
        srtWeather0200Arr = JSON.parse(value);
      } else {
        srtWeather0200Arr = await Srt10Weather(API_KEY, gridX, gridY);
        const srtWeather0200Str = JSON.stringify(srtWeather0200Arr);
        await AsyncStorage.setItem("@storage_Key", srtWeather0200Str);
      }
    } catch (e) {
      // error reading value
    }
    dispatch({
      type: "SET_WEATHER10",
      srtWeather0200Arr: srtWeather0200Arr,
    });
  };

  getWeather = async () => {
    const { gridX, gridY } = await GridXY(props.latitude, props.longitude);
    getUltSrtWeather(gridX, gridY);
    getSrtWeather0200(gridX, gridY);
  };

  useEffect(() => {
    getWeather();
  }, []);

  return (
    <>
      <WeatherNowComponent
        ultSrtWeatherArr={state.ultSrtWeatherArr.length > 1 ? state.ultSrtWeatherArr : "empty"}
        srtWeather0200Arr={state.srtWeather0200Arr.length > 1 ? state.srtWeather0200Arr[0] : "empty"}
      />
      <DustCovidComponent />
      <Weather3Component latitude={props.latitude} longitude={props.longitude} />
      <Weather10Component addrObj={props.addrObj} srtWeather0200Arr={state.srtWeather0200Arr.length > 1 ? state.srtWeather0200Arr : "empty"} />
      <WeatherDetailComponent ultSrtWeatherArr={state.ultSrtWeatherArr.length > 1 ? state.ultSrtWeatherArr : "empty"} />
      <WeatherClothesComponent srtWeather0200Arr={state.srtWeather0200Arr.length > 1 ? state.srtWeather0200Arr[0] : "empty"} />
    </>
  );
}

export default WeatherComponent;
