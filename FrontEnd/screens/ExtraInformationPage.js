
import React, { useState, useCallback } from "react";
import { SafeAreaView, View, Text, Image, TouchableOpacity, ScrollView, Modal, StyleSheet, TextInput } from "react-native";
import { useFocusEffect, useRoute } from '@react-navigation/native';
import styles from '../styles/styles';
import data from '../styles/localdata';
import axios from 'axios';


const ExtraInformationPage = ({ navigation, route }) => {
    const { user } = route.params;
    const [bio, setBio] = useState();
    const [profilePic, setProfilePic] = useState('https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg');

    async function uploadBio(){
        try {
            const response = await axios.post('https://390d-138-253-184-53.ngrok-free.app/setProfile', {username: user.username ,bio:bio, profile:profilePic});
            if(response.data && response.data.message) {
                navigation.navigate('Home', { user: user });
            }
        } catch (error) {
            console.error("❌ Error uploading bio:", error.response?.data || error.message || error);
        }
                
    };

    return (
        <SafeAreaView style={styles.safeAreaView}>
            <View style={styles.container}>

                <Text style={styles.title}>Extra Information</Text>
            </View> 
            <View style={createGroupPageStyles.form}>
                <ScrollView>

                    <View style={createGroupPageStyles.createAccountInput}>
                        <Text style={createGroupPageStyles.inputLabel}>Bio</Text>
                        <TextInput
                            style={createGroupPageStyles.expandableInputBox}
                            placeholder='max 100 characters'
                            placeholderTextColor="#6b7280"
                            value={bio}
                            onChangeText={bio => setBio(bio)}
                            multiline={true}
                            maxLength={100}
                        />
                    </View>
                    
                    <View style={{width: '100%', padding: 24}}>
                    <TouchableOpacity onPress={()=>{uploadBio()}}>
                        <View style={createGroupPageStyles.selectActivitiesButton}>
                            <Text style={{}}>Create Account</Text>
                        </View>
                    </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

const createGroupPageStyles = StyleSheet.create({

    input: {
        marginBottom: 16,
        margin: 20,
    },
    createAccountInput: {
        marginBottom: 10,
        margin: 20,
    },
    inputLabel:{
        fontSize: 17,
        fontWeight: '600',
        color: '#222',
        marginBottom: 8,
    },
    inputBox:{
        height: 60,
        width: '100%',
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        borderRadius: 12,
        fontSize: 15,
        fontWeight: '500',
        color: '#222',
        elevation: 10
    },
    
    expandableInputBox:{
        minHeight: 60,
        width: '100%',
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        borderRadius: 12,
        fontSize: 15,
        fontWeight: '500',
        color: '#222',
        elevation: 10
    },
    selectActivitiesButton:{
        height: 60,
        width: '100%',
        backgroundColor: 'teal',
        paddingHorizontal: 16,
        borderRadius: 12,
        elevation: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    form: {
        marginBottom: 24,
        flex: 1,
    },
    formAction: {
        marginTop: 50,
        marginVertical: 24,
        marginHorizontal: 20

    },
    button:{
        height: 60,
        width: '100%',
        backgroundColor: '#075eec',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#075eec',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff'

    },
    activityTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: 'gray',
        marginBottom: 2,
        textAlign: 'left',
    },
    
});
export default ExtraInformationPage;