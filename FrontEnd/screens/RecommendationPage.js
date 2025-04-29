import React, {useState, useCallback} from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Modal } from 'react-native';
import styles from '../styles/styles';
import { ScrollView } from 'react-native-gesture-handler';
import { useFocusEffect, useRoute } from '@react-navigation/native';

const RecommendationPage = ( {navigation} ) => {

  const [mutualUsers, setMutualUsers] = useState([]);
  const [localActivities, setLocalActivities] = useState([]);
  const [recommendedActivities, setRecommendedActivities] = useState([]);
  const [nearbyUsers, setNearbyUsers] = useState([]);

  const [mutualUsersOverlayVisable, setMutualUsersOverlayVisable] = useState(false)
  const [nearbyUsersOverlayVisable, setNearbyUsersOverlayVisable] = useState(false)
  const [possibleInterestsOverlayVisable, setPossibleInterestOverlayVisable] = useState(false)

  function getRecommendations(){
    const newMutualUsers = [
      { userID: 1, username: 'User1', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
      { userID: 2, username: 'User2', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
      { userID: 3, username: 'User3', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
      { userID: 4, username: 'User4', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
      { userID: 5, username: 'User5', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
      { userID: 6, username: 'User6', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
      { userID: 7, username: 'User7', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
      { userID: 8, username: 'User8', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
      { userID: 9, username: 'User9', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
      { userID: 10, username: 'User10', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
      { userID: 11, username: 'User11', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
      { userID: 12, username: 'User12', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
      { userID: 13, username: 'User13', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
      { userID: 14, username: 'User14', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
      { userID: 15, username: 'User15', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
      { userID: 16, username: 'User16', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
      { userID: 17, username: 'User17', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
      { userID: 18, username: 'User18', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
      { userID: 19, username: 'User19', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
      { userID: 20, username: 'User20', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
      { userID: 21, username: 'User21', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
      { userID: 22, username: 'User22', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
    ]
    setMutualUsers(newMutualUsers);

    const newNearbyUsers = [
      { userID: 1, username: 'User1', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
      { userID: 2, username: 'User2', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
      { userID: 3, username: 'User3', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
      { userID: 4, username: 'User4', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
      { userID: 5, username: 'User5', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
      { userID: 6, username: 'User6', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
      { userID: 7, username: 'User7', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
      { userID: 8, username: 'User8', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
      { userID: 9, username: 'User9', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
      { userID: 10, username: 'User10', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
      { userID: 11, username: 'User11', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
      { userID: 12, username: 'User12', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
      { userID: 13, username: 'User13', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
      { userID: 14, username: 'User14', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
      { userID: 15, username: 'User15', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
      { userID: 16, username: 'User16', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
      { userID: 17, username: 'User17', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
      { userID: 18, username: 'User18', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
      { userID: 19, username: 'User19', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
      { userID: 20, username: 'User20', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
      { userID: 21, username: 'User21', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
      { userID: 22, username: 'User22', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' },
    ]
    setNearbyUsers(newNearbyUsers);

    const newRecommendedActivities = [
      "Football","Tennis","Hockey","Rugby","Table Tennis","Archery"
    ]
    setRecommendedActivities(newRecommendedActivities);

    const newLocalActivities = [
      {activityName: "Football", date: '3d'},
      {activityName: "Tennis", date: '6d'},
      {activityName: "Soccer", date: '2w'},
      {activityName: "Dumblesort", date: '2w'},
      {activityName: "Goofball", date: '3w'},
      {activityName: "Slackerwacker", date: '3w'}
    ]
    
    setLocalActivities(newLocalActivities);
  }

  function openProfile(newUserID){
    navigation.push('UserProfile', { userID: newUserID });
  }

  function getPreview(thisArray, x){
    return thisArray.slice(0, x);
  }

  useFocusEffect(
    useCallback(() => {
      // This function will run every time the screen is focused
      getRecommendations();
      setMutualUsersOverlayVisable(false);
      setNearbyUsersOverlayVisable(false);
      console.log("navigated to")
    }, [])
  );
  const FriendCard = ({username, profilePicture, cardHeight}) => {
    return (
      <TouchableOpacity style={{width: '100%'}} onPress={() => {openProfile(username)}}>
        <View style={{width: '100%', flexDirection: "row", height: cardHeight, backgroundColor: '#d1d1d1', borderWidth: 1, alignItems: 'center', borderRadius: 12, marginBottom: 6}}>
          <Image style={recommendationPageStyles.popupItemProfilePicture} source={{ uri: profilePicture}}/>
          <Text style={recommendationPageStyles.popupItemText}>{username}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const PreviewFriendCard = ({username, profilePicture, cardHeight}) => {
    return (
      <View style={{width: '100%', flexDirection: "row", height: cardHeight, backgroundColor: '#d1d1d1', borderWidth: 1, alignItems: 'center', borderRadius: 12, marginBottom: 6}}>
        <Image style={recommendationPageStyles.popupItemProfilePicture} source={{ uri: profilePicture}}/>
        <Text style={recommendationPageStyles.popupItemText}>{username}</Text>
      </View>
    );
  };

  const RecommendedActivityCard = ({activityName}) => {
    return (
      <View style={{width: '100%', flexDirection: "row", height: 50, backgroundColor: '#d1d1d1', borderWidth: 1, alignItems: 'center', borderRadius: 12, marginBottom: 6}}>
        <Text style={recommendationPageStyles.popupItemText}>{activityName}</Text>
      </View>
    );
  };

  const PreviewRecommendedActivityCard = ({activityName}) => {
    return (
      <View style={{width: '100%', flexDirection: "row", height: 50, backgroundColor: '#d1d1d1', borderWidth: 1, alignItems: 'center', borderRadius: 12, marginBottom: 6}}>
        <Text style={recommendationPageStyles.popupItemText}>{activityName}</Text>
      </View>
    );
  };

  const PreviewLocalActivityCard = ({activityName, date}) => {
    return (
      <View style={{width: '100%', flexDirection: "row", height: 50, backgroundColor: '#d1d1d1', borderWidth: 1, alignItems: 'center', justifyContent: 'space-between', borderRadius: 12, marginBottom: 6}}>
        <Text style={recommendationPageStyles.popupItemText}>{activityName}</Text>
        <Text style={recommendationPageStyles.popupItemDateText}>{date}</Text>
      </View>
    );
  };
  return (
    <SafeAreaView style={[styles.safeAreaView, {alignItems: 'center', justifyContent: 'center'}]}>
      <View style={recommendationPageStyles.overlayBox}>
        <View style={{flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: '100%', height: 80, backgroundColor: '#c4c4c4' }}>
            <TouchableOpacity onPress={() => {navigation.goBack()}}>
                <Image style={recommendationPageStyles.backArrow} source={require('../assets/BackArrow.png')}/>
            </TouchableOpacity>
            <Text style={recommendationPageStyles.title}>Recommendation Page</Text>
        </View>
        <View style={{flex: 1,flexDirection: 'column', justifyContent: 'space-evenly'}}>

          <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-evenly'}}>

            {/*Mutual Users*/}
            <TouchableOpacity style={{width: '45%'}} onPress={() => {setMutualUsersOverlayVisable(true)}}>
              <View style={{width: '100%',height: 335, backgroundColor: 'white', borderWidth: 3, borderRadius: 12, padding: 12}}>
                <Text style={recommendationPageStyles.widgetTitle}numberOfLines={1} adjustsFontSizeToFit={true} minimumFontScale={0.5}>Mutual Users</Text>
                <View style={{width: '100%',height: '85%',alignItems: 'center', marginTop: 12, backgroundColor: '#9e9e9e', padding: 8, borderRadius: 12}}>
                  {getPreview(mutualUsers, 4).map((thisUser, index)=> (
                  <PreviewFriendCard
                      key = {index}
                      username = {thisUser.username}
                      profilePicture = {thisUser.profilePicture}
                      height = {40}
                  />
                  ))}
                  <Text style={recommendationPageStyles.widgetTitle}>...</Text>
                </View>
              </View>
            </TouchableOpacity>
            
            {/*Local Activities*/}
            <TouchableOpacity style={{width: '45%'}} onPress={() => {setPossibleInterestOverlayVisable(true)}}>
              <View style={{width: '100%',height: 335, backgroundColor: 'white', borderWidth: 3, borderRadius: 12, padding: 12}}>
                <Text style={recommendationPageStyles.widgetTitle}numberOfLines={1} adjustsFontSizeToFit={true} minimumFontScale={0.5}>Local Activities</Text>
                <View style={{width: '100%',height: '85%',alignItems: 'center', marginTop: 12, backgroundColor: '#9e9e9e', padding: 8, borderRadius: 12}}>
                  {getPreview(localActivities, 4).map((thisActivity, index)=> (
                  <PreviewLocalActivityCard
                      key = {index}
                      activityName = {thisActivity.activityName}
                      date = {thisActivity.date}
                  />
                  ))}
                  <Text style={recommendationPageStyles.widgetTitle}>...</Text>
                </View>
              </View>
            </TouchableOpacity>

          </View>

          <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-evenly'}}>

            {/*Possible Interests*/}

            <TouchableOpacity style={{width: '45%'}} onPress={() => {setPossibleInterestOverlayVisable(true)}}>
              <View style={{width: '100%',height: 335, backgroundColor: 'white', borderWidth: 3, borderRadius: 12, padding: 12}}>
                <Text style={recommendationPageStyles.widgetTitle}numberOfLines={1} adjustsFontSizeToFit={true} minimumFontScale={0.5}>Possible Interests</Text>
                <View style={{width: '100%',height: '85%',alignItems: 'center', marginTop: 12, backgroundColor: '#9e9e9e', padding: 8, borderRadius: 12}}>
                  {getPreview(recommendedActivities, 4).map((thisActivity, index)=> (
                  <PreviewRecommendedActivityCard
                      key = {index}
                      activityName = {thisActivity}
                  />
                  ))}
                  <Text style={recommendationPageStyles.widgetTitle}>...</Text>
                </View>
              </View>
            </TouchableOpacity>
            
            {/*Nearby Users*/}
            <TouchableOpacity style={{width: '45%'}} onPress={() => {setNearbyUsersOverlayVisable(true)}}>
              <View style={{width: '100%',height: 335, backgroundColor: 'white', borderWidth: 3, borderRadius: 12, padding: 12}}>
                <Text style={recommendationPageStyles.widgetTitle}numberOfLines={1} adjustsFontSizeToFit={true} minimumFontScale={0.5}>Nearby Users</Text>
                <View style={{width: '100%',height: '85%',alignItems: 'center', marginTop: 12, backgroundColor: '#9e9e9e', padding: 8, borderRadius: 12}}>
                  {getPreview(nearbyUsers, 4).map((thisUser, index)=> (
                  <PreviewFriendCard
                      key = {index}
                      username = {thisUser.username}
                      profilePicture = {thisUser.profilePicture}
                      height = {40}
                  />
                  ))}
                  <Text style={recommendationPageStyles.widgetTitle}>...</Text>
                </View>
              </View>
            </TouchableOpacity>

          </View>
        </View>
      </View>

      <Modal animationType='fade' transparent={true} visible={mutualUsersOverlayVisable} onRequestClose={() => setMutualUsersOverlayVisable(false)}>
        <TouchableOpacity style={recommendationPageStyles.popupScreenBackground} activeOpacity={1} onPress={() => setMutualUsersOverlayVisable(false)}>
          <View style={recommendationPageStyles.popupScreenOutline}>
              <Text style={recommendationPageStyles.popupScreenTitle}>Mutual users</Text>
              <ScrollView>
                <View style={{width: '100%',alignItems: 'center'}}>
                  {mutualUsers.map((thisUser, index)=> (
                  <FriendCard
                      key = {index}
                      username = {thisUser.username}
                      profilePicture = {thisUser.profilePicture}
                      cardHeight = {60}
                  />
                  ))}
                </View>
              </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal animationType='fade' transparent={true} visible={nearbyUsersOverlayVisable} onRequestClose={() => setNearbyUsersOverlayVisable(false)}>
        <TouchableOpacity style={recommendationPageStyles.popupScreenBackground} activeOpacity={1} onPress={() => setNearbyUsersOverlayVisable(false)}>
          <View style={recommendationPageStyles.popupScreenOutline}>
              <Text style={recommendationPageStyles.popupScreenTitle}>Nearby users</Text>
              <ScrollView>
                <View style={{width: '100%',alignItems: 'center'}}>
                  {mutualUsers.map((thisUser, index)=> (
                  <FriendCard
                      key = {index}
                      username = {thisUser.username}
                      profilePicture = {thisUser.profilePicture}
                      cardHeight = {60}
                  />
                  ))}
                </View>
              </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal animationType='fade' transparent={true} visible={possibleInterestsOverlayVisable} onRequestClose={() => setPossibleInterestOverlayVisable(false)}>
        <TouchableOpacity style={recommendationPageStyles.popupScreenBackground} activeOpacity={1} onPress={() => setPossibleInterestOverlayVisable(false)}>
          <View style={recommendationPageStyles.popupScreenOutline}>
              <Text style={recommendationPageStyles.popupScreenTitle}>Local Activities</Text>
              <ScrollView>
                <View style={{width: '100%',alignItems: 'center'}}>
                  {localActivities.map((thisActivity, index)=> (
                  <PreviewLocalActivityCard
                      key = {index}
                      activityName = {thisActivity.activityName}
                      date = {thisActivity.date}
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

const recommendationPageStyles = StyleSheet.create({
    overlayBox: {
      width: '95%', 
      height: '95%', 
      backgroundColor: '#E5E5E5', 
      borderRadius: 20, 
      justifyContent: 'flex-start',
      overflow: 'hidden'
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1e1e1e',
        marginBottom: 8,
        textAlign: 'center',
        
    },
    backArrow: {
        width: 50,
        height: 50,
        
    },
    widgetTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: '#1e1e1e',
      marginBottom: 2,
      textAlign: 'flex-start',
    },
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
      width: 40,
      height: 40,
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
    popupItemDateText: {
      fontSize: 16,
      fontWeight: '700',
      color: '#1e1e1e',
      marginLeft: 10,
      textAlign: 'center',
      marginRight: 10
    },
    participantNameText: {
      fontSize: 16,
      fontWeight: '700',
      color: '#1e1e1e',
      marginLeft: 10,
      textAlign: 'center',
    }
    
})
export default RecommendationPage;