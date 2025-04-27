import React, {useState, useCallback} from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import styles from '../styles/styles';

const GroupChatInfoPage = ({ navigation }) => {

    const route = useRoute();
    const { groupName, groupPF } = route.params;
    const [members, setMembers] = useState([]);
    function GetMembers() {
        const membersInfo = [
            {userID: 1, username: 'User1', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg'},
            {userID: 2, username: 'User2', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg'},
            {userID: 3, username: 'User3', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg'},
            {userID: 4, username: 'User4', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg'},
            {userID: 5, username: 'User5', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg'},
            {userID: 6, username: 'User6', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg'},
            {userID: 7, username: 'User7', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg'},
        ];
        setMembers(membersInfo);
    };

    useFocusEffect(
        useCallback(() => {
            // This function will run every time the screen is focused
            GetMembers();
        }, [])
    );
    const UserCard = ({ username, profilePicture }) => {
        return(
            <View style={{flexDirection: "row", alignItems: 'center',backgroundColor: '#dfdfdf', padding: 10, borderWidth: 1, borderColor: 'gray'}}>
                <Image style={groupChatInfoStyles.popupItemProfilePicture} source={{ uri: profilePicture}}/>
                <Text style={groupChatInfoStyles.popupItemText}>{username}</Text>
            </View>
        )
    }
    return(
        <SafeAreaView style={[styles.safeAreaView, {justifyContent: 'center', alignItems: 'center'}]}>
            <View style={groupChatInfoStyles.container}>
                <View style={groupChatInfoStyles.titleContainer}>
                    <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center',}}>
                        <TouchableOpacity onPress={() => {navigation.goBack()}}>
                            <Image style={groupChatInfoStyles.backArrow} source={require('../assets/BackArrow.png')}/>
                        </TouchableOpacity>
                    </View>
                </View>
                <ScrollView>
                    <View style={{alignItems: 'center', marginTop: 10}}>
                        <Image style={groupChatInfoStyles.profilePicture} source={{ uri: groupPF}}/>
                        <Text style={groupChatInfoStyles.title}>{groupName}</Text>
                    </View>
                    <View style={{marginTop: 20}}>
                        {members.map(member=> (
                        <UserCard
                            key = {member.userID}
                            username = {member.username}
                            profilePicture = {member.profilePicture}
                        />
                        ))}
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    )
};

const groupChatInfoStyles = StyleSheet.create({
    container: {
        width: '85%',
        height: '85%',
        backgroundColor: '#E5E5E5', 
        borderRadius: 12,
        overflow: 'hidden'
    },
    titleContainer: {
        height: 50,
        backgroundColor: '#c4c4c4',
        width: '100%',
        justifyContent: 'center'
    },
    backArrow: {
        width: 50,
        height: 50
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#797979',
        textAlign: 'center'
    },
    popupItemProfilePicture: {
        width: 50,
        height: 50,
        borderRadius: 50,
        marginLeft:10
      },
    popupItemText: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1e1e1e',
        marginBottom: 8,
        marginLeft: 10,
        textAlign: 'center',
    },
    profilePicture: {
        width: 180,
        height: 180,
        borderRadius: 100,
        borderWidth: 1
    }
});

export default GroupChatInfoPage;
