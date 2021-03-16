/* Sofia Khan CS 639 Fall 2020 
  I used this link as reference, which was posted by Prof Mutlu:
  https://reactnavigation.org/docs/auth-flow/ 
*/ 

import * as React from 'react';
import base64 from 'base-64';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AsyncStorage, Button, TextInput, Text, View, StyleSheet, StatusBar } from 'react-native';

const AuthContext = React.createContext();

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    height: 600, 
    paddingLeft: 20, 
    paddingRight: 20, 
    backgroundColor: 'white'
 },
 containerTwo: {
  flexDirection: 'column',
  height: 600, 
  paddingLeft: 20, 
  paddingRight: 20,
  paddingTop: 10, 
  backgroundColor: 'white', 
},
  bigText: {
    fontSize: 40,
    color: 'darkslateblue',
    fontWeight: 'bold', 
    fontStyle: 'italic'
  },
  titleText: {
    fontSize: 50,
    color: 'indigo',
    fontWeight: 'bold', 
  },
  goodButton: {
    width: 250,
    color: 'white',
    backgroundColor: 'indigo'
  },
  smallGray: {
    fontSize: 11,
    color: 'gray',
    fontStyle: 'italic'
  }
});

function SignUpScreen({ navigation: { navigate } }) {
  const { signUp } = React.useContext(AuthContext);
  const [newUsername, setNewUsername] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  return (
  <View style = {styles.containerTwo}>
  
      <StatusBar hidden />
      <Text style ={styles.titleText}>My Fitness Tracker</Text>

      <TextInput
        placeholder="Username"
        value={newUsername}
        onChangeText={setNewUsername}
      />
      <TextInput
        placeholder="Password"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
      />
      <Text> </Text>
      <Button title="Sign Up!"style= {styles.goodButton}  onPress={() => signUp({ newUsername, newPassword })} />
      <Text>   </Text> 
      <Button title="I have an account. Login." style= {styles.goodButton}  onPress={() => navigate('Sign In')} />
    </View>
  );
}

function SignInScreen({ navigation: { navigate } }) {
  const { signIn } = React.useContext(AuthContext);

  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  return (
    <View style = {styles.containerTwo}>
    <StatusBar hidden />
    <Text style ={styles.titleText}>My Fitness Tracker</Text>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Text> </Text>
      <Button title="Sign In!" style= {styles.goodButton} onPress={() => signIn({ username, password })} />
      <Text> </Text>
      <Button title="Don't have an account? Sign up!" style= {styles.goodButton} onPress={() => navigate('Sign Up')} />
    </View>
  );
}

function ProfileScreen({ route }) {

  let storedFirstname = route.params.firstname;
  let storedLastname = route.params.lastname;
  let storedDailyActivity = route.params.dailyActivity;
  let storedDailyCalories = route.params.dailyCalories;
  let storedDailyCarbs = route.params.dailyCarbs;
  let storedDailyFat = route.params.dailyFat;
  let storedDailyProtein = route.params.dailyProtein;
  const [firstname, setFirstname] = React.useState(storedFirstname);
  const [lastname, setLastname] = React.useState(storedLastname);
  const [dailyActivity, setDailyActivity] = React.useState(storedDailyActivity.toString());
  const [dailyCalories, setDailyCalories] = React.useState(storedDailyCalories.toString());
  const [dailyCarbs, setDailyCarbs] = React.useState(storedDailyCarbs.toString());
  const [dailyFat, setDailyFat] = React.useState(storedDailyFat.toString());
  const [dailyProtein, setDailyProtein] = React.useState(storedDailyProtein.toString());

  const { signOut } = React.useContext(AuthContext);

  return (

    <View style = {styles.container}>
      <StatusBar hidden />

      <Text style = {styles.bigText}>Welcome.</Text>
      <Text style = {{color:'gray'}}>To edit any info, simply tap.</Text>

      <Text style = {styles.smallGray} > First Name</Text>
      <TextInput
        placeholder="First Name"
        value={firstname}
        onChangeText={setFirstname}
      />
      <Text style = {styles.smallGray} > Last Name</Text>
      <TextInput
        placeholder="Last Name"
        value={lastname}
        onChangeText={setLastname}
      />
      <Text style = {styles.smallGray} > Daily Activity Goal (Minutes) </Text>
      <TextInput
        placeholder="Daily Activity Goal"
        keyboardType="numeric"
        value={dailyActivity}
        onChangeText={setDailyActivity}
      />
      <Text style = {styles.smallGray} > Daily Calorie Goal </Text>
      <TextInput
        placeholder="Daily Calorie Goal"
        keyboardType="numeric"
        value={dailyCalories}
        onChangeText={setDailyCalories}
      />
            <Text style = {styles.smallGray} > Daily Carbs Goal </Text>

      <TextInput
        placeholder="Daily Carbohydrate Goal"
        keyboardType="numeric"
        value={dailyCarbs}
        onChangeText={setDailyCarbs}
      />
            <Text style = {styles.smallGray} > Daily Fat Goal </Text>

      <TextInput
        placeholder="Daily Fat Goal"
        keyboardType="numeric"
        value={dailyFat}
        onChangeText={setDailyFat}
      />
            <Text style = {styles.smallGray} > Daily Protein Goal </Text>

      <TextInput
        placeholder="Daily Protein Goal"
        keyboardType="numeric"
        value={dailyProtein}
        onChangeText={setDailyProtein}
      />
      <Text>   </Text>
      <Button title="Sign out" style= {{backgroundColor: 'indigo'}} onPress={() => signOut({ firstname, lastname, dailyActivity, dailyCalories, dailyCarbs, dailyFat, dailyProtein })} />
    </View>
  );
}

