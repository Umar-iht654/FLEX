import React, {useState} from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity } from 'react-native';
import styles from '../styles/styles';

const MessagesPage = () => {
  return (
    <SafeAreaView style={styles.safeAreaView}>
      <TopBar></TopBar>
      <View style={styles.container}>
        <Text style={styles.title}>Messages</Text>
      </View>
    </SafeAreaView>
  );
};
export default MessagesPage;