import React, { useState, useCallback } from "react";
import { SafeAreaView, View, Text, Image, TouchableOpacity, ScrollView, Modal, StyleSheet, } from "react-native";
import { useFocusEffect, useRoute } from '@react-navigation/native';
import styles from '../styles/styles';
import axios from 'axios';


const ProfilePage = ({ navigation, route }) => {
  const { user } = route.params;


  const [friendOverlayVisable, setFriendOverlayVisable] = useState(false);
  const [groupOverlayVisable, setGroupOverlayVisable] = useState(false);
  const [activityOverlayVisable, setActivityOverlayVisable] = useState(false);
  const [participantOverlayVisable, setParticipantOverlayVisible] = useState(false);
  //this is a placeholder, there should be a function that can be called to collect all the data below from the database


  const [userInfo, setUserInfo] = useState({
    username: '',
    bio: '',
    profilePic: '',
    loggedActivitiesCount: 0,
  });

  const [activityLog, setActivityLog] = useState([]);
  const [currentActivityNumber, setCurrentActivityNumber] = useState(5);
  
  const [userStreak, setUserStreak] = useState('5');
  const [weather, setWeather] = useState('4°');
  const [friendData, setFriendData] = useState([]);
  const [groupData, setGroupData] = useState([]);
  const [activityData, setActivityData] = useState([]);
  const [userRelationship, setUserRelationship] = useState([]);
  const [currentParticipants, setCurrentParticipants] = useState([[]]);
  //should upload the user data from the database
  async function UploadPageInfo () {
    try {
      const response = await axios.post('https://1383-138-253-184-53.ngrok-free.app/getProfile', { username: user.username });
      if(response.data && response.data.message) {

        const userProf = response.data.userP;
        const friends = response.data.friends;
        const groups = response.data.groups;
        const activities = response.data.activities;

        const newUserInfo = {
          username: user.username,
          bio: userProf.bio,
          loggedActivitiesCount: response.data.activityCount,
          profilePic: userProf.profile_picture || ''
        }
        setUserInfo(newUserInfo);

        const newFriendData = friends.map(friend => ({
          username: friend.friend_username,
          profilePicture:'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg'
        }));
        setFriendData(newFriendData);

        const newGroupData = groups.map(group => ({
          groupname: group.group_name,
          profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg'
        }));
        setGroupData(newGroupData);

        const newActivityData = activities.map(activity => ({
          activityname: activity.name
        }));
        setActivityData(newActivityData);

        setUserRelationship('friend');
      }
    } catch (error) {
    }

  //  profilePic: 'https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg'
     
   

    // const newFriendData = [
    //   { userID: 1, username: 'Pee Pee Wherman', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
    //   { userID: 2, username: 'Dan Scooterist', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
    //   { userID: 3, username: 'Luka Scumperlot', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
    //   { userID: 4, username: 'Gooper Gooperson', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
    //   { userID: 5, username: 'Sickalicka trying', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
    //   { userID: 6, username: 'Sir Yemen', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
    //   { userID: 7, username: 'Timothy Skelton', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
    //   { userID: 8, username: 'Lenny Crapperson', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
    //   { userID: 9, username: 'Milo Biggers', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
    //   { userID: 10, username: 'Carlos Swindler', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
    //   { userID: 11, username: 'Jimmy Pickles', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
    //   { userID: 12, username: 'Billy McNugget', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
    //   { userID: 13, username: 'Maddie Two-Times', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
    //   { userID: 14, username: 'Vince Vermin', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
    //   { userID: 15, username: 'Fiona Biggins', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
    //   { userID: 16, username: 'Chuck Banter', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
    //   { userID: 17, username: 'Zane Crankford', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
    //   { userID: 18, username: 'Bea Wiggler', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
    //   { userID: 19, username: 'Oscar Baggins', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
    //   { userID: 20, username: 'Tina Wallflower', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
    //   { userID: 21, username: 'Zoe Fizzbin', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
    //   { userID: 22, username: 'Alex Sweets', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
    //   { userID: 23, username: 'Nina Stepperson', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' }
    // ];
    // setFriendData(newFriendData);

    // const newGroupData = [
    //   { groupname: 'The Footy Dwellers', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
    //   { groupname: 'Scarcity Tennis', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
    //   { groupname: 'Manchester Maddens', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/d/d8/Sai_mahotsav_manjhanpur.jpg?20231128214559' },
    //   { groupname: 'Badboyminton', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
    //   { groupname: 'Cycling Skeletons', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
    //   { groupname: 'Krazy Kenyans', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
    //   { groupname: 'Slapping Sailors', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
    // ];
    // setGroupData(newGroupData);

    // const newActivityData = [
    //   { activityname: 'Tennis'},
    //   { activityname: 'Football'},
    //   { activityname: 'Cycling'},
    //   { activityname: 'Running'},
    //   { activityname: 'Shuffle Board'},
    //   { activityname: 'Tap Dancing'},
    // ];
    // setActivityData(newActivityData);

    setUserRelationship('friend');

  }

  

  function openProfile(newUserID){
    navigation.push('UserProfile', { userID: newUserID });
  }

  function openGroup(newGroupID){
    navigation.push('GroupProfile', { groupID: newGroupID });
  }
  //retrieves user activities from the database
  function UploadActivities(isInitial){
    const newActivityLog = [
      {
        activityID: 1, activityName: 'Activity 1', dateTime: 'Date/Time', age: 'Xd', duration: 'duration', participants: [
          [ [ [0,'user1'], [1,'user2'], [0,'user3'] ], 3],
          [ [ [0,'user1'], [1,'user2'], [0,'user3'] ], 7],
        ]
      },
      {
        activityID: 2, activityName: 'Activity 2', dateTime: 'Date/Time', age: 'Xd', duration: 'duration', participants: [
          [ [ [0,'user1'], [1,'user2'], [0,'user3'] ], 5],
          [ [ [0,'user1'], [1,'user2'], [0,'user3'] ], 18],
          [ [ [0,'user1'], [1,'user2'], [0,'user3'] ], 7],
        ]
      },
      {
        activityID: 3, activityName: 'Activity 3', dateTime: 'Date/Time', age: 'Xd', duration: 'duration', participants: [
          [ [ [0,'user1'] ], 2],
        ]
      },
      {
        activityID: 4, activityName: 'Activity 4', dateTime: 'Date/Time', age: 'Xd', duration: 'duration', participants: [
          [ [ [0,'user1'], [1,'user2'], [0,'user3'] ], 2],
          [ [ [0,'user1'], [1,'user2'], [0,'user3'], [0,'user3'] ], 9],
        ]
      },
      {
        activityID: 5, activityName: 'Activity 5', dateTime: 'Date/Time', age: 'Xd', duration: 'duration', participants: [
          [ [ [0,'user1'], [1,'user2'], [0,'user3'] ], 27],
          [ [ [0,'user1'], [1,'user2'], [0,'user3'] ], 2],
        ]
      },
      {
        activityID: 6, activityName: 'Activity 6', dateTime: 'Date/Time', age: 'Xd', duration: 'duration', participants: [
          [ [ [0,'user1'], [1,'user2'], [0,'user3'] ], 3],
          [ [ [0,'user1'], [1,'user2'], [0,'user3'] ], 7],
          
        ]
      },
      {
        activityID: 7, activityName: 'Activity 7', dateTime: 'Date/Time', age: 'Xd', duration: 'duration', participants: [
          [ [ [0,'user1'], [1,'user2'], [0,'user3'] ], 3],
          [ [ [0,'user1'], [1,'user2'], [0,'user3'] ], 7],
        ]
      },
      {
        activityID: 8, activityName: 'Activity 8', dateTime: 'Date/Time', age: 'Xd', duration: 'duration', participants: [
          [ [ [0,'user1'], [1,'user2'], [0,'user3'] ], 3],
          [ [ [0,'user1'], [1,'user2'], [0,'user3'] ], 7],
        ]
      },
      {
        activityID: 9, activityName: 'Activity 9', dateTime: 'Date/Time', age: 'Xd', duration: 'duration', participants: [
          [ [ [0,'user1'], [1,'user2'], [0,'user3'] ], 3],
          [ [ [0,'user1'], [1,'user2'], [0,'user3'] ], 7],
        ]
      },
      {
        activityID: 10, activityName: 'Activity 10', dateTime: 'Date/Time', age: 'Xd', duration: 'duration', participants: [
          [ [ [0,'user1'], [1,'user2'], [0,'user3'] ], 3],
          [ [ [0,'user1'], [1,'user2'], [0,'user3'] ], 7],
        ]
      },
      {
        activityID: 11, activityName: 'Activity 11', dateTime: 'Date/Time', age: 'Xd', duration: 'duration', participants: [
          [ [ [0,'user1'], [1,'user2'], [0,'user3'] ], 3],
          [ [ [0,'user1'], [1,'user2'], [0,'user3'] ], 7],
        ]
      },
      {
        activityID: 12, activityName: 'Activity 12', dateTime: 'Date/Time', age: 'Xd', duration: 'duration', participants: [
          [ [ [0,'user1'], [1,'user2'], [0,'user3'] ], 3],
          [ [ [0,'user1'], [1,'user2'], [0,'user3'] ], 7],
        ]
      },
      {
        activityID: 13, activityName: 'Activity 13', dateTime: 'Date/Time', age: 'Xd', duration: 'duration', participants: [
          [ [ [0,'user1'], [1,'user2'], [0,'user3'] ], 3],
          [ [ [0,'user1'], [1,'user2'], [0,'user3'] ], 7],
        ]
      },
      {
        activityID: 14, activityName: 'Activity 14', dateTime: 'Date/Time', age: 'Xd', duration: 'duration', participants: [
          [ [ [0,'user1'], [1,'user2'], [0,'user3'] ], 3],
          [ [ [0,'user1'], [1,'user2'], [0,'user3'] ], 7],
        ]
      },
      {
        activityID: 15, activityName: 'Activity 15', dateTime: 'Date/Time', age: 'Xd', duration: 'duration', participants: [
          [ [ [0,'user1'], [1,'user2'], [0,'user3'] ], 3],
          [ [ [0,'user1'], [1,'user2'], [0,'user3'] ], 7],
        ]
      },
      {
        activityID: 16, activityName: 'Activity 16', dateTime: 'Date/Time', age: 'Xd', duration: 'duration', participants: [
          [ [ [0,'user1'], [1,'user2'], [0,'user3'] ], 3],
          [ [ [0,'user1'], [1,'user2'], [0,'user3'] ], 7],
        ]
      },
      {
        activityID: 17, activityName: 'Activity 17', dateTime: 'Date/Time', age: 'Xd', duration: 'duration', participants: [
          [ [ [0,'user1'], [1,'user2'], [0,'user3'] ], 3],
          [ [ [0,'user1'], [1,'user2'], [0,'user3'] ], 7],
        ]
      },
      {
        activityID: 18, activityName: 'Activity 18', dateTime: 'Date/Time', age: 'Xd', duration: 'duration', participants: [
          [ [ [0,'user1'], [1,'user2'], [0,'user3'] ], 3],
          [ [ [0,'user1'], [1,'user2'], [0,'user3'] ], 7],
        ]
      },
      {
        activityID: 19, activityName: 'Activity 19', dateTime: 'Date/Time', age: 'Xd', duration: 'duration', participants: [
          [ [ [0,'user1'], [1,'user2'], [0,'user3'] ], 3],
          [ [ [0,'user1'], [1,'user2'], [0,'user3'] ], 7],
        ]
      },
      {
        activityID: 20, activityName: 'Activity 20', dateTime: 'Date/Time', age: 'Xd', duration: 'duration', participants: [
          [ [ [0,'user1'], [1,'user2'], [0,'user3'] ], 3],
          [ [ [0,'user1'], [1,'user2'], [0,'user3'] ], 7],
        ]
      },
      {
        activityID: 21, activityName: 'Activity 21', dateTime: 'Date/Time', age: 'Xd', duration: 'duration', participants: [
          [ [ [0,'user1'], [1,'user2'], [0,'user3'] ], 3],
          [ [ [0,'user1'], [1,'user2'], [0,'user3'] ], 7],
        ]
      },
      {
        activityID: 22, activityName: 'Activity 22', dateTime: 'Date/Time', age: 'Xd', duration: 'duration', participants: [
          [ [ [0,'user1'], [1,'user2'], [0,'user3'] ], 3],
          [ [ [0,'user1'], [1,'user2'], [0,'user3'] ], 7],
        ]
      },
      {
        activityID: 23, activityName: 'Activity 23', dateTime: 'Date/Time', age: 'Xd', duration: 'duration', participants: [
          [ [ [0,'user1'], [1,'user2'], [0,'user3'] ], 3],
          [ [ [0,'user1'], [1,'user2'], [0,'user3'] ], 7],
        ]
      },
      {
        activityID: 24, activityName: 'Activity 24', dateTime: 'Date/Time', age: 'Xd', duration: 'duration', participants: [
          [ [ [0,'user1'], [1,'user2'], [0,'user3'] ], 3],
          [ [ [0,'user1'], [1,'user2'], [0,'user3'] ], 7],
        ]
      },
    ]
    if(isInitial){
      setCurrentActivityNumber(5)
    }
    setActivityLog(newActivityLog.slice(0, currentActivityNumber));
    setCurrentActivityNumber(prev => prev+5);

  }

  const ParticipantCard = ({participant}) => {
    return(
      <View style={{width: '90%', height: 60, backgroundColor: '#b5bdb5', borderRadius: 12, padding: 12, marginBottom: 10, justifyContent: 'center', alignItems: 'flex-start'}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={{width: 30, height: 30, borderRadius: 50, backgroundColor: 'gray'}}></View>
          <Text style={profilePageStyles.participantNameText}>{participant[1]}</Text>
        </View>
      </View>
    )
  }
  const ActivityScoreCard = ({participantCount, participant}) => {
    const thisBackgroundColor = participantCount === 0 ? 'green'
      : participantCount === 1 ? 'orange'
      : participantCount === 2 ? 'blue'
      : participantCount === 3 ? 'yellow'
      : 'gray';
    return(
      <TouchableOpacity onPress={() => {
        setCurrentParticipants(participant[0])
        setParticipantOverlayVisible(true)
      }}>
        <View style={[profilePageStyles.activityScoreContainer1, {backgroundColor: thisBackgroundColor}]}>
          <Text style={profilePageStyles.activityScoreText}>{participant[1]}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  //The card that shows details about the users activities
  const ActivityDataCard = (props) => {
    return (
      <View style={profilePageStyles.activityCardOutline}>
        {/*Displays information about the activity at the top of the card*/}
        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 10}}>
          <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
            <View style={{flexDirection: 'column', alignItems: 'flex-start', marginLeft: 10}}>
              <Text style={profilePageStyles.activityTitle}>{props.activityName}</Text>
              <Text style={profilePageStyles.activityTimeInformation}>{props.dateTime}</Text>
              <Text style={profilePageStyles.activityTimeInformation}>{props.duration}</Text>
            </View>
            <View style={profilePageStyles.activityIcon}/>
          </View>
          <Text style={profilePageStyles.activityAge}>{props.age}</Text>
        </View>

        {/*Display scores*/}
        <View styles={{width: '100%', alignItems: 'center'}}>
          <Text style={[profilePageStyles.activityTitle, {textDecorationLine: 'underline', color: '#8f8f8f'}]}>Scores</Text>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start', marginTop: 10}}>
          {props.participants.map((participant, index) => (
            <ActivityScoreCard
              key={index}
              participantCount={index}
              participant={participant}
            />
          ))}
        </View>

      </View>
    );
  };

  //The buttons which show the users friend, group and activity count
  const InfoBox = ({name, count}) => {
    return (
      <View style={profilePageStyles.infoBoxOutline}>
        <Text style={profilePageStyles.infoBoxTitle}>{name}</Text>
        <Text style={profilePageStyles.infoBoxNumber}>{count}</Text>
      </View>
    );
  };

  const FriendCard = ({username, profilePicture}) => {
    return (
      <TouchableOpacity onPress={() => {openProfile(username)}}>
        <View style={{flexDirection: "row", height: 60, backgroundColor: '#d1d1d1', borderWidth: 1, alignItems: 'center', borderRadius: 12, marginBottom: 6}}>
          <Image style={profilePageStyles.popupItemProfilePicture} source={{ uri: profilePicture}}/>
          <Text style={profilePageStyles.popupItemText}>{username}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const GroupCard = ({groupname, profilePicture}) => {
    return (
      <TouchableOpacity onPress={() => {openGroup(groupname)}}>
        <View style={{flexDirection: "row", height: 60, backgroundColor: '#d1d1d1', borderWidth: 1, alignItems: 'center', borderRadius: 12, marginBottom: 6}}>
          <Image style={profilePageStyles.popupItemProfilePicture} source={{ uri: profilePicture}}/>
          <Text style={profilePageStyles.popupItemText}>{groupname}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const ActivityCard = ({activityname}) => {
    return (
      <View style={{flexDirection: "row", height: 60, backgroundColor: '#d1d1d1', borderWidth: 1, alignItems: 'center', borderRadius: 12, marginBottom: 6}}>
        <View style={[profilePageStyles.popupItemProfilePicture, {backgroundColor: 'teal'}]}/>
        <Text style={profilePageStyles.popupItemText}>{activityname}</Text>
      </View>
    );
  };

  useFocusEffect(
    useCallback(() => {
      // This function will run every time the screen is focused
      UploadPageInfo("user");
      UploadActivities(true);
      setFriendOverlayVisable(false);
      setGroupOverlayVisable(false);
      setActivityOverlayVisable(false);
      setParticipantOverlayVisible(false);
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
      <View style={profilePageStyles.overlayBox}>
        <ScrollView>

          {/*profile picture/username/bio display*/}
          <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', marginTop: 24}}>

            {/*Profile picture*/}
            {userInfo.profilePic ? (
              <Image style={profilePageStyles.profilePicture} source={{ uri: userInfo.profilePic }} />
            ) : (
              <View style={[profilePageStyles.profilePicture, {backgroundColor: 'gray'}]}/>
            )}

            {/*Username and Bio*/}
            <View style={{marginLeft: 20}}>
              <Text style={profilePageStyles.usernameText}>{userInfo.username}</Text>
              <Text style={[styles.title, {fontSize:12, textAlign: 'left', width: 200}]}>{userInfo.bio}</Text>
            </View>
          </View>
              {/*edit profile button*/}
          <View style={styles.formAction}>
            <TouchableOpacity onPress={() => { navigation.navigate('Settings'); }}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>Edit Profile</Text>
              </View>
            </TouchableOpacity>
          </View>
          {/*Shows Friend, Group and Activity Number*/}
          <View style={{flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'flex-start', marginTop: 15}}>
            <TouchableOpacity onPress={() => {
              if((userRelationship == 'friend') || (userRelationship == 'self')){
                setFriendOverlayVisable(true)
              }
              }}>
              <InfoBox name='Friends' count={friendData.length}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              if((userRelationship == 'friend') || (userRelationship == 'self')){
                setGroupOverlayVisable(true)
              }
              }}>
              <InfoBox name='Groups' count={groupData.length}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              if((userRelationship == 'friend') || (userRelationship == 'self')){
                setActivityOverlayVisable(true)
              }
              }}>
              <InfoBox name='Activities' count={activityData.length}/>
            </TouchableOpacity>
          </View>

          <View style={{ alignItems: 'center' }}>
            {/* Displays recent activities */}
            <Text style={profilePageStyles.recentActivitiesHeader}>Recent Activities</Text>
            {activityLog.map(activity => (
              <ActivityDataCard
                key={activity.activityID}
                activityName={activity.activityName}
                dateTime={activity.dateTime}
                age={activity.age}
                duration={activity.duration}
                participants={activity.participants}
              />
            ))}

            {/* Displays show more button, the button disappears once all activities are shown */}
            {userInfo.loggedActivitiesCount > activityLog.length && (
              <TouchableOpacity onPress={() => UploadActivities(false)}>
                <Text style={profilePageStyles.showMoreButton}>Show More</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </View>

      {/*Friend List Overlay*/}
      <Modal animationType='fade' transparent={true} visible={friendOverlayVisable} onRequestClose={() => setFriendOverlayVisable(false)}>
        <TouchableOpacity style={profilePageStyles.popupScreenBackground} activeOpacity={1} onPress={() => setFriendOverlayVisable(false)}>
          <View style={profilePageStyles.popupScreenOutline}>
              <Text style={profilePageStyles.popupScreenTitle}>Friends</Text>
              <ScrollView>
                {friendData.map(friend=> (
                <FriendCard
                    key = {friend.userID}
                    username = {friend.username}
                    profilePicture = {friend.profilePicture}
                />
                ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
      
      {/*Group List Overlay*/}
      <Modal animationType='fade' transparent={true} visible={groupOverlayVisable} onRequestClose={() => setGroupOverlayVisable(false)}>
        {/*Blurry Backdrop from overlay*/}
        <TouchableOpacity style={profilePageStyles.popupScreenBackground} activeOpacity={1} onPress={() => setGroupOverlayVisable(false)}>
          {/*Overlay Container*/}
          <View style={profilePageStyles.popupScreenOutline}>
              <Text style={profilePageStyles.popupScreenTitle}>Groups</Text>
              <ScrollView>
                {groupData.map(group=> (
                <GroupCard
                    key = {group.groupname}
                    groupname = {group.groupname}
                    profilePicture = {group.profilePicture}
                />
                ))}
              </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
      
      {/*Activity List Overlay*/}
      <Modal animationType='fade' transparent={true} visible={activityOverlayVisable} onRequestClose={() => setActivityOverlayVisable(false)}>
        <TouchableOpacity style={profilePageStyles.popupScreenBackground} activeOpacity={1} onPress={() => setActivityOverlayVisable(false)}>
          <View style={profilePageStyles.popupScreenOutline}>
              <Text style={profilePageStyles.popupScreenTitle}>Activities</Text>
              <ScrollView>
                {activityData.map(activity=> (
                <ActivityCard
                    key = {activity.activityname}
                    activityname = {activity.activityname}
                />
                ))}
              </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/*Participants List Overlay*/}
      <Modal animationType='fade' transparent={true} visible={participantOverlayVisable} onRequestClose={() => setParticipantOverlayVisible(false)}>
        <TouchableOpacity style={profilePageStyles.popupScreenBackground} activeOpacity={1} onPress={() => setParticipantOverlayVisible(false)}>
          <View style={profilePageStyles.popupScreenOutline}>
              <Text style={profilePageStyles.popupScreenTitle}>Team Members</Text>
              <ScrollView>
                <View style={{alignItems: 'center'}}>
                  {currentParticipants.map((thisParticipant, index)=> (
                  <ParticipantCard
                      key = {index}
                      participant = {thisParticipant}
                  />
                  ))}
                </View>
              </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>

    
    
  );
};

const profilePageStyles = StyleSheet.create({
  overlayBox: {
    width: '95%', 
    height: '88%', 
    backgroundColor: '#E5E5E5', 
    borderRadius: 20, 
    justifyContent: 'flex-start'
  },
  //profile information
  profilePicture:{
    width: 100,
    height: 100,
    borderRadius: 50,
    marginLeft:10
  },
  usernameText: {
      fontSize: 30,
      fontWeight: '700',
      color: '#1e1e1e',
      marginBottom: 8,
      textAlign: 'left',
  },
  bioText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1e1e1e',
    marginBottom: 8,
    textAlign: 'left',
    width: 200
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
    borderRadius: 20,
    padding: 12
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
  },
  participantNameText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e1e1e',
    marginLeft: 10,
    textAlign: 'center',
  }
  
});
export default ProfilePage;
