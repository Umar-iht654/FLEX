import React, {useState, useEffect, act} from 'react';
import { SafeAreaView, View, Text,Image, TextInput, TouchableOpacity, StyleSheet, ScrollView, Modal,Alert } from 'react-native';
import styles from '../styles/styles';
import axios from 'axios';

const SearchPage = ( {navigation, route }) => {
    const { user } = route.params;
    {/*top bar data*/}
    const [userStreak, setUserStreak] = useState(5);
    const [weather, setWeather] = useState('4°');

    {/*Stores value in the search bar*/}
    const [searchInput, setSearchInput] = useState('');
    const [userP, setUserP] = useState(null);
    const [group, setGroup] = useState(null);

    {/*Controls visability of views within the page*/}
    const [groupsVisable, setGroupsVisable] = useState(true);
    const [usersVisable, setUsersVisable] = useState(true);
    const [activityOptionsVisable, setActivityOptionsVisable] = useState(false);
    const [locationOptionsVisable, setLocationOptionsVisable] = useState(false);

    {/*List of activities*/}
    const allActivities = [
      { Activity: "Archery", Selected: true }, { Activity: "Badminton", Selected: true }, { Activity: "Baseball", Selected: true }, 
      { Activity: "Basketball", Selected: true }, { Activity: "Boxing", Selected: true }, { Activity: "Cricket", Selected: true }, 
      { Activity: "Cycling", Selected: true }, { Activity: "Esports", Selected: true }, { Activity: "Fencing", Selected: true }, 
      { Activity: "Field Hockey", Selected: true }, { Activity: "Golf", Selected: true }, { Activity: "Gymnastics", Selected: true }, 
      { Activity: "Ice Hockey", Selected: true }, { Activity: "Mixed Martial Arts", Selected: true }, { Activity: "Rowing", Selected: true }, 
      { Activity: "Rugby", Selected: true }, { Activity: "Skateboarding", Selected: true }, { Activity: "Skiing", Selected: true }, 
      { Activity: "Soccer", Selected: true }, { Activity: "Snowboarding", Selected: true }, { Activity: "Surfing", Selected: true }, 
      { Activity: "Swimming", Selected: true }, { Activity: "Table Tennis", Selected: true }, { Activity: "Tennis", Selected: true }, 
      { Activity: "Track and Field", Selected: true }, { Activity: "Triathlon", Selected: true }, { Activity: "Volleyball", Selected: true }, 
      { Activity: "Weightlifting", Selected: true }, { Activity: "Wrestling", Selected: true }, { Activity: "American Football", Selected: true }
    ]
    
    {/*Settings for the search*/}
    const [activitiesSelected, setActivitiesSelected] = useState(allActivities)
    const [searchRadius, setSearchRadius] = useState(15);

    {/*the current groups and users being shown*/}
    const [searchResultsGroups, setSearchResultsGroups] = useState([]);
    const [searchResultsUsers, setSearchResultsUsers] = useState([]);


    // Modal states
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

    async function GetSearchResults(){
      {/*Again this data is just to test, a function should be called that
         searches the database based on the current search criteria*/}
      // const currentSearchResultsGroups = [
      //   {key: 1, name: 'Group1',profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg',location: 'location',activity: 'activity',description: 'this is a long description isnt it, the description should be now more than 2 sentences, but this is what happens if its even longer, even longer even, but what if it was eeeveeen longer that is',numberOfMembers: '355', isPrivate: true},
      //   {key: 2, name: 'Group2',profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg',location: 'location',activity: 'activity',description: 'this is a long description isnt it, the description should be now more than 2 sentences',numberOfMembers: '342', isPrivate: true},
      //   {key: 3, name: 'Group3',profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg',location: 'location',activity: 'activity',description: 'this is a long description isnt it, the description should be now more than 2 sentences',numberOfMembers: 'x', isPrivate: true},
      //   {key: 4, name: 'Group4',profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg',location: 'location',activity: 'activity',description: 'this is a long description isnt it, the description should be now more than 2 sentences',numberOfMembers: 'x', isPrivate: false},
      //   {key: 5, name: 'Group5',profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg',location: 'location',activity: 'activity',description: 'this is a long description isnt it, the description should be now more than 2 sentences',numberOfMembers: 'x', isPrivate: false},
      //   {key: 6, name: 'Group6',profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg',location: 'location',activity: 'activity',description: 'this is a long description isnt it, the description should be now more than 2 sentences',numberOfMembers: '22' ,isPrivate: true},
      //   {key: 7, name: 'Group7',profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg',location: 'location',activity: 'activity',description: 'this is a long description isnt it, the description should be now more than 2 sentences',numberOfMembers: 'x', isPrivate: false},
      //   {key: 8, name: 'Group8',profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg',location: 'location',activity: 'activity',description: 'this is a long description isnt it, the description should be now more than 2 sentences',numberOfMembers: 'x', isPrivate: false},
      // ]
      // setSearchResultsGroups(currentSearchResultsGroups);
      try {
        const response = await axios.post('https://933c-138-253-184-53.ngrok-free.app/search', {search: searchInput});
        if(response.data && response.data.message) {
          if (response.data.message === 'user'){
            setUserP(response.data.user);
            const fetchedUser  = { name: userP.username, profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg', location: 'location'}           
            setSearchResultsUsers([fetchedUser]);
          }
          else if (response.data.message === 'group'){
            setGroup(response.data.group)
            const fetchedGroup  = { name: group.group_name, profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg', location: 'location', activity: group.activity, description: group.bio, numberOfMembers: response.data.memberCount, isPrivate: false}
            setSearchResultsGroups([fetchedGroup]);
          }
        }
      } catch (error) {
        console.error("❌ Error fetching user:", error.response?.data || error.message || error);
      }
      // const currentSearchResultsUsers = [
      //   {name: 'User1',profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg',location: 'location'},
      //   {name: 'User2',profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg',location: 'location'},
      //   {name: 'User3',profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg',location: 'location'},
      //   {name: 'User4',profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg',location: 'location'},
      //   {name: 'User5',profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg',location: 'location'},
      //   {name: 'User6',profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg',location: 'location'},
      //   {name: 'User7',profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg',location: 'location'},

      // ]
      // {/*Updates the lists of search results*/}
      // setSearchResultsUsers(currentSearchResultsUsers);

    };

    function ClearSearch(){
      setSearchInput('');
    }

    

    function ToggleActivity(activityName){
      setActivitiesSelected(prevActivities =>
        prevActivities.map(thisActivity => thisActivity.Activity === activityName ? { ...thisActivity, Selected: !thisActivity.Selected } : thisActivity)
      );
    }

    function SelectedAllActivities(){
      setActivitiesSelected(prevActivities =>
        prevActivities.map(thisActivity => ({ ...thisActivity, Selected: true }))
      );
    }

    function UnselectAllActivities(){
      setActivitiesSelected(prevActivities =>
        prevActivities.map(thisActivity => ({ ...thisActivity, Selected: false }))
      );
    }

    function openGroup(newGroupID){
      navigation.push('GroupProfile', { user: user, group: group});
    }

    function openProfile(newUserID){
      navigation.push('UserProfile', { user: user, friendUSN: userP.username });
    }


  const GroupCard = ({ group }) => (
    <TouchableOpacity onPress={() => openGroup(group.name)}>
      <View style={searchPageStyles.groupCardContainer}>
        <View style={{ flexDirection: 'row' }}>
          <Image
            style={searchPageStyles.groupProfilePicture}
            source={{ uri: group.profilePicture }}
          />
          <View style={{ width: 180 }}>
            <Text style={searchPageStyles.groupCardTitle}>{group.name}</Text>
            <Text style={searchPageStyles.groupCardInfoText}>{group.location}</Text>
            <Text style={searchPageStyles.groupCardInfoText}>{group.activity}</Text>
            <Text
              style={searchPageStyles.groupCardDescriptionText}
              numberOfLines={2}
            >
              {group.description}
            </Text>
          </View>
        </View>
        <View style={searchPageStyles.iconColumn}>
          {group.isPrivate && (
            <Image
              style={searchPageStyles.padlockIcon}
              source={require('../assets/PadlockIcon.png')}
            />
          )}
          <Text style={searchPageStyles.numberOfMembersText}>
            {group.numberOfMembers}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
  
    const UserCard = ({ user }) => (
      <TouchableOpacity onPress={() => {openProfile(user.name)}}>
        <View style={searchPageStyles.userCardContainer}>
          <View style={{ flexDirection: 'row' }}>
            <Image
              style={searchPageStyles.userProfilePicture}
              source={{ uri: user.profilePicture }}
            />
            <View style={{ width: 180 }}>
              <Text style={searchPageStyles.groupCardTitle}>
                {user.name}
              </Text>
              <Text style={searchPageStyles.groupCardInfoText}>
                {user.location}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );


    const ActivityCard = ({ activityName, isSelected }) => {
      return(
        <TouchableOpacity onPress={() => {ToggleActivity(activityName);}}>
          <View style={{width: '100%', height: 40, backgroundColor: 'white',borderWidth: 1, flexDirection: 'row', alignItems: 'center'}}>
            <View style={{width: 20, height: 20, borderRadius: 8,marginHorizontal: 10,backgroundColor: isSelected ? 'blue' : 'gray'}}/>
            <Text style={searchPageStyles.activityCardText}>{activityName}</Text>
          </View>
        </TouchableOpacity>
      );
    }

    {/*called when the page is opened*/}
    useEffect(() => {
      GetSearchResults();
    }, []);
    
    return (
      <SafeAreaView style={styles.safeAreaView}>
        {/*TopBar*/}
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

            {/*Displays User Recommendation button*/}
            <TouchableOpacity onPress={() => {navigation.push('Recommendation', { user });}}>
              <Image style={styles.magicWandIcon} source={require('../assets/MagicWandButton.png')}/>
            </TouchableOpacity>
          </View>
        </View>
        <View style={searchPageStyles.container}>

          {/*Search Box*/}
          <View style={searchPageStyles.searchBoxHolder}>
            <TextInput
              style={searchPageStyles.searchBoxText}
              placeholder='Search...'
              placeholderTextColor="black" 
              value={searchInput}
              onChangeText={(search) => {
                setSearchInput(search);
              }}
            />

            {/*Clear Search bytton*/}
            <TouchableOpacity onPress={() => {ClearSearch()}}>
              <Image style={searchPageStyles.clearSearchButton} source={require('../assets/ClearSearchButton.png')}/>
            </TouchableOpacity>

            {/*Search button*/}
            <TouchableOpacity onPress={() => {GetSearchResults()}}>
              <Image style={searchPageStyles.searchButton} source={require('../assets/SearchButton.png')}/>
            </TouchableOpacity>
          </View>

          {/*Search settings button*/}
          <View style={{flexDirection: 'row', justifyContent: 'flex-start', paddingVertical: 15}}>
            <TouchableOpacity onPress={() => {setActivityOptionsVisable(true)}}>
                <View style={{width: 100, height: 40, backgroundColor: 'teal', borderWidth: 1, borderRadius: 5, justifyContent: 'center'}}>
                  <Text style={searchPageStyles.customizeSearchButtons}>Activity</Text>
                </View>
              </TouchableOpacity>
          </View>

          {/*Main overlay box*/}
          <View style={searchPageStyles.overlayBox}>
            <ScrollView>

              {/*Displays groups*/}
              <TouchableOpacity onPress={() => {setGroupsVisable(prev => !prev)}}>
                <Text style={searchPageStyles.subtitle}>Groups</Text>
              </TouchableOpacity>
              {(groupsVisable) && (
                <View>
                  {searchResultsGroups.map(group=> (
                    <GroupCard
                    key={group.key}
                    group={group}
                  />
                  ))}
                </View>
              )}

              {/*Displays users*/}
              <TouchableOpacity onPress={() => {setUsersVisable(prev => !prev)}}>
                <Text style={searchPageStyles.subtitle}>Users</Text>
              </TouchableOpacity>
              {(usersVisable) && (
                <View>
                  {searchResultsUsers.map(user=> (
                    <UserCard
                    key={user.name}
                    user={user}
                  />
                  ))}
                </View>
              )}
            </ScrollView>
          </View>
        </View>

        {/*Options Menu Display*/}
        <Modal animationType='fade' transparent={true} visible={activityOptionsVisable} onRequestClose={() => setActivityOptionsVisable(false)}>
          <TouchableOpacity style={searchPageStyles.optionsMenuBackground} activeOpacity={1} onPress={() => setActivityOptionsVisable(false)}>
            <View style={searchPageStyles.popupScreenOutline}>
              <View style={{flexDirection: 'row', width: '100%'}}>
                <View style={{width: '50%', height: 60}}>
                  <TouchableOpacity onPress={() => {SelectedAllActivities()}}>
                    <View style={{width: '100%', height: 60, justifyContent: 'center', alignItems: 'center', borderRightWidth: 1}}>
                      <Text style={searchPageStyles.activityPopupButtonText}>Select All</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={{width: '50%', height: 60}}>
                  <TouchableOpacity onPress={() => {UnselectAllActivities()}}>
                    <View style={{width: '100%', height: 60, justifyContent: 'center', alignItems: 'center', borderLeftWidth: 1}}>
                      <Text style={searchPageStyles.activityPopupButtonText}>Unselect All</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              <ScrollView>
                {activitiesSelected.map(thisActivity=> (
                  <ActivityCard
                    key = {thisActivity.Activity}
                    activityName = {thisActivity.Activity}
                    isSelected = {thisActivity.Selected}
                  />
                ))}
              </ScrollView>
            </View>
          </TouchableOpacity>
        </Modal>
      </SafeAreaView>
  );
};

const searchPageStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10
  },
  overlayBox: {
    width: '100%', 
    height: '80%', 
    backgroundColor: '#E5E5E5', 
    borderRadius: 20, 
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 2
  },
  subtitle: {
    fontSize: 22,
    fontWeight: '500',
    color: '#929292',
    textAlign: 'center',
    marginBottom: 10,
    textDecorationLine: 'underline',
    marginTop: 10,
  },
  searchBoxHolder: {
    height: 60,
    width: '100%',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    borderRadius: 12,
    elevation: 10,
    borderWidth: 3,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBoxText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#222',
    width: '75%'
  },
  searchButton: {
    width: 30,
    height: 30,
  },
  clearSearchButton: {
    width: 10,
    height: 10,
    marginRight: 10
  },
  customizeSearchButtons: {
    fontSize: 16,
    textAlign: 'left',
    marginLeft: 10,
    fontWeight: '700',
    color: '#1e1e1e',
  },
  groupProfilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    alignSelf: 'center'
  },
  userProfilePicture: {
    width: 80,
    height: 80,
    borderRadius: 50,
    borderWidth: 1,
    alignSelf: 'center',
    marginRight: 10
  },
  groupCardContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
    padding: 10,
    width: '100%', 
    height: 180, 
    backgroundColor: 'white', 
    borderWidth: 1, 
    borderRadius: 15, 
    marginBottom: 10
  },
  userCardContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
    padding: 10,
    width: '100%', 
    height: 100, 
    backgroundColor: 'white', 
    borderWidth: 1, 
    borderRadius: 15, 
    marginBottom: 10,
  },
  groupCardTitle: {
    fontSize: 30,
    fontWeight: '500',
    color: '#1e1e1e',
  },
  groupCardInfoText: {
    fontSize: 12,
    width: '100',
    fontWeight: '500',
    color: '#1e1e1e',
    marginLeft: 5,
  },
  groupCardDescriptionText: {
    fontWeight: '500',
    color: '#929292',
    marginLeft: 5,
  },
  numberOfMembersText: {
    fontSize: 30,
    fontWeight: '500',
    color: '#1e1e1e',
    marginLeft: 5,
    textAlign: 'right'
  },
  padlockIcon: {
    width: 35,
    height: 35
  },
  iconColumn: { height: '100%', justifyContent: 'space-between', alignItems: 'center' },
  modalBackground: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContainer: { width: '80%', backgroundColor: 'white', borderRadius: 20, padding: 20, alignItems: 'center' },
  modalProfilePicture: { width: 100, height: 100, borderRadius: 50, marginBottom: 15 },
  modalTitle: { fontSize: 24, fontWeight: '600', marginBottom: 10 },
  modalDescription: { fontSize: 16, color: '#666', marginBottom: 20, textAlign: 'center' },
  modalButton: { backgroundColor: 'teal', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10 },
  modalButtonText: { fontSize: 16, fontWeight: '500', color: 'white' },

  optionsMenuBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupScreenOutline: {
    width: '70%', 
    height: '50%', 
    backgroundColor: 'white', 
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2
  },
  activityCardText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e1e1e',
  },
  activityPopupButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e1e1e',
    textAlign: 'center'
  }
})

export default SearchPage;

