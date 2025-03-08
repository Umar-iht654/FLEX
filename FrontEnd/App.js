import React, {useState} from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View, TextInput,  TouchableOpacity, ScrollView, Image } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

// creates navigators used in HomeTabs & App
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

//Contains Login Page UI
const LoginPage  = ({ navigation }) => {

  //where the email and password are stored for now
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
  <SafeAreaView style={styles.safeAreaView}> 
    <View style={styles.container }>
      <View style={styles.header}>
        <Text style={styles.title}>Login</Text>
      </View>
    </View>

    <View style={styles.form}>
      <View style={styles.input}>
        <Text style={styles.inputLabel}>Email address</Text>
        <TextInput
          style={styles.inputBox}
          placeholder='johnsmith@example.com'
          placeholderTextColor="#6b7280" 
          value={email}
          onChangeText={email => setEmail(email)}
        />
      </View>

      <View style={styles.input}>
        <Text style={styles.inputLabel}>Password</Text>
        <TextInput secureTextEntry 
          style={styles.inputBox}
          placeholder='password'
          placeholderTextColor="#6b7280"
          value={password}
          onChangeText={password => setPassword(password)}
        />
        <TouchableOpacity
          onPress={() => {
            //forgot password function
          }}>
            <Text style={styles.hyperlink}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formAction}>
        <TouchableOpacity 
          onPress={() => {
            navigation.navigate("Home")
          }}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Login</Text>
          </View>
        </TouchableOpacity>
      </View>
      <TouchableOpacity 
        onPress={() => {
          navigation.navigate('CreateAccount')
        }}>
        <View>
          <Text style={styles.hyperlinkCreateAccount}>Don't have an account? Sign up</Text>
        </View>
      </TouchableOpacity>
    </View>
  </SafeAreaView>
  );
};

//Contains Create Account Page UI
const CreateAccountPage = ({ navigation }) => {
  //stores the data needed to create account for now
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [postcode, setPostcode] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setconfirmPassword] = useState('');

  //allows the t&c confirm button to be toggleable
  const [tacButtonColor, setTacButtonColor] = useState('white');
  const toggleColor = () => {
    setTacButtonColor(prevColor => (prevColor === "white" ? "blue" : "white"));
  };
  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Login')
          }}>
          <Text style={[styles.hyperlink, {marginTop:0, margin: 10}]}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Create Account</Text>
      </View>
      <View style={styles.form}>
        <ScrollView>
          <View style={styles.createAccountInput}>
            <Text style={styles.inputLabel}>First Name</Text>
            <TextInput
              style={styles.inputBox}
              placeholder='john'
              placeholderTextColor="#6b7280"
              value={firstName}
              onChangeText={firstName => setFirstName(firstName)}
            />
          </View>

          <View style={styles.createAccountInput}>
            <Text style={styles.inputLabel}>Last Name</Text>
            <TextInput
              style={styles.inputBox}
              placeholder='smith'
              placeholderTextColor="#6b7280"
              value={lastName}
              onChangeText={lastName => setLastName(lastName)}
            />
          </View>

          <View style={styles.createAccountInput}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <TextInput
                style={styles.inputBox}
                placeholder='johnsmith@example.com'
                placeholderTextColor="#6b7280"
                value={newEmail}
                onChangeText={newEmail => setNewEmail(newEmail)}
              />
          </View>

          <View style={styles.createAccountInput}>
              <Text style={styles.inputLabel}>Date of Birth</Text>
              <TextInput
                style={styles.inputBox}
                placeholder='DD/MM/YEAR'
                placeholderTextColor="#6b7280"
                value={dateOfBirth}
                onChangeText={dateOfBirth => setDateOfBirth(dateOfBirth)}
              />
          </View>

          <View style={styles.createAccountInput}>
              <Text style={styles.inputLabel}>Postcode</Text>
              <TextInput
                style={styles.inputBox}
                placeholder='postcode'
                placeholderTextColor="#6b7280"
                value={postcode}
                onChangeText={postcode => setPostcode(postcode)}
              />
          </View>

          <View style={styles.createAccountInput}>
              <Text style={styles.inputLabel}>Address Line 1</Text>
              <TextInput
                style={styles.inputBox}
                placeholder='example road, house name/number'
                placeholderTextColor="#6b7280"
                value={addressLine}
                onChangeText={addressLine => setAddressLine(addressLine)}
              />
          </View>

          <View style={styles.createAccountInput}>
              <Text style={styles.inputLabel}>Username</Text>
              <TextInput
                style={styles.inputBox}
                placeholder='johnpoopcock23'
                placeholderTextColor="#6b7280"
                value={newUsername}
                onChangeText={newUsername => setNewUsername(newUsername)}
              />
          </View>

          <View style={styles.createAccountInput}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput secureTextEntry
                style={styles.inputBox}
                placeholder='password'
                placeholderTextColor="#6b7280"
                value={newPassword}
                onChangeText={newPassword => setNewPassword(newPassword)}
              />
          </View>

          <View style={styles.createAccountInput}>
              <Text style={styles.inputLabel}>Confirm Password</Text>
              <TextInput secureTextEntry
                style={styles.inputBox}
                placeholder='confirm password'
                placeholderTextColor="#6b7280"
                value={confirmPassword}
                onChangeText={confirmPassword => setconfirmPassword(confirmPassword)}
              />
          </View>
          <View style={{flexDirection:'row', alignItems:'left', margin:20}}>
            <TouchableOpacity onPress={toggleColor}>
              <View style={{width:20, height: 20, backgroundColor: tacButtonColor}} />
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => {
                  navigation.navigate('TermsAndConditions')
                }}>
                <Text style={[styles.hyperlink, {marginTop:0, margin: 20}]}>Terms & Conditions</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.formAction}>
            <TouchableOpacity 
              onPress={() => {
                navigation.navigate("CreateActivitySelection")
              }}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>Create Account</Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

