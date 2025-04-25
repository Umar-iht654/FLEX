import React, {useState, useRef, useCallback} from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, Image, Dimensions, Animated, StyleSheet, Touchable } from 'react-native';
import styles from '../styles/styles';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { LineChart, BarChart, PieChart, ProgressChart, ContributionGraph, StackedBarChart } from "react-native-chart-kit";

const FeedPage = ( {navigation} ) => {

  //contains the current screen
  const [userStreak, setUserStreak] = useState(5);
  const [weather, setWeather] = useState('4°');

  const [userGoals, setUserGoals] = useState([]);

  //animation components
  const screenWidth = Dimensions.get('window').width;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const [currentView, setCurrentView] = useState(0);
  const cardWidth = screenWidth * 0.9;


  const chartConfig = {
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false // optional
  };

  function GetUserGoals(){
    /*
    Weight loss/gain: 0
    running distance: 1
    cycling distance: 2
    running speed: 3
    cycling speed: 4
    strength training: 5
    custom: 6
    */
    const thisUserGoals = [
      {id: 1, goalType: 0, goal: ['60']},
      {id: 2, goalType: 1, goal: ['10']},
      {id: 3, goalType: 2, goal: ['50']},
      {id: 4, goalType: 3, goal: ['5', '2-']},
      {id: 5, goalType: 4, goal: ['30', '60']},
      {id: 6, goalType: 5, goal: ['Bench Press', '80']},
      {id: 7, goalType: 6, goal: 'do 100 pressups in row'},
      {id: 8, goalType: 6, goal: 'do 200 squats in a row'},
      {id: 9, goalType: 6, goal: 'do a pull up'},
      {id: 10, goalType: 6, goal: 'play tennis 4 times this week'},
    ]
    setUserGoals(thisUserGoals);
  }

  function GetProgressData(catagory){
    if(catagory == 0){
      //gets the users weight from the database
      const userWeight = 68;
      return userWeight
    }

    if(catagory == 1){
      //gets a list of running distances over the last month from the database
      const runningDistanceData = {
        labels: ['2/6/2025', '6/6/2025','10/6/2025','16/6/2025','24/6/2026'],
        datasets: [
          {
            data: [3.6, 4, 3.8, 4.3, 4.8, 5.1]

          }
        ]
      }
      return runningDistanceData
    }

    if(catagory == 2){
      //gets the users biggest cycling distance for that week (if no activity logged that week, look at previous week and so on) 
      const userCyclingDistance = 36.2;
      return userCyclingDistance
    }

    if(catagory == 3){
      //gets users fastest running time for the distance stated in goal for that week (if no activity logged that week, look at previous week and so on) 
      const userRunningSpeed = 26.2;
      return userRunningSpeed
    }

    if(catagory == 4){
      //gets users fastest cycling time for the distance stated in goal for that week (if no activity logged that week, look at previous week and so on) 
      const userCyclingSpeed = 46.8;
      return userCyclingSpeed
    }

    if(catagory == 5){
      //gets users best weight for the workout stated in the goal (if no activity logged that week, look at previous week and so on)
      const userWeightLifted = 85;
      return userWeightLifted
    }
  }

  function GetNumberOfSlides(goals) {
    let count = 0;
    let hasGoalType6 = false;
  
    for (const goal of goals) {
      if (goal.goalType === 6) {
        if (!hasGoalType6) {
          count += 1;
          hasGoalType6 = true;
        }
      } else {
        count += 1;
      }
    }
    return count;
  }

  const slideNext = () => {
    setCurrentView(prev => {
      const newIndex = Math.min(prev + 1, GetNumberOfSlides(userGoals) - 1);
      Animated.timing(slideAnim, {
        toValue: -cardWidth * newIndex,
        duration: 300,
        useNativeDriver: true,
      }).start();
      return newIndex;
    });
  };
  
  const slidePrev = () => {
    setCurrentView(prev => {
      const newIndex = Math.max(prev - 1, 0);
      Animated.timing(slideAnim, {
        toValue: -cardWidth * newIndex,
        duration: 300,
        useNativeDriver: true,
      }).start();
      return newIndex;
    });
  };

  const ProgressCard = ({ goalType, goal }) => {
    return(
      <View style={{width: screenWidth *0.9, height: '100%',flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
        <TouchableOpacity onPress={() => {slidePrev()}}>
          <View style={{width: 50, height: 50, borderRadius: 12, backgroundColor: 'gray'}}/>
        </TouchableOpacity>
        {goalType === 1 && (
          <View style={{position: 'relative'}}>
            <Text>Running Distance Progress</Text>
            <LineChart
              data={GetProgressData(1)}
              width={250}
              height={300}
              chartConfig={chartConfig}
            />
          </View>
        )}
        <TouchableOpacity onPress={() => {slideNext()}}>
          <View style={{width: 50, height: 50, borderRadius: 12, backgroundColor: 'gray'}}/>
        </TouchableOpacity>
      </View>
    )
  }

  useFocusEffect(
    useCallback(() => {
      // This function will run every time the screen is focused
      GetUserGoals();
    }, [])
  );
  return (
    <SafeAreaView style={styles.safeAreaView}>
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
      <View style={{flex: 1,alignItems: 'center'}}>
        <View style={{width: '90%', height: 400, marginHorizontal: 10, marginVertical: 10, backgroundColor: 'white', borderRadius: 12, overflow: 'hidden'}}>
          <Animated.View style={{ transform: [{ translateX: slideAnim }], flexDirection: 'row', width: (cardWidth * GetNumberOfSlides(userGoals)), height: '100%' }}>
            {userGoals.map(thisGoal => (
              <ProgressCard
                key={thisGoal.id}
                goalType={thisGoal.goalType}
                goal={thisGoal.goal}
              />
            ))}
          </Animated.View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const feedPageStyles = StyleSheet.create({
  
})
export default FeedPage;
