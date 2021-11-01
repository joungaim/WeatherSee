import React from "react";



function Weather10Component({apikey, nx, ny}}) {
    /**
 * 단기예보 10일 예보 조회용 변수
 */
const [srtWeather10Obj, setSrtWeather10Obj] = useState({});

const IMG_WEATHER10_SRC = [
  {
    image: require("../../assets/img/weather10/cloudy.png"),
  },
  {
    image: require("../../assets/img/weather10/cloudy.png"),
  },
  {
    image: require("../../assets/img/weather10/slightly-cloudy.png"),
  },
  {
    image: require("../../assets/img/weather10/rainy.png"),
  },
  {
    image: require("../../assets/img/weather10/snowy.png"),
  },
  {
    image: require("../../assets/img/weather10/thunder.png"),
  },
  {
    image: require("../../assets/img/weather10/rainy-thunder.png"),
  },
];

/**
 * 10일 예보 날씨 아이콘 표시
 */

const getWeather10Img = (wfCode, ptyCode = 0) => {
  let code;
  if (isNaN(wfCode)) {
    const obj = midLandWeatherObj[0];
    const sky = obj[wfCode];

    if (sky == "맑음") {
      code = 0;
    } else if (sky == "흐림") {
      code = 1;
    } else if (sky == "구름많음") {
      code = 2;
    } else if (
      sky == "구름많고 비" ||
      sky == "구름많고 소나기" ||
      sky == "흐리고 비" ||
      sky == "흐리고 소나기" ||
      sky == "구름많고 비/눈" ||
      sky == "흐리고 비/눈"
    ) {
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
      if (wfCode == 1) {
        code = 0;
      } else if (wfCode == 3) {
        code = 2;
      } else if (wfCode == 4) {
        code = 1;
      }
    }
  }
  return code;
};

useEffect(() => {
  const base_time = "0200";
  const base_date = moment().format("YYYYMMDD");
  const srt10Url = `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${apikey}&numOfRows=1000&pageNo=1&dataType=JSON&base_date=${base_date}&base_time=${base_time}&nx=${nx}&ny=${ny}`;
  let srtWeatherResponseData;
  console.log("10일 예보용 단기예보 url : " + srt10Url);
  await axios
    .get(srt10Url)
    .then(function (response) {
      srtWeatherResponseData = response.data.response.body.items.item; //필요한 정보만 받아오기 전부 다 받아 오려면 response.data 까지만 적는다.

      srtWeatherResponseData = srtWeatherResponseData.filter((ele) => {
        return (
          ele.category == "TMN" ||
          ele.category == "TMX" ||
          (ele.category == "SKY" && ele.fcstTime == "0900") ||
          (ele.category == "POP" && Number(ele.fcstValue) >= 40)
        );
      });

      // POP가 중간중간 끼여 있으면 TMN TMX SKY 를 순서대로 쓰기에 불편하기 때문에 배열 뒤로 보내는 코드
      srtWeatherResponseData = srtWeatherResponseData
        .filter((ele) => ele.category != "POP")
        .concat(srtWeatherResponseData.filter((ele) => ele.category == "POP"));
      console.log(
        "strWeather10Obj = " + JSON.stringify(srtWeatherResponseData)
      );
      setSrtWeather10Obj(srtWeatherResponseData);
      //setIsLoading(false);
    })
    .catch(function (error) {
      console.log("getSrtWeather 실패 : " + error);
    });
});

  return (
    <View style={[styles.ractangle_bg, { height: 550 }]}>
      <View style={styles.content_padding}>
        <Text style={styles.txt_h6_b}>10일 예보</Text>
        <View style={styles.content_weather10_first}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text style={[styles.txt_subtitle1_b, styles.color_weather10_1st]}>
              {moment().format("dddd")}
            </Text>

            <Text
              style={[
                styles.txt_weather10_1st,
                styles.color_weather10_1st,
                { marginLeft: 5, width: 30 },
              ]}
            >
              오늘
            </Text>
          </View>
          <View>
            <Image
              style={{ resizeMode: "contain" }}
              source={
                IMG_WEATHER10_SRC[getWeather10Img(srtWeather10Obj[1].fcstValue)]
                  .image
              }
            />
          </View>

          <View style={{ flexDirection: "row" }}>
            <View style={styles.content_weather10_taMax}>
              <Text style={styles.txt_subtitle1_b}>
                {Math.round(srtWeather10Obj[2].fcstValue)}°
              </Text>
            </View>
            <View style={styles.content_weather10_taMin}>
              <Text style={[styles.txt_subtitle1_r_g]}>
                {Math.round(srtWeather10Obj[0].fcstValue)}°
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.devider_weather10}></View>

        <View style={styles.content_weather10}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text
              style={[styles.txt_subtitle1_b_r, styles.color_weather10_2nd]}
            >
              {moment().add(1, "days").format("dddd")}
            </Text>
            <Text
              style={[
                styles.txt_caption_r_r,
                styles.color_weather10_2nd,
                { marginLeft: 5, width: 30 },
              ]}
            >
              내일
            </Text>
          </View>
          <View>
            <Image
              style={{ resizeMode: "contain" }}
              source={
                IMG_WEATHER10_SRC[getWeather10Img(srtWeather10Obj[4].fcstValue)]
                  .image
              }
            />
          </View>
          <View style={{ flexDirection: "row" }}>
            <View style={styles.content_weather10_taMax}>
              <Text style={styles.txt_subtitle1_b}>
                {Math.round(srtWeather10Obj[5].fcstValue)}°
              </Text>
            </View>
            <View style={styles.content_weather10_taMin}>
              <Text style={[styles.txt_subtitle1_r_g]}>
                {Math.round(srtWeather10Obj[3].fcstValue)}°
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.devider_weather10}></View>

        <View style={styles.content_weather10}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text
              style={[styles.txt_subtitle1_b_r, styles.color_weather10_3rd]}
            >
              {moment().add(2, "days").format("dddd")}
            </Text>
            <Text
              style={[
                styles.txt_caption_r_r,
                styles.color_weather10_3rd,
                { marginLeft: 5, width: 30 },
              ]}
            >
              모레
            </Text>
          </View>
          <View>
            <Image
              style={{ resizeMode: "contain" }}
              source={
                IMG_WEATHER10_SRC[getWeather10Img(srtWeather10Obj[7].fcstValue)]
                  .image
              }
            />
          </View>
          <View style={{ flexDirection: "row" }}>
            <View style={styles.content_weather10_taMax}>
              <Text style={styles.txt_subtitle1_b}>
                {Math.round(srtWeather10Obj[8].fcstValue)}°
              </Text>
            </View>

            <View style={styles.content_weather10_taMin}>
              <Text style={[styles.txt_subtitle1_r_g]}>
                {Math.round(srtWeather10Obj[6].fcstValue)}°
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.devider_weather10}></View>

        <View style={styles.content_weather10}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text style={[styles.txt_subtitle1_b, styles.color_weather10_4th]}>
              {moment().add(3, "days").format("dddd")}
            </Text>
            <Text
              style={[
                styles.txt_caption_r_b,
                styles.color_weather10_4th,
                { marginLeft: 5, width: 30 },
              ]}
            >
              {moment().add(3, "days").format("MM.DD")}
            </Text>
          </View>
          <View>
            <Image
              style={{ resizeMode: "contain" }}
              source={IMG_WEATHER10_SRC[getWeather10Img("wf3Am")].image}
            />
          </View>
          <View style={{ flexDirection: "row" }}>
            <View style={styles.content_weather10_taMax}>
              <Text style={styles.txt_subtitle1_b}>
                {midTaWeatherObj[0].taMax3}°
              </Text>
            </View>
            <View style={styles.content_weather10_taMin}>
              <Text style={[styles.txt_subtitle1_r_g]}>
                {midTaWeatherObj[0].taMin3}°
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.devider_weather10}></View>

        <View style={styles.content_weather10}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text style={[styles.txt_subtitle1_b, styles.color_weather10_5th]}>
              {moment().add(4, "days").format("dddd")}
            </Text>
            <Text
              style={[
                styles.txt_caption_r_b,
                styles.color_weather10_5th,
                { marginLeft: 5, width: 30 },
              ]}
            >
              {moment().add(4, "days").format("MM.DD")}
            </Text>
          </View>
          <View>
            <Image
              style={{ resizeMode: "contain" }}
              source={IMG_WEATHER10_SRC[getWeather10Img("wf4Am")].image}
            />
          </View>
          <View style={{ flexDirection: "row" }}>
            <View style={styles.content_weather10_taMax}>
              <Text style={styles.txt_subtitle1_b}>
                {midTaWeatherObj[0].taMax4}°
              </Text>
            </View>
            <View style={styles.content_weather10_taMin}>
              <Text style={[styles.txt_subtitle1_r_g]}>
                {midTaWeatherObj[0].taMin4}°
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.devider_weather10}></View>

        <View style={styles.content_weather10}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text style={[styles.txt_subtitle1_b, styles.color_weather10_6th]}>
              {moment().add(5, "days").format("dddd")}
            </Text>
            <Text
              style={[
                styles.txt_caption_r_b,
                styles.color_weather10_6th,
                { marginLeft: 5, width: 30 },
              ]}
            >
              {moment().add(5, "days").format("MM.DD")}
            </Text>
          </View>
          <View>
            <Image
              style={{ resizeMode: "contain" }}
              source={IMG_WEATHER10_SRC[getWeather10Img("wf5Am")].image}
            />
          </View>
          <View style={{ flexDirection: "row" }}>
            <View style={styles.content_weather10_taMax}>
              <Text style={styles.txt_subtitle1_b}>
                {midTaWeatherObj[0].taMax5}°
              </Text>
            </View>
            <View style={styles.content_weather10_taMin}>
              <Text style={[styles.txt_subtitle1_r_g]}>
                {midTaWeatherObj[0].taMin5}°
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.devider_weather10}></View>

        <View style={styles.content_weather10}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text style={[styles.txt_subtitle1_b, styles.color_weather10_7th]}>
              {moment().add(6, "days").format("dddd")}
            </Text>
            <Text
              style={[
                styles.txt_caption_r_b,
                styles.color_weather10_7th,
                { marginLeft: 5, width: 30 },
              ]}
            >
              {moment().add(6, "days").format("MM.DD")}
            </Text>
          </View>
          <View>
            <Image
              style={{ resizeMode: "contain" }}
              source={IMG_WEATHER10_SRC[getWeather10Img("wf6Am")].image}
            />
          </View>
          <View style={{ flexDirection: "row" }}>
            <View style={styles.content_weather10_taMax}>
              <Text style={styles.txt_subtitle1_b}>
                {midTaWeatherObj[0].taMax6}°
              </Text>
            </View>
            <View style={styles.content_weather10_taMin}>
              <Text style={[styles.txt_subtitle1_r_g]}>
                {midTaWeatherObj[0].taMin6}°
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.devider_weather10}></View>

        <View style={styles.content_weather10}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text style={[styles.txt_subtitle1_b, styles.color_weather10_8th]}>
              {moment().add(7, "days").format("dddd")}
            </Text>
            <Text
              style={[
                styles.txt_caption_r_b,
                styles.color_weather10_8th,
                { marginLeft: 5, width: 30 },
              ]}
            >
              {moment().add(7, "days").format("MM.DD")}
            </Text>
          </View>
          <View>
            <Image
              style={{ resizeMode: "contain" }}
              source={IMG_WEATHER10_SRC[getWeather10Img("wf7Am")].image}
            />
          </View>
          <View style={{ flexDirection: "row" }}>
            <View style={styles.content_weather10_taMax}>
              <Text style={styles.txt_subtitle1_b}>
                {midTaWeatherObj[0].taMax7}°
              </Text>
            </View>
            <View style={styles.content_weather10_taMin}>
              <Text style={[styles.txt_subtitle1_r_g]}>
                {midTaWeatherObj[0].taMin7}°
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.devider_weather10}></View>

        <View style={styles.content_weather10}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text
              style={[styles.txt_subtitle1_b_r, styles.color_weather10_9th]}
            >
              {moment().add(8, "days").format("dddd")}
            </Text>
            <Text
              style={[
                styles.txt_caption_r_r,
                styles.color_weather10_9th,
                { marginLeft: 5, width: 30 },
              ]}
            >
              {moment().add(8, "days").format("MM.DD")}
            </Text>
          </View>
          <View>
            <Image
              style={{ resizeMode: "contain" }}
              source={IMG_WEATHER10_SRC[getWeather10Img("wf8")].image}
            />
          </View>
          <View style={{ flexDirection: "row" }}>
            <View style={styles.content_weather10_taMax}>
              <Text style={styles.txt_subtitle1_b}>
                {midTaWeatherObj[0].taMax8}°
              </Text>
            </View>
            <View style={styles.content_weather10_taMin}>
              <Text style={[styles.txt_subtitle1_r_g]}>
                {midTaWeatherObj[0].taMin8}°
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.devider_weather10}></View>

        <View style={styles.content_weather10}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text
              style={[styles.txt_subtitle1_b_r, styles.color_weather10_10th]}
            >
              {moment().add(9, "days").format("dddd")}
            </Text>
            <Text
              style={[
                styles.txt_caption_r_r,
                styles.color_weather10_10th,
                { marginLeft: 5, width: 30 },
              ]}
            >
              {moment().add(9, "days").format("MM.DD")}
            </Text>
          </View>
          <View>
            <Image
              style={{ resizeMode: "contain" }}
              source={IMG_WEATHER10_SRC[getWeather10Img("wf9")].image}
            />
          </View>
          <View style={{ flexDirection: "row" }}>
            <View style={styles.content_weather10_taMax}>
              <Text style={styles.txt_subtitle1_b}>
                {midTaWeatherObj[0].taMax9}°
              </Text>
            </View>
            <View style={styles.content_weather10_taMin}>
              <Text style={[styles.txt_subtitle1_r_g]}>
                {midTaWeatherObj[0].taMin9}°
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

export default Weather10Component;
