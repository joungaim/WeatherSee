import React from "react";
import axios from "axios";

/**
 * 한글 주소 얻음
 */
async function Address(latitude, longitude) {
  const worldOpenkey = "D2914382-1CF1-340A-B872-29911F460AEF";
  const url = `http://api.vworld.kr/req/address?service=address&request=getAddress&version=2.0&crs=epsg:4326&point=${longitude},${latitude}&format=json&type=PARCEL&zipcode=false&simple=true&key=${worldOpenkey}`;
  let addrText;
  let addrSi;
  let addrGu;
  let addrDong;
  console.log("getAddress url :" + url);

  await axios
    .get(url)
    .then(function (response) {
      addrText = response.data.response.result[0].text; // 주소 전체 (중기예보지역코드 얻기위함)
      addrSi = response.data.response.result[0].structure.level1; // 시 이름
      addrGu = response.data.response.result[0].structure.level2; // 구 이름
      addrDong = response.data.response.result[0].structure.level4L; // 동 이름
    })
    .catch(function (error) {
      console.log("getAddress 실패 : " + error);
    });

  return {
    addrText,
    addrSi,
    addrGu,
    addrDong,
  };
}

export { Address };
