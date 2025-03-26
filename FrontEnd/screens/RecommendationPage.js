import React, {useState} from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import styles from '../styles/styles';

const RecommendationPage = ( {navigation} ) => {
  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}>
        <View style={{flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: '100%', height: 100}}>
            <TouchableOpacity onPress={() => {navigation.goBack()}}>
                <Image style={recommendationPageStyles.backArrow} source={require('../assets/BackArrow.png')}/>
            </TouchableOpacity>
            <Text style={recommendationPageStyles.title}>Recommendation Page</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const recommendationPageStyles = StyleSheet.create({
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1e1e1e',
        marginBottom: 8,
        textAlign: 'center',
    },
    backArrow: {
        width: 50,
        height: 50,
        
    }
})
export default RecommendationPage;