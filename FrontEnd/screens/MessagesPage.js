import React, {useState} from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import styles from '../styles/styles';

const MessagesPage = ({ navigation }) => {
  //contains the current screen
  const [userStreak, setUserStreak] = useState(5);

  const [currentScreen, setCurrentScreen] = useState("groups");
  
  //this data is a placeholder, there should be a function that collects this data from
  //the database so it can be displayed on the screen
  const groupsInfo = [
    {groupID: 1, groupName: 'Group1',profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg', pinned: false, unreadMessageCount: 5},
    {groupID: 2, groupName: 'Group2', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg', pinned: true, unreadMessageCount: 2},
    {groupID: 3, groupName: 'Group3', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg', pinned: true, unreadMessageCount: 0,},
  ]
  const friendsInfo = [
    {friendID: 1, friendName: 'Friend1',profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg', pinned: true, unreadMessageCount: 2},
    {friendID: 2, friendName: 'Friend2',profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg', pinned: true, unreadMessageCount: 5},
    {friendID: 3, friendName: 'Friend3',profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg', pinned: false, unreadMessageCount: 5},
    {friendID: 4, friendName: 'Friend4',profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg', pinned: false, unreadMessageCount: 10},
    {friendID: 5, friendName: 'Friend5',profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg', pinned: false, unreadMessageCount: 0},
    {friendID: 6, friendName: 'Friend6',profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg', pinned: false, unreadMessageCount: 0},
    {friendID: 7, friendName: 'Friend7',profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg', pinned: false, unreadMessageCount: 0},
    {friendID: 8, friendName: 'Friend8',profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg', pinned: false, unreadMessageCount: 1},
    
  ]

  //opens the chat page
  function OpenChat(chatName, chatID, chatPF){
    navigation.navigate('Chat', { chatName, chatID, chatPF })
  }

  //renders the chat card
  const ChatCard = ({ID, name, profilePicture, pinned, unreadMessageCount}) => {
    return(
      <TouchableOpacity onPress={() => {OpenChat(name, ID, profilePicture)}}>

        {/*chat card container*/}
        <View style={messagesPageStyles.infoCardContainer}>

          {/*profile picture and name*/}
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image style={messagesPageStyles.infoCardProfilePicture} source={{ uri: profilePicture}}/>
            <Text style={messagesPageStyles.infoCardName}>{name}</Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>

            {/*only shows the number of unread if there are unread messages*/}
            {unreadMessageCount != 0 && (
              <View style={messagesPageStyles.numOfMessagesContainer}>
                <Text style={messagesPageStyles.numOfMessagesText}>{unreadMessageCount}</Text>
              </View>
            )}

            {/*shows the pinned chat icon if the chat is pinned*/}
            {pinned && (
              <Image style={messagesPageStyles.pinnedIcon} source={require('../assets/PinIcon.png')}/>
            )}
          </View>
        </View>
      </TouchableOpacity>
    )
  }
  return (
    <SafeAreaView style={[styles.safeAreaView, {justifyContent: 'flex-start', alignItems: 'center'}]}>

      {/*Top Bar*/}
      <View style={styles.topBar}>

        {/*Displays Streak*/}
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image style={styles.streakIcon} source={require('../assets/StreakIcon.png')}/>
          <Text style={styles.streakNumber}>{userStreak}</Text>
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
            {/*Shows list of groups*/}
            <View style={{alignItems: 'center'}}>
              {groupsInfo.map(group=> (
              <ChatCard
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
              <ChatCard
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
    justifyContent: 'flex-start'
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
    marginTop: 10, 
    marginBottom: 15,
    borderRadius: 15, 
    flexDirection: 'row',
    justifyContent: 'space-between',
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