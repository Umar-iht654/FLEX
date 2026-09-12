# FLEX
Comp208 Project
# FLEX – The Ultimate Social Fitness Platform

**FLEX (Fitness, Learn and Excel)** is a mobile-first social fitness application that combines goal tracking, community engagement, and real-time social interaction to help users stay motivated in their fitness journey.

The app enables users to:
- Connect with others who share similar fitness goals and interests  
- Create and join fitness groups (public or private)  
- Chat, share progress, and discover nearby facilities  
- Receive personalized friend and activity recommendations  
- Track workouts and visualize progress over time  

---

## Features
- **User Profiles** – Create personalized accounts with bios and fitness goals  
- **Social Interaction** – Add friends, create and join groups, and chat in real-time  
- **Recommendation Engine** – Suggests users, groups, and activities based on location, mutual friends, and shared interests  
- **API Integrations** – Uses OpenWeather, OpenCage, and Foursquare APIs for local data  
- **Privacy & Security** – Encrypted passwords and secure data handling compliant with GDPR  
- **Cross-Platform** – Built with React Native for both Android and iOS  

---

## Tech Stack
**Frontend:** React Native, Expo  
**Backend:** FastAPI / Flask, Python  
**Database:** PostgreSQL  
**APIs:** OpenCage Geocoder, Foursquare, OpenWeather  
**Real-Time:** WebSockets  

---

## Team Members
Siham Abdulkadir · Umar Ihtesham · Louis Selwood · Leon Kiunga · Basit Adedeji · Osaretin Ekhoragbon  

---

## Flex Application: Access & Run Instructions

This one-page guide explains how to clone and run the FLEX repository via Expo.  
The code is publicly hosted on GitHub and will remain available indefinitely.

### Step 1: Clone Repository
GitHub URL: [https://github.com/Umar-iht654/FLEX](https://github.com/Umar-iht654/FLEX)

```bash
git clone https://github.com/Umar-iht654/FLEX.git
```

### Step 2: Install Prerequisites
Make sure you have Node.js and npm installed. Then run:
```bash
npm install --global expo-cli
npx expo install react-native@0.76.9 react-native-web@~0.19.14
```
(react-native-web is optional if you want to open the project in a browser)

### Step 3: Navigate to the Frontend and Install Dependencies
```bash
cd FLEX/Frontend
npm install
```

### Step 4: Run the App
```bash
npx expo start
```
Use your phone’s Expo Go app to scan the QR code, or
Press W to open in your default web browser
