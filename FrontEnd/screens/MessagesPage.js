import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import styles from '../styles/styles';

const MessagesPage = ({ navigation, route }) => {
  //contains the current screen
  const {user} = route.params;
  const [userStreak, setUserStreak] = useState(5);
  const [weather, setWeather] = useState('4°');

  const [currentScreen, setCurrentScreen] = useState("groups");
  
  //this data is a placeholder, there should be a function that collects this data from
  //the database so it can be displayed on the screen
  const [groupsInfo, setGroupsInfo] = useState([]);
  const [friendsInfo, setFriendsInfo] = useState([]);

  //opens the chat page
  function OpenChat( chatType, chatName){
    navigation.navigate('Chat', { chatType, chatName, user })
  }

  function UploadPageInfo(username){
    const newGroupsInfo = [
      {groupID: 1, groupName: 'Group1',profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg', unreadMessageCount: 5},
      {groupID: 2, groupName: 'Group2', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg', unreadMessageCount: 2},
      {groupID: 3, groupName: 'Group3', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg', unreadMessageCount: 0,},
    ]
    setGroupsInfo(newGroupsInfo);

    const newFriendsInfo = [
      {friendID: 1, friendName: 'Friend1',profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg', unreadMessageCount: 2},
      {friendID: 2, friendName: 'Friend2',profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg', unreadMessageCount: 5},
      {friendID: 3, friendName: 'Friend3',profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg', unreadMessageCount: 5},
      {friendID: 4, friendName: 'Stan the man',profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/2023_Watter_Holger_Prof._Dr._x1_53_Quadrat.jpg', unreadMessageCount: 10},
      {friendID: 5, friendName: 'Friend5',profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg', unreadMessageCount: 0},
      {friendID: 6, friendName: 'Friend6',profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg', unreadMessageCount: 0},
      {friendID: 7, friendName: 'Friend7',profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg', unreadMessageCount: 0},
      {friendID: 8, friendName: 'Friend8',profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg', unreadMessageCount: 1},
    ]
    setFriendsInfo(newFriendsInfo);
  }

  //renders the chat card
  const GroupChatCard = ({ID, name, profilePicture, pinned, unreadMessageCount}) => {
    return(
      <TouchableOpacity onPress={() => {OpenChat("group", name)}}>

        {/*chat card container*/}
        <View style={messagesPageStyles.infoCardContainer}>

          {/*profile picture and name*/}
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {profilePicture ? (
              <Image style={messagesPageStyles.infoCardProfilePicture} source={{ uri: profilePicture }} />
              ) : (
                <View style={[messagesPageStyles.infoCardProfilePicture, {backgroundColor: 'gray'}]}/>
            )}
            <Text style={messagesPageStyles.infoCardName}>{name}</Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>

            {/*only shows the number of unread if there are unread messages*/}
            {unreadMessageCount != 0 && (
              <View style={messagesPageStyles.numOfMessagesContainer}>
                <Text style={messagesPageStyles.numOfMessagesText}>{unreadMessageCount}</Text>
              </View>
            )}

          </View>
        </View>
      </TouchableOpacity>
    )
  }

  const FriendChatCard = ({ID, name, profilePicture, pinned, unreadMessageCount}) => {
    return(
      <TouchableOpacity onPress={() => {OpenChat("friend", name)}}>

        {/*chat card container*/}
        <View style={messagesPageStyles.infoCardContainer}>

          {/*profile picture and name*/}
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {profilePicture ? (
              <Image style={messagesPageStyles.infoCardProfilePicture} source={{ uri: profilePicture }} />
              ) : (
                <View style={[messagesPageStyles.infoCardProfilePicture, {backgroundColor: 'gray'}]}/>
            )}
            <Text style={messagesPageStyles.infoCardName}>{name}</Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>

            {/*only shows the number of unread if there are unread messages*/}
            {unreadMessageCount != 0 && (
              <View style={messagesPageStyles.numOfMessagesContainer}>
                <Text style={messagesPageStyles.numOfMessagesText}>{unreadMessageCount}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  useEffect(() => {
    UploadPageInfo("user");
  }, []);

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
        </View>
      </View>

      {/*Displays Main Container*/}
      <View style={messagesPageStyles.overlayBox}>

        {/*Displays two chat options, group and friend*/}
        <View style={{flexDirection: 'row', alignItems: 'center'}}>

          {/*Groups Option*/}
          <TouchableOpacity style={[messagesPageStyles.optionButton, {backgroundColor: currentScreen == 'groups' ? '#E5E5E5' : 'gray'}]} onPress={() => {setCurrentScreen("groups")}}>
            <Text style={messagesPageStyles.MenuOptionText}>Groups</Text>
          </TouchableOpacity>
          
          {/*Friends Option*/}
          <TouchableOpacity style={[messagesPageStyles.optionButton, {backgroundColor: currentScreen == 'friends' ? '#E5E5E5' : 'gray',}]} onPress={() => {setCurrentScreen("friends")}}>
            <Text style={messagesPageStyles.MenuOptionText}>Friends</Text>
          </TouchableOpacity>
        </View>

        {/*Group Screen*/}
        {currentScreen === 'groups' && (
          <ScrollView>
            <View style={{width: '100%', alignItems: 'flex-end', padding: 16}}>
              <TouchableOpacity style={{width: '100%'}}onPress={()=>{navigation.navigate("CreateGroup", {user:user})}}>
                <View style={{height: 60, width: '100%', backgroundColor: 'teal', borderRadius: 12, borderWidth: 2, alignItems: 'center', justifyContent: 'center'}}>
                  <Text style={messagesPageStyles.buttonText}>Create Group</Text>
                </View>
              </TouchableOpacity>
            </View>
            {/*Shows list of groups*/}
            <View style={{alignItems: 'center'}}>
              {groupsInfo.map(group=> (
              <GroupChatCard
                key = {group.groupID}
                ID = {group.groupID}
                name = {group.groupName}
                profilePicture = {group.profilePicture}
                pinned = {group.pinned}
                unreadMessageCount = {group.unreadMessageCount}
              />
              ))}
            </View>
          </ScrollView>
        )}

        {/*Friend Screen*/}
        {currentScreen === 'friends' && (
          <ScrollView>
            {/*Shows list of friends*/}
            <View style={{alignItems: 'center'}}>
            {friendsInfo.map(friend=> (
              <FriendChatCard
                key = {friend.friendID}
                ID = {friend.friendID}
                name = {friend.friendName}
                profilePicture = {friend.profilePicture}
                pinned = {friend.pinned}
                unreadMessageCount = {friend.unreadMessageCount}
              />
            ))}
          </View>
        </ScrollView>
        )}
      </View>

    </SafeAreaView>
  );
};

const messagesPageStyles = StyleSheet.create({
  //container box for the page
  overlayBox: {
    width: '95%', 
    height: '88%', 
    backgroundColor: '#E5E5E5', 
    borderRadius: 15, 
    justifyContent: 'flex-start',
    overflow: 'hidden'
  },
  //menu options
  MenuOptionText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#1e1e1e',
    marginBottom: 8,
    textAlign: 'center',
  },
  optionButton: {
    width: '50%', 
    height: 100, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  //group/friend details
  infoCardContainer:{
    width: '90%', 
    height: 80, 
    backgroundColor: '#D7D7D7', 
    marginTop: 8, 
    marginBottom: 8,
    borderRadius: 15, 
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 2
  },
  infoCardProfilePicture:{
    width: 50,
    height: 50,
    borderRadius: 50,
    marginLeft:10,
    marginRight: 10
  },
  infoCardName:{
    fontSize: 30,
    fontWeight: '700',
    color: '#1e1e1e',
    marginRight: 15
  },
  buttonText:{
    fontSize: 24,
    fontWeight: '700',
    color: '#1e1e1e',
    marginRight: 15
  },
  numOfMessagesContainer:{
    width: 32, 
    height: 32, 
    borderRadius: 15, 
    backgroundColor: 'red',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  numOfMessagesText:{
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
  pinnedIcon: {
    width: 40,
    height: 40,
    borderRadius: 15,
    marginRight: 10
  }
})
export default MessagesPage;
