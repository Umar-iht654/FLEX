import React, {useState} from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity } from 'react-native';
import styles from '../styles/styles';

const GoalSetting = ({ navigation }) => { 
  const [goalType, setGoalType] = useState('');
  const [inputValues, setInputValues] = useState({ start: '', goal: '' });
  const [customGoal, setCustomGoal] = useState('');

  const goalOptions = [
    { label: 'Weight Loss / Gain', value: 'weight' },
    { label: 'Running Distance', value: 'running_distance' },
    { label: 'Cycling Distance', value: 'cycling_distance' },
    { label: 'Running Pace', value: 'running_pace' },
    { label: 'Cycling Speed', value: 'cycling_speed' },
    { label: 'Strength Training Reps', value: 'strength_reps' },
    { label: 'Custom Goal', value: 'custom' }
  ];

  const placeholders = {
    weight: { start: 'Enter current weight (kg)', goal: 'Enter target weight (kg)' },
    running_distance: { start: 'Enter current distance (km)', goal: 'Enter target distance (km)' },
    cycling_distance: { start: 'Enter current distance (km)', goal: 'Enter target distance (km)' },
    running_pace: { start: 'Enter current pace (min/km)', goal: 'Enter target pace (min/km)' },
    cycling_speed: { start: 'Enter current speed (km/h)', goal: 'Enter target speed (km/h)' },
    strength_reps: { start: 'Enter current reps per set', goal: 'Enter target reps per set' },
    custom: { start: '', goal: '' }
  };

  const handleSubmit = () => {
    if (goalType === 'custom' && !customGoal) {
      Alert.alert('Please enter your custom goal');
      return;
    }
    
    if (goalType !== 'custom' && (!inputValues.start || !inputValues.goal)) {
      Alert.alert('Please enter both start and goal values');
      return;
    }
    
    Alert.alert('Goal Saved!', `Your ${goalType} goal has been set.`);
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Set Your Goals</Text>
        
        <View style={styles.optionsContainer}>
          {goalOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              onPress={() => setGoalType(option.value)}
              style={[styles.optionButton, goalType === option.value && styles.selectedOption]}
            >
              <Text style={[styles.optionText, goalType === option.value && styles.selectedText]}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        
        {goalType && goalType !== 'custom' && (
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Start:</Text>
            <TextInput
              placeholder={placeholders[goalType]?.start || 'Enter starting value'}
              keyboardType='numeric'
              value={inputValues.start}
              onChangeText={(text) => setInputValues({ ...inputValues, start: text })}
              style={styles.inputBox}
            />
            <Text style={styles.inputLabel}>Goal:</Text>
            <TextInput
              placeholder={placeholders[goalType]?.goal || 'Enter target value'}
              keyboardType='numeric'
              value={inputValues.goal}
              onChangeText={(text) => setInputValues({ ...inputValues, goal: text })}
              style={styles.inputBox}
            />
          </View>
        )}
        
        {goalType === 'custom' && (
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Describe Your Custom Goal:</Text>
            <TextInput
              placeholder='Enter your custom goal here...'
              value={customGoal}
              onChangeText={setCustomGoal}
              style={[styles.inputBox, styles.customInput]}
              multiline={true}
            />
          </View>
        )}
        
        <TouchableOpacity onPress={handleSubmit} style={styles.button}>
          <Text style={styles.buttonText}>Save Goal</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.replace('ActivityLog')} style={[styles.button, styles.secondaryButton]}>
          <Text style={styles.buttonText}>Go to Activity Log</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};
export default GoalSetting;