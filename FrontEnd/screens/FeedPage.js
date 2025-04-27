import React, {useState, useRef, useCallback} from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, Image, Dimensions, Animated, StyleSheet, Touchable } from 'react-native';
import styles from '../styles/styles';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { VictoryChart, VictoryLine, VictoryAxis, VictoryScatter, VictoryTheme } from 'victory-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Reanimated, {
  useSharedValue,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';


const FeedPage = ( {navigation} ) => {
  
  //contains the current screen
  const [userStreak, setUserStreak] = useState(5);
  const [weather, setWeather] = useState('4°');

  //stores the users current goals
  const [userGoals, setUserGoals] = useState([]);

  //animation components
  const screenWidth = Dimensions.get('window').width;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const [currentView, setCurrentView] = useState(0);
  const cardWidth = screenWidth * 0.9;

  //retrieves the users goals from the database
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
    //this is a placeholder, the database should retrieve the data in this format
    const thisUserGoals = [
      {id: 1, goalType: 0, goal: ['60']},
      {id: 2, goalType: 1, goal: ['5']},
      {id: 3, goalType: 2, goal: ['50']},
      {id: 4, goalType: 3, goal: ['5', '2-']},
      {id: 5, goalType: 4, goal: ['30', '60']},
      {id: 6, goalType: 5, goal: ['Bench Press', '80']},
      {id: 7, goalType: 6, goal: ['do 100 pressups in row']},
      {id: 8, goalType: 6, goal: ['do 200 squats in a row']},
      {id: 9, goalType: 6, goal: ['do a pull up']},
      {id: 10, goalType: 6, goal: ['play tennis 4 times this week']},
    ]
    //updates the global variable
    setUserGoals(thisUserGoals);
  }

  //gets the goal progress data for the selected catagory
  function GetProgressData(catagory){
    //0: Weight
    if(catagory == 0){
      //gets the users weight from the database
      const userWeight = [68];
      return userWeight
    }

    //1: Running Distance
    if(catagory == 1){
      //gets a list of running distances over the last month from the database

      const runningDistanceData = [
        { x: '2/6', y: 3.6 },
        { x: '6/6', y: 4 },
        { x: '10/6', y: 3.8 },
        { x: '16/6', y: 4.3 },
        { x: '24/6', y: 5.1 }
      ]
      return runningDistanceData
    }

    //2: Cycling Distance
    if(catagory == 2){
      //gets the users biggest cycling distance for that week (if no activity logged that week, look at previous week and so on) 
      const userCyclingDistance = [
        { x: '2/6', y: 3.6 },
        { x: '6/6', y: 4 },
        { x: '10/6', y: 3.8 },
        { x: '16/6', y: 4.3 },
        { x: '24/6', y: 5.1 }
      ]
      return userCyclingDistance
    }

    //3: Running Time for a specific distance
    if(catagory == 3){
      //gets users fastest running time for the distance stated in goal for that week (if no activity logged that week, look at previous week and so on) 
      const userRunningSpeed = [
        { x: '2/6', y: 3.6 },
        { x: '6/6', y: 4 },
        { x: '10/6', y: 3.8 },
        { x: '16/6', y: 4.3 },
        { x: '24/6', y: 5.1 }
      ]
      return userRunningSpeed
    }

    //4: Cycling Time for a specific distance
    if(catagory == 4){
      //gets users fastest cycling time for the distance stated in goal for that week (if no activity logged that week, look at previous week and so on) 
      const userCyclingSpeed = [
        { x: '2/6', y: 3.6 },
        { x: '6/6', y: 4 },
        { x: '10/6', y: 3.8 },
        { x: '16/6', y: 4.3 },
        { x: '24/6', y: 5.1 }
      ]
      return userCyclingSpeed
    }

    //5: Weight for specific workout
    if(catagory == 5){
      //gets users best weight for the workout stated in the goal (if no activity logged that week, look at previous week and so on)
      const userWeightLifted = [85];
      return userWeightLifted
    }
  }

  //gets the number of slides needed to show all the users goals
  function GetNumberOfSlides(goals) {
    let count = 0;
    let hasGoalType6 = false;
    //cycles through the goals, only counting goal type 6 (custom goal) once as these all appear
    //on the same page
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

  //Controls the sliding right animation for views that need sliding
  const slideNext = () => {
    //changes the view to the next slide
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
  
  //Controls the sliding left animation for views that need sliding
  const slidePrev = () => {
    //changes the view to the previous slide
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

  //Holds the progress data for the current goal showing
  const ProgressCard = ({ goalType, goal }) => {
    
    //retrieves the progress data for the current goal
    const progressData = GetProgressData(goalType);

    return(
      <View style={{width: screenWidth *0.9, height: '100%',flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
        
        {/*previous slide button*/}
        <TouchableOpacity onPress={() => {slidePrev()}}>
          <View style={feedPageStyles.slideNavigationButton}/>
        </TouchableOpacity>

        {/*loads the progress table for running distance*/}
        {goalType === 1 && (
          <View>

            {/*Checks whether the user has recent logged running activities*/}
            {(!Array.isArray(progressData) || progressData.length === 0) ? (

              //displays error
              <Text style={{ textAlign: 'center', marginTop: 20 }}>No progress data available.</Text>
            ) : (

              //if the user has recently logged activities
              <View style={{width: cardWidth-100}}>

                {/*Title*/}
                <Text style={feedPageStyles.goalProgressTitle}>Running Distance Progress: {goal}km</Text>

                {/*Chart showing progress*/}
                <VictoryChart theme={VictoryTheme.material} width={cardWidth-70} height={250}>

                  {/*X axis*/}
                  <VictoryAxis
                    label="Dates"
                    style={{
                      axisLabel: { padding: 35, fontSize: 13, fontWeight: '600', fill: '#333' },
                      tickLabels: { fontSize: 10, angle: -30, padding: 15 },
                      grid: { stroke: 'lightgray', strokeDasharray: '4,4' },
                    }}
                  />

                  {/*Y axis*/}
                  <VictoryAxis
                    dependentAxis
                    label="Distance (km)"
                    tickFormat={(tick) => `${tick}km`}
                    style={{
                      axisLabel: { padding: 40, fontSize: 13, fontWeight: '600', fill: '#333' },
                      tickLabels: { fontSize: 10 },
                      grid: { stroke: 'lightgray', strokeDasharray: '4,4' },
                    }}
                  />

                  {/*Line showing information*/}
                  <VictoryScatter
                    data={progressData}
                    size={4}
                    style={{
                      data: {
                        fill: '#3b82f6',
                        stroke: '#ffffff',
                        strokeWidth: 1.5,
                      },
                    }}
                  />
                  <VictoryLine data={progressData}/>

                  {/*Shows where the user set their goal*/}
                  <VictoryLine
                    style={{
                      data: { stroke: "red", strokeWidth: 2, strokeDasharray: "6,3"  },
                    }}
                    data={[
                      { x: 0, y: goal },
                      { x: 100, y: goal }, // Make sure this x value covers your chart's range
                    ]}
                  />

                </VictoryChart>
              </View>
            )}
          </View>
        )}

        {/*Button to the next slide*/}
        <TouchableOpacity onPress={() => {slideNext()}}>
          <View style={feedPageStyles.slideNavigationButton}/>
        </TouchableOpacity>
      </View>
    )
  }
  //gets called when the page is navigated to
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

      {/*View where the info widgets are shown*/}
      <View style={feedPageStyles.widgetContainer}>
        <View style={feedPageStyles.widgetBox}>
          
          {/*Implements sliding animation between*/}
          <Animated.View style={{transform: [{ translateX: slideAnim }], flexDirection: 'row', width: (cardWidth * GetNumberOfSlides(userGoals)), height: '100%' }}>
            
            {/*Displays progress cards for each of the users goals*/}
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
  goalProgressTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e1e1e',
    marginBottom: 8,
    textAlign: 'center',
  },
  widgetContainer: {
    flex: 1,
    alignItems: 'center'
  },
  widgetBox: {
    width: '90%', 
    height: 300, 
    marginHorizontal: 10, 
    marginVertical: 10, 
    backgroundColor: 'white', 
    borderRadius: 12, 
    overflow: 'hidden'
  },
  slideNavigationButton: {
    width: 50, 
    height: 50, 
    borderRadius: 12, 
    backgroundColor: 'gray',
    opacity: 0.4
  }

})
export default FeedPage;
