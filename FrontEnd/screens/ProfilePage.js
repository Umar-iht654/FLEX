
import React from "react";
import { SafeAreaView, View, Text, StyleSheet } from "react-native";
import styles from '../styles/styles';


const ProfilePage = () => {
  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}>
        <Text style={styles.title}>Profile</Text>
      </View>
    </SafeAreaView>
  );
};
export default ProfilePage;