const Stack = createStackNavigator();

export default function App() {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
            username: action.username,
            firstname: action.firstname,
            lastname: action.lastname,
            dailyActivity: action.dailyActivity,
            dailyCalories: action.dailyCalories,
            dailyCarbs: action.dailyCarbs,
            dailyFat: action.dailyFat,
            dailyProtein: action.dailyProtein
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
            username: action.username,
            firstname: action.firstname,
            lastname: action.lastname,
            dailyActivity: action.dailyActivity,
            dailyCalories: action.dailyCalories,
            dailyCarbs: action.dailyCarbs,
            dailyFat: action.dailyFat,
            dailyProtein: action.dailyProtein
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
            username: null
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  );

  const authContext = React.useMemo(
    () => ({
      signIn: async data => {
        let firstname;
        let lastname;
        let dailyActivity;
        let dailyCalories;
        let dailyCarbs;
        let dailyFat;
        let dailyProtein;

        // SIGN IN METHOD
        fetch('https://mysqlcs639.cs.wisc.edu/login/', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + base64.encode(data.username + ":" + data.password)
          },
        }).then(response => { return response.json() })
          .then(newdata => {
            if (newdata.token != undefined) {
              AsyncStorage.setItem('token', newdata.token);
              AsyncStorage.setItem('username', data.username);

              let link = "https://mysqlcs639.cs.wisc.edu/users/" + data.username;
              fetch(link, {
                method: 'GET',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  'x-access-token': newdata.token
                },
              }).then(response => { return response.json() })
                .then(result => {
                  firstname = result.firstName;
                  lastname = result.lastName;
                  dailyActivity = result.goalDailyActivity;
                  dailyCalories = result.goalDailyCalories;
                  dailyCarbs = result.goalDailyCarbohydrates;
                  dailyFat = result.goalDailyFat;
                  dailyProtein = result.goalDailyProtein;

                  dispatch({ type: 'SIGN_IN', token: newdata.token, username: data.username, firstname: firstname, lastname: lastname, dailyActivity: dailyActivity, dailyCalories: dailyCalories, dailyCarbs: dailyCarbs, dailyFat: dailyFat, dailyProtein: dailyProtein });
                })
            } else {
              alert("Username/password not valid. New user? Sign up!");
            }
          })
      },
      signOut: async data => {
        // SIGN OUT METHOD
        let username = await AsyncStorage.getItem('username');
        let token = await AsyncStorage.getItem('token');

        let link = 'https://mysqlcs639.cs.wisc.edu/users/' + username;
        fetch(link, {
          method: 'PUT',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'x-access-token': token
          },
          body: JSON.stringify({
            firstName: data.firstname,
            lastName: data.lastname,
            goalDailyActivity: data.dailyActivity,
            goalDailyCalories: data.dailyCalories,
            goalDailyCarbohydrates: data.dailyCarbs,
            goalDailyFat: data.dailyFat,
            goalDailyProtein: data.dailyProtein
          })
        })
          .then(response => response.text())
          .then(result => {
          })
          .catch(error => {
            console.error("Error:", error);
          })
        dispatch({ type: 'SIGN_OUT' });
      },
      signUp: async data => {
        // SIGN UP METHOD
        fetch('https://mysqlcs639.cs.wisc.edu/users/?', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + base64.encode(data.newUsername + ":" + data.newPassword)
          },
          body: JSON.stringify({
            username: data.newUsername,
            password: data.newPassword,
            firstName: "",
            lastName: "",
            goalDailyActivity: 0,
            goalDailyCalories: 0,
            goalDailyProtein: 0,
            goalDailyCarbohydrates: 0,
            goalDailyFat: 0,
          })
        })
          .then(response => response.json())
          .then(newdata => {
            if (newdata.message === "User created!") {
              alert("You've made an account, hooray! Please sign in.")
              dispatch({ type: 'SIGN_IN', token: newdata.token, username: data.newUsername });
            } else {
              alert(newdata.message)
            }
          })
      },
    }),
    []
  );

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Sign In">
          {state.userToken == null ? (
            <>
              <Stack.Screen
                name="Sign Up"
                component={SignUpScreen}
              />
              <Stack.Screen
                name="Sign In"
                component={SignInScreen}
              />
            </>
          ) : (
              <Stack.Screen
                name="Profile"
                component={ProfileScreen}
                initialParams={{
                  username: state.username, token: state.userToken, firstname: state.firstname, lastname: state.lastname,
                  dailyActivity: state.dailyActivity, dailyCalories: state.dailyCalories, dailyCarbs: state.dailyCarbs, dailyFat: state.dailyFat,
                  dailyProtein: state.dailyProtein
                }}
              />
            )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}