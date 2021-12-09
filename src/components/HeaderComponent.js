import React from "react";
import { View, ScrollView } from "react-native";
import styles from "../styles/styles";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

function HeaderComponent({ children }) {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
          <StatusBar style="auto" />
          <View style={styles.header} />
          <View style={styles.content}>{children}</View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
export default HeaderComponent;