//Contains Terms and Conditions Page UI
const TermsAndConditionsPage = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}>
        <Text style={styles.title}>Terms & Conditions</Text>
      </View>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('CreateAccount')
          }}>
          <Text style={[styles.hyperlink, {marginTop:0, margin: 20}]}>Back</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

//Contains Activity Selection Page UI
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
            navigation.navigate('CreateGoalSetting')
          }}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Confirm Activities</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

//Contains Goal Setting Page UI
const CreateGoalSettingPage = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}>
        <Text style={styles.title}>Set Your Goals</Text>
        <Text style={styles.subtitle}>Be bold, don't be old fool</Text>
      </View>
      <View style={[styles.formAction, {justifyContent: 'flex-end'}]}>
        <TouchableOpacity 
          onPress={() => {
            navigation.navigate('Home')
          }}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Create Account</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

//Contains Feed Page UI
const FeedPage = ( {navigation} ) => {
  return (
    <SafeAreaView style={styles.safeAreaView}>
      <TopBar></TopBar>
      <View style={styles.container}>
        <Text style={styles.title}>Feed</Text>
      </View>
      <View style={[styles.formAction, {justifyContent: 'flex-end'}]}>
        <TouchableOpacity 
          onPress={() => {
            navigation.navigate('Login')
          }}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>return to login page</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

//Contains Search Page UI
const SearchPage = () => {
  return (
    <SafeAreaView style={styles.safeAreaView}>
      <TopBar></TopBar>
      <View style={styles.container}>
        <Text style={styles.title}>Search</Text>
      </View>
    </SafeAreaView>
  );
};

//Contains Activity Logging Page UI
const ActivityLogPage = () => {
  return (
    <SafeAreaView style={styles.safeAreaView}>
      <TopBar></TopBar>
      <View style={styles.container}>
        <Text style={styles.title}>Activity Log</Text>
      </View>
    </SafeAreaView>
  );
};

//Contains Messaging Page UI
const MessagesPage = () => {
  return (
    <SafeAreaView style={styles.safeAreaView}>
      <TopBar></TopBar>
      <View style={styles.container}>
        <Text style={styles.title}>Messages</Text>
      </View>
    </SafeAreaView>
  );
};

//Contains Profile Page UI
const ProfilePage = () => {
  return (
    <SafeAreaView style={styles.safeAreaView}>
      <TopBar></TopBar>
      <View style={styles.container}>
        <Text style={styles.title}>Profile</Text>
      </View>
    </SafeAreaView>
  );
};

//Creates a navigation bar which navigates the 5 main pages
const HomeTabs = () => {
  return (
    <Tab.Navigator screenOptions={{
      tabBarShowLabel: false, 
      tabBarStyle: { backgroundColor: 'white', height: 60 },
      tabBarItemStyle: { flex: 1, justifyContent: 'center', alignItems: 'center' },
      tabBarIconStyle:{marginTop:10}}}>
      <Tab.Screen 
        name="Feed" 
        component={FeedPage} 
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? require('./assets/FeedIcon.png') : require('./assets/FeedIcon.png')}
              style={{ width: 120, height: 120 }}
            />
          ), headerShown:false
        }}/>
      <Tab.Screen 
        name="Search" 
        component={SearchPage} 
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? require('./assets/SearchIcon.png') : require('./assets/SearchIcon.png')}
              style={{ width: 120, height: 120 }}
            />
          ), headerShown:false
        }}/>
      <Tab.Screen 
        name="ActivityLog" 
        component={ActivityLogPage} 
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? require('./assets/ActivityLogIcon.png') : require('./assets/ActivityLogIcon.png')}
              style={{ width: 120, height: 120 }}
            />
          ), headerShown:false
        }}/>
      <Tab.Screen 
        name="Messages" 
        component={MessagesPage} 
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? require('./assets/MessageIcon.png') : require('./assets/MessageIcon.png')}
              style={{ width: 120, height: 120 }}
            />
          ), headerShown:false
        }}/>
      <Tab.Screen 
        name="Profile" 
        component={ProfilePage} 
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? require('./assets/ProfileIcon.png') : require('./assets/ProfileIcon.png')}
              style={{ width: 120, height: 120 }}
            />
          ), headerShown:false
        }}/>
    </Tab.Navigator>
  );
};

