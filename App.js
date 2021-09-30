import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  SafeAreaView,
} from "react-native";
import * as Location from "expo-location";
import axios from "axios";
import moment from "moment";
import Loading from "./Loading";
import firebase from "firebase/app";
import { Svg } from "react-native-svg";
import { useFonts, NotoSans_300Regular } from "@expo-google-fonts/noto-sans";
import {
  NotoSansKR_300Light,
  NotoSansKR_400Regular,
  NotoSansKR_500Medium,
  NotoSansKR_700Bold,
  NotoSansKR_900Black,
} from "@expo-google-fonts/noto-sans-kr";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const config = {
  apiKey: "AIzaSyAZ_6n2gMd3MKedZ6DO3auqsn9ZVyDYcdw",
  authDomain: "weathersee-40c91.firebaseapp.com",
  projectId: "weathersee-40c91",
  storageBucket: "weathersee-40c91.appspot.com",
  messagingSenderId: "1015441262442",
  appId: "1:1015441262442:web:a6b5595f00eb2b93fe4713",
  measurementId: "G-PYZPZDBNZG",
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

export default function App() {
  /**
   * 폰트 로딩
   */
  let [fontsLoaded] = useFonts({
    NotoSans_300Regular,
    NotoSansKR_300Light,
    NotoSansKR_400Regular,
    NotoSansKR_500Medium,
    NotoSansKR_700Bold,
    NotoSansKR_900Black,
  });

  const [isLoading, setIsLoading] = useState(true);

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  /**
   * 초단기실황조회용 변수
   */
  const [ultraSrtLiveBaseDate, setultraSrtLiveBaseDate] = useState(null);
  const [ultraSrtLiveBaseTime, setUltraSrtLiveBaseTime] = useState("0000");
  const [ultSrtLiveWeatherObj, setUltSrtLiveWeatherObj] = useState({});

  /**
   * 초단기예보조회용 변수
   */
  const [ultraSrtBaseDate, setultraSrtBaseDate] = useState(null);
  const [ultraSrtBaseTime, setUltraSrtBaseTime] = useState("0000");
  const [ultSrtWeatherObj, setUltSrtWeatherObj] = useState({});

  /**
   * 단기예보조회용 변수
   */
  const [srtBaseDate, setSrtBaseDate] = useState(null);
  const [srtBaseTime, setSrtBaseTime] = useState("0200");
  const [srtWeatherObj, setSrtWeatherObj] = useState({});

  /**
   * 중기예보조회용 변수
   */
  const [midTmFc, setMidTmFc] = useState(null);
  const [midLandRegId, setMidLandRegId] = useState(); //중기육상예보조회용 지역코드
  const [midLandWeatherObj, setmidLandWeatherObj] = useState({}); //중기육상예보조회용 객체
  const [midTaRegId, setMidTaRegId] = useState(); //중기기온조회용 지역코드
  const [midTaWeatherObj, setmidTaWeatherObj] = useState({}); //중기육상예보조회용 객체

  let [addrObj, setAddrObj] = useState({});

  // 날씨 데이터
  const [pop, setPop] = useState(); // 강수확률 단위 : %
  const [pty, setPty] = useState(); // 강수형태
  const [pcp, setPcp] = useState(); // 1시간 강수량
  const [reh, setReh] = useState(); // 습도 단위 : %
  const [sno, setSno] = useState(); // 1시간 신적설(눈 쌓인 양)
  const [sky, setSky] = useState(); // 하늘상태
  const [tmp, setTmp] = useState(); // 1시간 기온 단위 :℃
  const [tmn, setTmn] = useState(); // 일 최저기온 단위 :℃
  const [tmx, setTmx] = useState(); // 일 최고기온 단위 :℃
  const [uuu, setUuu] = useState(); // 풍속(동서성분) : m/s
  const [vvv, setVvv] = useState(); // 풍속(남북성분) : m/s
  const [vec, setVec] = useState(); // 풍향 : deg
  const [wsd, setWsd] = useState(); // 풍속 : m/s
  // 날씨 데이터

  getTime = async () => {
    let todayDate = moment().format("YYYYMMDD");
    let currentTime = moment().format("HHmm"); //현재 시간분 (HH:24h / hh:12h)
    let yesterdayDate = moment().subtract(1, "days"); // 어제날짜 구하기
    yesterdayDate = moment(yesterdayDate).format("YYYYMMDD"); // 어제날짜 포맷 재 설정

    let srtBaseTime;
    let ultraSrtLiveBaseTime;
    let ultraSrtBaseTime;
    let midBaseDate = todayDate;
    let midBaseTime;

    setSrtBaseDate(todayDate);
    setultraSrtLiveBaseDate(todayDate);
    setultraSrtBaseDate(todayDate);

    /**
     * [단기예보조회용 날짜/시간 세팅]
     * 기상청 정보는 1일 총 8번 업데이트 된다.(0200, 0500, 0800, 1100, 1400, 1700, 2000, 2300)
     * moment(currentTime).isBetween("1200", "0210") : 1200 <= currentTime < 0210 : 1200은 포함되고 (true) 0210은 포함되지 않음(flase)
     */
    if (moment(currentTime).isBetween("0000", "0211")) {
      // 0시~2시 10분 사이 : base_date가 어제 날짜로 바뀌어야 한다.
      setSrtBaseDate(yesterdayDate);
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
    setSrtBaseTime(srtBaseTime);

    /**
     * [초단기실황조회용 날짜/시간 세팅]
     * 매시간 정각 40분 후에 조회 가능. 예) 12시 데이터는 12시 41분부터 / 1시 데이터는 1시 41분부터 조회 가능
     */
    if (moment(currentTime).isBetween("0041", "0141")) {
      ultraSrtLiveBaseTime = "0000";
    } else if (moment(currentTime).isBetween("0141", "0241")) {
      ultraSrtLiveBaseTime = "0100";
    } else if (moment(currentTime).isBetween("0241", "0341")) {
      ultraSrtLiveBaseTime = "0200";
    } else if (moment(currentTime).isBetween("0341", "0441")) {
      ultraSrtLiveBaseTime = "0300";
    } else if (moment(currentTime).isBetween("0441", "0541")) {
      ultraSrtLiveBaseTime = "0400";
    } else if (moment(currentTime).isBetween("0541", "0641")) {
      ultraSrtLiveBaseTime = "0500";
    } else if (moment(currentTime).isBetween("0641", "0741")) {
      ultraSrtLiveBaseTime = "0600";
    } else if (moment(currentTime).isBetween("0741", "0841")) {
      ultraSrtLiveBaseTime = "0700";
    } else if (moment(currentTime).isBetween("0841", "0941")) {
      ultraSrtLiveBaseTime = "0800";
    } else if (moment(currentTime).isBetween("0941", "1041")) {
      ultraSrtLiveBaseTime = "0900";
    } else if (moment(currentTime).isBetween("1041", "1141")) {
      ultraSrtLiveBaseTime = "1000";
    } else if (moment(currentTime).isBetween("1141", "1241")) {
      ultraSrtLiveBaseTime = "1100";
    } else if (moment(currentTime).isBetween("1241", "1341")) {
      ultraSrtLiveBaseTime = "1200";
    } else if (moment(currentTime).isBetween("1341", "1441")) {
      ultraSrtLiveBaseTime = "1300";
    } else if (moment(currentTime).isBetween("1441", "1541")) {
      ultraSrtLiveBaseTime = "1400";
    } else if (moment(currentTime).isBetween("1541", "1641")) {
      ultraSrtLiveBaseTime = "1500";
    } else if (moment(currentTime).isBetween("1641", "1741")) {
      ultraSrtLiveBaseTime = "1600";
    } else if (moment(currentTime).isBetween("1741", "1841")) {
      ultraSrtLiveBaseTime = "1700";
    } else if (moment(currentTime).isBetween("1841", "1941")) {
      ultraSrtLiveBaseTime = "1800";
    } else if (moment(currentTime).isBetween("1941", "2041")) {
      ultraSrtLiveBaseTime = "1900";
    } else if (moment(currentTime).isBetween("2041", "2141")) {
      ultraSrtLiveBaseTime = "2000";
    } else if (moment(currentTime).isBetween("2141", "2241")) {
      ultraSrtLiveBaseTime = "2100";
    } else if (moment(currentTime).isBetween("2241", "2341")) {
      ultraSrtLiveBaseTime = "2200";
    } else if (moment(currentTime).isBetween("2341", "0000")) {
      ultraSrtLiveBaseTime = "2300";
    } else if (moment(currentTime).isBetween("0000", "0040")) {
      ultraSrtLiveBaseTime = "2300";
      setultraSrtLiveBaseDate(yesterdayDate);
    }
    setUltraSrtLiveBaseTime(ultraSrtLiveBaseTime);

    /**
     * [초단기예보조회용 날짜/시간 세팅]
     * 매시간 정각 45분 후에 조회 가능. 예) 12시 데이터는 12시 46분부터 / 1시 데이터는 1시 46분부터 조회 가능
     */
    if (moment(currentTime).isBetween("0046", "0146")) {
      ultraSrtBaseTime = "0030";
    } else if (moment(currentTime).isBetween("0146", "0246")) {
      ultraSrtBaseTime = "0130";
    } else if (moment(currentTime).isBetween("0246", "0346")) {
      ultraSrtBaseTime = "0230";
    } else if (moment(currentTime).isBetween("0346", "0446")) {
      ultraSrtBaseTime = "0330";
    } else if (moment(currentTime).isBetween("0446", "0546")) {
      ultraSrtBaseTime = "0430";
    } else if (moment(currentTime).isBetween("0546", "0646")) {
      ultraSrtBaseTime = "0530";
    } else if (moment(currentTime).isBetween("0646", "0746")) {
      ultraSrtBaseTime = "0630";
    } else if (moment(currentTime).isBetween("0746", "0846")) {
      ultraSrtBaseTime = "0730";
    } else if (moment(currentTime).isBetween("0846", "0946")) {
      ultraSrtBaseTime = "0830";
    } else if (moment(currentTime).isBetween("0946", "1046")) {
      ultraSrtBaseTime = "0930";
    } else if (moment(currentTime).isBetween("1046", "1146")) {
      ultraSrtBaseTime = "1030";
    } else if (moment(currentTime).isBetween("1146", "1246")) {
      ultraSrtBaseTime = "1130";
    } else if (moment(currentTime).isBetween("1246", "1346")) {
      ultraSrtBaseTime = "1230";
    } else if (moment(currentTime).isBetween("1346", "1446")) {
      ultraSrtBaseTime = "1330";
    } else if (moment(currentTime).isBetween("1446", "1546")) {
      ultraSrtBaseTime = "1430";
    } else if (moment(currentTime).isBetween("1546", "1646")) {
      ultraSrtBaseTime = "1530";
    } else if (moment(currentTime).isBetween("1646", "1746")) {
      ultraSrtBaseTime = "1630";
    } else if (moment(currentTime).isBetween("1746", "1846")) {
      ultraSrtBaseTime = "1730";
    } else if (moment(currentTime).isBetween("1846", "1946")) {
      ultraSrtBaseTime = "1830";
    } else if (moment(currentTime).isBetween("1946", "2046")) {
      ultraSrtBaseTime = "1930";
    } else if (moment(currentTime).isBetween("2046", "2146")) {
      ultraSrtBaseTime = "2030";
    } else if (moment(currentTime).isBetween("2146", "2246")) {
      ultraSrtBaseTime = "2130";
    } else if (moment(currentTime).isBetween("2246", "2346")) {
      ultraSrtBaseTime = "2230";
    } else if (moment(currentTime).isBetween("2346", "0000")) {
      ultraSrtBaseTime = "2330";
    } else if (moment(currentTime).isBetween("0000", "0046")) {
      ultraSrtBaseTime = "2330";
      setultraSrtBaseDate(yesterdayDate);
    }
    setUltraSrtBaseTime(ultraSrtBaseTime);

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
    setMidTmFc(midBaseDate + midBaseTime);
  };

  /**
   * 1. 위도, 경도 얻은 후
   * 2. getAddress 호출하여 한글 주소 얻음
   * 3. 위,경도를 getGridGPS 호출하여 좌표값으로 바꾼후 getWeather 호출
   */
  getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});

    console.log(
      "위/경도 : " + location.coords.latitude + "/" + location.coords.longitude
    );
    setLatitude(location.coords.latitude);
    setLongitude(location.coords.longitude);

    await getAddress(location.coords.latitude, location.coords.longitude);
    await getRegId();

    const rs = await getGridGPS(); // 위도,경도를 기상청 api에 활용 가능한 x,y로 바꾸는 함수
    getWeather(rs.x, rs.y); // 좌표 값 사용하여 날씨데이터 받아오는 함수
  };

  /**
   * 한글 주소 얻음
   */
  getAddress = async (latitude, longitude) => {
    const worldOpenkey = "D2914382-1CF1-340A-B872-29911F460AEF";
    const url = `http://api.vworld.kr/req/address?service=address&request=getAddress&version=2.0&crs=epsg:4326&point=${longitude},${latitude}&format=json&type=PARCEL&zipcode=false&simple=true&key=${worldOpenkey}`;

    await axios
      .get(url)
      .then(function (response) {
        const addrText = response.data.response.result[0].text; // 주소 전체 (중기예보지역코드 얻기위함)
        const addrGu = response.data.response.result[0].structure.level2; // 구 이름
        const addrDong = response.data.response.result[0].structure.level4L; // 동 이름
        setAddrObj({
          addrText,
          addrGu,
          addrDong,
        });
      })
      .catch(function (error) {
        console.log("getAddress 실패 : " + error);
      });
  };

  /**
   * 중기예보조회용 예보구역코드 얻기
   */
  getRegId = async () => {
    //중기육상예보조회용 RegId 객체
    const midLandRegIdObj = {
      서울: "11B00000",
      인천: "11B00000",
      경기도: "11B00000",
      강원도영서: "11D10000",
      강원도영동: "11D20000",
      대전: "11C20000",
      세종: "11C20000",
      충청남도: "11C20000",
      충청북도: "11C10000",
      광주: "11F20000",
      전라남도: "11F20000",
      전라북도: "11F10000",
      대구: "11H10000",
      경상북도: "11H10000",
      부산: "11H20000",
      울산: "11H20000",
      경상남도: "11H20000",
      제주도: "11G00000",
    };

    // 중기기온조회용 RegId 객체
    // vWrold 결과 값과 상이 한게 있으면 아래 객체의 key값을 수정하기
    // ex. 추자도 -> vWorld API에서는 추자읍으로 출력하기 때문에 추자로 수정함.
    const midTaRegIdObj = {
      서울: "11B10101",
      인천: "11B20201",
      수원: "11B20601",
      성남: "11B20605",
      안양: "11B20602",
      광명: "11B10103",
      과천: "11B10102",
      평택: "11B20606",
      오산: "11B20603",
      의왕: "11B20609",
      용인: "11B20612",
      군포: "11B20610",
      안성: "11B20611",
      화성: "11B20604",
      양평: "11B20503",
      구리: "11B20501",
      남양주: "11B20502",
      하남: "11B20504",
      이천: "11B20701",
      여주: "11B20703",
      광주: "11B20702",
      의정부: "11B20301",
      고양: "11B20302",
      파주: "11B20305",
      양주: "11B20304",
      동두천: "11B20401",
      연천: "11B20402",
      포천: "11B20403",
      가평: "11B20404",
      강화: "11B20101",
      김포: "11B20102",
      시흥시: "11B20202",
      부천: "11B20204",
      안산: "11B20203",
      백령도: "11A00101",
      부산: "11H20201",
      울산: "11H20101",
      김해: "11H20304",
      양산: "11H20102",
      창원: "11H20301",
      밀양: "11H20601",
      함안: "11H20603",
      창녕: "11H20604",
      의령: "11H20602",
      진주: "11H20701",
      하동: "11H20704",
      사천: "11H20402",
      거창: "11H20502",
      합천: "11H20503",
      산청: "11H20703",
      함양: "11H20501",
      통영: "11H20401",
      거제: "11H20403",
      고성: "11H20404",
      남해: "11H20405",
      대구: "11H10701",
      영천: "11H10702",
      경산: "11H10703",
      청도: "11H10704",
      칠곡: "11H10705",
      김천: "11H10601",
      구미: "11H10602",
      군위: "11H10603",
      고령: "11H10604",
      성주: "11H10605",
      안동: "11H10501",
      의성: "11H10502",
      청송: "11H10503",
      상주: "11H10302",
      문경: "11H10301",
      예천: "11H10303",
      영주: "11H10401",
      봉화: "11H10402",
      영양: "11H10403",
      울진: "11H10101",
      영덕: "11H10102",
      포항: "11H10201",
      경주: "11H10202",
      울릉도: "11E00101",
      독도: "11E00102",
      광주: "11F20501",
      나주: "11F20503",
      장성: "11F20502",
      담양: "11F20504",
      화순: "11F20505",
      영광: "21F20102",
      함평: "21F20101",
      목포: "21F20801",
      무안: "21F20804",
      영암: "21F20802",
      진도: "21F20201",
      신안: "21F20803",
      흑산도: "11F20701",
      순천: "11F20603",
      광양: "11F20402",
      구례: "11F20601",
      곡성: "11F20602",
      완도: "11F20301",
      강진: "11F20303",
      장흥: "11F20304",
      해남: "11F20302",
      여수: "11F20401",
      고흥: "11F20403",
      보성: "11F20404",
      전주: "11F10201",
      익산: "11F10202",
      군산: "21F10501",
      정읍: "11F10203",
      김제: "21F10502",
      남원: "11F10401",
      고창: "21F10601",
      무주: "11F10302",
      부안: "21F10602",
      순창: "11F10403",
      완주: "11F10204",
      임실: "11F10402",
      장수: "11F10301",
      진안: "11F10303",
      대전: "11C20401",
      세종: "11C20404",
      공주: "11C20402",
      논산: "11C20602",
      계룡: "11C20403",
      금산: "11C20601",
      천안: "11C20301",
      아산: "11C20302",
      예산: "11C20303",
      서산: "11C20101",
      태안: "11C20102",
      당진: "11C20103",
      홍성: "11C20104",
      보령: "11C20201",
      서천: "11C20202",
      청양: "11C20502",
      부여: "11C20501",
      청주: "11C10301",
      증평: "11C10304",
      괴산: "11C10303",
      진천: "11C10102",
      충주: "11C10101",
      음성: "11C10103",
      제천: "11C10201",
      단양: "11C10202",
      보은: "11C10302",
      옥천: "11C10403",
      영동: "11C10402",
      추풍령: "11C10401",
      철원: "11D10101",
      화천: "11D10102",
      인제: "11D10201",
      양구: "11D10202",
      춘천: "11D10301",
      홍천: "11D10302",
      원주: "11D10401",
      횡성: "11D10402",
      영월: "11D10501",
      정선: "11D10502",
      평창: "11D10503",
      대관령: "11D20201",
      속초: "11D20401",
      고성: "11D20402",
      양양: "11D20403",
      강릉: "11D20501",
      동해: "11D20601",
      삼척: "11D20602",
      태백: "11D20301",
      제주: "11G00201",
      서귀포: "11G00401",
      성산: "11G00101",
      고산: "11G00501",
      성판악: "11G00302",
      이어도: "11G00601",
      추자: "11G00800",
    };

    // 중기육상 예보코드조회
    Object.keys(midLandRegIdObj).map(function (el) {
      if (addrObj.addrText.includes(el)) {
        setMidLandRegId(midLandRegIdObj[el]);
      }
    });

    // 중기기온 예보코드조회
    Object.keys(midTaRegIdObj).map(function (el) {
      if (addrObj.addrText.includes(el)) {
        setMidTaRegId(midTaRegIdObj[el]);
      }
    });

    /**
     * 중기육상예보조회용 지역코드 구하기.
     * 시이름 뒤에 특별시 or 광역시 or 시 가 붙어 있을 경우 떼는 작업
     */
    // let strAddrText = addrObj.addrText.replace(/(특별시|광역시)/g, ""); // 특별시, 광역시 문자열 제거
    // let strAddrSilastVal = strAddrText.charAt(strAddrText.length - 1); //strAddrText 마지막 문자열 가져옴
    // if (strAddrSilastVal == "시") {
    //   strAddrText = strAddrText.slice(0, -1); // tmpValue 의 제일 마지막 문자가 시일 경우 맨 마지막 문자 자르기
    // }
    // console.log(strAddrText);
  };
  // 위,경도 -> 좌표변환 함수
  getGridGPS = async () => {
    // 위,경도 -> 좌표변환 하기 위한 기본값
    const RE = 6371.00877; // 지구 반경(km)
    const GRID = 5.0; // 격자 간격(km)
    const SLAT1 = 30.0; // 투영 위도1(degree)
    const SLAT2 = 60.0; // 투영 위도2(degree)
    const OLON = 126.0; // 기준점 경도(degree)
    const OLAT = 38.0; // 기준점 위도(degree)
    const XO = 43; // 기준점 X좌표(GRID)
    const YO = 136; // 기1준점 Y좌표(GRID)
    //

    var DEGRAD = Math.PI / 180.0;
    var RADDEG = 180.0 / Math.PI;

    var re = RE / GRID;
    var slat1 = SLAT1 * DEGRAD;
    var slat2 = SLAT2 * DEGRAD;
    var olon = OLON * DEGRAD;
    var olat = OLAT * DEGRAD;

    var sn =
      Math.tan(Math.PI * 0.25 + slat2 * 0.5) /
      Math.tan(Math.PI * 0.25 + slat1 * 0.5);
    sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
    var sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
    sf = (Math.pow(sf, sn) * Math.cos(slat1)) / sn;
    var ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
    ro = (re * sf) / Math.pow(ro, sn);
    var rs = {};

    rs["lat"] = latitude; // 객체 rs에 "lat"를 이름으로 하는 key 를 생성하고, 변수 latitude을 value로 할당한다.
    rs["lng"] = longitude; // 객체 rs에 "lng"를 이름으로 하는 key 를 생성하고, 변수 longitude을 value로 할당한다.
    var ra = Math.tan(Math.PI * 0.25 + latitude * DEGRAD * 0.5);
    ra = (re * sf) / Math.pow(ra, sn);
    var theta = longitude * DEGRAD - olon;
    if (theta > Math.PI) theta -= 2.0 * Math.PI;
    if (theta < -Math.PI) theta += 2.0 * Math.PI;
    theta *= sn;
    rs["x"] = Math.floor(ra * Math.sin(theta) + XO + 0.5);
    rs["y"] = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5);

    return rs;
  };

  // nx,ny : 위,경도를 좌표로 바꾼 각각의 값
  getWeather = async (nx, ny) => {
    const API_KEY =
      "Skm8Sx%2BhuSd8PBsZeDzGPZVXFlXODLxEJR2MRRajPQqn1aID2DYuEYoMC97NhdpJ4AzetqrX2xTDHtIUKnTX1g%3D%3D";

    /**
     * [초단기실황조회용 HTTP 비동기 통신 ]
     */
    // const ultSrtLiveUrl = `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst?serviceKey=${API_KEY}&numOfRows=10&pageNo=1&base_date=${ultraSrtLiveBaseDate}&base_time=${ultraSrtLiveBaseTime}&nx=${nx}&ny=${ny}&dataType=JSON`;
    // console.log("ultSrtLiveUrl " + ultSrtLiveUrl);
    // await axios
    //   .get(ultSrtLiveUrl)
    //   .then(function (response) {
    //     const ultSrtLiveWeatherResponseData =
    //       response.data.response.body.items.item;
    //     setUltSrtLiveWeatherObj(ultSrtLiveWeatherResponseData);
    //     // WeatherResponseData.map(function (arr, i) {
    //     //   console.log("getUltSrtWeather :" + arr.category);
    //     // });
    //   })
    //   .catch(function (error) {
    //     console.log("getUltLiveSrtWeather 실패 : " + error);
    //   });

    /**
     * [초단기예보조회용 HTTP 비동기 통신 ]
     */
    const ultSrtUrl = `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst?serviceKey=${API_KEY}&numOfRows=100&pageNo=1&base_date=${ultraSrtBaseDate}&base_time=${ultraSrtBaseTime}&nx=${nx}&ny=${ny}&dataType=JSON`;
    console.log(ultSrtUrl);
    await axios
      .get(ultSrtUrl)
      .then(function (response) {
        const ultSrtWeatherResponseData =
          response.data.response.body.items.item;
        setUltSrtWeatherObj(ultSrtWeatherResponseData);
        // WeatherResponseData.map(function (arr, i) {
        //   console.log("getUltSrtWeather :" + arr.category);
        // });
      })
      .catch(function (error) {
        console.log("getUltSrtWeather 실패 : " + error);
      });

    /**
     * [단기예보조회용 HTTP 비동기 통신 ]
     */
    const srtUrl = `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${API_KEY}&numOfRows=10&pageNo=1&dataType=JSON&base_date=${srtBaseDate}&base_time=${srtBaseTime}&nx=${nx}&ny=${ny}`;
    await axios
      .get(srtUrl)
      .then(function (response) {
        const srtWeatherResponseData = response.data.response.body.items.item; //필요한 정보만 받아오기 전부 다 받아 오려면 response.data 까지만 적는다.
        setSrtWeatherObj(srtWeatherResponseData);
        // WeatherResponseData.map(function (arr, i) {
        //   setSrtWeatherObj ({
        //     category = arr.category,
        //   })
        // });
      })
      .catch(function (error) {
        console.log("getSrtWeather 실패 : " + error);
      });

    // /**
    //  * [중기육상예보조회용 HTTP 비동기 통신 ]
    //  */
    const midLandUrl = `http://apis.data.go.kr/1360000/MidFcstInfoService/getMidLandFcst?serviceKey=${API_KEY}&dataType=JSON&tmFc=${midTmFc}&regId=${midLandRegId}`;
    await axios
      .get(midLandUrl)
      .then(function (response) {
        const midLandWeatherResponseData =
          response.data.response.body.items.item; //필요한 정보만 받아오기 전부 다 받아 오려면 response.data 까지만 적는다.
        setmidLandWeatherObj(midLandWeatherResponseData);
        console.log(midLandWeatherResponseData);
      })
      .catch(function (error) {
        console.log("getMidWeather 실패 : " + error);
      });

    //여기부터 수정 Unhandled promise rejection: ReferenceError: Can't find variable: getMidTaWeather 에러 잡아야함.
    /**
     * [중기기온예보조회용 HTTP 비동기 통신 ]
     */
    const midUrl = `http://apis.data.go.kr/1360000/MidFcstInfoService/getMidTa?serviceKey=${API_KEY}&dataType=JSON&tmFc=${midTmFc}&regId=${midTaRegId}`;
    await axios
      .get(midUrl)
      .then(function (response) {
        const midWeatherResponseData = response.data.response.body.items.item; //필요한 정보만 받아오기 전부 다 받아 오려면 response.data 까지만 적는다.
        setmidTaWeatherObj(midWeatherResponseData);
        console.log(midWeatherResponseData);
      })
      .catch(function (error) {
        console.log("getMidWeather 실패 : " + error);
      });

    setIsLoading(false);
  };

  // 클래스 생명주기 메서드 중 componentDidMount() 와 동일한 기능을 한다.
  // useEffect는첫번째 렌더링과 이후의 모든 업데이트에서 수행됩니다.
  useEffect(() => {
    getTime();
    getLocation();
  }, []);
  // 빈 배열을 넣어 주면 처음 랜더링 될 때 한번만 실행 된다. 넣지 않으면 모든 업데이트에서 실행되며
  // 배열안에 [count] 같이 인자를 넣어주면 해당 인자가 업데이트 될 때 마다 실행된다.
  // {Math.round(ultSrtWeatherObj[3].obsrValue)}
  return isLoading ? (
    <Loading />
  ) : (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <StatusBar style="auto" />
        <View style={styles.header} />

        <View style={styles.content}>
          <Text style={[styles.txt_h5_b]}>
            {addrObj.addrGu} {addrObj.addrDong}
          </Text>

          <View style={styles.content_padding}>
            <View style={styles.ractangle1}>
              <Image
                style={styles.img_weathericon}
                source={require("./assets/img/weather/cloudy.png")}
              />
              <View style={styles.content_weather}>
                <Text style={styles.txt_weather}>19°</Text>
                <Text style={[styles.txt_subtitle2_r_w, { marginTop: 5 }]}>
                  최고:24° 최저:17°
                </Text>
              </View>
            </View>
          </View>

          <View style={[styles.ractangle_bg, { height: 200 }]}>
            <Text style={styles.txt_h6_b}>상세 예보</Text>
            <View style={styles.contents_padding}>
              <View style={[styles.ractangle_detail, { height: 120 }]}>
                <Image
                  style={styles.img_detail}
                  source={require("./assets/img/temperatures.png")}
                />
                <View>
                  <Text
                    style={[
                      styles.txt_caption_r,
                      { marginLeft: "15%", marginBottom: "3%" },
                    ]}
                  >
                    체감온도
                  </Text>
                  <Text
                    style={[
                      styles.txt_subtitle1_b,
                      { marginLeft: "15%", marginBottom: "15%" },
                    ]}
                  >
                    더움 29°
                  </Text>
                </View>
              </View>
              <View
                style={[
                  styles.ractangle_detail,
                  { height: 120, marginLeft: "2.5%" },
                ]}
              >
                <Image
                  style={styles.img_detail}
                  source={require("./assets/img/humidity.png")}
                />
                <Text
                  style={[
                    styles.txt_caption_r,
                    { marginLeft: "15%", marginBottom: "3%" },
                  ]}
                >
                  습도
                </Text>
                <Text
                  style={[
                    styles.txt_subtitle1_b,
                    {
                      marginLeft: "15%",
                      marginBottom: "15%",
                    },
                  ]}
                >
                  습함 55%
                </Text>
              </View>
              <View
                style={[
                  styles.ractangle_detail,
                  { height: 120, marginLeft: "2.5%" },
                ]}
              >
                <Image
                  style={styles.img_detail}
                  source={require("./assets/img/windspeed.png")}
                />
                <Text
                  style={[
                    styles.txt_caption_r,
                    { marginLeft: "13%", marginBottom: "3%" },
                  ]}
                >
                  서풍
                </Text>
                <Text
                  style={[
                    styles.txt_subtitle1_b,
                    { marginLeft: "13%", marginBottom: "15%" },
                  ]}
                >
                  약함 1m/s
                </Text>
              </View>
            </View>
          </View>

          <View style={[styles.ractangle_bg_row, { height: 50 }]}>
            <View style={styles.contents_padding}>
              <View style={styles.content_umbrella}>
                <Image
                  style={styles.img_umbrella}
                  source={require("./assets/img/umbrella.png")}
                />
                <Text style={[styles.txt_subtitle1_b, { marginLeft: "3%" }]}>
                  3시부터 비
                </Text>
                <Text style={[styles.txt_subtitle1_r, { marginLeft: 3 }]}>
                  예보
                </Text>
              </View>
            </View>
          </View>

          <View style={[styles.ractangle_bg, { height: 300 }]}>
            <View style={styles.content_padding}>
              <Text
                style={
                  ([styles.txt_caption_r],
                  { paddingTop: "5%", paddingBottom: "5%" })
                }
              >
                옷차림 알림
              </Text>
            </View>
            <View style={styles.devider}></View>
          </View>

          <Text style={styles.txt_h6_b}>미세먼지 단계</Text>
          <View style={styles.contents_padding}>
            <View style={[styles.ractangle_w_r, { height: 90 }]}>
              <Image
                style={styles.img_dust}
                source={require("./assets/img/dust/reallybad.png")}
              />
              <View style={{ marginLeft: "6%" }}>
                <Text style={[styles.txt_subtitle1_b, { marginBottom: "1%" }]}>
                  많이 나쁨
                </Text>
                <Text style={styles.txt_body2_r}>미세먼지</Text>
              </View>
            </View>

            <View
              style={[styles.ractangle_w_r, { height: 90, marginLeft: "2.5%" }]}
            >
              <Image
                style={styles.img_dust}
                source={require("./assets/img/dust/verybad.png")}
              />
              <View style={{ marginLeft: "6%" }}>
                <Text style={[styles.txt_subtitle1_b, { marginBottom: "1%" }]}>
                  아주 나쁨
                </Text>
                <Text style={styles.txt_body2_r}>초미세먼지</Text>
              </View>
            </View>
          </View>

          <Text style={[styles.txt_h6_b, { marginTop: "3%" }]}>
            코로나 19 확진자 수
          </Text>
          <View style={styles.contents_padding}>
            <View style={[styles.ractangle_w_r, { height: 70 }]}>
              <Text style={[styles.txt_body2_r]}>전국</Text>
              <Text style={[styles.txt_subtitle1_b, { marginLeft: "3%" }]}>
                1,597명
              </Text>
              <Image
                style={styles.img_arrow}
                source={require("./assets/img/up_r.png")}
                marginLeft="3%"
              />
            </View>

            <View
              style={[styles.ractangle_w_r, { height: 70, marginLeft: "2.5%" }]}
            >
              <Text style={[styles.txt_body2_r]}>서울</Text>
              <Text style={[styles.txt_subtitle1_b, { marginLeft: "3%" }]}>
                697명
              </Text>
              <Image
                style={styles.img_arrow}
                source={require("./assets/img/down_g.png")}
                marginLeft="3%"
              />
            </View>
          </View>

          <View
            style={[styles.ractangle_bg, { height: 200, marginTop: "10%" }]}
          >
            <Text style={styles.txt_h6_b}>3일 예보</Text>
            <View style={styles.contents_padding}>
              <View style={[styles.ractangle_detail, { height: 120 }]}>
                <Image
                  style={styles.img_detail}
                  source={require("./assets/img/weather3/sun.png")}
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },

  header: {
    height: 10,
  },

  content: {
    flex: 1,
  },

  content_weather: {
    flex: 1,
    paddingTop: "10%",
    paddingBottom: "20%",
  },

  content_padding: {
    paddingLeft: "4.5%",
    paddingRight: "4.5%",
  },

  contents_padding: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: "4.5%",
    paddingRight: "4.5%",
  },

  content_umbrella: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  devider: {
    borderBottomColor: "#c8c8cc",
    borderBottomWidth: 0.5,
  },

  txt_weather: {
    fontFamily: "NotoSansKR_300Light",
    fontSize: 85,
    color: "white",
    height: 105,
    marginTop: 0,
    paddingTop: 0,
  },

  txt_h5_b: {
    fontFamily: "NotoSansKR_700Bold",
    fontSize: 24,
    color: "black",
    paddingLeft: "4.5%",
  },

  txt_h6_b: {
    fontSize: 20,
    color: "black",
    fontFamily: "NotoSansKR_700Bold",
    paddingLeft: "4.5%",
    paddingTop: "5%",
  },

  txt_subtitle1_b: {
    fontFamily: "NotoSansKR_700Bold",
    fontSize: 18,
    color: "black",
    lineHeight: 22,
  },

  txt_subtitle1_r: {
    fontFamily: "NotoSansKR_400Regular",
    fontSize: 18,
    color: "black",
    lineHeight: 22,
  },

  txt_subtitle2_r: {
    fontFamily: "NotoSansKR_500Medium",
    fontSize: 14,
    color: "black",
  },

  txt_subtitle2_r_w: {
    fontFamily: "NotoSansKR_500Medium",
    fontSize: 14,
    color: "white",
    height: 16,
  },

  txt_body2_r: {
    fontFamily: "NotoSansKR_400Regular",
    fontSize: 14,
    color: "#8A8A8E",
    lineHeight: 19,
  },

  txt_caption_r: {
    fontSize: 12,
    color: "#85858C",
    fontFamily: "NotoSansKR_400Regular",
    lineHeight: 15,
  },

  txt_caption_r_b: {
    fontSize: 12,
    color: "black",
    fontFamily: "NotoSansKR_400Regular",
    lineHeight: 15,
  },

  ractangle1: {
    backgroundColor: "#007AFF",
    flexDirection: "row",
    borderRadius: 14,
    height: 203,
    alignItems: "center",
    marginTop: 25,
    marginBottom: 15,
  },

  /**
   * 흰색 배경
   */
  ractangle_bg: {
    backgroundColor: "white",
    width: "100%",
    marginTop: 10,
  },

  /**
   * 흰색 배경 가로 정렬 (비/눈 예보 영역)
   */
  ractangle_bg_row: {
    backgroundColor: "white",
    flexDirection: "row",
    width: "100%",
    marginTop: 10,
    alignItems: "center",
  },

  /**
   * 흰색 라운드 박스
   */
  ractangle_w_r: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "white",
    width: "100%",
    borderRadius: 14,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  ractangle_detail: {
    flex: 1,
    backgroundColor: "#F3F3F9",
    width: "100%",
    borderRadius: 14,
    marginTop: 20,
  },

  img_weathericon: {
    flex: 1,
    resizeMode: "contain",
    paddingLeft: "14%",
  },

  img_detail: {
    flex: 1,
    resizeMode: "contain",
    marginLeft: "15%",
    marginTop: "15%",
    marginBottom: "10%",
  },

  img_weather3: {
    flex: 1,
    resizeMode: "contain",
    marginLeft: "15%",
    marginTop: "15%",
    marginBottom: "10%",
  },

  img_umbrella: {
    resizeMode: "contain",
  },

  img_dust: {
    resizeMode: "contain",
  },
});
