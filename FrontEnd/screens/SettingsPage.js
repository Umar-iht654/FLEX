import React, {useState} from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity } from 'react-native';
import styles from '../styles/styles';

const SettingsPage = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}>
        <Text style={styles.title}>Settings</Text>
        <TouchableOpacity style={{justifyContent: 'flex-end'}}onPress={() => {navigation.goBack()}}>
            <Text style={styles.title}>Go Back</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
export default SettingsPage;