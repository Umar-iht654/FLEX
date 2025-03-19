import React, {useState} from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity } from 'react-native';
import styles from '../styles/styles';

const TermsAndConditionsPage = ({ navigation }) => {
    return (
      <SafeAreaView style={styles.safeAreaView}>
        <View style={styles.container}>
          <Text style={styles.title}>Terms & Conditions</Text>
        </View>
        <View style={styles.container}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('CreateAccount')
            }}>
            <Text style={[styles.hyperlink, {marginTop:0, margin: 20}]}>Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  };

  export default TermsAndConditionsPage;