import React from "react";
import axios from "axios";
import { API_KEY } from "./ApiKey";
/**
 * [미세먼지조회용 HTTP 비동기 통신 ]
 */
async function Dust(stationName) {
  const dustUrl = `http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty?stationName=${encodeURIComponent(
    stationName
  )}&dataTerm=DAILY&pageNo=1&numOfRows=100&returnType=json&serviceKey=${API_KEY}&ver=1.3`;
  let dustResponseData;
  console.log("미세먼지예보 url : " + dustUrl);
  await axios
    .get(dustUrl)
    .then(function (response) {
      dustResponseData = response.data.response.body.items[0];
    })
    .catch(function (error) {
      console.log("미세먼지예보 실패 : " + error);
    });
  return dustResponseData;
}

export { Dust };
