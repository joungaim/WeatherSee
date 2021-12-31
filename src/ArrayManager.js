import React from "react";
import { getAddDay } from "../src/Time";
/**
 * 날짜별로 배열 그룹 구분하기
 * 오늘 날짜 배열
 * 내일 날짜 배열
 * 모레 날짜 배열
 */
function getSepArrByDate(arr, baseDate, i, gubn = "nomal") {
  const arrData = arr
    .filter((arr) => {
      if (gubn == "nomal") {
        return arr.fcstDate == String(getAddDay(baseDate, i));
      } else {
        const fcstTime = Number(arr.fcstTime.substring(0, 2));
        if (gubn == "popAm") {
          return arr.fcstDate == String(getAddDay(baseDate, i)) && 0 <= fcstTime && fcstTime <= 11;
        } else if (gubn == "popPm") {
          return arr.fcstDate == String(getAddDay(baseDate, i)) && 12 <= fcstTime && fcstTime <= 23;
        }
      }
    })
    .map((arr) => {
      return arr.fcstValue;
    });
  return arrData;
}

/**
 * 최빈값 구하는 함수
 */
function getModeValue(arr) {
  const newObject = arr.reduce((acc, cur) => {
    acc.hasOwnProperty(cur) ? (acc[cur] += 1) : (acc[cur] = 1);
    return acc;
  }, {});

  const modeValue = Object.keys(newObject).reduce((acc, cur) => (newObject[acc] > newObject[cur] ? acc : cur));
  return modeValue;
}

export { getSepArrByDate, getModeValue };
