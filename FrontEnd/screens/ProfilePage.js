
import React, { useState} from "react";
import { SafeAreaView, View, Text, Image, TouchableOpacity, ScrollView, Modal, StyleSheet } from "react-native";
import styles from '../styles/styles';


const ProfilePage = ({ navigation }) => {
  const [friendOverlayVisable, setFriendOverlayVisable] = useState(false);
  const [groupOverlayVisable, setGroupOverlayVisable] = useState(false);
  const [activityOverlayVisable, setActivityOverlayVisable] = useState(false);
  //this is a placeholder, there should be a function that can be called to collect all the data below from the database
  const userInfo = {
    username: 'John Segway',
    bio: 'Hi im a small time jazzz singer from new rock california and I enjoy sports of many types, like swimming and cycling and others',
    profilePic: 'https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg',
    friendCount: 35,
    groupCount: 6,
    activityCount: 8,
    loggedActivitiesCount: 24,
    //realistically should only contain the last 10 activities logged, if the user pressed the "See More" option then this list will be updated to also contain the next 10
    activities: [
      {activityID: 1, activityType: '1v1',activityName: 'Activity 1',dateTime: 'Date/Time',age: 'Xd',duration: 'duration',scores: [5,3]},
      {activityID: 2, activityType: 'solo', activityName: 'Activity 2', dateTime: 'Date/Time', age: 'Xd', duration: 'duration', scores: [12]},
      {activityID: 3, activityType: '1v1', activityName: 'Activity 3', dateTime: 'Date/Time', age: 'Xd', duration: 'duration', scores: [8,8]},
      {activityID: 4,activityType: '1v1v1', activityName: 'Activity 4', dateTime: 'Date/Time', age: 'Xd', duration: 'duration', scores: [1,3,6]},
      {activityID: 5, activityType: '1v1', activityName: 'Activity 5', dateTime: 'Date/Time', age: 'Xd', duration: 'duration',scores: [9,3]}
    ]
  }
  
  const [userStreak, setUserStreak] = useState('5');
  const [weather, setWeather] = useState('4°');
  const [friendData, setFriendData] = useState([]);
  const [groupData, setGroupData] = useState([]);
  const [activityData, setActivityData] = useState([]);


  //Gets a list of user activities
  function GetFriends(user) {
    //here would be a function which collects the users list of friends from the database
    //for testing i've created this list myself
    const collectedFriendData = [
      { username: 'Pee Pee Wherman', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
      { username: 'Dan Scooterist', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
      { username: 'Luka Scumperlot', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
      { username: 'Gooper Gooperson', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
      { username: 'Sickalicka trying', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
      { username: 'Sir Yemen', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
      { username: 'Timothy Skelton', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
      { username: 'Lenny Crapperson', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
      { username: 'Milo Biggers', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
      { username: 'Carlos Swindler', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
      { username: 'Jimmy Pickles', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
      { username: 'Billy McNugget', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
      { username: 'Maddie Two-Times', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
      { username: 'Vince Vermin', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
      { username: 'Fiona Biggins', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
      { username: 'Chuck Banter', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
      { username: 'Zane Crankford', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
      { username: 'Bea Wiggler', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
      { username: 'Oscar Baggins', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
      { username: 'Tina Wallflower', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
      { username: 'Zoe Fizzbin', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
      { username: 'Alex Sweets', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
      { username: 'Nina Stepperson', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' }
    ];
    setFriendData(collectedFriendData);
    setFriendOverlayVisable(true);
  }

  function GetGroups(user) {
    //here would be a function which collects the users list of friends from the database
    //for testing i've created this list myself
    const collectedGroupData = [
      { groupname: 'The Footy Dwellers', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
      { groupname: 'Scarcity Tennis', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
      { groupname: 'Manchester Maddens', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/d/d8/Sai_mahotsav_manjhanpur.jpg?20231128214559' },
      { groupname: 'Badboyminton', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
      { groupname: 'Cycling Skeletons', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
      { groupname: 'Krazy Kenyans', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
      { groupname: 'Slapping Sailors', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
    ];
    setGroupData(collectedGroupData);
    setGroupOverlayVisable(true);
  }
 
  function GetActivities(user) {
    //here would be a function which collects the users list of friends from the database
    //for testing i've created this list myself
    const collectedActivityData = [
      { activityname: 'Tennis'},
      { activityname: 'Football'},
      { activityname: 'Cycling'},
      { activityname: 'Running'},
      { activityname: 'Shuffle Board'},
      { activityname: 'Tap Dancing'},
    ];
    setActivityData(collectedActivityData);
    setActivityOverlayVisable(true);
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

        {/*Displays the scores if the activity only has 1 score*/}
        {props.activityType == 'solo' && (
          <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start', marginTop: 10}}>
            <View style={profilePageStyles.activityScoreContainer2}>
              <Text style={profilePageStyles.activityScoreText}>{props.scores[0]}</Text>
            </View>


          </View>
        )}

        {/*Displays the scores if the activity has 2 scores*/}
        {props.activityType == '1v1' && (
          <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start', marginTop: 10}}>
            {/*First score*/}
            <View style={profilePageStyles.activityScoreContainer1}>
              <Text style={profilePageStyles.activityScoreText}>{props.scores[0]}</Text>
            </View>
            {/*Second score*/}
            <View style={profilePageStyles.activityScoreContainer2}>
              <Text style={profilePageStyles.activityScoreText}>{props.scores[1]}</Text>
            </View>

          </View>
        )}

        {/*Displays the scores if the activity has 3 scores*/}
        {props.activityType == '1v1v1' && (
          <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start', marginTop: 10}}>
            {/*First score*/}
            <View style={profilePageStyles.activityScoreContainer1}>
              <Text style={profilePageStyles.activityScoreText}>{props.scores[0]}</Text>
            </View>
            {/*Second score*/}
            <View style={profilePageStyles.activityScoreContainer2}>
              <Text style={profilePageStyles.activityScoreText}>{props.scores[1]}</Text>
            </View>
            {/*Third score*/}
            <View style={profilePageStyles.activityScoreContainer3}>
              <Text style={profilePageStyles.activityScoreText}>{props.scores[2]}</Text>
            </View>
          </View>
        )}

        {/*Contributing Users button, if pressed displays all users involved in activity*/}
        <TouchableOpacity>
          <Text style={profilePageStyles.contributingUsersButton}>Contributing Users</Text>
        </TouchableOpacity>
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
      <TouchableOpacity onPress={() => {/*Directs user to friends profile page*/}}>
        <View style={{flexDirection: "row"}}>
          <Image style={profilePageStyles.popupItemProfilePicture} source={{ uri: profilePicture}}/>
          <Text style={profilePageStyles.popupItemText}>{username}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const GroupCard = ({groupname, profilePicture}) => {
    return (
      <TouchableOpacity onPress={() => {/*Directs user to groups profile page page*/}}>
        <View style={{flexDirection: "row"}}>
          <Image style={profilePageStyles.popupItemProfilePicture} source={{ uri: profilePicture}}/>
          <Text style={profilePageStyles.popupItemText}>{groupname}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const ActivityCard = ({activityname}) => {
    return (
      <View style={{flexDirection: "row"}}>
        <View style={[profilePageStyles.popupItemProfilePicture, {backgroundColor: 'teal'}]}/>
        <Text style={profilePageStyles.popupItemText}>{activityname}</Text>
      </View>
    );
  };

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
            <Image 
              style={profilePageStyles.profilePicture}
              source={{ uri: userInfo.profilePic}}
            />

            {/*Username and Bio*/}
            <View style={{marginLeft: 20}}>
              <Text style={profilePageStyles.usernameText}>{userInfo.username}</Text>
              <Text style={[styles.title, {fontSize:12, textAlign: 'left', width: 200}]}>{userInfo.bio}</Text>
            </View>
          </View>

          {/*Shows Friend, Group and Activity Number*/}
          <View style={{flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'flex-start', marginTop: 15}}>
            <TouchableOpacity onPress={() => GetFriends("blank")}>
              <InfoBox name='Friends' count={userInfo.friendCount}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => GetGroups("blank")}>
              <InfoBox name='Groups' count={userInfo.groupCount}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {GetActivities("blank")}}>
              <InfoBox name='Activities' count={userInfo.activityCount}/>
            </TouchableOpacity>
          </View>

          {/*Displays recent activities*/}
          <View style={{alignItems:'center'}}>
            <Text style={profilePageStyles.recentActivitiesHeader}>Recent Activities</Text>
            {userInfo.activities.map(activity=> (
              <ActivityDataCard
                  key={activity.activityID}
                  activityType={activity.activityType}
                  activityName={activity.activityName}
                  dateTime={activity.dateTime}
                  age={activity.age}
                  duration={activity.duration}
                  scores={activity.scores}
              />
            ))}
          </View>

          {/*Displays show more button, the button disappears once all activities are shown*/}
          {userInfo.loggedActivitiesCount > userInfo.activities.length && (
          <TouchableOpacity>
            <Text style={profilePageStyles.showMoreButton}>Show More</Text>
          </TouchableOpacity>)}
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
                    key = {friend.username}
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
    marginBottom: 8,
    marginLeft: 10,
    textAlign: 'center',
  }
  
});
export default ProfilePage;