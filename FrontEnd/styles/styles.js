import { StyleSheet } from 'react-native';


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

export default styles;