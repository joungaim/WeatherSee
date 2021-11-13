import React from "react";
import axios from "axios";
import moment from "moment";

/**
 * [초단기예보조회용 HTTP 비동기 통신 ]
 */
async function UltSrtWeather(apikey, basedate, basetime, nx, ny) {
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
async function SrtWeather(apikey, basedate, basetime, nx, ny) {
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
  return [srtWeatherResponseData, strWeatherTmpObj, strWeatherSkyObj, strWeatherPtyObj, strWeatherPopObj];
}

/**
 * [10일 예보용 단기예보조회 HTTP 비동기 통신 ]
 */
async function Srt10Weather(apikey, nx, ny) {
  let currentTime = moment().format("HHmm"); //현재 시간분 (HH:24h / hh:12h)
  const baseTime = "0200";
  let baseDate = moment().format("YYYYMMDD");

  if (moment(currentTime).isBetween("0000", "0212", undefined, "[)")) {
    baseDate = moment().subtract(1, "days").format("YYYYMMDD");
  }

  const srt10Url = `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${apikey}&numOfRows=1000&pageNo=1&dataType=JSON&base_date=${baseDate}&base_time=${baseTime}&nx=${nx}&ny=${ny}`;
  let weather10Data;
  let weather10Arr = [];

  console.log("10일 예보용 단기예보 url : " + srt10Url);
  await axios
    .get(srt10Url)
    .then(function (response) {
      weather10Data = response.data.response.body.items.item; //필요한 정보만 받아오기 전부 다 받아 오려면 response.data 까지만 적는다.

      weather10Data = weather10Data.filter((ele) => {
        return ele.category == "TMN" || ele.category == "TMX" || (ele.category == "SKY" && ele.fcstTime == "0900") || (ele.category == "POP" && Number(ele.fcstValue) >= 40);
      });

      // POP가 중간중간 끼여 있으면 TMN TMX SKY 를 순서대로 쓰기에 불편하기 때문에 배열 뒤로 보내는 코드
      weather10Data = weather10Data.filter((ele) => ele.category != "POP").concat(weather10Data.filter((ele) => ele.category == "POP"));

      const weather10DataLth = 9; // 단기예보는 3일간의 날씨를 불러오는 데 1일에 TMX, TMN, SKY 는 각각 하나씩 있으므로 3일x3개는 9개. 뒤에 POP가 있을 수 있으므로 배열 길이로 체크하면 안됨.
      let j = 0;
      for (let i = 0; i < weather10DataLth; i += 3) {
        weather10Arr[j] = {
          tmn: Math.round(weather10Data[i].fcstValue),
          sky: Number(weather10Data[i + 1].fcstValue),
          tmx: Math.round(weather10Data[i + 2].fcstValue),
        };
        j++;
      }

      console.log("strWeather10Obj = " + JSON.stringify(weather10Data));
    })
    .catch(function (error) {
      console.log("10일 예보용 단기예보 실패 : " + error);
    });
  return weather10Arr;
}

/**
 * [중기육상예보조회용 HTTP 비동기 통신 ]
 */
async function MidLandWeather(apikey, basetime, midRegId) {
  const midLandUrl = `http://apis.data.go.kr/1360000/MidFcstInfoService/getMidLandFcst?serviceKey=${apikey}&dataType=JSON&tmFc=${basetime}&regId=${midRegId}`;
  console.log("중기육상예보 url : " + midLandUrl);

  let midLandData;
  let midLandArr = [];

  /**
   * key 값 설정하기 위한 반복문
   * */
  let midLandKeyArr = [];
  let t = 0;
  const midLandLth = 10 - 3; //중기 육상예보는 3일 후 ~ 10일 째 되는 날 까지의 날씨를 알려준다. 즉 7일간의 날씨를 알려준다.
  // 중기육상예보의 데이터 이름이 "rnSt3Am", "wf3Pm" 이런 식으로 3부터 시작한다. 하여 +3을 해주었다.
  for (let i = 0 + 3; i < midLandLth + 3; i++) {
    if (i < 8) {
      midLandKeyArr[t] = {
        rnStAm: "rnSt" + i + "Am",
        rnStPm: "rnSt" + i + "Pm",
        wfPm: "wf" + i + "Pm",
      }; // 날씨 아이콘을 오전 날씨 기준으로 하고싶으면 wfAm :"wf"+i+"Am" 로 교체
    } else {
      midLandKeyArr[t] = { rnStAm: "rnSt" + i, wfPm: "wf" + i };
    }
    t++;
  }

  await axios
    .get(midLandUrl)
    .then(function (response) {
      midLandData = response.data.response.body.items.item[0]; //필요한 정보만 받아오기 전부 다 받아 오려면 response.data 까지만 적는다.

      for (let i = 0; i < midLandLth; i++) {
        midLandArr[i] = {
          sky: midLandData[midLandKeyArr[i].wfPm],
          popAm: midLandData[midLandKeyArr[i].rnStAm],
        };
        if (i < 5) {
          midLandArr[i].popPm = midLandData[midLandKeyArr[i].rnStPm];
        }
      }

      console.log("중기육상예보 데이터 ", midLandData);
    })
    .catch(function (error) {
      console.log("중기육상예보 실패 : " + error);
    });
  return { midLandData, midLandArr };
}

/**
 * [중기기온예보조회용 HTTP 비동기 통신 ]
 */
async function MidTaWeather(apikey, basetime, midRegId) {
  const midUrl = `http://apis.data.go.kr/1360000/MidFcstInfoService/getMidTa?serviceKey=${apikey}&dataType=JSON&tmFc=${basetime}&regId=${midRegId}`;
  let midTaData;
  let midTaArr = [];
  const midTaLth = 10 - 3; //중기 육상예보는 3일 후 ~ 10일 째 되는 날 까지의 날씨를 알려준다. 즉 7일간의 날씨를 알려준다.
  console.log("중기기온예보 url : " + midUrl);
  await axios
    .get(midUrl)
    .then(function (response) {
      midTaData = response.data.response.body.items.item[0]; //필요한 정보만 받아오기 전부 다 받아 오려면 response.data 까지만 적는다.

      let j = 0;
      for (let i = 0; i < midTaLth; i++) {
        j = i + 3;
        midTaArr[i] = {
          tmn: midTaData["taMin" + j],
          tmx: midTaData["taMax" + j],
        };
      }

      console.log("중기기온예보 데이터 수정", midTaData);
    })
    .catch(function (error) {
      console.log("중기기온예보조회 실패 : " + error);
    });
  return { midTaData, midTaArr };
}

export { UltSrtWeather, SrtWeather, Srt10Weather, MidLandWeather, MidTaWeather };
