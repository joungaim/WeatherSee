import React from "react";

/**
 * 10일 예보 날씨 아이콘 표시
 * 하늘상태(SKY) 코드  : 맑음(1), 구름많음(3), 흐림(4)
 * 강수형태(PTY) 코드 : (초단기) 없음(0), 비(1), 비/눈(2), 눈(3), 빗방울(5), 빗방울눈날림(6), 눈날림(7)
 * 		                 (단기) 없음(0), 비(1), 비/눈(2), 눈(3), 소나기(4)
 * 중기예보 : 맑음 / 구름많음, 구름많고 비, 구름많고 눈, 구름많고 비/눈, 구름많고 소나기 / 흐림, 흐리고 비, 흐리고 눈, 흐리고 비/눈, 흐리고 소나기 / 소나기
 */
function GetWeatherImage(sky, ptyCode = 0) {
  let code;
  if (isNaN(sky)) {
    if (sky == "맑음") {
      code = 0;
    } else if (sky == "흐림") {
      code = 1;
    } else if (sky == "구름많음") {
      code = 2;
    } else if (sky == "구름많고 비" || sky == "구름많고 소나기" || sky == "흐리고 비" || sky == "흐리고 소나기" || sky == "구름많고 비/눈" || sky == "흐리고 비/눈") {
      code = 3;
    } else if (sky == "구름많고 눈" || sky == "흐리고 눈") {
      code = 4;
    }
  } else {
    if (ptyCode > 0) {
      if (ptyCode == 1 || ptyCode == 2 || ptyCode == 4) {
        code = 3;
      } else if (ptyCode == 3) {
        code = 4;
      }
    } else {
      if (sky == 1) {
        code = 0;
      } else if (sky == 3) {
        code = 2;
      } else if (sky == 4) {
        code = 1;
      }
    }
  }
  return code;
}

export default GetWeatherImage;
