import React from "react";
import styles from "../styles/styles";
import { View, Image, Text } from "react-native";

function WeatherClothesComponent(props) {
  return (
    <View style={[styles.ractangle_bg, { height: 250 }]}>
      <View style={styles.content_padding}>
        <Text style={styles.txt_h6_b}> 옷차림 예보 </Text>
      </View>
      <View style={styles.content_padding}>
        <Image style={styles.img_clothes} source={props.onRctngle} />
        <View
          style={{
            marginTop: "-25.5%",
            marginLeft: "5.5%",
            marginRight: "5.5%",
          }}
        >
          <Text style={[styles.txt_subtitle2_b, { paddingTop: "5%" }]}>{props.clothesTitle}</Text>
          <Text style={[styles.txt_caption_r, { marginTop: 7 }]}>{props.clothesSub}</Text>
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
          {props.clothesArr.map((arr, i) => (
            <View style={{ flex: 1, alignItems: "center" }}>
              <Image style={styles.img_contain_clothes} source={arr.image} />
              <Text style={props.onText == i ? styles.txt_caption_b : styles.txt_caption_r}>{arr.text}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

export default WeatherClothesComponent;
