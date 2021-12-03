import React from "react";
import moment from "moment";

const todayDate = moment().format("YYYYMMDD");
const todayDateTime = moment().format("YYYYMMDDHHmm");
const todayDateAClock = moment().format("YYYY-MM-DD HH"); //현재 날짜 및 시각 (add 하려면 YYYY-MM-DD HH:mm 이런 형식이어야 함.)
const currentTime = moment().format("HHmm"); //현재 시간분 (HH:24h / hh:12h)
const yesterdayDate = moment().subtract(1, "days").format("YYYYMMDD"); // 어제날짜

const { ultSrtBaseDate, ultSrtBaseTime } = getUltSrtBaseDateTime();
const { srtBaseDate, srtBaseTime } = getSrtBaseDateTime();
const midBaseDateTime = getMidBaseDateTime();

/**
 * 인자 날짜에서 하루 뺀 날짜 반환
 */
function getSubtract1day(fromDate) {
  const subtractDate = moment(fromDate).subtract(1, "days").format("YYYYMMDD");
  return subtractDate;
}

/**
 * 인자 날짜에서 한시간 후 날짜 반환
 * moment(fromDate).add(15, "minutes").format("YYYYMMDDHHmm") 에서 fromDate 값으로 들어갈 데이터인데,
 * 이때 형식을 YYYYMMDDHH 이렇게 하면 Invalid date 에러가 난다.
 * 그렇기 때문에 반환 형식을 YYYY-MM-DD HH 로 해주었다.
 */
function getAfter1Hour(fromDate) {
  const aHourAfterDate = moment(fromDate).add(1, "h").format("YYYY-MM-DD HH");
  console.log("aHourAfterDate : ", aHourAfterDate);
  return aHourAfterDate;
}

/**
 * 인자 날짜에서 15분 후 날짜 반환
 */
function getAfter15Min(fromDate) {
  const aHourAfter15Min = moment(fromDate).add(15, "m").format("YYYYMMDDHHmm");
  console.log("aHourAfter15Min : ", aHourAfter15Min);
  return aHourAfter15Min;
}

/**
 * [초단기예보조회용 날짜/시간 세팅]
 * 매시간 정각 45분 후에 조회 가능. 예) 12시 데이터는 12시 46분부터 / 1시 데이터는 1시 46분부터 조회 가능
 */
function getUltSrtBaseDateTime() {
  let ultSrtBaseDate = todayDate;
  let ultSrtBaseTime;

  if (moment(currentTime).isBetween("0045", "0146")) {
    // 12시 46분~1시 45분 사이
    ultSrtBaseTime = "0030";
  } else if (moment(currentTime).isBetween("0145", "0246")) {
    // 1시 46분~2시 45분 사이
    ultSrtBaseTime = "0130";
  } else if (moment(currentTime).isBetween("0245", "0346")) {
    // 2시 46분~3시 45분 사이
    ultSrtBaseTime = "0230";
  } else if (moment(currentTime).isBetween("0345", "0446")) {
    // 3시 46분~3시 45분 사이
    ultSrtBaseTime = "0330";
  } else if (moment(currentTime).isBetween("0445", "0546")) {
    // 4시 46분~5시 45분 사이
    ultSrtBaseTime = "0430";
  } else if (moment(currentTime).isBetween("0545", "0646")) {
    // 5시 46분~6시 45분 사이
    ultSrtBaseTime = "0530";
  } else if (moment(currentTime).isBetween("0645", "0746")) {
    // 6시 46분~7시 45분 사이
    ultSrtBaseTime = "0630";
  } else if (moment(currentTime).isBetween("0745", "0846")) {
    // 7시 46분~8시 45분 사이
    ultSrtBaseTime = "0730";
  } else if (moment(currentTime).isBetween("0845", "0946")) {
    // 8시 46분~9시 45분 사이
    ultSrtBaseTime = "0830";
  } else if (moment(currentTime).isBetween("0945", "1046")) {
    // 9시 46분~10시 45분 사이
    ultSrtBaseTime = "0930";
  } else if (moment(currentTime).isBetween("1045", "1146")) {
    // 10시 46분~11시 45분 사이
    ultSrtBaseTime = "1030";
  } else if (moment(currentTime).isBetween("1145", "1246")) {
    // 11시 46분~12시 45분 사이
    ultSrtBaseTime = "1130";
  } else if (moment(currentTime).isBetween("1245", "1346")) {
    // 12시 46분~13시 45분 사이
    ultSrtBaseTime = "1230";
  } else if (moment(currentTime).isBetween("1345", "1446")) {
    // 13시 46분~14시 45분 사이
    ultSrtBaseTime = "1330";
  } else if (moment(currentTime).isBetween("1445", "1546")) {
    // 14시 46분~15시 45분 사이
    ultSrtBaseTime = "1430";
  } else if (moment(currentTime).isBetween("1545", "1646")) {
    // 15시 46분~16시 45분 사이
    ultSrtBaseTime = "1530";
  } else if (moment(currentTime).isBetween("1645", "1746")) {
    // 16시 46분~17시 45분 사이
    ultSrtBaseTime = "1630";
  } else if (moment(currentTime).isBetween("1745", "1846")) {
    // 17시 46분~18시 45분 사이
    ultSrtBaseTime = "1730";
  } else if (moment(currentTime).isBetween("1845", "1946")) {
    // 18시 46분~19시 45분 사이
    ultSrtBaseTime = "1830";
  } else if (moment(currentTime).isBetween("1945", "2046")) {
    // 19시 46분~20시 45분 사이
    ultSrtBaseTime = "1930";
  } else if (moment(currentTime).isBetween("2045", "2146")) {
    // 20시 46분~21시 45분 사이
    ultSrtBaseTime = "2030";
  } else if (moment(currentTime).isBetween("2145", "2246")) {
    // 21시 46분~22시 45분 사이
    ultSrtBaseTime = "2130";
  } else if (moment(currentTime).isBetween("2245", "2346")) {
    // 22시 46분~23시 45분 사이
    ultSrtBaseTime = "2230";
  } else if (moment(currentTime).isBetween("2345", "2359", undefined, "(]")) {
    // 23시 46분~11시 59분 사이
    ultSrtBaseTime = "2330";
  } else if (moment(currentTime).isBetween("0000", "0046", undefined, "[)")) {
    // 12시 00분~12시 45분 사이
    ultSrtBaseTime = "2330";
    ultSrtBaseDate = yesterdayDate;
  }
  return { ultSrtBaseDate, ultSrtBaseTime };
}

