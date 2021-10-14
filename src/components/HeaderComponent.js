import React from "react";
import { StyleSheet, View, ScrollView, SafeAreaView } from "react-native";
import { StatusBar } from "expo-status-bar";

function HeaderComponent({ children }) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <StatusBar style="auto" />
        <View style={styles.header} />
        <View style={styles.content}>{children}</View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },

  header: {
    height: 10,
  },

  content: {
    flex: 1,
  },
});

export default HeaderComponent;
