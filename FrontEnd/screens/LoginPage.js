import React, {useState} from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity } from 'react-native';
import styles from '../styles/styles';

const LoginPage  = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
          <TouchableOpacity 
            onPress={() => {
              navigation.navigate("Home")
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