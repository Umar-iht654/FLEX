import React, {useState, useRef, useCallback} from 'react';
import { SafeAreaView, View, Image, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Modal, FlatList } from 'react-native';
import styles from '../styles/styles';
import { useFocusEffect, useRoute } from '@react-navigation/native';

const ChatPage = ({ navigation }) => {
    //collects information chat information needed to load the messages
    //the chat id should be used to identify the chat
    const route = useRoute();
    const { chatType, chatName, chatID, chatPF } = route.params;

    //contains the message being typed in the message input field
    const [message, setMessage] = useState();
    
    const [currentUser, setCurrentUser] = useState(0);
    const [currentChat, setCurrentChat] = useState([])
    const [currentChatInfo, setCurrentChatInfo] = useState();

    //chat controls
    const [numberOfMessages, setNumberOfMessages] = useState(20);
    //controls when cetain views are visable
    const [optionsMenuVisable, setOptionsMenuVisable] = useState(false);
    
    const flatListRef = useRef(null);
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

    const getProfilePicture = (userID) => {
        const user = currentChatInfo.find(user => user.userID === userID);
        return user ? user.profilePicture : null;
    };

    function GetChat(){
        const chatUsersInfo = [
            {userID: 1, username: 'User1', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg'},
            {userID: 2, username: 'User2', profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg'},
        ]

        setCurrentChatInfo(chatUsersInfo);
        const messages = [
            {id: 68, content: 'Whats your plan for tomorrow?', senderID: 2, timeStamp: '2025-04-24 22:52:00'},
            {id: 67, content: 'That movie was insane!', senderID: 1, timeStamp: '2025-04-24 22:53:00'},
            {id: 66, content: 'Can you send me the notes?', senderID: 0, timeStamp: '2025-04-24 22:54:00'},
            {id: 65, content: 'Bro you missed a mad session today', senderID: 2, timeStamp: '2025-04-24 22:55:00'},
            {id: 64, content: 'What you eating rn?', senderID: 1, timeStamp: '2025-04-24 22:56:00'},
            {id: 63, content: 'I need new gym shoes lol', senderID: 0, timeStamp: '2025-04-24 22:57:00'},
            {id: 62, content: 'Might hit the library later', senderID: 2, timeStamp: '2025-04-24 22:58:00'},
            {id: 61, content: 'Your outfit was fire today 🔥', senderID: 1, timeStamp: '2025-04-24 22:59:00'},
            {id: 60, content: 'Bruv im so tired', senderID: 0, timeStamp: '2025-04-24 23:00:00'},
            {id: 59, content: 'Did you finish that assignment?', senderID: 2, timeStamp: '2025-04-24 23:01:00'},
            {id: 58, content: 'Nah bro im still on question 3', senderID: 1, timeStamp: '2025-04-24 23:02:00'},
            {id: 57, content: 'Lets link up tomorrow', senderID: 0, timeStamp: '2025-04-24 23:03:00'},
            {id: 56, content: 'You still awake?', senderID: 2, timeStamp: '2025-04-24 23:04:00'},
            {id: 55, content: 'Yeah just chilling wbu', senderID: 1, timeStamp: '2025-04-24 23:05:00'},
            {id: 54, content: 'Bout to sleep tbh', senderID: 0, timeStamp: '2025-04-24 23:06:00'},
            {id: 53, content: 'You see the match earlier?', senderID: 2, timeStamp: '2025-04-24 23:07:00'},
            {id: 52, content: 'Bro that goal was nuts', senderID: 1, timeStamp: '2025-04-24 23:08:00'},
            {id: 51, content: 'We winning the league fr', senderID: 0, timeStamp: '2025-04-24 23:09:00'},
            {id: 50, content: 'Haha dream on mate', senderID: 2, timeStamp: '2025-04-24 23:10:00'},
            {id: 49, content: 'Oi what time you free tomorrow', senderID: 1, timeStamp: '2025-04-24 23:11:00'},
            {id: 48, content: 'After 5pm probably', senderID: 0, timeStamp: '2025-04-24 23:12:00'},
            {id: 47, content: 'Safe safe', senderID: 2, timeStamp: '2025-04-24 23:13:00'},
            {id: 46, content: 'Get some rest g', senderID: 1, timeStamp: '2025-04-24 23:14:00'},
            {id: 45, content: 'You too bro', senderID: 0, timeStamp: '2025-04-24 23:15:00'},
            {id: 44, content: 'Night fam', senderID: 2, timeStamp: '2025-04-24 23:16:00'},
            {id: 43, content: 'Night night', senderID: 1, timeStamp: '2025-04-24 23:17:00'},
            {id: 42, content: 'Sweet dreams lol', senderID: 0, timeStamp: '2025-04-24 23:18:00'},
            {id: 41, content: 'U up?', senderID: 2, timeStamp: '2025-04-24 23:19:00'},
            {id: 40, content: 'Just woke up why?', senderID: 1, timeStamp: '2025-04-24 23:20:00'},
            {id: 39, content: 'Forgot to tell you smth', senderID: 0, timeStamp: '2025-04-24 23:21:00'},
            {id: 38, content: 'What what', senderID: 2, timeStamp: '2025-04-24 23:22:00'},
            {id: 37, content: 'We got free food at the event tmw', senderID: 1, timeStamp: '2025-04-24 23:23:00'},
            {id: 36, content: 'Say less im pulling up', senderID: 0, timeStamp: '2025-04-24 23:24:00'},
            {id: 35, content: 'Dress code casual?', senderID: 2, timeStamp: '2025-04-24 23:25:00'},
            {id: 34, content: 'Yeah bro normal stuff', senderID: 1, timeStamp: '2025-04-24 23:26:00'},
            {id: 33, content: 'Lit', senderID: 0, timeStamp: '2025-04-24 23:27:00'},
            {id: 32, content: 'Good vibes only', senderID: 2, timeStamp: '2025-04-24 23:28:00'},
            {id: 31, content: 'You know the vibe', senderID: 1, timeStamp: '2025-04-24 23:29:00'},
            {id: 30, content: 'Gonna be a mad one', senderID: 0, timeStamp: '2025-04-24 23:30:00'},
            {id: 29, content: 'Bring the speaker?', senderID: 2, timeStamp: '2025-04-24 23:31:00'},
            {id: 28, content: 'Bet ill pack it', senderID: 1, timeStamp: '2025-04-24 23:32:00'},
            {id: 27, content: 'Bless', senderID: 0, timeStamp: '2025-04-24 23:33:00'},
            {id: 26, content: 'Need anything else?', senderID: 2, timeStamp: '2025-04-24 23:34:00'},
            {id: 25, content: 'Maybe some drinks?', senderID: 1, timeStamp: '2025-04-24 23:35:00'},
            {id: 24, content: 'On it', senderID: 0, timeStamp: '2025-04-24 23:36:00'},
            {id: 23, content: 'You a real one', senderID: 2, timeStamp: '2025-04-24 23:37:00'},
            {id: 22, content: 'Anything for the mandem', senderID: 1, timeStamp: '2025-04-24 23:38:00'},
            {id: 21, content: 'Safe bro', senderID: 0, timeStamp: '2025-04-24 23:39:00'},
            {id: 20, content: 'Blessed', senderID: 2, timeStamp: '2025-04-24 23:40:00'},
            {id: 19, content: 'You hear new Drake album?', senderID: 1, timeStamp: '2025-04-24 23:41:00'},
            {id: 18, content: 'Yeah its cold', senderID: 0, timeStamp: '2025-04-24 23:42:00'},
            {id: 17, content: 'Favourite track?', senderID: 2, timeStamp: '2025-04-24 23:43:00'},
            {id: 16, content: 'First one goes hard', senderID: 1, timeStamp: '2025-04-24 23:44:00'},
            {id: 15, content: 'Might listen on repeat lol', senderID: 0, timeStamp: '2025-04-24 23:45:00'},
            {id: 14, content: 'Same haha', senderID: 2, timeStamp: '2025-04-24 23:46:00'},
            {id: 13, content: 'Music therapy fr', senderID: 1, timeStamp: '2025-04-24 23:47:00'},
            {id: 12, content: 'Facts', senderID: 0, timeStamp: '2025-04-24 23:48:00'},
            {id: 11, content: 'Ok im actually sleeping now', senderID: 2, timeStamp: '2025-04-24 23:49:00'},
            {id: 10, content: 'Nighttt', senderID: 1, timeStamp: '2025-04-24 23:50:00'},
            {id: 9, content: 'Sleep tight g', senderID: 0, timeStamp: '2025-04-24 23:51:00'},
            {id: 8, content: 'Catch you tomorrow', senderID: 2, timeStamp: '2025-04-24 23:52:00'},
            {id: 7, content: 'Hey i saw you on tik tok and thought you were cure', senderID: 0, timeStamp: '2025-04-25 00:07:00'},
            {id: 6, content: 'Yh what time you going gym later>', senderID: 2, timeStamp: '2025-04-25 00:06:00'},
            {id: 5, content: 'dothst though not protest like a sinner?', senderID: 1, timeStamp: '2025-04-25 00:05:00'},
            {id: 4, content: 'hath thy protest of the dearest raisin', senderID: 0, timeStamp: '2025-04-25 00:04:00'},
            {id: 3, content: 'you going gym later?', senderID: 1, timeStamp: '2025-04-25 00:03:00'},
            {id: 2, content: 'Whats going on man', senderID: 2, timeStamp: '2025-04-25 00:02:00'},
            {id: 1, content: 'Hey', senderID: 1, timeStamp: '2025-04-25 00:01:00'},
            {id: 0, content: 'Hello', senderID: 0, timeStamp: '2025-04-25 00:00:00'}
          ];
        const splitMessages = messages.slice(0, numberOfMessages)
        setCurrentChat(splitMessages);
        setNumberOfMessages(prev => prev + 20);

         
    }

    const MessageCard = ({ item }) => {
        const isCurrentUser = item.senderID === currentUser;
        return(
            <View style={{width: '100%'}}>
                <Text style={{color: 'white', textAlign: 'center'}}>{item.timeStamp}</Text>
                <View style={{width: '100%',flexDirection: 'row', justifyContent: isCurrentUser ? 'flex-end' : 'flex-start' }}>
                    {!isCurrentUser && (
                        <Image style={chatPageStyles.chatProfilePicture} source={{ uri: getProfilePicture(item.senderID) }} />
                    )}
                    <View style={[chatPageStyles.mainMessageContainer, isCurrentUser? chatPageStyles.myMessage : chatPageStyles.theirMessage]}>
                        <Text style={chatPageStyles.messageText}>{item.content}</Text>
                    </View>
                </View>
            </View>
        )
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

    useFocusEffect(
        useCallback(() => {
            // This function will run every time the screen is focused
            setNumberOfMessages(20);
            GetChat();
        }, [])
    );
    return (
      <SafeAreaView style={[styles.safeAreaView, {justifyContent: 'flex-start', flexDirection: 'column'}]}>

        {/*Chat Infobar*/}
        <View style={chatPageStyles.infoBar}>
            <View style={chatPageStyles.infoBarLeft}>
                {/*Back button*/}
                <TouchableOpacity onPress={() => {navigation.navigate('Home', {screen: 'Messages'})}}>
                    <Image style={chatPageStyles.backArrow} source={require('../assets/BackArrow.png')}/>
                </TouchableOpacity>

                {/*chat profile picture and name*/}
                <TouchableOpacity onPress={() => {
                    if(chatType == "friend"){
                        navigation.navigate('UserProfile', { userID: chatName, previousPage: 'Chat' })
                    }else{
                        navigation.navigate('GroupChatInfo', { groupName: chatName, groupPF: chatPF})
                    }}}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        {chatPF ? (
                            <Image style={chatPageStyles.chatProfilePicture} source={{ uri: chatPF }} />
                            ) : (
                            <View style={[chatPageStyles.chatProfilePicture, {backgroundColor: 'gray'}]}/>
                        )}
                        <Text style={chatPageStyles.chatName}>{chatName}</Text>
                    </View>
                </TouchableOpacity>
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
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
            <View style={{ flex: 1 }}>
                <FlatList
                    ref={flatListRef}
                    data={currentChat}
                    keyExtractor={(item) => item.id}
                    renderItem={MessageCard}
                    inverted
                    style={{ flex: 1 }}
                    contentContainerStyle={{ flexGrow: 1 }}
                    ListFooterComponent={
                        <TouchableOpacity 
                            onPress={() => {GetChat()}}
                            style={{ paddingVertical: 10 }}
                        >
                            <Image 
                                style={{
                                    width: 50, 
                                    height: 50, 
                                    alignSelf: 'center'
                                }} 
                                source={require('../assets/RefreshIcon.png')}
                            />
                        </TouchableOpacity>
                    }
                />
                {/*Message Bar at the bottom of the screen*/}
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
    //messages
    mainMessageContainer: {
        marginVertical: 4,
        padding: 10,
        marginHorizontal: 10,
        marginVertical: 10,
        borderRadius: 12,
        maxWidth: '70%',
    },
    myMessage: {
        backgroundColor: '#DCF8C5',
        alignSelf: 'flex-end',
    },
    theirMessage: {
        backgroundColor: '#ECECEC',
        alignSelf: 'flex-start',
    },
    messageText: {
        fontSize: 16,
    },
})
export default ChatPage;
