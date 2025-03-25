import React, {act, useState} from 'react';
import { SafeAreaView, View, Text, Image, TextInput, TouchableOpacity, StyleSheet, ScrollView, Modal } from 'react-native';
import styles from '../styles/styles';

const ActivityLogPage = () => {

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
  const currentActivityScores = [];

  {/*top bar data*/}
  const [userStreak, setUserStreak] = useState(5);
  const [weather, setWeather] = useState('4°');

  {/*these values are ones i have created in order to test the page
     in the final app there must be functions which retrieve this information from either
     a local datastore or the database*/}
  const recentActivities = ["Snowboarding", "Badminton", "Wrestling", "Surfing", "Table Tennis"];
  const allActivities = ["Archery", "Badminton", "Baseball", "Basketball", "Boxing", "Cricket", "Cycling", "Esports", "Fencing", "Field Hockey", "Golf", "Gymnastics", "Ice Hockey", "Mixed Martial Arts", "Rowing", "Rugby", "Skateboarding", "Skiing", "Soccer", "Snowboarding", "Surfing", "Swimming", "Table Tennis", "Tennis", "Track and Field", "Triathlon", "Volleyball", "Weightlifting", "Wrestling", "American Football"];
  
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
            <View style={activityLogPageStyles.popupScreenOutline}>
              <Text style={activityLogPageStyles.popupScreenTitle} adjustsFontSizeToFit numberOfLines={1}>Activity: {currentActivity} </Text>
              
              <View style={{flex: 1, justifyContent: 'flex-end', alignItems: 'center'}}>
                <TouchableOpacity onPress={() => {SubmitActivityLog()}}>
                  <View style={{width: 140, height: 50, backgroundColor: 'green', borderWidth: 1, borderRadius: 15, justifyContent:'center', alignItems: 'center'}}>
                    <Text style={activityLogPageStyles.popupSubmitText}>Submit</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
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
    height: '50%', 
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
  },
  popupSubmitText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e1e1e',
    marginBottom: 8,
    textAlign: 'center',
  }
})
  export default ActivityLogPage;