/**
 * [단기예보조회용 날짜/시간 세팅]
 * 기상청 정보는 1일 총 8번 업데이트 된다.(0200, 0500, 0800, 1100, 1400, 1700, 2000, 2300)
 * moment(currentTime).isBetween("0000", "0211", undefined, "[)") : [, ] 포함되고 (, )은 포함되지 않음
 */
function getSrtBaseDateTime() {
  let srtBaseDate = todayDate;
  let srtBaseTime;

  if (moment(currentTime).isBetween("0000", "0211", undefined, "[)")) {
    // 0시~2시 10분 사이 : base_date가 어제 날짜로 바뀌어야 한다.
    srtBaseDate = yesterdayDate;
    //dispatch({ type: "SET_STR_YESTDATE", yesterDate: yesterdayDate });
    srtBaseTime = "2300";
  } else if (moment(currentTime).isBetween("0210", "0511")) {
    // 2시 11분~5시 10분 사이
    srtBaseTime = "0200";
  } else if (moment(currentTime).isBetween("0510", "0811")) {
    // 5시 11분~8시 10분 사이
    srtBaseTime = "0500";
  } else if (moment(currentTime).isBetween("0810", "1111")) {
    // 8시 11분~11시 10분 사이
    srtBaseTime = "0800";
  } else if (moment(currentTime).isBetween("1110", "1411")) {
    // 11시 11분~14시 10분 사이
    srtBaseTime = "1100";
  } else if (moment(currentTime).isBetween("1410", "1711")) {
    // 14시 11분~17시 10분 사이
    srtBaseTime = "1400";
  } else if (moment(currentTime).isBetween("1710", "2011")) {
    // 17시 11분~20시 10분 사이
    srtBaseTime = "1700";
  } else if (moment(currentTime).isBetween("2010", "2311")) {
    // 20시 11분~23시 10분 사이
    srtBaseTime = "2000";
  } else if (moment(currentTime).isBetween("2310", "2359", undefined, "(]")) {
    // 23시 11분~23시 59분
    srtBaseTime = "2300";
  }
  return { srtBaseDate, srtBaseTime };
}

/**
 * [중기예보조회용 날짜/시간 세팅]
 * 0600 / 1800 하루에 두 번 조회 가능
 */
function getMidBaseDateTime() {
  let midBaseDate = todayDate;
  let midBaseTime;
  let midBaseDateTime;

  if (moment(currentTime).isBetween("0000", "0601", undefined, "[)")) {
    // 12시 01분~6시 00분 사이
    midBaseDate = yesterdayDate;
    midBaseTime = "1800";
  } else if (moment(currentTime).isBetween("0600", "1801")) {
    // 6시 01분~18시 00분 사이
    midBaseTime = "0600";
  } else {
    // 18시 01분~12시 00분 사이
    midBaseTime = "1800";
  }
  midBaseDateTime = midBaseDate + midBaseTime;

  return midBaseDateTime;
}

export {
  getSubtract1day,
  getAfter1Hour,
  getAfter15Min,
  ultSrtBaseDate,
  ultSrtBaseTime,
  srtBaseDate,
  srtBaseTime,
  midBaseDateTime,
  todayDateAClock,
  currentTime,
  todayDate,
  todayDateTime,
  yesterdayDate,
};
