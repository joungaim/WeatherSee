import React, { useReducer, useEffect } from "react";
import { AsyncStorage } from "react-native";
import moment from "moment";
import WeatherNowComponent from "../../src/components/WeatherNowComponent";
import DustCovidComponent from "../../src/components/DustCovidComponent";
import Weather3Component from "../../src/components/Weather3Component";
import Weather10Component from "../../src/components/Weather10Component";
import WeatherDetailComponent from "../../src/components/WeatherDetailComponent";
import WeatherClothesComponent from "../../src/components/WeatherClothesComponent";
import { UltSrtWeather, Srt10Weather } from "../../src/UltStrWeather";
import { API_KEY } from "../../src/ApiKey";
import { ultSrtBaseDate, ultSrtBaseTime } from "../../src/Time";

function WeatherComponent(props) {
  const gridX = props.gridX;
  const gridY = props.gridY;
  const gridXStr = String(gridX);
  const gridYStr = String(gridY);

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
  getUltSrtWeather = async () => {
    let ultSrtWeatherArr;

    try {
      const weatherItem = await AsyncStorage.getItem("@ultSrtWeather");
      const dateItem = await AsyncStorage.getItem("@ultSrtBaseDate");
      const timeItem = await AsyncStorage.getItem("@ultSrtBaseTime");
      const gridXItem = await AsyncStorage.getItem("@gridX");
      const gridYItem = await AsyncStorage.getItem("@gridY");
      console.log("초단기 예보 쿠키 baseDate, Time", dateItem, ", ", timeItem);
      console.log("초단기 예보 현재 ultSrtBaseDate, ultSrtBaseTime", ultSrtBaseDate, ", ", ultSrtBaseTime);
      if (ultSrtBaseDate == dateItem && ultSrtBaseTime == timeItem && gridXStr == gridXItem && gridYStr == gridYItem && weatherItem !== null) {
        ultSrtWeatherArr = JSON.parse(weatherItem);
      } else {
        ultSrtWeatherArr = await UltSrtWeather(API_KEY, ultSrtBaseDate, ultSrtBaseTime, gridX, gridY);
        const ultSrtWeather = ["@ultSrtWeather", JSON.stringify(ultSrtWeatherArr)];
        const ultSrtDate = ["@ultSrtBaseDate", ultSrtBaseDate];
        const ultSrtTime = ["@ultSrtBaseTime", ultSrtBaseTime];

        await AsyncStorage.multiSet([ultSrtWeather, ultSrtDate, ultSrtTime]);
      }
    } catch (e) {
      // error reading value
    }

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
  getSrtWeather0200 = async () => {
    let srtWeather0200Arr, baseDate;

    /**
     * 오전 12시~2시 11분은 날짜가 하루 넘어갔지만 여전히 전날의 데이터를 받아와야 하는 상황이다.
     * 당일 오전 2시 데이터가 오전 2시 11분 이후에 생성되기 때문이다.
     * 하여 해당 시간 사이에는 오늘날짜가 아닌 어제 날짜로 세팅을 바꿔주어야 한다.
     */
    const currentTime = moment().format("HHmm");
    let crntBaseDate = moment().format("YYYYMMDD");
    if (moment(currentTime).isBetween("0000", "0212", undefined, "[)")) {
      crntBaseDate = moment().subtract(1, "days").format("YYYYMMDD");
    }

    try {
      const dateItem = await AsyncStorage.getItem("@srt0200BaseDate");
      const weatherItem = await AsyncStorage.getItem("@srtWeather0200");
      const gridXItem = await AsyncStorage.getItem("@gridX");
      const gridYItem = await AsyncStorage.getItem("@gridY");
      console.log("10일 예보 쿠키 baseDate", dateItem);
      console.log("10일 예보 현재 crntBaseDate", crntBaseDate);
      if (crntBaseDate == dateItem && gridXStr == gridXItem && gridYStr == gridYItem && weatherItem !== null) {
        srtWeather0200Arr = JSON.parse(weatherItem);
      } else {
        ({ srtWeather0200Arr, baseDate } = await Srt10Weather(API_KEY, gridX, gridY));
        const srtWeather0200 = ["@srtWeather0200", JSON.stringify(srtWeather0200Arr)];
        const srt0200BaseDate = ["@srt0200BaseDate", baseDate];

        await AsyncStorage.multiSet([srtWeather0200, srt0200BaseDate]);
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
    getUltSrtWeather();
    getSrtWeather0200();
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
      <Weather3Component gridX={props.gridX} gridY={props.gridY} />
      <Weather10Component addrObj={props.addrObj} srtWeather0200Arr={state.srtWeather0200Arr.length > 1 ? state.srtWeather0200Arr : "empty"} />
      <WeatherDetailComponent ultSrtWeatherArr={state.ultSrtWeatherArr.length > 1 ? state.ultSrtWeatherArr : "empty"} />
      <WeatherClothesComponent srtWeather0200Arr={state.srtWeather0200Arr.length > 1 ? state.srtWeather0200Arr[0] : "empty"} />
    </>
  );
}

export default WeatherComponent;
