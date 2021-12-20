import React, { useCallback, useState } from "react";
import { View, ScrollView, RefreshControl } from "react-native";
import styles from "../styles/styles";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

function HeaderComponent({ children }) {
  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
          <StatusBar style="auto" />
          <View style={styles.header} />
          <View style={styles.content}>{children}</View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
export default HeaderComponent;
