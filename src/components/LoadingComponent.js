import * as React from "react";
import { Text, View, StatusBar, Platform, Animated, Easing } from "react-native";
import styles from "../styles/styles";

export default function LoadingComponent() {
  spinValue = new Animated.Value(0);

  // First set up animation
  Animated.loop(
    Animated.timing(this.spinValue, {
      toValue: 1,
      duration: 4000,
      easing: Easing.linear, // Easing is an additional import from react-native
      useNativeDriver: true, // To make use of native driver for performance
    })
  ).start();

  // Next, interpolate beginning and end values (in this case 0 and 1)
  const spin = this.spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const statusBarStyle = Platform.OS === "ios" ? "dark-content" : "auto";
  return (
    <View style={styles.container_load}>
      <StatusBar barStyle={statusBarStyle} />
      <Animated.Image style={{ resizeMode: "contain", transform: [{ rotate: spin }] }} source={require("../../assets/img/loading/sun.png")} />
      <Text style={styles.txt_load}>Day See</Text>
    </View>
  );
}
