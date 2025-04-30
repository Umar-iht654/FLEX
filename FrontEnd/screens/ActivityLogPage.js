import React, {act, useState} from 'react';
import { SafeAreaView, View, Text, Image, TextInput, TouchableOpacity, StyleSheet, ScrollView, Modal, Dimensions } from 'react-native';
import styles from '../styles/styles';
import data from '../styles/localdata';

const ActivityLogPage = () => {

  const { height } = Dimensions.get('window');
  //stores the input of the search bar
  const [searchInput, setSearchInput] = useState('');

  //determines whether to show search results or not
  const [hasSearched, setHasSearched] = useState(false);

  {/*contains a list of activities similar to one in the search input*/}
  const [searchSuggestions, setSearchSuggestions] = useState([]);

  {/*controls the visability of popup screens*/}
  const [searchSuggestionsVisable, setSearchSuggestionsVisable] = useState(false);
  const [activityLogPopupVisable, setActivityLogPopupVisable] = useState(false);

  {/*contains the activity the user is currently attempting to log*/}
  const [currentActivity, setCurrentActivity] = useState('');
  const [currentActivityScores, setCurrentActivityScores] = useState([]);
  const [currentActivityParticipants, setCurrentActivityParticipants] = useState([]);

  {/*top bar data*/}
  const [userStreak, setUserStreak] = useState(5);
  const [weather, setWeather] = useState('4°');

  {/*these values are ones i have created in order to test the page
     in the final app there must be functions which retrieve this information from either
     a local datastore or the database*/}
  const recentActivities = ["Snowboarding", "Badminton", "Wrestling", "Surfing", "Table Tennis"];
  const allActivities = ["Archery", "Badminton", "Baseball", "Basketball", "Boxing", "Cricket", "Cycling", "Fencing", "Football", "Golf", "Gymnastics", "Hockey", "Mixed Martial Arts", "Rowing", "Rugby", "Running", "Skiing", "Snowboarding", "Swimming", "Table Tennis", "Tennis", "Volleyball", "Weightlifting", "Wrestling"];
  
  {/*gets a list of activities similar to the search input*/}
  function GetSearchSuggestions(currentSearchInput){
    const currentSearchResults = [];
    for(let i = 0; i < allActivities.length; i++){
      if(allActivities[i].toLowerCase().includes(currentSearchInput.toLowerCase())){
        currentSearchResults.push(allActivities[i]);
      }
    }
    setSearchSuggestions(currentSearchResults)
  }

  {/*gets called on the presss of the search button, hides the search suggestions and gets a list
     of activities relating to the search input*/}
  function GetSearchResults(currentSearchInput){
    setSearchSuggestionsVisable(false);
    if(currentSearchInput != ''){
      GetSearchSuggestions(currentSearchInput);
      setHasSearched(true);
    }else{
      setHasSearched(false);
    }
  }

  //checks whether the search box is empty
  function CheckSearchBarEmpty(currentSearchInput){
    if(currentSearchInput == ''){
      setHasSearched(false);
      setSearchSuggestionsVisable(false);
    }else{
      setSearchSuggestionsVisable(true);
    }
  }

  function ClearSearch(){
    setSearchInput('');
    setHasSearched(false);
  }

  function SubmitActivityLog(){
    setActivityLogPopupVisable(false);
  }

  function getActivityInformation(){

  }


//card which displays search suggestions while the user is typing
  const SearchResultCard = ({activityName}) => {
    return(
      //if clicked then the clicked activity automatically is sent to the text input
      <TouchableOpacity onPress={() => {setSearchInput(activityName); setSearchSuggestionsVisable(false);}}>
        <View style={{width: '100%', height: 40, backgroundColor: 'white', borderWidth: 1,borderColor: 'gray' ,justifyContent: 'center'}}>
          <Text style={activityLogPageStyles.searchResultText}>{activityName}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  //card which displays the activity and its icon
  const ActivityCard = ({activityName}) => {
    return(
      //if clicked it opens the pop up window for that activity
      <TouchableOpacity onPress={() => {setActivityLogPopupVisable(true); setCurrentActivity(activityName)}}>
        <View style={activityLogPageStyles.activityCardBox}>
          {/*activity card name and icon*/}
          <Text style={activityLogPageStyles.activityCardText} adjustsFontSizeToFit numberOfLines={1}>{activityName}</Text>
          <View style={activityLogPageStyles.activityCardImage}/>
        </View>
      </TouchableOpacity>
    );
  };

  const ScoreCard = ({ id, score, onChangePlayerScore }) => {
    const thisBackgroundColor = id === 1 ? 'green'
    : id === 2 ? 'orange'
    : id === 3 ? 'blue'
    : id === 4 ? 'yellow'
    : 'gray';
    return(
      <View style={{width: 70, height: 60, backgroundColor: thisBackgroundColor, marginRight: 10, borderRadius: 8, borderWidth: 2,justifyContent: 'center', alignItems: 'center'  }}>
        <TextInput
            style={{width: 70, height: 60, borderRadius: 6, paddingHorizontal: 8, textAlign: 'center', textAlignVertical: 'center', fontSize: 28, fontWeight: 500}}
            value={score}
            placeholder="X"
            onChangeText={(text) => onChangePlayerScore(id, text)}
          />
      </View>
    )
  }
  const ParticipantCard = ({ id, userLinked, playerName, onChangePlayerName }) => {
    const thisBackgroundColor = id === 1 ? 'green'
      : id === 2 ? 'orange'
      : id === 3 ? 'blue'
      : id === 4 ? 'yellow'
      : 'gray';
    return(
      <View style={{height: 50, backgroundColor: '#D9D9D9', borderRadius: 8, marginBottom: 16,padding: 4}}>
        {userLinked === '' && (
          <View style={{flex: 1,flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity>
              <View style={{width: 30, height: 30, backgroundColor: 'teal', borderRadius: 50, marginLeft: 10 }}/>
            </TouchableOpacity>
            <TextInput
              style={{ marginLeft: 10, flex: 1, backgroundColor: 'white', borderRadius: 6, paddingHorizontal: 8 }}
              value={playerName}
              placeholder="Enter player name"
              onChangeText={(text) => onChangePlayerName(id, text)}
            />
            <View style={{width: 30, height: 30, backgroundColor: thisBackgroundColor, borderRadius: 50, marginLeft: 10 }}/>
          </View>
        )}
      </View>
    )
  }
  
  const ActivityInputCard = ({activityName}) => {
    const activityInfo = data?.activities.find(activity => activity.name === activityName);
    
    const [participants, setParticipants] = useState(
      Array.from({ length: activityInfo.initialPlayers }, (_, index) => ({
        id: index + 1,
        userLinked: '',
        playerName: '',
        score: null,
      }))
    );


    function AddParticipant() {
      const newParticipant = {
        id: participants.length + 1,
        userLinked: '',
        playerName: ''
      };
      setParticipants([...participants, newParticipant]);
    };

    function ChangePlayerName(id, text) {
      setParticipants(prevParticipants =>
        prevParticipants.map(participant =>
          participant.id === id
            ? { ...participant, playerName: text }
            : participant
        )
      );
    }
    function ChangePlayerScore(id, newScore) {
      setParticipants(prevParticipants =>
        prevParticipants.map(participant =>
          participant.id === id
            ? { ...participant, score: newScore }
            : participant
        )
      );
    }
    return(
      //if clicked then the clicked activity automatically is sent to the text input
      <View style={[activityLogPageStyles.popupScreenOutline, {height: height*0.45}]}>
          <Text style={activityLogPageStyles.popupScreenTitle} adjustsFontSizeToFit numberOfLines={1}>Activity: {currentActivity} </Text>
          <View style={{flex: 1, flexDirection: 'column', justifyContent: 'space-between'}}>
              {/* ScrollView for the participants */}
              <ScrollView style={{flexGrow: 1}}>
                {participants.map(participant => (
                  <ParticipantCard
                    key={participant.id}
                    id={participant.id}
                    userLinked={participant.userLinked}
                    playerName={participant.playerName}
                    onChangePlayerName={ChangePlayerName}
                  />
                ))}
                <View style={{width: '100%', alignItems: 'flex-end'}}>
                  {participants.length < activityInfo.maxPlayers && (
                    <TouchableOpacity onPress={AddParticipant}>
                      <Text style={activityLogPageStyles.hyperlink}>Add Players</Text>
                    </TouchableOpacity>
                  )}
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', marginVertical: 30}}>
                  {participants.map(participant => (
                    <ScoreCard
                      key={participant.id}
                      id={participant.id}
                      score={participant.score}
                      onChangePlayerScore={ChangePlayerScore}
                    />
                  ))}
                  {activityInfo.type === 'time/distance' && (
                    <View style={{alignItems: 'center'}}>
                      <Text style={{fontSize: 28, fontWeight: 500}}>km</Text>
                    </View>
                  )}
                </View>
              </ScrollView>

              {/* Submit Button */}
              <View style={{alignItems: 'center', marginBottom: 20}}>
                <TouchableOpacity onPress={() => {console.log(participants); SubmitActivityLog()}}>
                  <View style={{width: 140, height: 50, backgroundColor: 'green', borderWidth: 1, borderRadius: 15, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={activityLogPageStyles.popupSubmitText}>Submit</Text>
                  </View>
                </TouchableOpacity>
              </View>

            </View>
        </View>
    );
  };
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
        </View>
        </View>

        <View style={{justifyContent: 'flex-start', alignItems: 'center'}}>
          <Text style={activityLogPageStyles.title}>Record Activity</Text>

          {/*Main Container*/}
          <View style={activityLogPageStyles.overlayBox}>

            {/*Search bar*/}
            <View style={activityLogPageStyles.searchBoxHolder}>
              <TextInput
                style={activityLogPageStyles.searchBoxText}
                placeholder='Search Activities...'
                placeholderTextColor="black" 
                value={searchInput}
                onChangeText={(search) => {
                  setSearchInput(search);
                  GetSearchSuggestions(search);
                  CheckSearchBarEmpty(search);
                }}
                clearButtonMode='always'
              />
              {/*Clear Search bytton*/}
              <TouchableOpacity onPress={() => {ClearSearch()}}>
                <Image style={activityLogPageStyles.clearSearchButton} source={require('../assets/ClearSearchButton.png')}/>
              </TouchableOpacity>
              {/*Search button*/}
              <TouchableOpacity onPress={() => {GetSearchResults(searchInput)}}>
                <Image style={activityLogPageStyles.searchButton} source={require('../assets/SearchButton.png')}/>
              </TouchableOpacity>
            </View>

            {/*Search Suggestions (appears over page)*/}
            {(searchInput != '') && (searchSuggestionsVisable) && (
                  <View style={{position: 'absolute',zIndex: 1, left: 0,top: 60,width: '100%', maxHeight: '90%', backgroundColor: 'white'}}>
                    <ScrollView>
                      <View style={{width: '100%', height: '100%'}}>
                      {searchSuggestions.map(activity=> (
                        <SearchResultCard
                          key = {activity}
                          activityName = {activity}
                        />
                      ))}
                      </View>
                    </ScrollView>
                  </View>
            )}

            {/*Displays a list of recent activities and all activities, only appears if the search bar is empty*/}
            {(!hasSearched) && (
              <ScrollView style={{width: '100%'}}>

                {/*Recent activities*/}
                <Text style={activityLogPageStyles.subtitle}>Recent Activities</Text>
                  <View style={{justifyContent: 'space-evenly',flexDirection: 'row',flexWrap: 'wrap'}}>
                    {recentActivities.map(activity=> (
                    <ActivityCard
                      key = {activity}
                      activityName = {activity}
                    />
                    ))}
                  </View>

                {/*All activities*/}
                <Text style={activityLogPageStyles.subtitle}>All Activities</Text>
                  <View style={{justifyContent: 'space-evenly',flexDirection: 'row',flexWrap: 'wrap'}}>
                    {allActivities.map(activity=> (
                    <ActivityCard
                      key = {activity}
                      activityName = {activity}
                    />
                    ))}
                </View>
              </ScrollView>
            )}

            {/*Displays a list of activities based on what the user has search, only appears if search button
               has been pressed and the search bar is not empty*/}
            {(hasSearched) && (
              <ScrollView style={{width: '100%'}}>
                <Text style={activityLogPageStyles.subtitle}>Results</Text>
                <View style={{justifyContent: 'space-evenly',flexDirection: 'row',flexWrap: 'wrap'}}>
                  {searchSuggestions.map(activity=> (
                  <ActivityCard
                    key = {activity}
                    activityName = {activity}
                  />
                  ))}
                </View>
              </ScrollView>
            )}
          </View>
        </View>

        {/*Overlay page where the user inputs their activity log data*/}
        <Modal animationType='fade' transparent={true} visible={activityLogPopupVisable} onRequestClose={() => setActivityLogPopupVisable(false)}>
          <TouchableOpacity style={activityLogPageStyles.popupScreenBackground} activeOpacity={1} onPress={() => setActivityLogPopupVisable(false)}>
            <ActivityInputCard activityName={currentActivity}/>
          </TouchableOpacity>
        </Modal>
      </SafeAreaView>
    );
  };
const activityLogPageStyles = StyleSheet.create({
  overlayBox: {
    width: '90%', 
    height: '85%', 
    backgroundColor: '#E5E5E5', 
    borderRadius: 20, 
    justifyContent: 'flex-start'
  },
  //text
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e1e1e',
    marginBottom: 8,
    textAlign: 'center',
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
  searchResultText: {
    fontSize: 16,
    textAlign: 'left',
    marginLeft: 10,
    fontWeight: '700',
    color: '#1e1e1e',
  },
  //search bar
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
  //activity cards
  activityCardBox: {
    width: 110,
    height: 110,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 15,
    borderWidth: 2,
    marginBottom: 10
  },
  activityCardText: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '700',
    color: '#1e1e1e',
  },
  activityCardImage: {
    width: 60,
    height: 60,
    borderRadius: 15,
    backgroundColor: 'gray',
  },
  popupScreenBackground: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: "rgba(0,0,0,0.8)"
  },
  //activity pop up screen
  popupScreenOutline: {
    width: '70%', 
    backgroundColor: 'white', 
    borderRadius: 20,
    padding: 10,
  },
  popupScreenTitle: {
    fontSize: 30,
    fontWeight: '700',
    color: '#1e1e1e',
    marginBottom: 8,
    textAlign: 'center',
    marginBottom: 20,
  },
  popupSubmitText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e1e1e',
    marginBottom: 8,
    textAlign: 'center',
  },
  hyperlink: {
    fontsize: 16,
    fontWeight: '600',
    color: 'blue',
    textDecorationLine: 'underline',
    textAlign: 'center'
  },
})
  export default ActivityLogPage;
