import React from "react";

function getSepArrByDate(arr, baseDate, i, gubn = "nomal") {
  const arrData = arr
    .filter((arr) => {
      if (gubn == "nomal") {
        return arr.fcstDate == String(Number(baseDate) + i);
      } else {
        const fcstTime = Number(arr.fcstTime.substring(0, 2));
        if (gubn == "popAm") {
          return arr.fcstDate == String(Number(baseDate) + i) && 0 <= fcstTime && fcstTime <= 11;
        } else if (gubn == "popPm") {
          return arr.fcstDate == String(Number(baseDate) + i) && 12 <= fcstTime && fcstTime <= 23;
        }
      }
    })
    .map((arr) => {
      return arr.fcstValue;
    });
  return arrData;
}

function getModeValue(arr) {
  const newObject = arr.reduce((acc, cur) => {
    acc.hasOwnProperty(cur) ? (acc[cur] += 1) : (acc[cur] = 1);
    return acc;
  }, {});

  const modeValue = Object.keys(newObject).reduce((acc, cur) => (newObject[acc] > newObject[cur] ? acc : cur));
  return modeValue;
}

export { getSepArrByDate, getModeValue };
