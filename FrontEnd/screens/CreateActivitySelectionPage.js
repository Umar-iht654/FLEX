import React, {useState} from 'react';
 import { SafeAreaView, View, Text, TouchableOpacity, FlatList } from 'react-native';
 import styles from '../styles/styles';
 import axios from 'axios';
  
const CreateActivitySelectionPage = ({ navigation, route }) => {
  const { email } = route.params;
  const [selectedActivities, setSelectedActivities] = useState(data.activities);
  const [validateError, setValidateError] = useState('');
 
  const uploadData =  async () => {
    const activityNames = data.activities
    .filter(activity => selectedActivities.includes(activity.id)).map(activity => activity.name);

    setValidateError('');
    try{
      const response = await axios.post('https://933c-138-253-184-53.ngrok-free.app/activityLog', {activities: activityNames, email:email});
      if(response.data && response.data.message){
        setValidateError('');
        const user = response.data.user
        navigation.navigate('ExtraInformation', {user: user});
      }
    } catch (error) {
      setValidateError(error.response?.data?.detail || 'Something went wrong');
    }
  }
 
  const handleActivityPress = (activity) => {
    if (selectedActivities.includes(activity.id)) {
      setSelectedActivities(selectedActivities.filter((id) => id !== activity.id));
    } else {
        setSelectedActivities([...selectedActivities, activity.id]);
      }
  }
 
  const renderActivities = ({ item }) => {
    const isSelected = selectedActivities.includes(item.id);
    return (
      <TouchableOpacity
        onPress={() => handleActivityPress(item)}
      >
        <View style={[styles.activityCard, isSelected && {backgroundColor: '#add8e6'}]}>
          <Text style={[styles.subtitle, {marginVertical: 50}]}>{item.name}</Text>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}>
        <Text style={styles.title}>Activity Selection</Text>
        <Text style={styles.subtitle}>Select activities you would be interested in</Text>
      </View>
      <View style={styles.form}>
        <FlatList
          data={data.activities}
          renderItem={renderActivities}
          keyExtractor={(item) => item.id}
          numColumns={3}
          contentContainerStyle={styles.container}
        />
      </View>
      <View style={styles.formAction}>
        {validateError ? (
          <Text style={{ color: 'red', fontSize: 21, marginBottom: 8 }}>
            {validateError}
          </Text>
        ) : null}
        <TouchableOpacity 
          onPress={() => {
            uploadData();
          }}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Confirm Activities</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}


const data = {
  activities: [
    { id: 'a1', name: 'Archery' },
    { id: 'a2', name: 'Badminton'  },
    { id: 'a3', name: 'Baseball' },
    { id: 'a4', name: 'Basketball' },
    { id: 'a5', name: 'Boxing' },
    { id: 'a6', name: 'Basketball' },
    { id: 'a7', name: 'Cricket' },
    { id: 'a8', name: 'Cycling' },
    { id: 'a9', name: 'Fencing' },
    { id: 'a10', name: 'Golf' },
    { id: 'a11', name: 'Gymnastics' },
    { id: 'a12', name: 'Hockey' },
    { id: 'a13', name: 'Mixed Martial Arts' },
    { id: 'a14', name: 'Rowing' },
    { id: 'a15', name: 'Rugby' },
    { id: 'a16', name: 'Running' },
    { id: 'a17', name: 'Mixed Martial Arts' },
    { id: 'a18', name: 'Skiing' },
    { id: 'a19', name: 'Snowboarding' },
    { id: 'a20', name: 'Swimming' },
    { id: 'a21', name: 'Table Tennis' },
    { id: 'a22', name: 'Tennis' },
    { id: 'a23', name: 'Volleyball' },
    { id: 'a24', name: 'Weight Lifting' },
    { id: 'a25', name: 'Wrestling' },
    { id: 'a26', name: 'Weight Lifting' }
  ]
};



export default CreateActivitySelectionPage;