//Reusable Object, the bar at the top which displays weather and streak icon
const TopBar = ({props}) => {
  return (
    <View style={{width:'100%',height:80, backgroundColor: 'gray'}}>
      <View style={{alignItems:''}}></View>
    </View>
  );
};

//Contains Login pages, Create Account Pages and the HomeTabs
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginPage} options={{headerShown:false}}/>
        <Stack.Screen name="CreateAccount" component={CreateAccountPage} options={{headerShown:false}}/>
        <Stack.Screen name="TermsAndConditions" component={TermsAndConditionsPage} options={{headerShown:false}}/>
        <Stack.Screen name="CreateActivitySelection" component={CreateActivitySelectionPage} options={{headerShown:false}}/>
        <Stack.Screen name="CreateGoalSetting" component={CreateGoalSettingPage} options={{headerShown:false}}/>
        <Stack.Screen name="Home" component={HomeTabs} options={{headerShown:false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

//Style Sheet for the Entire Software
const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: '#3e5879'
  },
  container: {
    padding: 24,
  },
  header: {
    marginVertical: 16,
  },
  subtitle:{
    fontSize: 15,
    fontWeight: '500',
    color: '#929292',
    textAlign: 'center',
  },
  title: {
    fontSize: 50,
    fontWeight: '700',
    color: '#1e1e1e',
    marginBottom: 8,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
    margin: 20,
  },
  createAccountInput: {
    marginBottom: 10,
    margin: 20,
  },
  inputLabel:{
    fontSize: 17,
    fontWeight: '600',
    color: '#222',
    marginBottom: 8,
  },
  inputBox:{
    height: 60,
    width: '100%',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: '500',
    color: '#222',
    elevation: 10
  },
  form: {
    marginBottom: 24,
    flex: 1
  },
  formAction: {
    marginTop: 50,
    marginVertical: 24,
    marginHorizontal: 20

  },
  button:{
    height: 60,
    width: '100%',
    backgroundColor: '#075eec',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#075eec',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff'

  },
  hyperlink:{
    marginTop: 10,
    fontsize: 16,
    fontWeight: '600',
    color: 'blue',
    textDecorationLine: 'underline'
  },
  hyperlinkCreateAccount:{
    marginTop: 10,
    fontSize: 16,
    fontWeight: '600',
    color: 'blue',
    textDecorationLine: 'underline',
    textAlign: 'center'
  },
  activityCard: {
    width: 100,
    height: 120,
    marginVertical: 10,
    marginHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 10
  },
  profilePicture:{

  }
});

//Local Data
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