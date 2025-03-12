
import React from "react";
import { SafeAreaView, Text, StyleSheet } from "react-native";



const ProfilePage = () => {
  return (
    <SafeAreaView style={styles.safeAreaView}>
      <TopBar></TopBar>
      <View style={styles.container}>
        <Text style={styles.title}>Profile</Text>
      </View>
    </SafeAreaView>
  );
};
export default ProfilePage;