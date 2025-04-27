import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import styles from '../styles/styles';

const TermsAndConditionsPage = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.safeAreaView}>
            <View style={styles.container}>
                <Text style={styles.title}>Terms & Conditions</Text>

                {/* Terms and Conditions Content */}
                <Text style={styles.text}>
                    **1. Ethical Considerations**: Flex is committed to following ethical guidelines for data protection. We will uphold the principles of integrity and transparency and respect for participants rights.
                </Text>
                
                <Text style={styles.text}>
                    **2. Data Usage and Privacy**:
                    We collect the following user data during account registration:
                    - Name
                    - Date of Birth
                    - Email
                    - Gender
                    - Address
                    - Username
                    - Password
                    Optional: Height, Weight, Goals

                    This information is required for account creation, and optional data will be used to enhance your experience. We make sure that passwords are encrypted before storing them in a secure database.
                </Text>

                <Text style={styles.text}>
                    **3. Confidentiality**:
                    User data such as private messages and group passwords will be encrypted and stored securely. We will never share your personal information without your consent. You have control over who can view your data or delete it.
                </Text>

                <Text style={styles.text}>
                    **4. Use of Public Data and APIs**:
                    To enhance your experience, we use third-party APIs to provide fitness-related content such as workout recommendationsand weather information. We ensure that:
                    - Only reputable and verified sources are used.
                    - We obtain permission to use the data necessary.
                    - We credit data sources to maintain integrity.
                </Text>

                <Text style={styles.text}>
                    **5. Data Generation and Testing**:
                    5.1 **User Data Collection**: We collect and store sensitive data such as location, age, and interests to provide personalized recommendations. All sensitive data will be encrypted and stored securely.

                    5.2 **Testing and Evaluation**: To test the platform, we will recruit voluntary participants who will be fully anonymized to ensure privacy. Participants can withdraw at any time, and their data will be deleted immediately upon request.
                </Text>

                <Text style={styles.text}>
                    **6. Data Protection**:
                    We take measures to protect user data:
                    - User profiles can be set to private.
                    - Private messages and group messages will be encrypted.
                    - Group passwords will be encrypted and stored securely.
                </Text>

                <Text style={styles.text}>
                    **7. Algorithmic Fairness**:
                    We aim to avoid bias in our algorithm by:
                    - Giving users control over filtering profiles they can see.
                    
                </Text>

                <Text style={styles.text}>
                    **8. Digital Safety, Age Restrictions, and Privacy Concerns**:
                    We take digital safety seriously:
                    - Users under 16 years old will not be allowed to create an account.
                    - we will prevent precise location tracking for privacy risks.
                    - Users will be able to block others to stop harassment and ensure a safe social environment.
                </Text>

                <Text style={styles.text}>
                    **9. User Rights**:
                    By using Flex, you have the right to:
                    - Modify or delete your personal data.
                    - Access and manage your privacy settings.
                    - Withdraw from the platform at any time.
                </Text>

                <Text style={styles.text}>
                    **10. Consent and Agreement**:
                    By signing up for an account, you consent to the collection, use, and storage of your data in accordance with these terms. You acknowledge that you have read and understood these Terms and Conditions and agree to be bound by them.
                </Text>

                <Text style={styles.text}>
                    **11. Changes to Terms and Conditions**:
                    We may update these Terms and Conditions periodically. All changes will be posted on this page, and we encourage you to review them regularly. Continued use of the platform constitutes acceptance of any updates to these terms.
                </Text>

                <Text style={styles.text}>
                    **12. Contact Us**:
                    If you have any questions or concerns regarding these Terms and Conditions, please contact us at FLEX@GMAIL.COM.
                </Text>
            </View>

            {/* Back Button at the Top Left */}
            <View style={styles.container}>
                <TouchableOpacity
                    onPress={() => {
                        navigation.goBack();  // Will take the user back to the previous page
                    }}>
                    <Text style={[styles.hyperlink, { marginTop: 0, margin: 20 }]}>Back</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default TermsAndConditionsPage;
