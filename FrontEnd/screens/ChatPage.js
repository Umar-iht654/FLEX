import React, {useState} from 'react';
import { SafeAreaView, View, Image, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Modal } from 'react-native';
import styles from '../styles/styles';
import { useRoute } from '@react-navigation/native';

const ChatPage = ({ navigation }) => {
    //collects information chat information needed to load the messages
    //the chat id should be used to identify the chat
    const route = useRoute();
    const { chatName, chatID, chatPF } = route.params;


    //contains the message being typed in the message input field
    const [message, setMessage] = useState();

    //controls when cetain views are visable
    const [optionsMenuVisable, setOptionsMenuVisable] = useState(false);
    
    //called when the user presses the send message button
    function SendMessage(outgoingMessage){
        if(outgoingMessage != ''){
            //upload message to database here
            setMessage('');
        }
    }

    //changes the options of the current chat
    function SetChatOptions(optionName, newStatus){
        setOptionsMenuVisable(false);
    }
    //gets the chat options of the current chat
    function GetChatOptions(){
        //uses the chat ID to collect the pinned and muted settings from the database
        const chatOptions = [{optionName: 'Pin', status: true}, {optionName: 'Mute', status: false}];
        return chatOptions;
    }

    {/*Options*/}
    const ChatOptionsCard = ({ option, status }) => {
        return(
            //when clicked, calls a function which changes the option in the database
            <TouchableOpacity onPress={()=>{SetChatOptions(option, !status)}}>

                {/*dispays the status of the option*/}
                <View style={chatPageStyles.optionContainer}>
                    {status && (
                        <Text>Un{option.toLowerCase()} chat</Text>
                    )}
                    {!status && (
                        <Text>{option} chat</Text>
                    )}
                </View>
            </TouchableOpacity>
        )
    }
    return (
      <SafeAreaView style={[styles.safeAreaView, {justifyContent: 'flex-start'}]}>

        {/*Chat Infobar*/}
        <View style={chatPageStyles.infoBar}>
            <View style={chatPageStyles.infoBarLeft}>
                {/*Back button*/}
                <TouchableOpacity onPress={() => {navigation.goBack()}}>
                    <Image style={chatPageStyles.backArrow} source={require('../assets/BackArrow.png')}/>
                </TouchableOpacity>

                {/*chat profile picture and name*/}
                <Image style={chatPageStyles.chatProfilePicture} source={{ uri: chatPF}}/>
                <Text style={chatPageStyles.chatName}>{chatName}</Text>
            </View>

            {/*Options button*/}
            <TouchableOpacity onPress={() => {setOptionsMenuVisable(true)}}>
                <Image style={chatPageStyles.optionsButton} source={require('../assets/OptionsIcon.png')}/>
            </TouchableOpacity>
        </View>

        {/*Options Menu Display*/}
        <Modal animationType='fade' transparent={true} visible={optionsMenuVisable} onRequestClose={() => setOptionsMenuVisable(false)}>
            <TouchableOpacity style={chatPageStyles.optionsMenuBackground} activeOpacity={1} onPress={() => setOptionsMenuVisable(false)}>
                <View style={chatPageStyles.optionsMenuContainer}>

                    {/*Displays Options*/}
                    {GetChatOptions().map(thisOption=> (
                        <ChatOptionsCard
                            key = {thisOption.optionName}
                            option = {thisOption.optionName}
                            status = {thisOption.status}
                        />
                    ))}
                </View>
            </TouchableOpacity>
        </Modal>

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
        justifyContent: 'space-between'
    },
    infoBarLeft: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    backArrow: {
        width: 50,
        height: 50
    },
    optionsButton: {
        width: 25,
        height: 25,
        marginRight: 25
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
    //options menu
    optionsMenuBackground: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
    },
      optionsMenuContainer: {
        backgroundColor: 'white', 
        marginTop: 56
    },
      optionContainer: {
        width: 140, 
        height: 40, 
        backgroundColor: 'white', 
        justifyContent: 'center', 
        alignItems: 'flex-start'
    },
})
export default ChatPage;