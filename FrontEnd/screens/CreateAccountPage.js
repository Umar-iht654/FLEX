import React, { useState } from "react";
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import styles from '../styles/styles';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CreateAccountPage = ({ navigation }) => {
  //stores the data needed to create account for now
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [postcode, setPostcode] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setconfirmPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [validateError, setValidateError] = useState('');
  const [confirmError, setConfirmError] = useState('');

  //allows the t&c confirm button to be toggleable
  const [tacButtonColor, setTacButtonColor] = useState('white');
  const toggleColor = () => {
    setTacButtonColor(prevColor => (prevColor === "white" ? "blue" : "white"));
  };


  const validateEntries = async () => {
    setValidateError('');
    setEmailError('');
    setUsernameError('');
    setPasswordError('');
    setConfirmError('')

    validated = true;
    if (!firstName || !lastName || !newEmail || !dateOfBirth || !postcode || !addressLine || !newUsername || !newPassword || !confirmPassword) {
      setValidateError('Please fill in all fields')
      return;
    }
    setValidateError('');

    try {
      const response = await axios.post('https://fc87-138-253-184-53.ngrok-free.app/checkEmail', { email: newEmail });
      console.log("✅ Server response:", response.data);
      if(response.data.message === "email is available") {
        setEmailError('');
        console.log('email is available')
      }
    }
    catch(error){
      console.log("❌ Error:", error.toJSON ? error.toJSON() : error);
      if (error.response) {
        setEmailError(error.response.data?.detail || 'Something went wrong');
      } else if (error.request) {
        setEmailError('No response from server');
      } else {
        setEmailError('Error setting up request');
      }
      validated = false;
    }
    
    // try {
    //   const response = await axios.post('http://localhost:5000/api/checkUsername', { username: newUsername });
  
    //   if (response.data.message === "username is available") {
    //     setUsernameError('');
    //   }
    // } catch (error) {
    //   setUsernameError(error.response?.data?.detail || 'Something went wrong');
    //   validated = false;
    // } 

    // try {
    //   const response = await axios.post(`http://localhost:5000/api/checkPassword`, { password: newPassword });
    //   if(response.data.message === "password is valid") {
    //     setPasswordError('');
    //     if (newPassword != confirmPassword) {
    //       setConfirmError('Passwords do not match')
    //     }
    //     else {
    //       setConfirmError('')
    //     }
    //   }
    // }
    // catch(error){
    //   setPasswordError(error.response?.data?.detail || 'Something went wrong');
    //   validated = false;
    // }
    if (validated){
      if (tacButtonColor !== 'blue') {
        setValidateError('Please accept Terms and Conditions');
        return;
      }
      const userData = {
        username: newUsername,
        email: newEmail,
        password: newPassword,
        full_name: `${firstName} ${lastName}`,
        address: addressLine,
        DOB: dateOfBirth,
        postcode: postcode
      };

      try {
        const response = await axios.post('https://fc87-138-253-184-53.ngrok-free.app/register', userData);
        if (response.data && response.data.data) {
            navigation.navigate('CreateActivitySelection');
        }
      } catch (error) {
        setValidateError(error.response?.data?.detail || 'Something went wrong');
      }
    }
  }
  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Login')
          }}>
          <Text style={[styles.hyperlink, {marginTop:0, margin: 10}]}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Create Account</Text>
      </View>
      <View style={styles.form}>
        <ScrollView>
          <View style={styles.createAccountInput}>
            <Text style={styles.inputLabel}>First Name</Text>
            <TextInput
              style={styles.inputBox}
              placeholder='john'
              placeholderTextColor="#6b7280"
              value={firstName}
              onChangeText={firstName => setFirstName(firstName)}
            />
          </View>

          <View style={styles.createAccountInput}>
            <Text style={styles.inputLabel}>Last Name</Text>
            <TextInput
              style={styles.inputBox}
              placeholder='smith'
              placeholderTextColor="#6b7280"
              value={lastName}
              onChangeText={lastName => setLastName(lastName)}
            />
          </View>

          <View style={styles.createAccountInput}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <TextInput
                style={styles.inputBox}
                placeholder='johnsmith@example.com'
                placeholderTextColor="#6b7280"
                value={newEmail}
                onChangeText={newEmail => setNewEmail(newEmail)}
              />
              {emailError ? <Text style={{color:'red', fontSize:21}}>{emailError}</Text> :null}
          </View>

          <View style={styles.createAccountInput}>
              <Text style={styles.inputLabel}>Date of Birth</Text>
              <TextInput
                style={styles.inputBox}
                placeholder='DD/MM/YEAR'
                placeholderTextColor="#6b7280"
                value={dateOfBirth}
                onChangeText={dateOfBirth => setDateOfBirth(dateOfBirth)}
              />
          </View>

          <View style={styles.createAccountInput}>
              <Text style={styles.inputLabel}>Postcode</Text>
              <TextInput
                style={styles.inputBox}
                placeholder='postcode'
                placeholderTextColor="#6b7280"
                value={postcode}
                onChangeText={postcode => setPostcode(postcode)}
              />
          </View>

          <View style={styles.createAccountInput}>
              <Text style={styles.inputLabel}>Address Line 1</Text>
              <TextInput
                style={styles.inputBox}
                placeholder='example road, house name/number'
                placeholderTextColor="#6b7280"
                value={addressLine}
                onChangeText={addressLine => setAddressLine(addressLine)}
              />
          </View>

          <View style={styles.createAccountInput}>
              <Text style={styles.inputLabel}>Username</Text>
              <TextInput
                style={styles.inputBox}
                placeholder='johnpoopcock23'
                placeholderTextColor="#6b7280"
                value={newUsername}
                onChangeText={newUsername => setNewUsername(newUsername)}
              />
              {usernameError ? <Text style={{color:'red', fontSize:21}}>{usernameError}</Text> :null}
          </View>

          <View style={styles.createAccountInput}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput secureTextEntry
                style={styles.inputBox}
                placeholder='password'
                placeholderTextColor="#6b7280"
                value={newPassword}
                onChangeText={newPassword => setNewPassword(newPassword)}
              />
              {passwordError ? <Text style={{color:'red', fontSize:21}}>{passwordError}</Text> :null}
          </View>

          <View style={styles.createAccountInput}>
              <Text style={styles.inputLabel}>Confirm Password</Text>
              <TextInput secureTextEntry
                style={styles.inputBox}
                placeholder='confirm password'
                placeholderTextColor="#6b7280"
                value={confirmPassword}
                onChangeText={confirmPassword => setconfirmPassword(confirmPassword)}
              />
              {confirmError ? <Text style={{color:'red', fontSize:21}}>{confirmError}</Text> :null}
          </View>
          <View style={{flexDirection:'row', alignItems:'left', margin:20}}>
            <TouchableOpacity onPress={toggleColor}>
              <View style={{width:20, height: 20, backgroundColor: tacButtonColor}} />
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => {
                  navigation.navigate('TermsAndConditions')
                }}>
                <Text style={[styles.hyperlink, {marginTop:0, margin: 20}]}>Terms & Conditions</Text>
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
                validateEntries();
              }}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>Create Account</Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default CreateAccountPage;
