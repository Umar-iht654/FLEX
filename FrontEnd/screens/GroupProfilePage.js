import React, { useState, useCallback } from "react";
import { SafeAreaView, View, Text, Image, TouchableOpacity, ScrollView, Modal, StyleSheet, } from "react-native";
import { useFocusEffect, useRoute } from '@react-navigation/native';
import styles from '../styles/styles';
import axios from 'axios';

const GroupProfilePage = ({ navigation, route}) => {
    const { user, group } = route.params;

    const [memberData, setMemberData] = useState([]);
    const [groupInfo, setGroupInfo] = useState([]);
    const [userRelationship, setUserRelationship] = useState("");

    const [userStreak, setUserStreak] = useState('5');
    const [weather, setWeather] = useState('4°');

    function returnToPage(){
        navigation.goBack();
    }


    const addMember = async () => {
        const addData = {
            groupname: group,
            username: user.username
        };
    
        try {
            const response = await axios.post('https://54e5-138-253-184-53.ngrok-free.app/addMember', addData);
            if (response.data && response.data.data) {
                window.location.reload(false)
            }
        } catch (error) {
            console.error("❌ Error creating group:", error);
        }
    }

    function removeMember(){
        setUserRelationship(false)
        console.log("Member Removed")
    }

    function openGroup(newGroupID){
        navigation.push('GroupProfile', { user: user, userID: newGroupID});
    }

    function openProfile(newProfileID){
        navigation.push('UserProfile', {user: user, friendUSN: newProfileID});
    }


    async function UploadPageInfo() {
        const newGroupInfo = {
            username: group.group_name,
            bio: group.bio,
            profilePic: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg',
            activityName: group.activity,
            isPrivate: 0,
        };
        setGroupInfo(newGroupInfo);

        try {
            const response = await axios.post('https://933c-138-253-184-53.ngrok-free.app/groupProfile', {user_usn: user.username ,user2_usn:group.group_name });
            if(response.data && response.data.message) {
                const newGroupInfo = {
                    username: response.data.group.group_name,
                    bio: response.data.group.bio,
                    profilePic: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg',
                    activityName: response.data.group.activity,
                    isPrivate: 0,
                };
                setGroupInfo(newGroupInfo);

                const members = response.data.members
                const isMember = response.data.isMember

                const newMemberData = members.map(member => ({
                    username: member.user_username, profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg'
                }))
                setMemberData(newMemberData);
            }
        } catch (error) {
            console.error("❌ Error fetching members:", error.response?.data || error.message || error);
        }
        // const newMemberData = [
        //     { userID: 1, username: 'Pee Pee Wherman', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
        //     { userID: 2, username: 'Dan Scooterist', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
        //     { userID: 3, username: 'Luka Scumperlot', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
        //     { userID: 4, username: 'Gooper Gooperson', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
        //     { userID: 5, username: 'Sickalicka trying', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
        //     { userID: 6, username: 'Sir Yemen', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
        //     { userID: 7, username: 'Timothy Skelton', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
        //     { userID: 8, username: 'Lenny Crapperson', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
        //     { userID: 9, username: 'Milo Biggers', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
        //     { userID: 10, username: 'Carlos Swindler', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
        //     { userID: 11, username: 'Jimmy Pickles', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
        //     { userID: 12, username: 'Billy McNugget', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
        //     { userID: 13, username: 'Maddie Two-Times', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
        //     { userID: 14, username: 'Vince Vermin', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
        //     { userID: 15, username: 'Fiona Biggins', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
        //     { userID: 16, username: 'Chuck Banter', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
        //     { userID: 17, username: 'Zane Crankford', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
        //     { userID: 18, username: 'Bea Wiggler', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
        //     { userID: 19, username: 'Oscar Baggins', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
        //     { userID: 20, username: 'Tina Wallflower', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
        //     { userID: 21, username: 'Zoe Fizzbin', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
        //     { userID: 22, username: 'Alex Sweets', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
        //     { userID: 23, username: 'Nina Stepperson', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' }
        // ];
        // setMemberData(newMemberData);

        setUserRelationship(true);

    }

    const FriendCard = ({username, profilePicture}) => {
        return (
            <TouchableOpacity onPress={() => {openProfile(username)}}>
                <View style={{flexDirection: "row", height: 60, backgroundColor: '#d1d1d1', borderWidth: 1, alignItems: 'center', borderRadius: 12, marginBottom: 6}}>
                    <Image style={groupProfileStyles.popupItemProfilePicture} source={{ uri: profilePicture}}/>
                    <Text style={groupProfileStyles.popupItemText}>{username}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    
    useFocusEffect(
        useCallback(() => {
            // This function will run every time the screen is focused
            UploadPageInfo("group");
            console.log("navigated to")
        }, [])
    );
    return (
        <SafeAreaView style={[styles.safeAreaView, {justifyContent: 'flex-start', alignItems: 'center'}]}>
            {/*Top Bar*/}
            <View style={styles.topBar}>
                {/*Displays Streak*/}
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image style={styles.streakIcon} source={require('../assets/StreakIcon.png')}/>
                    <Text style={styles.streakNumber}>{userStreak}</Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    {/*Displays Weather*/}
                    <Text style={styles.temperatureText}>{weather}</Text>
                    <Image style={styles.weatherIcon} source={require('../assets/WeatherIcon.png')}/>
                    {/*Displays Settings Button*/}
                    <TouchableOpacity onPress={() => {navigation.navigate("Settings")}}>
                        <Image style={styles.settingsIcon} source={require('../assets/Settings.png')}/>
                    </TouchableOpacity>
                </View>
            </View>

            {/*Overlay box*/}
            <View style={groupProfileStyles.overlayBox}>
                <ScrollView>
                    <TouchableOpacity onPress={() => {returnToPage()}}>
                        <View style={{marginTop: 10, marginLeft: 10}}>
                            <Text style={groupProfileStyles.hyperlink}>back</Text>
                        </View>
                    </TouchableOpacity>
                    {/*profile picture/username/bio display*/}
                    <View style={{alignItems: 'center', marginTop: 24}}>

                        {/*Profile picture*/}
                        {groupInfo.profilePic ? (
                            <Image style={groupProfileStyles.profilePicture} source={{ uri: groupInfo.profilePic }} />
                        ) : (
                            <View style={[groupProfileStyles.profilePicture, {backgroundColor: 'gray'}]}/>
                        )}

                        {/*Username and Bio*/}
    
                        <Text style={groupProfileStyles.usernameText}>{groupInfo.username}</Text>
                        <Text style={groupProfileStyles.locationText}>{groupInfo.activityName}</Text>
                        <Text style={groupProfileStyles.bioText}>{groupInfo.bio}</Text>
                    </View>
                    <View style={{flexDirection: 'row', width: '100%', marginTop: 24}}>
                        {!userRelationship && (
                            <TouchableOpacity style={{width: '100%'}} onPress={()=> {addMember()}}>
                                <View style={{width: '100%', height: 60, backgroundColor: 'teal', borderRadius: 12, alignItems: 'center', justifyContent: 'center'}}>
                                    <Text style={groupProfileStyles.joinButtonText}>Join Group</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                        {userRelationship && (
                            <TouchableOpacity style={{width: '100%'}} onPress={()=> {removeMember()}}>
                                <View style={{width: '100%', height: 60, backgroundColor: 'teal', borderRadius: 12, alignItems: 'center', justifyContent: 'center'}}>
                                    <Text style={groupProfileStyles.joinButtonText}>Leave Group</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                        
                    </View>
                    <View style={{marginVertical: 24, width: '100%', height: 2, backgroundColor: '#383838'}}/>
                    {((userRelationship)) && (
                        <View style={{width: '100%'}}>
                            {memberData.map(member=> (
                            <FriendCard
                                key = {member.userID}
                                username = {member.username}
                                profilePicture = {member.profilePicture}
                            />
                            ))}
                        </View>
                    )}

                </ScrollView>
            </View>

                    
        </SafeAreaView>

        
        
    );
};

const groupProfileStyles = StyleSheet.create({
    overlayBox: {
        width: '95%', 
        height: '88%', 
        backgroundColor: '#E5E5E5', 
        borderRadius: 20, 
        justifyContent: 'flex-start',
        padding: 24
    },
    //profile information
    profilePicture:{
        width: 180,
        height: 180,
        borderRadius: 100,
        borderWidth: 1
    },
    usernameText: {
            fontSize: 36,
            fontWeight: '700',
            color: '#1e1e1e',
            marginBottom: 8,
            textAlign: 'left',
    },
    activityText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#828282',
        marginBottom: 8,
        textAlign: 'left',
    },
    locationText: {
        fontSize: 20,
        fontWeight: '700',
        color: '#595959',
        marginBottom: 8,
        textAlign: 'left',
    },
    bioText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#1e1e1e',
        marginBottom: 8,
        textAlign: 'center',
        width: 300
    },
    joinButtonText: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1e1e1e',
        textAlign: 'center',
    },
    //info box
    infoBoxOutline: {
        width: 100, 
        height: 100, 
        backgroundColor: "teal", 
        borderRadius: 14, 
        justifyContent: "center", 
        alignItems: "center",
    },
    infoBoxTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1e1e1e',
        marginBottom: 8,
        textAlign: 'center',
    },
    infoBoxNumber: {
        fontSize: 35,
        fontWeight: '700',
        color: '#1e1e1e',
        marginBottom: 8,
        textAlign: 'center',
    },
    //headers
    recentActivitiesHeader: {
        fontSize: 30,
        fontWeight: '700',
        color: '#1e1e1e',
        marginBottom: 8,
        textAlign: 'center',
        marginTop: 10,
        textDecorationLine: 'underline'
    },
    showMoreButton: {
        fontSize: 24,
        fontWeight: '700',
        textAlign: 'center',
        color: 'gray', 
        textDecorationLine: 'underline',
        marginTop: 20, 
        marginBottom: 20,
    },
    //activity cards
    activityCardOutline: {
        width: '90%', 
        height: 200, 
        elevation: 5, 
        borderRadius: 15, 
        backgroundColor: '#D7D7D7', 
        marginTop: 15
    },
    activityTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1e1e1e',
        marginBottom: 2,
        textAlign: 'center',
    },
    activityTimeInformation: {
        fontSize: 10,
        fontWeight: '700',
        color: '#1e1e1e',
        marginBottom: 2,
        marginLeft: 5,
        textAlign: 'center',
    },
    activityIcon: {
        width: 50, 
        height: 50, 
        backgroundColor: 'teal', 
        borderRadius: 8,
        marginLeft: 5
    },
    activityAge: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1e1e1e',
        marginBottom: 8,
        marginRight: 10,
        textAlign: 'center',
    },
    activityScoreContainer1: {
        width: 60, 
        height: 50, 
        borderRadius: 15, 
        backgroundColor: 'orange', 
        justifyContent: 'center'
    },
    activityScoreContainer2: {
        width: 60, 
        height: 50, 
        borderRadius: 15, 
        backgroundColor: 'green', 
        justifyContent: 'center'
    },
    activityScoreContainer3: {
        width: 60, 
        height: 50, 
        borderRadius: 15, 
        backgroundColor: 'yellow', 
        justifyContent: 'center'
    },
    activityScoreText: {
        fontSize: 30,
        fontWeight: '700',
        color: '#1e1e1e',
        marginBottom: 8,
        textAlign: 'center',
    },
    contributingUsersButton: {
        marginTop: 10,
        fontsize: 16,
        fontWeight: '600',
        color: 'blue',
        textDecorationLine: 'underline',
        textAlign: 'center'
    },
    //popup (friend, groups and activity extra information screen)
    popupScreenBackground: {
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: "rgba(0,0,0,0.8)"
    },
    popupScreenOutline: {
        width: '70%', 
        height: '70%', 
        backgroundColor: 'white', 
        borderRadius: 20
    },
    popupScreenTitle: {
        fontSize: 50,
        fontWeight: '700',
        color: '#1e1e1e',
        marginBottom: 8,
        textAlign: 'center',
    },
    popupScreenDoneButton: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1e1e1e',
        marginBottom: 8,
        textAlign: 'center',
        textDecorationLine: 'underline'
    },
    popupItemProfilePicture: {
        width: 25,
        height: 25,
        borderRadius: 50,
        marginLeft:10
    },
    popupItemText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1e1e1e',
        marginLeft: 10,
        textAlign: 'center',
    }
    
});
export default GroupProfilePage;