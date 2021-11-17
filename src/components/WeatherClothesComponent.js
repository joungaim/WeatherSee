import React from "react";
import { View, Image, Text } from "react-native";
import moment from "moment";
import styles from "../styles/styles";
import { IMG_CLOTHES_ON_SRC, IMG_CLOTHES_RCTNGL_SRC } from "../ImageSrc";

/**
 * 옷차림 예보용
 * 1. 28도 이상 (여름) 아주더운 한여름 날씨에요! 민소매, 반팔 반바지, 스커트 등의 얇은 옷이 좋아요.
 * 2. 23~ 27도 (초여름)  버틸만한 더위에요! 반팔, 얇은 셔츠, 반바지, 면바지 등이 좋겠어요.
 * 3. 18~ 22도 (초가을)  활동하기 너무 좋은 날씨에요! 긴팔티, 청바지, 면바지에 쌀쌀하면 가디건도 괜찮아요.
 * 4. 12~ 17도 (봄, 가을)  밤에는 추워요! 맨투맨, 니트, 가디건, 재킷, 야상, 스타킹 등이 좋아요.
 * 5. 6~ 11도 (겨울)  쌀쌀해졌어요! 트렌치코트, 경량 패딩, 가죽자켓, 내복, 레깅스 등이 좋겠어요.
 * 6. 5도 ~ -1도 (겨울)  춥다 추워! 두꺼운 코트, 패딩, 목도리, 모자, 기모 제품이 필요해요
 * 7. -1 ~ (한겨울)  무장이 필요해요! 롱패딩, 내복, 털모자, 목도리, 장갑으로 무장해요.
 */
function WeatherClothesComponent(props) {
  const srtWeather0200Arr = props.srtWeather0200Arr;

  const crntMnth = moment().format("MM"); //현재 달
  let tmx = 0;
  let tmn = 0;
  let basedTemp = 0;
  let onIcon = 0; //활성화 시킬 아이콘
  let onText; // 활성화 시킬 아이콘 밑 텍스트
  let onRctngle; //활성화 시킬 말풍선
  let clothesTitle = ""; //말풍선 안에 들어갈 제목
  let clothesSub = ""; // 말풍선 안에 들어갈 설명
  let loaded = false;

  // 옷차림 예보 비활성화 옷(회색) 아이콘 경로
  let IMG_CLOTHES_OFF_SRC = [
    {
      text: "민소매",
      image: require("../../assets/img/clothes/clothes0_g.png"),
    },
    {
      text: "반팔",
      image: require("../../assets/img/clothes/clothes1_g.png"),
    },
    {
      text: "긴팔",
      image: require("../../assets/img/clothes/clothes2_g.png"),
    },
    {
      text: "맨투맨",
      image: require("../../assets/img/clothes/clothes3_g.png"),
    },
    {
      text: "자켓",
      image: require("../../assets/img/clothes/clothes4_g.png"),
    },
    {
      text: "코트",
      image: require("../../assets/img/clothes/clothes5_g.png"),
    },
    {
      text: "롱패딩",
      image: require("../../assets/img/clothes/clothes6_g.png"),
    },
  ];

  if (srtWeather0200Arr != "empty") {
    loaded = true;
    tmx = srtWeather0200Arr.tmx; //오늘 최고기온
    tmn = srtWeather0200Arr.tmn; //오늘 최저기온
    basedTemp = tmx - (tmx - tmn) / 2; //오늘 평균 기온 ex. 31 28일때, 중간온도를 구하기 위해 31-28=3 / 3/2=1.5 / 31-1.5=29.5가 오늘의 평균 기온이다.

    if (basedTemp >= 28) {
      onIcon = 0;
      clothesTitle = "아주더운 한여름 날씨에요!";
      clothesSub = "민소매, 반팔 반바지, 스커트 등의 얇은 옷이 좋아요.";
    } else if (23 <= basedTemp && basedTemp < 28) {
      onIcon = 1;
      clothesTitle = "버틸만한 더위에요!";
      clothesSub = "반팔, 얇은 셔츠, 반바지, 면바지로 시원하게 입어요.";
    } else if (18 <= basedTemp && basedTemp < 23) {
      onIcon = 2;
      clothesTitle = "활동하기 너무 좋은 날씨에요!";
      clothesSub = "긴팔티, 청바지, 면바지에 쌀쌀하면 가디건도 괜찮아요.";
    } else if (12 <= basedTemp && basedTemp < 18) {
      onIcon = 3;
      clothesTitle = "밤에는 추워요!";
      clothesSub = "맨투맨, 니트, 가디건, 재킷, 야상으로 멋도 열도 잡아요";
    } else if (6 <= basedTemp && basedTemp < 12) {
      onIcon = 4;
      clothesTitle = "쌀쌀해요!";
      clothesSub = "트렌치코트, 경량 패딩, 가죽자켓, 레깅스로 따뜻하게 입어요.";
    } else if (-1 <= basedTemp && basedTemp < 6) {
      onIcon = 5;
      clothesTitle = "춥다 추워!";
      clothesSub = "두꺼운 코트, 패딩, 목도리, 모자, 기모 제품이 필요해요.";
    } else if (basedTemp < -1) {
      onIcon = 6;
      clothesTitle = "무장이 필요해요!";
      clothesSub = "롱패딩, 내복, 털모자, 목도리, 장갑으로 무장해요.";
    }
    // console.log(
    //   "clothesArr :" + IMG_CLOTHES_OFF_SRC + ", onRctngle : " + onRctngle + ", clothesTitle : " + clothesTitle + ", clothesSub : " + clothesSub + ", onText : " + onText + ", onIcon : " + onIcon
    // );

    IMG_CLOTHES_OFF_SRC[onIcon].image = IMG_CLOTHES_ON_SRC[onIcon].image;
    if (4 <= crntMnth && crntMnth <= 10) {
      onRctngle = IMG_CLOTHES_RCTNGL_SRC[onIcon].image;
      IMG_CLOTHES_OFF_SRC = IMG_CLOTHES_OFF_SRC.slice(0, 5);
      onText = onIcon;
    } else {
      onRctngle = IMG_CLOTHES_RCTNGL_SRC[onIcon - 2].image;
      IMG_CLOTHES_OFF_SRC = IMG_CLOTHES_OFF_SRC.slice(2);
      onText = onIcon - 2;
    }
  }

  return (
    loaded && (
      <View style={[styles.ractangle_bg, { height: 250 }]}>
        <View style={styles.content_padding}>
          <Text style={styles.txt_h6_b}> 옷차림 예보 </Text>
        </View>
        <View style={styles.content_padding}>
          <Image style={styles.img_clothes} source={onRctngle} />
          <View
            style={{
              marginTop: "-25.5%",
              marginLeft: "5.5%",
              marginRight: "5.5%",
            }}
          >
            <Text style={[styles.txt_subtitle2_b, { paddingTop: "5%" }]}>{clothesTitle}</Text>
            <Text style={[styles.txt_caption_r, { marginTop: 7 }]}>{clothesSub}</Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              marginTop: "15%",
              marginLeft: "2.5%",
              marginRight: "2.5%",
              justifyContent: "space-between",
            }}
          >
            {IMG_CLOTHES_OFF_SRC.map((arr, i) => (
              <View style={{ flex: 1, alignItems: "center" }}>
                <Image style={styles.img_contain_clothes} source={arr.image} />
                <Text style={onText == i ? styles.txt_caption_b : styles.txt_caption_r}>{arr.text}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    )
  );
}

export default WeatherClothesComponent;
