import React, {useState} from 'react';
 import { SafeAreaView, View, Text, TouchableOpacity, FlatList } from 'react-native';
 import styles from '../styles/styles';
 import axios from 'axios';
  import data from '../styles/localdata';

const CreateActivitySelectionPage = ({ navigation, route }) => {
  const { email } = route.params;
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [validateError, setValidateError] = useState('');
 
  const uploadData =  async () => {
    const activityNames = data.activities
    .filter(activity => selectedActivities.includes(activity.id)).map(activity => activity.name);

    setValidateError('');
    try{
      const response = await axios.post('https://0d7f-138-253-184-53.ngrok-free.app/activityLog', {activities: activityNames, email:email});
      if(response.data && response.data.message){
        setValidateError('');
        const {user} = response.data.user
        navigation.navigate('GoalSetting', {create_user:user});
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
          keyExtractor={(item) => item.name}
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
    {
      id: 'a1',
      name: 'running',
    },
    {
      id: 'a2',
      name: 'tennis',
    },
    {
      id: 'a3',
      name: 'football',
    },
    {
      id: 'a4',
      name: 'cricket',
    },
    {
      id: 'a5',
      name: 'rugby',
    },
    {
      id: 'a6',
      name: 'athletics',
    },
    {
      id: 'a7',
      name: 'snooker',
    },
    {
      id: 'a8',
      name: 'racing',
    },
    {
      id: 'a9',
      name: 'boxing',
    },
    {
      id: 'a10',
      name: 'darts',
    },
    {
      id: 'a11',
      name: 'swimming',
    },
    {
      id: 'a12',
      name: 'gymnastics',
    },
    {
      id: 'a13',
      name: 'badminton',
    },
    {
      id: 'a14',
      name: 'squash',
    },
    {
      id: 'a15',
      name: 'watersport',
    },
    {
      id: 'a16',
      name: 'skiing',
    },
    {
      id: 'a17',
      name: 'hockey',
    },
    {
      id: 'a18',
      name: 'basketball',
    },
    {
      id: 'a19',
      name: 'table tennis',
    },
    {
      id: 'a20',
      name: 'golf',
    },
    {
      id: 'a21',
      name: 'netball',
    },
  ]
};

export default CreateActivitySelectionPage;