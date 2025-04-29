
import React, { useState, useCallback } from "react";
import { SafeAreaView, View, Text, Image, TouchableOpacity, ScrollView, Modal, StyleSheet, TextInput } from "react-native";
import { useFocusEffect, useRoute } from '@react-navigation/native';
import styles from '../styles/styles';
import data from '../styles/localdata';


const CreateGroupPage = ({ navigation }) => {

    const [groupName, setGroupName] = useState();
    const [bio, setBio] = useState();
    const [groupActivity, setGroupActivity] = useState();


    const activities = data.activities.map(activity => activity.name);
    const [activitiesVisable, setActivitiesVisable] = useState(false);

    const ActivityCard = ({ activityName }) => {
        return(
            <View style={{width: '100%', height: 60, backgroundColor: '#fff', borderRadius: 12, borderWidth: 2, justifyContent: 'center', padding: 24}}>
                <Text style={createGroupPageStyles.activityTitle}>{activityName}</Text>
            </View>
        )
    }
    return (
        <SafeAreaView style={styles.safeAreaView}>
            <View style={styles.container}>
                <TouchableOpacity
                onPress={() => {
                    navigation.goBack();
                }}>
                <Text style={[styles.hyperlink, {marginTop:0, margin: 10}]}>Back</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Create Group</Text>
            </View>
            <View style={createGroupPageStyles.form}>
                <ScrollView>
                    <View style={createGroupPageStyles.createAccountInput}>
                        <Text style={createGroupPageStyles.inputLabel}>Group Name</Text>
                        <TextInput
                        style={createGroupPageStyles.inputBox}
                        placeholder='Enter Name'
                        placeholderTextColor="#6b7280"
                        value={groupName}
                        onChangeText={groupName => setGroupName(groupName)}
                        />
                    </View>

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
                    <TouchableOpacity style={{width: '100%', padding: 24}} onPress={() => {setActivitiesVisable(prev => !prev)}}>
                        <View style={createGroupPageStyles.selectActivitiesButton}>
                            <Text> Select Activity</Text>
                        </View>
                    </TouchableOpacity>

                    {activitiesVisable && (
                        <View style={{alignItems: 'center', padding: 24}}>
                            {activities.map((activity, index)=> (
                            <ActivityCard
                                key = {index}
                                activityName = {activity}
                            />
                            ))}
                        </View>
                    )}
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
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        borderRadius: 12,
        elevation: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    form: {
        marginBottom: 24,
        flex: 1
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
        fontSize: 24,
        fontWeight: '700',
        color: '#1e1e1e',
        marginBottom: 2,
        textAlign: 'flex-start',
    }
    
});
export default CreateGroupPage;