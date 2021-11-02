import React from "react";
import moment from "moment";

async function Time() {
  let todayDate = moment().format("YYYYMMDD");
  let currentTime = moment().format("HHmm"); //현재 시간분 (HH:24h / hh:12h)
  let yesterdayDate = moment().subtract(1, "days").format("YYYYMMDD"); // 어제날짜 구하기

  let srtBaseDate = todayDate;
  let srtBaseTime;
  let ultSrtBaseDate = todayDate;
  let ultSrtBaseTime;
  let midBaseDate = todayDate;
  let midBaseTime;
  let midBaseDateTime;
  // let ultraSrtLiveBaseTime; // 초단기실황 조회용 (사용안함)

  // setultraSrtLiveBaseDate(todayDate); //초단기실황 조회용 (사용안함)

  /**
   * [단기예보조회용 날짜/시간 세팅]
   * 기상청 정보는 1일 총 8번 업데이트 된다.(0200, 0500, 0800, 1100, 1400, 1700, 2000, 2300)
   * moment(currentTime).isBetween("1200", "0210") : 1200 <= currentTime < 0210 : 1200은 포함되고 (true) 0210은 포함되지 않음(flase)
   */
  if (moment(currentTime).isBetween("0000", "0211")) {
    // 0시~2시 10분 사이 : base_date가 어제 날짜로 바뀌어야 한다.
    srtBaseDate = yesterdayDate;
    //dispatch({ type: "SET_STR_YESTDATE", yesterDate: yesterdayDate });
    srtBaseTime = "2300";
  } else if (moment(currentTime).isBetween("0211", "0511")) {
    // 2시 11분~5시 10분 사이
    srtBaseTime = "0200";
  } else if (moment(currentTime).isBetween("0511", "0811")) {
    // 5시 11분~8시 10분 사이
    srtBaseTime = "0500";
  } else if (moment(currentTime).isBetween("0811", "1111")) {
    // 8시 11분~11시 10분 사이
    srtBaseTime = "0800";
  } else if (moment(currentTime).isBetween("1111", "1411")) {
    // 11시 11분~14시 10분 사이
    srtBaseTime = "1100";
  } else if (moment(currentTime).isBetween("1411", "1711")) {
    // 14시 11분~17시 10분 사이
    srtBaseTime = "1400";
  } else if (moment(currentTime).isBetween("1711", "2011")) {
    // 17시 11분~20시 10분 사이
    srtBaseTime = "1700";
  } else if (moment(currentTime).isBetween("2011", "2311")) {
    // 20시 11분~23시 10분 사이
    srtBaseTime = "2000";
  } else {
    // 23시 11분~23시 59분
    srtBaseTime = "2300";
  }

  /**
   * [초단기예보조회용 날짜/시간 세팅]
   * 매시간 정각 45분 후에 조회 가능. 예) 12시 데이터는 12시 46분부터 / 1시 데이터는 1시 46분부터 조회 가능
   */
  if (moment(currentTime).isBetween("0046", "0146")) {
    ultSrtBaseTime = "0030";
  } else if (moment(currentTime).isBetween("0146", "0246")) {
    ultSrtBaseTime = "0130";
  } else if (moment(currentTime).isBetween("0246", "0346")) {
    ultSrtBaseTime = "0230";
  } else if (moment(currentTime).isBetween("0346", "0446")) {
    ultSrtBaseTime = "0330";
  } else if (moment(currentTime).isBetween("0446", "0546")) {
    ultSrtBaseTime = "0430";
  } else if (moment(currentTime).isBetween("0546", "0646")) {
    ultSrtBaseTime = "0530";
  } else if (moment(currentTime).isBetween("0646", "0746")) {
    ultSrtBaseTime = "0630";
  } else if (moment(currentTime).isBetween("0746", "0846")) {
    ultSrtBaseTime = "0730";
  } else if (moment(currentTime).isBetween("0846", "0946")) {
    ultSrtBaseTime = "0830";
  } else if (moment(currentTime).isBetween("0946", "1046")) {
    ultSrtBaseTime = "0930";
  } else if (moment(currentTime).isBetween("1046", "1146")) {
    ultSrtBaseTime = "1030";
  } else if (moment(currentTime).isBetween("1146", "1246")) {
    ultSrtBaseTime = "1130";
  } else if (moment(currentTime).isBetween("1246", "1346")) {
    ultSrtBaseTime = "1230";
  } else if (moment(currentTime).isBetween("1346", "1446")) {
    ultSrtBaseTime = "1330";
  } else if (moment(currentTime).isBetween("1446", "1546")) {
    ultSrtBaseTime = "1430";
  } else if (moment(currentTime).isBetween("1546", "1646")) {
    ultSrtBaseTime = "1530";
  } else if (moment(currentTime).isBetween("1646", "1746")) {
    ultSrtBaseTime = "1630";
  } else if (moment(currentTime).isBetween("1746", "1846")) {
    ultSrtBaseTime = "1730";
  } else if (moment(currentTime).isBetween("1846", "1946")) {
    ultSrtBaseTime = "1830";
  } else if (moment(currentTime).isBetween("1946", "2046")) {
    ultSrtBaseTime = "1930";
  } else if (moment(currentTime).isBetween("2046", "2146")) {
    ultSrtBaseTime = "2030";
  } else if (moment(currentTime).isBetween("2146", "2246")) {
    ultSrtBaseTime = "2130";
  } else if (moment(currentTime).isBetween("2246", "2346")) {
    ultSrtBaseTime = "2230";
  } else if (moment(currentTime).isBetween("2346", "0000")) {
    ultSrtBaseTime = "2330";
  } else if (moment(currentTime).isBetween("0000", "0046")) {
    ultSrtBaseTime = "2330";
    ultSrtBaseDate = yesterdayDate;
  }

  /**
   * [중기예보조회용 날짜/시간 세팅]
   * 0600 / 1800 하루에 두 번 조회 가능
   */
  if (moment(currentTime).isBetween("0000", "0600")) {
    midBaseDate = yesterdayDate;
    midBaseTime = "1800";
  } else if (moment(currentTime).isBetween("0601", "1800")) {
    midBaseTime = "0600";
  } else if (moment(currentTime).isBetween("1801", "2359")) {
    midBaseTime = "1800";
  }
  midBaseDateTime = midBaseDate + midBaseTime;

  return {
    ultSrtBaseTime,
    ultSrtBaseDate,
    srtBaseTime,
    srtBaseDate,
    midBaseDateTime,
  };

  /**
   * [초단기실황조회용 날짜/시간 세팅] (사용안함)
   * 매시간 정각 40분 후에 조회 가능. 예) 12시 데이터는 12시 41분부터 / 1시 데이터는 1시 41분부터 조회 가능
   */
  // if (moment(currentTime).isBetween("0041", "0141")) {
  //   ultraSrtLiveBaseTime = "0000";
  // } else if (moment(currentTime).isBetween("0141", "0241")) {
  //   ultraSrtLiveBaseTime = "0100";
  // } else if (moment(currentTime).isBetween("0241", "0341")) {
  //   ultraSrtLiveBaseTime = "0200";
  // } else if (moment(currentTime).isBetween("0341", "0441")) {
  //   ultraSrtLiveBaseTime = "0300";
  // } else if (moment(currentTime).isBetween("0441", "0541")) {
  //   ultraSrtLiveBaseTime = "0400";
  // } else if (moment(currentTime).isBetween("0541", "0641")) {
  //   ultraSrtLiveBaseTime = "0500";
  // } else if (moment(currentTime).isBetween("0641", "0741")) {
  //   ultraSrtLiveBaseTime = "0600";
  // } else if (moment(currentTime).isBetween("0741", "0841")) {
  //   ultraSrtLiveBaseTime = "0700";
  // } else if (moment(currentTime).isBetween("0841", "0941")) {
  //   ultraSrtLiveBaseTime = "0800";
  // } else if (moment(currentTime).isBetween("0941", "1041")) {
  //   ultraSrtLiveBaseTime = "0900";
  // } else if (moment(currentTime).isBetween("1041", "1141")) {
  //   ultraSrtLiveBaseTime = "1000";
  // } else if (moment(currentTime).isBetween("1141", "1241")) {
  //   ultraSrtLiveBaseTime = "1100";
  // } else if (moment(currentTime).isBetween("1241", "1341")) {
  //   ultraSrtLiveBaseTime = "1200";
  // } else if (moment(currentTime).isBetween("1341", "1441")) {
  //   ultraSrtLiveBaseTime = "1300";
  // } else if (moment(currentTime).isBetween("1441", "1541")) {
  //   ultraSrtLiveBaseTime = "1400";
  // } else if (moment(currentTime).isBetween("1541", "1641")) {
  //   ultraSrtLiveBaseTime = "1500";
  // } else if (moment(currentTime).isBetween("1641", "1741")) {
  //   ultraSrtLiveBaseTime = "1600";
  // } else if (moment(currentTime).isBetween("1741", "1841")) {
  //   ultraSrtLiveBaseTime = "1700";
  // } else if (moment(currentTime).isBetween("1841", "1941")) {
  //   ultraSrtLiveBaseTime = "1800";
  // } else if (moment(currentTime).isBetween("1941", "2041")) {
  //   ultraSrtLiveBaseTime = "1900";
  // } else if (moment(currentTime).isBetween("2041", "2141")) {
  //   ultraSrtLiveBaseTime = "2000";
  // } else if (moment(currentTime).isBetween("2141", "2241")) {
  //   ultraSrtLiveBaseTime = "2100";
  // } else if (moment(currentTime).isBetween("2241", "2341")) {
  //   ultraSrtLiveBaseTime = "2200";
  // } else if (moment(currentTime).isBetween("2341", "0000")) {
  //   ultraSrtLiveBaseTime = "2300";
  // } else if (moment(currentTime).isBetween("0000", "0040")) {
  //   ultraSrtLiveBaseTime = "2300";
  //   setultraSrtLiveBaseDate(yesterdayDate);
  // }
  // setUltraSrtLiveBaseTime(ultraSrtLiveBaseTime);
}

export { Time };
