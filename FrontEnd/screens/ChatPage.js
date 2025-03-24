import React, {useState} from 'react';
import { SafeAreaView, View, Image, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import styles from '../styles/styles';
import { useRoute } from '@react-navigation/native';

const ChatPage = ({ navigation }) => {
    //collects information chat information needed to load the messages
    //the chat id should be used to identify the chat
    const route = useRoute();
    const { chatName, chatID, chatPF } = route.params;

    //contains the message being typed in the message input field
    const [message, setMessage] = useState();
    
    //called when the user presses the send message button
    function SendMessage(outgoingMessage){
        if(outgoingMessage != ''){
            //upload message to database here

            setMessage('');
        }
    }
    return (
      <SafeAreaView style={styles.safeAreaView}>

        {/*Chat Infobar*/}
        <View style={chatPageStyles.infoBar}>

            {/*Back button*/}
            <TouchableOpacity onPress={() => {navigation.goBack()}}>
                <Image style={chatPageStyles.backArrow} source={require('../assets/BackArrow.png')}/>
            </TouchableOpacity>

            {/*chat profile picture and name*/}
            <Image style={chatPageStyles.chatProfilePicture} source={{ uri: chatPF}}/>
            <Text style={chatPageStyles.chatName}>{chatName}</Text>
        </View>

        {/*Ensures the items on the page shift up when the keyboard opens*/}
        <KeyboardAvoidingView style={{ flex: 1 }}>
            
            {/*Message Bar at the bottom of the screen*/}
            <View style={{flex:1, justifyContent: 'flex-end'}}>
                <View style={chatPageStyles.messageContainer}>
                    <TextInput 
                        style={chatPageStyles.messageBar}
                        multiline={true}
                        placeholder='Type Message...'
                        placeholderTextColor="black"
                        value={message}
                        onChangeText={setMessage}
                    />

                    {/*Send message button*/}
                    <TouchableOpacity onPress={() => {SendMessage(message)}}>
                        <Image style={chatPageStyles.sendMessageButton} source={require('../assets/SendMessage.png')}/>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  };

const chatPageStyles = StyleSheet.create({
    //chat info bar
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
    //send message bar
    messageContainer: {
        width: '100%', 
        flex: 0,
        backgroundColor: 'gray', 
        justifyContent: 'center', 
        alignItems: 'flex-start', 
        flexDirection: 'row'
    },
    messageBar: {
        width: '85%', 
        flex: 0, 
        backgroundColor: 'white', 
        borderRadius: 20, 
        marginLeft: 10, 
        marginTop: 10, 
        marginBottom: 10
    },
    sendMessageButton: {
        width: 30,
        height: 30,
        marginTop: 14,
        marginRight: 15,
        marginLeft: 10
    },
})
export default ChatPage;