import React, {useState} from 'react';
import { SafeAreaView, View, Image, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import styles from '../styles/styles';
import { useRoute } from '@react-navigation/native';

const ChatPage = ({ navigation }) => {
    const route = useRoute();
    const { chatName, chatID, chatPF } = route.params;

    const [message, setMessage] = useState();
    
    function SendMessage(outgoingMessage){
        if(outgoingMessage != ''){
            //upload message to database here

            setMessage('');
        }
    }
    return (
      <SafeAreaView style={styles.safeAreaView}>
        <View style={chatPageStyles.infoBar}>
            <TouchableOpacity onPress={() => {navigation.goBack()}}>
                <Image style={chatPageStyles.backArrow} source={require('../assets/BackArrow.png')}/>
            </TouchableOpacity>
            <Image style={chatPageStyles.chatProfilePicture} source={{ uri: chatPF}}/>
            <Text style={chatPageStyles.chatName}>{chatName}</Text>
        </View>
        <KeyboardAvoidingView style={{ flex: 1 }}>
            <View style={{flex:1, justifyContent: 'flex-end'}}>
                <View style={{width: '100%', flex: 0,backgroundColor: 'gray', justifyContent: 'center', alignItems: 'flex-start', flexDirection: 'row'}}>
                    <TextInput 
                        style={{width: '85%', flex: 0, backgroundColor: 'white', borderRadius: 20, marginLeft: 10, marginTop: 10, marginBottom: 10}}
                        multiline={true}
                        placeholder='Type Message...'
                        placeholderTextColor="black"
                        value={message}
                        onChangeText={setMessage}
                    />
                    <TouchableOpacity onPress={() => {SendMessage(message)}}>
                        <Image style={chatPageStyles.sendMessage} source={require('../assets/SendMessage.png')}/>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  };

const chatPageStyles = StyleSheet.create({
    infoBar: {
        width: '100%',
        height: 80, 
        flexDirection: 'row',
        backgroundColor: 'gray', 
        alignItems: 'center', 
        justifyContent: 'flex-start'
    },
    backArrow: {
        width: 50,
        height: 50
    },
    sendMessage: {
        width: 30,
        height: 30,
        marginTop: 14,
        marginRight: 15,
        marginLeft: 10
    },
    chatProfilePicture:{
        width: 50,
        height: 50,
        borderRadius: 50,
        marginLeft:10,
        marginRight: 10
    },
    chatName:{
        fontSize: 30,
        fontWeight: '700',
        color: '#1e1e1e',
        marginRight: 15
      },
})
export default ChatPage;