import React, {useState, useEffect} from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity } from 'react-native';
import styles from '../styles/styles';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsPage = ({ navigation }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUserData = async () => {
      const storedData = await AsyncStorage.getItem('userDetail');
      if (storedData) {
        setUser(JSON.parse(storedData));
      }
    };

    loadUserData();
  }, []);


  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}>
        <Text style={styles.title}>Settings</Text>
        <TouchableOpacity style={{justifyContent: 'flex-end'}}onPress={() => {navigation.goBack()}}>
            <Text style={styles.title}>Go Back</Text>
        </TouchableOpacity>
      </View>
      {!user ? ( <Text>Loading...</Text> ) : 
      ( <View>
        <Text>Name: {user.full_name}</Text>
        <Text>Username: {user.username}</Text>
        <Text>Email: {user.email}</Text>
        <Text>DOB: {user.DOB}</Text>
        <Text>Postcode: {user.postcode}</Text>
        <Text>Address: {user.address}</Text>
        </View> 
      )} 
    </SafeAreaView>

  );


};
export default SettingsPage;
