import React, { useState } from "react";
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import styles from '../styles/styles';

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

  //allows the t&c confirm button to be toggleable
  const [tacButtonColor, setTacButtonColor] = useState('white');
  const toggleColor = () => {
    setTacButtonColor(prevColor => (prevColor === "white" ? "blue" : "white"));
  };
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
            <TouchableOpacity 
              onPress={() => {
                navigation.navigate("CreateActivitySelection")
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
