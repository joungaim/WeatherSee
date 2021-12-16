import React from "react";
import { AsyncStorage } from "react-native";

const KEY_VALUE = "@isFirstLaunch21";

/**
 * 앱 최초 실행 여부 조회 함수
 * 로직 :
 *  1. "@isFirstLaunch" 쿠키 값 조회
 *    1-1. 해당 쿠키 값이 없으면 앱 최초 실행이다. 해당 쿠키 값이 없을 경우 true 저장 후 true 반환
 *    1-2. 해당 쿠키 값이 있으면 최초 실행이 아니다. 아무 동작도 하지 않고, false 반환
 *    1-3. 혹여 에러가 나도 false를 반환
 */
export default async function CheckFirstLaunch() {
  try {
    const isFirstLaunched = await AsyncStorage.getItem(KEY_VALUE);
    if (isFirstLaunched === null) {
      AsyncStorage.setItem(KEY_VALUE, "true");
      return true;
    }
    return false;
  } catch (error) {
    console.log(" CheckFirstLaunch Error :" + error);
    return false;
  }
}
