import React from "react";
import axios from "axios";
import { API_KEY } from "./ApiKey";
import XMLParser from "react-xml-parser";

/**
 * [코로나 확진자 조회용 HTTP 비동기 통신 ]
 */
async function Covid(gubun, crntDate) {
  const covidUrl = `http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19SidoInfStateJson?serviceKey=${API_KEY}&pageNo=1&numOfRows=10&startCreateDt=${crntDate}&endCreateDt=${crntDate}`;
  let covidResponseData;
  console.log("코로나19 확진자 예보 url : " + covidUrl);
  await axios
    .get(covidUrl)
    .then(function (response) {
      covidResponseData = response.data.response.body.items.item;

      covidResponseData = covidResponseData.filter((ele) => {
        return ele.gubun == gubun || ele.gubun == "합계";
      });
    })
    .catch(function (error) {
      console.log("코로나19 확진자 예보 실패 : " + error);
    });
  return covidResponseData;
}

export { Covid };
