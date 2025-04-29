import React, {useState} from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, FlatList } from 'react-native';
import styles from '../styles/styles';
import data from '../styles/localdata';

const CreateActivitySelectionPage = ({ navigation }) => {
 
    const [selectedActivities, setSelectedActivities] = useState([]);
    
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
          <TouchableOpacity 
            onPress={() => {
              navigation.navigate('GoalSetting')
            }}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Confirm Activities</Text>
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
};

export default CreateActivitySelectionPage;