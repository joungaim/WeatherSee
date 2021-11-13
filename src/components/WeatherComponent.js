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

    // [단기 10일예보 조회용 변수]
    srtWeather10Obj: {},
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
      case "SET_ULT_SRT_WEATHER":
        return {
          ...state,
          ultSrtWeatherArr: action.ultSrtWeatherArr,
        };
      case "SET_WEATHER10":
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
   * 초단기 예보 API
   * 사용 컴포넌트 : <WeatherNowComponent>, <WeatherDetailComponent>
   */
  getUltSrtWeather = async (gridX, gridY) => {
    const ultSrtWeatherArr = await UltSrtWeather(API_KEY, ultSrtBaseDate, ultSrtBaseTime, gridX, gridY);
    dispatch({
      type: "SET_ULT_SRT_WEATHER",
      ultSrtWeatherArr: ultSrtWeatherArr,
    });
  };

  getWeather10 = async (gridX, gridY) => {
    const weather10Arr = await Srt10Weather(API_KEY, gridX, gridY);
    dispatch({
      type: "SET_WEATHER10",
      weather10Arr: weather10Arr,
    });
  };

  getWeather = async () => {
    const { gridX, gridY } = await GridXY(props.latitude, props.longitude); // 위도,경도를 기상청 api에 활용 가능한 x,y로 바꾸는 함수
    getUltSrtWeather(gridX, gridY);
    getWeather10(gridX, gridY);
  };

  useEffect(() => {
    console.log("WeatherComponent useEffect 진입");
    getWeather();
  }, []);

  return (
    <>
      {state.weather10Arr.length > 1 && <WeatherNowComponent imageVar={props.imageVar} crtTemp={props.crtTemp} weather10Arr={state.weather10Arr[0]} />}
      <DustCovidComponent />
      <Weather3Component srtWeatherTmpObj={props.srtWeatherTmpObj} srtWeatherSkyObj={props.srtWeatherSkyObj} srtWeatherPtyObj={props.srtWeatherPtyObj} />
      <Weather10Component weather10Arr={props.weather10Arr} />
      <WeatherDetailComponent feelTemp={props.feelTemp} humidity={props.humidity} windIconDegree={props.windIconDegree} windTitle={props.windTitle} crtWindSpd={props.crtWindSpd} />
      <WeatherClothesComponent onRctngle={props.onRctngle} clothesTitle={props.clothesTitle} clothesSub={props.clothesSub} clothesArr={props.clothesArr} onText={props.onText} />
    </>
  );
}

export default WeatherComponent;
