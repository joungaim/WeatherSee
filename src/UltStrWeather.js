import React from "react";
import axios from "axios";
import moment from "moment";
/**
 * [초단기예보조회용 HTTP 비동기 통신 ]
 */
async function UltStrWeather(apikey, basedate, basetime, nx, ny) {
  const ultSrtUrl = `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst?serviceKey=${apikey}&numOfRows=100&pageNo=1&base_date=${basedate}&base_time=${basetime}&nx=${nx}&ny=${ny}&dataType=JSON`;
  let ultSrtWeatherResponseData;
  console.log("초단기예보 url : " + ultSrtUrl);
  await axios
    .get(ultSrtUrl)
    .then(function (response) {
      ultSrtWeatherResponseData = response.data.response.body.items.item;
    })
    .catch(function (error) {
      console.log("초단기예보 실패 : " + error);
    });
  return ultSrtWeatherResponseData;
}

/**
 * [단기예보조회용 HTTP 비동기 통신 (3일 예보에 사용) ]
 */
async function StrWeather(apikey, basedate, basetime, nx, ny) {
  const srtUrl = `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${apikey}&numOfRows=1000&pageNo=1&dataType=JSON&base_date=${basedate}&base_time=${basetime}&nx=${nx}&ny=${ny}`;
  console.log("단기예보 url : " + srtUrl);
  let srtWeatherResponseData;
  let strWeatherTmpObj;
  let strWeatherSkyObj;
  let strWeatherPtyObj;
  let strWeatherPopObj;

  await axios
    .get(srtUrl)
    .then(function (response) {
      srtWeatherResponseData = response.data.response.body.items.item; //필요한 정보만 받아오기 전부 다 받아 오려면 response.data 까지만 적는다.

      // 3일 예보 조회용 배열 쪼개기 (TMP:기온 / SKY:하늘상태[맑음(1), 구름많음(3), 흐림(4)] / PTY:강수형태(없음(0), 비(1), 비/눈(2), 눈(3), 소나기(4) / fcstTime:기준시간)
      strWeatherTmpObj = srtWeatherResponseData.filter((ele) => {
        return ele.category == "TMP";
      });

      strWeatherSkyObj = srtWeatherResponseData.filter((ele) => {
        return ele.category == "SKY";
      });

      strWeatherPtyObj = srtWeatherResponseData.filter((ele) => {
        return ele.category == "PTY";
      });

      strWeatherPopObj = srtWeatherResponseData.filter((ele) => {
        return ele.category == "POP";
      });
    })
    .catch(function (error) {
      console.log("단기예보 실패 : " + error);
    });
  return [
    srtWeatherResponseData,
    strWeatherTmpObj,
    strWeatherSkyObj,
    strWeatherPtyObj,
    strWeatherPopObj,
  ];
}
/**
 * [10일 예보용 단기예보조회 HTTP 비동기 통신 ]
 */
async function Str10Weather(apikey, nx, ny) {
  const baseTime = "0200";
  const baseDate = moment().format("YYYYMMDD");
  const srt10Url = `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${apikey}&numOfRows=1000&pageNo=1&dataType=JSON&base_date=${baseDate}&base_time=${baseTime}&nx=${nx}&ny=${ny}`;
  let srtWeatherResponseData;
  console.log("10일 예보용 단기예보 url : " + srt10Url);
  await axios
    .get(srt10Url)
    .then(function (response) {
      srtWeatherResponseData = response.data.response.body.items.item; //필요한 정보만 받아오기 전부 다 받아 오려면 response.data 까지만 적는다.

      srtWeatherResponseData = srtWeatherResponseData.filter((ele) => {
        return (
          ele.category == "TMN" ||
          ele.category == "TMX" ||
          (ele.category == "SKY" && ele.fcstTime == "0900") ||
          (ele.category == "POP" && Number(ele.fcstValue) >= 40)
        );
      });

      // POP가 중간중간 끼여 있으면 TMN TMX SKY 를 순서대로 쓰기에 불편하기 때문에 배열 뒤로 보내는 코드
      srtWeatherResponseData = srtWeatherResponseData
        .filter((ele) => ele.category != "POP")
        .concat(srtWeatherResponseData.filter((ele) => ele.category == "POP"));
      console.log(
        "strWeather10Obj = " + JSON.stringify(srtWeatherResponseData)
      );
    })
    .catch(function (error) {
      console.log("10일 예보용 단기예보 실패 : " + error);
    });
  return srtWeatherResponseData;
}

/**
 * [중기육상예보조회용 HTTP 비동기 통신 ]
 */
async function MidLandWeather(apikey, basetime, midRegId) {
  const midLandUrl = `http://apis.data.go.kr/1360000/MidFcstInfoService/getMidLandFcst?serviceKey=${apikey}&dataType=JSON&tmFc=${basetime}&regId=${midRegId}`;
  let midLandWeatherResponseData;
  console.log("중기육상예보 url : " + midLandUrl);
  await axios
    .get(midLandUrl)
    .then(function (response) {
      midLandWeatherResponseData = response.data.response.body.items.item; //필요한 정보만 받아오기 전부 다 받아 오려면 response.data 까지만 적는다.
      console.log("중기육상예보 데이터", midLandWeatherResponseData);
    })
    .catch(function (error) {
      console.log("중기육상예보 실패 : " + error);
    });
  return midLandWeatherResponseData;
}

/**
 * [중기기온예보조회용 HTTP 비동기 통신 ]
 */
async function MidTaWeather(apikey, basetime, midRegId) {
  const midUrl = `http://apis.data.go.kr/1360000/MidFcstInfoService/getMidTa?serviceKey=${apikey}&dataType=JSON&tmFc=${basetime}&regId=${midRegId}`;
  let midWeatherResponseData;
  console.log("중기기온예보 url : " + midUrl);
  await axios
    .get(midUrl)
    .then(function (response) {
      midWeatherResponseData = response.data.response.body.items.item; //필요한 정보만 받아오기 전부 다 받아 오려면 response.data 까지만 적는다.

      console.log("중기기온예보 데이터 ", midWeatherResponseData);
    })
    .catch(function (error) {
      console.log("중기기온예보조회 실패 : " + error);
    });
  return midWeatherResponseData;
}

export {
  UltStrWeather,
  StrWeather,
  Str10Weather,
  MidLandWeather,
  MidTaWeather,
};
