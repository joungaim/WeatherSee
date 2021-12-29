import React from "react";

/**
 * 인자의 Null 여부 체크
 * return :
 *  1. false : 인자 값이 Null 값
 *  2. ture : 인자 값이 비어있지 않음
 */
export default function CheckNotNull(value) {
  if (value == "" || value == null || value == undefined || (value != null && typeof value == "object" && !Object.keys(value).length) || !value) {
    return false;
  } else {
    return true;
  }
}
