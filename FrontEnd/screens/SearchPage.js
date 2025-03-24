import React, {useState} from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity } from 'react-native';
import styles from '../styles/styles';

const SearchPage = () => {
    return (
      <SafeAreaView style={styles.safeAreaView}>

        <View style={styles.container}>
          <Text style={styles.title}>Search</Text>
        </View>
      </SafeAreaView>
    );
  };

export default SearchPage;
