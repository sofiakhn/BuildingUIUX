import React from 'react';
import LoginView from './LoginView';
import SignupView from './SignupView';
import TodayView from './TodayView'
import ExercisesView from './ExercisesView'
import ProfileView from './ProfileView'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { SimpleLineIcons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { FontAwesome } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { TouchableOpacity, Image, View, Text } from 'react-native';

const TabNavigation = createBottomTabNavigator();
function BottomTabNavigator({ route }) {
  return (
    <TabNavigation.Navigator
      tabBarOptions={{
        activeTintColor: '#942a21',
        inactiveTintColor: 'gray',
      }}>
      <TabNavigation.Screen
        name="Today"
        options={{
          tabBarLabel: 'Today',
          tabBarIcon: ({ tintColor }) => {
            return <FontAwesome name="sun-o" size={25} color={tintColor} />;
          },
          tabBarOptions: {
            activeTintColor: '#942a21',
            inactiveTintColor: 'gray',
          },
          animationEnabled: true,
        }}>
        {(props) => <TodayView {...props} username={route.params.username} accessToken={route.params.accessToken} revokeAccessToken={route.params.revokeAccessToken} />}
      </TabNavigation.Screen>

      <TabNavigation.Screen
        name="Exercises"
        options={{
          tabBarLabel: 'Exercises',
          tabBarIcon: ({ tintColor }) => {
            return <FontAwesome5 name="dumbbell" size={25} color={tintColor} />;
          },
          tabBarOptions: {
            activeTintColor: '#942a21',
            inactiveTintColor: 'gray',
          },
          animationEnabled: true,
        }}>

        {(props) => <ExercisesView {...props} username={route.params.username} accessToken={route.params.accessToken} revokeAccessToken={route.params.revokeAccessToken} />}
      </TabNavigation.Screen>

      <TabNavigation.Screen
        name="Profile"
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ tintColor }) => {
            return <Icon name="id-card" size={25} color={tintColor} style={{ marginRight: 20 }} />;
          },
          tabBarOptions: {
            activeTintColor: '#942a21',
            inactiveTintColor: 'gray',
          },
          animationEnabled: true,
        }}>
        {(props) => <ProfileView {...props} username={route.params.username} accessToken={route.params.accessToken} revokeAccessToken={route.params.revokeAccessToken} />}
      </TabNavigation.Screen>
    </TabNavigation.Navigator>
  );
}

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      accessToken: undefined,
      username: undefined,
      goalDailyActivity: 0
    }

    this.login = this.login.bind(this);
    this.revokeAccessToken = this.revokeAccessToken.bind(this);

    this.SignoutButton = this.SignoutButton.bind(this);
  }

  /**
   * Store the username and accessToken here so that it can be
   * passed down to each corresponding child view.
   */
  login(username, accessToken) {
    this.setState({
      username: username,
      accessToken: accessToken
    });
  }

  /**
   * Revokes the access token, effectively signing a user out of their session.
   */
  revokeAccessToken() {
    this.setState({
      accessToken: undefined
    });
  }

  /**
   * Returns the user to the login page.
   */
  backToLogin() {
    this.revokeAccessToken();
  }

  /**
   * Defines a signout button.
   */
  SignoutButton = () => {
    return <>
      <View style={{ flexDirection: 'row', marginRight: 25 }}>
        <TouchableOpacity onPress={() => this.backToLogin()}>
          <Text>
            <SimpleLineIcons name="logout" size={32} color="#942a21" />
          </Text>
        </TouchableOpacity>
      </View>
    </>
  }

  /**
   * Note that there are many ways to do navigation and this is just one!
   * I chose this way as it is likely most familiar to us, passing props
   * to child components from the parent.
   * 
   * Other options may have included contexts, which store values above
   * (similar to this implementation), or route parameters which pass
   * values from view to view along the navigation route.
   * 
   * You are by no means bound to this implementation; choose what
   * works best for your design!
   */
  render() {

    // Our primary navigator between the pre and post auth views
    // This navigator switches which screens it navigates based on
    // the existent of an access token. In the authorized view,
    // which right now only consists of the profile, you will likely
    // need to specify another set of screens or navigator; e.g. a
    // list of tabs for the Today, Exercises, and Profile views.
    let AuthStack = createStackNavigator();

    return (
      <NavigationContainer>
        <AuthStack.Navigator>
          {!this.state.accessToken ? (
            <>
              <AuthStack.Screen
                name="SignIn"
                options={{
                  title: 'Fitness Tracker Welcome',
                }}
              >
                {(props) => <LoginView {...props} login={this.login} />}
              </AuthStack.Screen>

              <AuthStack.Screen
                name="SignUp"
                options={{
                  title: 'Fitness Tracker Signup',
                }}
              >
                {(props) => <SignupView {...props} />}
              </AuthStack.Screen>
            </>
          ) : (
              <>
                <AuthStack.Screen
                  name="FitnessTracker"
                  initialParams={{
                    username: this.state.username,
                    accessToken: this.state.accessToken,
                    revokeAccessToken: this.revokeAccessToken
                  }}
                  options={{
                    headerLeft: this.SignoutButton
                  }}>
                  {(props) => <BottomTabNavigator {...props} username={this.state.username} accessToken={this.state.accessToken} revokeAccessToken={this.revokeAccessToken} />}
                </AuthStack.Screen>
              </>
            )}
        </AuthStack.Navigator>
      </NavigationContainer >
    );
  }
}

export default App;