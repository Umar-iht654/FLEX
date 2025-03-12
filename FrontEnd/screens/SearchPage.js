import React, {useState} from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity } from 'react-native';
import styles from '../styles/styles';

const SearchScreen = () => <SafeAreaView style={styles.container}><Text style={styles.title}>Search</Text></SafeAreaView>;

const styles = StyleSheet.create({ container: { flex: 1, justifyContent: "center", alignItems: "center" }, title: { fontSize: 24 } });

export default SearchScreen;
