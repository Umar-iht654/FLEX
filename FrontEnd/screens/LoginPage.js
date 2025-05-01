import React, {useState} from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity } from 'react-native';
import styles from '../styles/styles';
import axios from 'axios';

const LoginPage  = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validateError, setValidateError] = useState('');

  const validateLogin = async () => {
    setValidateError('');
    try {
      const response = await axios.post('https://a19e-138-253-184-53.ngrok-free.app/Login', {
        email: email,
        password: password
      });
      if(response.data && response.data.message === "Login successful") {
        setValidateError('');
        navigation.navigate('Home', {user: response.data.user})
      }
    } catch (error) {
      console.log("❌ Error:", error.toJSON ? error.toJSON() : error);
      if (error.response) {
        setValidateError(error.response.data?.detail || 'Something went wrong');
      } else if (error.request) {
        setValidateError('No response from server');
      } else {
        setValidateError('Error setting up request');
      };
    }
  }

  return (
    <SafeAreaView style={styles.safeAreaView}> 
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Login</Text>
        </View>
      </View>

      <View style={styles.form}>
        <View style={styles.input}>
          <Text style={styles.inputLabel}>Email address</Text>
          <TextInput
            style={styles.inputBox}
            placeholder='johnsmith@example.com'
            placeholderTextColor="#6b7280" 
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.input}>
          <Text style={styles.inputLabel}>Password</Text>
          <TextInput secureTextEntry 
            style={styles.inputBox}
            placeholder='password'
            placeholderTextColor="#6b7280"
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            onPress={() => {
              //forgot password function
            }}>
            <Text style={styles.hyperlink}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formAction}>
          {validateError ? (
            <Text style={{ color: 'red', fontSize: 21, marginBottom: 8 }}>
              {validateError}
            </Text>
          ) : null}
          <TouchableOpacity 
            onPress={() => {
              validateLogin();
            }}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Login</Text>
            </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity 
          onPress={() => {
            navigation.navigate('CreateAccount')
          }}>
          <View>
            <Text style={styles.hyperlinkCreateAccount}>Don't have an account? Sign up</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LoginPage;
