import React from 'react';
import { StyleSheet, Button, TouchableOpacity, Image, View, Text, ScrollView } from 'react-native';
import { Card} from 'react-native-elements'
import { FontAwesome } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';

class TodayView extends React.Component {
    /**
     * Specifies the default values that will be shown for a split second
     * while data is loading in from the server.
     */
    constructor(props) {
        super(props);
        this.state = {
            activities: [],
            goalDailyActivity: 0,
            actualDailyActivity: 0,
            goalDailyCalories: 0,
            actualDailyCalories: 0,
            goalDailyProtein: 0,
            actualDailyProtein: 0,
            goalDailyCarbohydrates: 0,
            actualDailyCarbohydrates: 0,
            goalDailyFat: 0,
            actualDailyFat: 0
        }
    }

    componentDidMount() {
        this._navListener = this.props.navigation.addListener('focus', () => {
          // Do your fetch and thening here!
          fetch('https://mysqlcs639.cs.wisc.edu/activities', {
            method: 'GET',
            headers: { 'x-access-token': this.props.accessToken }
          })
            .then(res => res.json())
            .then(res => {
                this.setState({
                    activities: res.activities,
                });
                let total = 0;
                for (let i = 0; i < this.state.activities.length; i++) {
                    total += this.state.activities[i].duration;
                }
                this.setState({ actualDailyActivity: total });
            });

        });

        fetch('https://mysqlcs639.cs.wisc.edu/users/' + this.props.username, {
            method: 'GET',
            headers: { 'x-access-token': this.props.accessToken }
        })
            .then(res => res.json())
            .then(res => {
                this.setState({
                    goalDailyCalories: res.goalDailyCalories,
                    goalDailyProtein: res.goalDailyProtein,
                    goalDailyCarbohydrates: res.goalDailyCarbohydrates,
                    goalDailyFat: res.goalDailyFat,
                    goalDailyActivity: res.goalDailyActivity
                });
            });
    }

    // return all of the activity cards for today
    getActivities() {
        let activities = this.state.activities;
        const cardsArray = activities.map(activity => (
            <Card key={activity.name} style={styles.todayCard}>
                <Text style={styles.medRedText}>{activity.name}</Text>
                <Text style={styles.medBlackText}>{activity.duration} minutes</Text>
                <Text style={styles.medBlackText}>{(activity.date).toString()}</Text>
                <Text style={styles.medBlackText}>{activity.calories} calories burned!</Text>
            </Card>
        ))

        return <>
            {cardsArray}
        </>
    }

    // return all of the meal cards for today
    getMeals() {
        return <>
            <Card style={styles.todayCard}>
                <Text>[Meal]</Text>
            </Card>
        </>
    }

    refresh(){

        fetch('https://mysqlcs639.cs.wisc.edu/activities', {
            method: 'GET',
            headers: { 'x-access-token': this.props.accessToken }
          })
            .then(res => res.json())
            .then(res => {
                this.setState({
                    activities: res.activities,
                });
                let total = 0;
                for (let i = 0; i < this.state.activities.length; i++) {
                    total += this.state.activities[i].duration;
                }
                this.setState({ actualDailyActivity: total });
            });

        this.getActivities()

    }

    render() {
      this.componentDidMount(); 
        return <>
            <ScrollView style={styles.mainContainer} contentContainerStyle={{ flexGrow: 11, justifyContent: 'center', alignItems: "center" }}>
            <View style={styles.spaceSmall}><Text>  </Text></View>

                <Text style={styles.bigText}>Today</Text>
                <View style={styles.spaceSmall}><Text>  </Text></View>

                <Text>
                    <FontAwesome5 name="dumbbell" size={25} color="black" />
                </Text>
                <Text style={styles.medBlackText}>
                    Today's Total Activity: 
                </Text>
                <Text style={styles.medBlackText}>
                    {this.state.actualDailyActivity} / {this.state.goalDailyActivity} Active Minutes
                </Text>
                <Text style={styles.medRedText}>
                    Today's Activities
                </Text>
                {this.getActivities()}

                {/* <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    <Button color="#E69597" style={styles.buttonInline} title="Refresh" onPress={() => this.refresh()} />
                </View> */}

                <Text style={styles.topMargin}>
                    <MaterialCommunityIcons name="food" size={35} color="black" />
                </Text>
                <Text style={styles.medBlackText}>
                    Daily Calorie Goal: {this.state.actualDailyCalories} / {this.state.goalDailyCalories}
                </Text>
                <Text style={styles.medBlackText}>
                    Daily Protein Goal: {this.state.actualDailyProtein} / {this.state.goalDailyProtein}
                </Text>
                <Text style={styles.medBlackText}>
                    Daily Carb Goal: {this.state.actualDailyCarbohydrates} / {this.state.goalDailyCarbohydrates}
                </Text>
                <Text style={styles.medBlackText}>
                    Daily Fat Goal : {this.state.actualDailyFat} / {this.state.goalDailyFat}
                </Text>
                <Text style={styles.medRedText}>
                    Today's Meals
                </Text>
                {this.getMeals()}
            </ScrollView>
        </>
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1
    },
    bigText: {
        fontSize: 32,
        fontWeight: "700",
        marginBottom: 5,
        color: "#E69597"
    },
    medBlackText: {
        fontSize: 18,
        fontWeight: "500",
        marginBottom: 8
    },
    medRedText: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 2,
        color: "#CEB5B7"
    },
    smallText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 25
    },
    todayCard: {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#fff',
        width: '70%',
        padding: 10,
        marginTop: 20,
        alignItems: 'center'
    },
    topMargin: {
        marginTop: 30
    }
});

export default TodayView;