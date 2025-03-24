import React, {act, useState} from 'react';
import { SafeAreaView, View, Text, Image, TextInput, TouchableOpacity, StyleSheet, ScrollView, FlatList } from 'react-native';
import styles from '../styles/styles';

const ActivityLogPage = () => {

  const [searchInput, setSearchInput] = useState('');

  const [userStreak, setUserStreak] = useState(5);

  const recentActivities = ["Snowboarding", "Badminton", "Wrestling", "Surfing", "Table Tennis"];
  const allActivities = ["Archery", "Badminton", "Baseball", "Basketball", "Boxing", "Cricket", "Cycling", "Esports", "Fencing", "Field Hockey", "Golf", "Gymnastics", "Ice Hockey", "Mixed Martial Arts", "Rowing", "Rugby", "Skateboarding", "Skiing", "Soccer", "Snowboarding", "Surfing", "Swimming", "Table Tennis", "Tennis", "Track and Field", "Triathlon", "Volleyball", "Weightlifting", "Wrestling", "American Football"];

  const ActivityCard = ({activityName}) => {
    return(
      <TouchableOpacity>
        <View style={activityLogPageStyles.activityCardBox}>
          <Text style={activityLogPageStyles.activityCardText}>{activityName}</Text>
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
        </View>
        <View style={{justifyContent: 'flex-start', alignItems: 'center'}}>
          <Text style={activityLogPageStyles.title}>Record Activity</Text>
          <View style={activityLogPageStyles.overlayBox}>
            <View style={activityLogPageStyles.searchBoxHolder}>
              <TextInput
                style={activityLogPageStyles.searchBoxText}
                placeholder='Search Activities...'
                placeholderTextColor="black" 
                value={searchInput}
                onChangeText={setSearchInput}
              />
              <TouchableOpacity>
                <Image style={activityLogPageStyles.searchButton} source={require('../assets/SearchButton.png')}/>
              </TouchableOpacity>
            </View>
              <ScrollView style={{width: '100%'}}nestedScrollEnabled={true}>
                <Text style={activityLogPageStyles.subtitle}>Recent Activities</Text>
                  <View style={{justifyContent: 'space-evenly',flexDirection: 'row',flexWrap: 'wrap'}}>
                    {recentActivities.map(activity=> (
                    <ActivityCard
                      key = {activity}
                      activityName = {activity}
                    />
                    ))}
                  </View>
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
          </View>
        </View>
      </SafeAreaView>
    );
  };
const activityLogPageStyles = StyleSheet.create({
  title: {
    fontSize: 36,
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
    width: '80%'
  },
  overlayBox: {
    width: '90%', 
    height: '85%', 
    backgroundColor: '#E5E5E5', 
    borderRadius: 20, 
    justifyContent: 'flex-start'
  },
  searchButton: {
    width: 30,
    height: 30,
  },
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
  }
})
  export default ActivityLogPage;