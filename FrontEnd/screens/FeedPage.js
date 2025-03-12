import React, {useState} from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity } from 'react-native';
import styles from '../styles/styles';

const FeedPage = ( {navigation} ) => {
  return (
    <SafeAreaView style={styles.safeAreaView}>
      <TopBar></TopBar>
      <View style={styles.container}>
        <Text style={styles.title}>Feed</Text>
      </View>
      <View style={[styles.formAction, {justifyContent: 'flex-end'}]}>
        <TouchableOpacity 
          onPress={() => {
            navigation.navigate('Login')
          }}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>return to login page</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
export default FeedScreen;
