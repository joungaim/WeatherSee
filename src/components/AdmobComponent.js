import React from "react";
import { AdMobBanner, AdMobInterstitial, PublisherBanner, AdMobRewarded, setTestDeviceIDAsync } from "expo-ads-admob";

import { Platform } from "react-native";

const adBannerUnitId = Platform.OS === "android" ? "ca-app-pub-3940256099942544/6300978111" : "ca-app-pub-3940256099942544/2934735716"; // 광고 ID 입력

function AdmobComponent() {
  return (
    <AdMobBanner
      bannerSize="banner"
      adUnitID={adBannerUnitId} // Test ID, Replace with your-admob-unit-id
      servePersonalizedAds // true or false
      onDidFailToReceiveAdWithError={(err) => {
        console.log(err);
      }}
      style={{ borderRadius: 14, marginTop: 10, alignItems: "center", justifyContent: "center" }}
    />
  );
}

export default AdmobComponent;
