import React, { useReducer, useEffect } from "react";
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
   * 사용 컴포넌트 : <WeatherNowComponent>, <Weather10Component>
   * 사용 데이터 :
   *  <WeatherNowComponent> : TMX (최고기온), TMN (최저기온)
   *  <Weather10Component> : TMX (최고기온), TMN (최저기온), SKY (하늘상태)
   */
  getSrtWeather0200 = async (gridX, gridY) => {
    const srtWeather0200Arr = await Srt10Weather(API_KEY, gridX, gridY);
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
      <WeatherNowComponent imageVar={props.imageVar} crtTemp={props.crtTemp} srtWeather0200Arr={state.srtWeather0200Arr.length > 1 ? state.srtWeather0200Arr[0] : "empty"} />
      <DustCovidComponent />
      <Weather3Component srtWeatherTmpObj={props.srtWeatherTmpObj} srtWeatherSkyObj={props.srtWeatherSkyObj} srtWeatherPtyObj={props.srtWeatherPtyObj} />
      <Weather10Component addrObj={props.addrObj} weather10Arr={props.weather10Arr} />
      <WeatherDetailComponent feelTemp={props.feelTemp} humidity={props.humidity} windIconDegree={props.windIconDegree} windTitle={props.windTitle} crtWindSpd={props.crtWindSpd} />
      <WeatherClothesComponent onRctngle={props.onRctngle} clothesTitle={props.clothesTitle} clothesSub={props.clothesSub} clothesArr={props.clothesArr} onText={props.onText} />
    </>
  );
}

export default WeatherComponent;
