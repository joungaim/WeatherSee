import React, { useReducer, useEffect } from "react";
import styles from "../styles/styles";
import { View, Image, Text } from "react-native";
import Swiper from "react-native-swiper";
import { Dust } from "../../src/Dust";
import { DUST_STATION } from "../../src/DustStationList";
import { IMG_DUST_SRC } from "../ImageSrc";

function DustCovidComponent(props) {
  const addrSi = props.addrObj.addrSi; //level1
  const addrGu = props.addrObj.addrGu; //level2
  const latitude = props.latitude; //level2
  const longitude = props.longitude; //level2

  const initialState = {
    srtWeatherTmpObj: {},
    srtWeatherSkyObj: {},
    srtWeatherPtyObj: {},
    srtWeatherPopObj: {},

    pm10Value: 0,
    pm25Value: 0,
    pm10Grade: 0,
    pm25Grade: 0,
    pm10GradeStr: "",
    pm25GradeStr: "",
    dustLoaded: false,
  };

  function reducer(state, action) {
    switch (action.type) {
      case "SET_DUST_OBJ":
        return {
          ...state,
          pm10Value: action.pm10Value,
          pm25Value: action.pm25Value,
          pm10Grade: action.pm10Grade,
          pm25Grade: action.pm25Grade,
          pm10GradeStr: action.pm10GradeStr,
          pm25GradeStr: action.pm25GradeStr,
          dustLoaded: action.dustLoaded,
        };
      default:
        throw new Error();
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  /**
   * 위,경도를 기준으로 두 점의 거리를 km 값으로 반환
   */
  getDistanceInKm = (lat1, lng1, lat2, lng2) => {
    deg2rad = (deg) => {
      return (deg * Math.PI) / 180;
    };

    var R = 6371; // 지구 반경(km)
    var dLat = deg2rad(lat2 - lat1);
    var dLon = deg2rad(lng2 - lng1);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // 좌표사이 거리(km)
    console.log("두 좌표 사이의 거리 : ", d);
    return d;
  };

  getStationObj = () => {
    let stationObj = DUST_STATION.filter((ele) => {
      return ele.level1 == addrSi;
    });

    stationObj = stationObj.filter((ele) => {
      return ele.level2 == addrGu;
    });

    if (stationObj.length > 1) {
      let minDistance = getDistanceInKm(stationObj[0].latitude, stationObj[0].longitude, latitude, longitude);
      let nearestStation;
      for (let i = 1; i < stationObj.length; i++) {
        if (minDistance > getDistanceInKm(stationObj[i].latitude, stationObj[i].longitude, latitude, longitude)) {
          minDistance = getDistanceInKm(stationObj[i].latitude, stationObj[i].longitude, latitude, longitude);
          nearestStation = stationObj[i];
        }
      }
      stationObj = nearestStation;
    }

    return stationObj;
  };

  getDustGrade = (dust) => {
    const pm10Value = dust.pm10Value;
    const pm25Value = dust.pm25Value;

    let pm10Grade; //미세먼지 등급
    let pm25Grade; //초미세먼지 등급
    let pm10GradeStr;
    let pm25GradeStr;

    if (pm10Value <= 15) {
      pm10Grade = 0;
      pm10GradeStr = "최고";
    } else if (15 < pm10Value && pm10Value <= 30) {
      pm10Grade = 1;
      pm10GradeStr = "좋음";
    } else if (30 < pm10Value && pm10Value <= 40) {
      pm10Grade = 2;
      pm10GradeStr = "양호";
    } else if (40 < pm10Value && pm10Value <= 50) {
      pm10Grade = 3;
      pm10GradeStr = "보통";
    } else if (50 < pm10Value && pm10Value <= 75) {
      pm10Grade = 4;
      pm10GradeStr = "나쁨";
    } else if (75 < pm10Value && pm10Value <= 100) {
      pm10Grade = 5;
      pm10GradeStr = "아주나쁨";
    } else if (100 < pm10Value && pm10Value <= 150) {
      pm10Grade = 6;
      pm10GradeStr = "매우나쁨";
    } else {
      pm10Grade = 7;
      pm10GradeStr = "최악";
    }

    if (pm25Value <= 8) {
      pm25Grade = 0;
      pm25GradeStr = "최고";
    } else if (8 < pm25Value && pm25Value <= 15) {
      pm25Grade = 1;
      pm25GradeStr = "좋음";
    } else if (15 < pm25Value && pm25Value <= 20) {
      pm25Grade = 2;
      pm25GradeStr = "양호";
    } else if (20 < pm25Value && pm25Value <= 25) {
      pm25Grade = 3;
      pm25GradeStr = "보통";
    } else if (25 < pm25Value && pm25Value <= 37) {
      pm25Grade = 4;
      pm25GradeStr = "나쁨";
    } else if (37 < pm25Value && pm25Value <= 50) {
      pm25Grade = 5;
      pm25GradeStr = "아주나쁨";
    } else if (50 < pm25Value && pm25Value <= 75) {
      pm25Grade = 6;
      pm25GradeStr = "매우나쁨";
    } else {
      pm25Grade = 7;
      pm25GradeStr = "최악";
    }

    return { pm10Grade, pm25Grade, pm10GradeStr, pm25GradeStr };
  };

  getDust = async () => {
    const stationObj = await getStationObj();
    const stationName = stationObj[0].name;
    const dust = await Dust(stationName);
    const { pm10Grade, pm25Grade, pm10GradeStr, pm25GradeStr } = getDustGrade(dust);
    console.log("미세먼지 : ", dust.pm10Value, ", 초미세먼지 : ", dust.pm25Value);
    console.log("미세먼지 단계 : ", pm10Grade, ", 초미세먼지 단계 : ", pm25Grade);

    dispatch({
      type: "SET_DUST_OBJ",
      pm10Value: dust.pm10Value,
      pm25Value: dust.pm25Value,
      pm10Grade: pm10Grade,
      pm25Grade: pm25Grade,
      pm10GradeStr: pm10GradeStr,
      pm25GradeStr: pm25GradeStr,
      dustLoaded: true,
    });
  };

  useEffect(() => {
    getDust();
  }, []);

  return (
    state.dustLoaded && (
      <View style={styles.content_padding_row}>
        <Swiper style={styles.wrapper} showsPagination={false}>
          <View style={styles.slide1}>
            <View style={[styles.ractangle_wrapper]}>
              <View style={[styles.ractangle_w_r, { height: 90 }]}>
                <Image style={styles.img_contain} source={IMG_DUST_SRC[state.pm10Grade].image} />
                <View style={{ marginLeft: "6%" }}>
                  <Text style={[styles.txt_body2_r, { marginBottom: "1%" }]}>미세먼지</Text>
                  <Text style={styles.txt_subtitle1_b}>{state.pm10GradeStr}</Text>
                </View>
              </View>

              <View style={[styles.ractangle_w_r, { height: 90, marginLeft: "2.5%" }]}>
                <Image style={styles.img_contain} source={IMG_DUST_SRC[state.pm25Grade].image} />
                <View style={{ marginLeft: "6%" }}>
                  <Text style={[styles.txt_body2_r, { marginBottom: "1%" }]}>초미세먼지</Text>
                  <Text style={styles.txt_subtitle1_b}>{state.pm25GradeStr}</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.slide2}>
            <View style={[styles.ractangle_wrapper]}>
              <View style={[styles.ractangle_w_r, { height: 90 }]}>
                <Text style={[styles.txt_body2_r]}>전국</Text>
                <Text style={[styles.txt_subtitle1_b, { marginLeft: "3%" }]}>1,597명</Text>
                <Image style={styles.img_arrow} source={require("../../assets/img/up_r.png")} marginLeft="3%" />
              </View>

              <View style={[styles.ractangle_w_r, { height: 90, marginLeft: "2.5%" }]}>
                <Text style={[styles.txt_body2_r]}>서울</Text>
                <Text style={[styles.txt_subtitle1_b, { marginLeft: "3%" }]}>697명</Text>
                <Image style={styles.img_arrow} source={require("../../assets/img/down_g.png")} marginLeft="3%" />
              </View>
            </View>
          </View>
        </Swiper>
      </View>
    )
  );
}

export default DustCovidComponent;
