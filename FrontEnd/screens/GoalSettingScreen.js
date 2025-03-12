import React, {useState} from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity } from 'react-native';
import styles from '../styles/styles';

const UserGoalSetting = () => {
  const [goalType, setGoalType] = useState('');
  const [inputValues, setInputValues] = useState({ start: '', goal: '' });
  const [customGoal, setCustomGoal] = useState('');

  const goalOptions = [
    { label: 'Weight Loss / Gain', value: 'weight' },
    { label: 'Distance (Running / Cycling)', value: 'distance' },
    { label: 'Pace', value: 'pace' },
    { label: 'Custom', value: 'custom' }
  ];

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
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Select Your Goal Type:</Text>
      
      {goalOptions.map((option) => (
        <TouchableOpacity
          key={option.value}
          onPress={() => setGoalType(option.value)}
          style={{
            padding: 15,
            marginVertical: 5,
            backgroundColor: goalType === option.value ? '#4CAF50' : '#ddd',
            borderRadius: 10,
            alignItems: 'center'
          }}
        >
          <Text style={{ fontSize: 16, color: goalType === option.value ? '#fff' : '#000' }}>{option.label}</Text>
        </TouchableOpacity>
      ))}
      
      {goalType && goalType !== 'custom' && (
        <View>
          <Text>Start:</Text>
          <TextInput
            placeholder="Enter starting value"
            keyboardType="numeric"
            value={inputValues.start}
            onChangeText={(text) => setInputValues({ ...inputValues, start: text })}
            style={{ borderBottomWidth: 1, marginBottom: 10 }}
          />
          <Text>Goal:</Text>
          <TextInput
            placeholder="Enter target value"
            keyboardType="numeric"
            value={inputValues.goal}
            onChangeText={(text) => setInputValues({ ...inputValues, goal: text })}
            style={{ borderBottomWidth: 1, marginBottom: 10 }}
          />
        </View>
      )}
      
      {goalType === 'custom' && (
        <View>
          <Text>Custom Goal:</Text>
          <TextInput
            placeholder="Describe your goal"
            value={customGoal}
            onChangeText={setCustomGoal}
            style={{ borderBottomWidth: 1, marginBottom: 10 }}
          />
        </View>
      )}
      
      <TouchableOpacity
        onPress={handleSubmit}
        style={{ padding: 15, backgroundColor: '#007BFF', borderRadius: 10, alignItems: 'center', marginTop: 10 }}
      >
        <Text style={{ color: '#fff', fontSize: 16 }}>Save Goal</Text>
      </TouchableOpacity>
    </View>
  );
};

export default UserGoalSetting;
