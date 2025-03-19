import React from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity } from 'react-native';
import styles from '../styles/styles';

const ActivityLogPage = () => {
    return (
      <SafeAreaView style={styles.safeAreaView}>
        <View style={styles.container}>
          <Text style={styles.title}>Activity Log</Text>
        </View>
      </SafeAreaView>
    );
  };

  export default ActivityLogPage;