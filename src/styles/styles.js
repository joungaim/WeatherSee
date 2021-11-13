import React from "react";
import { StyleSheet } from "react-native";
import moment from "moment";
import "moment/locale/ko";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },

  header: {
    height: 10,
  },
  wrapper: { height: 90 },
  slide1: { height: 90 },
  slide2: { height: 90 },
  content: {
    flex: 1,
  },

  content_weather: {
    flex: 1,
    paddingTop: "10%",
    paddingBottom: "20%",
    marginLeft: "5%",
    alignItems: "flex-start",
  },

  content_padding: {
    paddingLeft: "4.5%",
    paddingRight: "4.5%",
  },

  content_padding_row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: "4.5%",
    paddingRight: "4.5%",
  },

  content_weather10_first: {
    paddingTop: "5%",
    justifyContent: "space-between",
    flexDirection: "row",
  },

  content_weather10: {
    paddingTop: "4%",
    justifyContent: "space-between",
    flexDirection: "row",
  },

  content_weather10_taMax: {
    width: 30,
    alignItems: "flex-end",
  },

  content_weather10_taMin: {
    width: 32,
    alignItems: "flex-end",
  },

  content_umbrella: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  devider: {
    borderBottomColor: "#CCCCCC",
    borderBottomWidth: 0.6,
    paddingTop: "5%",
  },

  devider_weather3: {
    borderBottomColor: "#CCCCCC",
    borderBottomWidth: 1,
    width: 45,
  },

  devider_weather10: {
    borderBottomColor: "#CCCCCC",
    borderBottomWidth: 0.6,
    paddingTop: "4%",
  },

  txt_weather: {
    fontFamily: "NotoSansKR_300Light",
    fontSize: 85,
    color: "white",
    height: 105,
    margin: 0,
    padding: 0,
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
    paddingTop: "5%",
  },

  txt_subtitle1_b: {
    fontFamily: "NotoSansKR_700Bold",
    fontSize: 18,
    color: "black",
    lineHeight: 22,
  },

  txt_subtitle1_b_r: {
    fontFamily: "NotoSansKR_700Bold",
    fontSize: 18,
    color: "#FF3B30",
    lineHeight: 22,
  },

  txt_subtitle1_r: {
    fontFamily: "NotoSansKR_400Regular",
    fontSize: 18,
    color: "black",
    lineHeight: 22,
  },

  txt_subtitle1_r_g: {
    fontFamily: "NotoSansKR_400Regular",
    fontSize: 18,
    color: "#8A8A8E",
    lineHeight: 22,
  },

  txt_subtitle2_r: {
    fontFamily: "NotoSansKR_500Medium",
    fontSize: 14,
    color: "black",
  },

  txt_subtitle2_b: {
    fontFamily: "NotoSansKR_700Bold",
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

  txt_body2_b: {
    fontFamily: "NotoSansKR_700Bold",
    fontSize: 14,
    color: "black",
    lineHeight: 19,
  },

  txt_caption_r: {
    fontSize: 12,
    color: "#85858C",
    fontFamily: "NotoSansKR_400Regular",
    lineHeight: 15,
  },

  txt_caption_sb: {
    fontSize: 12,
    color: "#0E0E0E",
    fontFamily: "NotoSansKR_500Medium",
    lineHeight: 15,
  },

  txt_caption_r_r: {
    fontSize: 12,
    color: "#FF3B30",
    fontFamily: "NotoSansKR_400Regular",
    lineHeight: 15,
  },

  txt_caption_r_b: {
    fontSize: 12,
    color: "black",
    fontFamily: "NotoSansKR_400Regular",
    lineHeight: 15,
  },

  txt_caption_b: {
    fontSize: 12,
    color: "black",
    fontFamily: "NotoSansKR_700Bold",
    lineHeight: 15,
  },

  txt_overline_r: {
    fontSize: 10,
    color: "#85858C",
    fontFamily: "NotoSansKR_400Regular",
    lineHeight: 14,
  },

  //   txt_weather10_1st: {
  //     fontSize: 12,
  //     color:
  //       moment().format("dddd") == ("토요일" || "일요일") ? "#FF3B30" : "black",
  //     fontFamily: "NotoSansKR_400Regular",
  //     lineHeight: 15,
  //   },

  color_weather10_1st: {
    color: moment().format("dddd") == "토요일" || moment().format("dddd") == "일요일" ? "#FF3B30" : "black",
  },

  color_weather10_2nd: {
    color: moment().add(1, "days").format("dddd") == "토요일" || moment().add(1, "days").format("dddd") == "일요일" ? "#FF3B30" : "black",
  },

  color_weather10_3rd: {
    color: moment().add(2, "days").format("dddd") == "토요일" || moment().add(2, "days").format("dddd") == "일요일" ? "#FF3B30" : "black",
  },

  color_weather10_4th: {
    color: moment().add(3, "days").format("dddd") == "토요일" || moment().add(3, "days").format("dddd") == "일요일" ? "#FF3B30" : "black",
  },

  color_weather10_5th: {
    color: moment().add(4, "days").format("dddd") == "토요일" || moment().add(4, "days").format("dddd") == "일요일" ? "#FF3B30" : "black",
  },

  color_weather10_6th: {
    color: moment().add(5, "days").format("dddd") == "토요일" || moment().add(5, "days").format("dddd") == "일요일" ? "#FF3B30" : "black",
  },

  color_weather10_7th: {
    color: moment().add(6, "days").format("dddd") == "토요일" || moment().add(6, "days").format("dddd") == "일요일" ? "#FF3B30" : "black",
  },

  color_weather10_8th: {
    color: moment().add(7, "days").format("dddd") == "토요일" || moment().add(7, "days").format("dddd") == "일요일" ? "#FF3B30" : "black",
  },

  color_weather10_9th: {
    color: moment().add(8, "days").format("dddd") == "토요일" || moment().add(8, "days").format("dddd") == "일요일" ? "#FF3B30" : "black",
  },

  color_weather10_10th: {
    color: moment().add(9, "days").format("dddd") == "토요일" || moment().add(9, "days").format("dddd") == "일요일" ? "#FF3B30" : "black",
  },

  ractangle_wrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 90,
  },

  ractangle1: {
    backgroundColor: "#007AFF",
    flexDirection: "row",
    borderRadius: 14,
    height: 203,
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    paddingLeft: "5%",
    paddingRight: "5%",
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
    marginTop: 10,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  ractangle_detail: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    backgroundColor: "#F3F3F9",
    width: "100%",
    borderRadius: 14,
    marginTop: 20,
    height: 68,
  },

  ractangle_weather3: {
    flex: 1,
    backgroundColor: "#F3F3F9",
    borderRadius: 14,
    marginTop: 20,
    width: 80,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },

  ractangle_weather3_margin: {
    flex: 1,
    backgroundColor: "#F3F3F9",
    borderRadius: 14,
    marginTop: 20,
    width: 80,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },

  ractangle_weather3_text: {
    flex: 1,
    marginTop: 20,
    width: 80,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },

  contain_detail: {
    flex: 1.3,
    alignItems: "flex-start",
  },

  img_weathericon: {
    flex: 1,
    resizeMode: "contain",
  },

  img_detail: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    resizeMode: "contain",
  },

  img_detail_wind: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    resizeMode: "contain",
    marginLeft: "3%",
  },

  img_weather3: {
    flex: 1,
    resizeMode: "contain",
    marginLeft: "15%",
    marginRight: "15%",
    marginTop: "15%",
    marginBottom: "10%",
  },

  img_contain: {
    resizeMode: "contain",
  },

  img_contain_clothes: {
    resizeMode: "contain",
    marginBottom: 5,
  },

  img_clothes: {
    width: "100%",
    resizeMode: "stretch",
    marginTop: "7%",
    paddingBottom: 5,
    paddingTop: 5,
  },
});

export default styles;
