import React from 'react';
import TextField from '@material-ui/core/TextField';
import { StyleSheet, Modal, TouchableHighlight, TouchableOpacity, Button, Image, View, Text, TextInput, ScrollView } from 'react-native';
import { Card } from 'react-native-elements';
import { FontAwesome5 } from '@expo/vector-icons';

class ExercisesView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activities: [],
            addExerciseModalVisible: false,
            editExerciseModalVisible: false,
            newExerciseName: "",
            newExerciseDuration: 0,
            newExerciseDate: "2020-11-18T2:12:13",
            newExerciseCalories: 0,
            editExerciseName: "",
            editExerciseDuration: 0,
            editExerciseDate: "2020-11-18T2:12:13",
            editExerciseCalories: 0,
        }

    }

    setAddExerciseModalVisible = (visible) => {
        this.setState({ addExerciseModalVisible: visible });
    }
    setEditExerciseModalVisible = (visible) => {
        this.setState({ editExerciseModalVisible: visible });
    }

    componentDidMount() {
        // get the completed exercises
        fetch('https://mysqlcs639.cs.wisc.edu/activities', {
            method: 'GET',
            headers: { 'x-access-token': this.props.accessToken }
        })
            .then(res => res.json())
            .then(res => {
                this.setState({
                    activities: res.activities,
                });
            });
    }

    setEditStates(name, duration, date, calories, id) {
        this.setState({ editExerciseName: name })
        this.setState({ editExerciseDuration: duration })
        this.setState({ editExerciseDate: date })
        this.setState({ editExerciseCalories: calories })
        this.setState({ editExerciseId: id })
        this.setEditExerciseModalVisible(true)
    }

    getActivities() {
        let activities = this.state.activities;
        const cardsArray = activities.map(activity => (
            <Card key={activity.name} style={styles.exerciseCard}>
                <Text style={styles.medRedText}>{activity.name}</Text>
                <Text style={styles.medBlackText}>{activity.duration} Minutes</Text>
                <Text style={styles.medBlackText}>{(activity.date).toString()}</Text>
                <Text style={styles.medBlackText}>{activity.calories} Calories Burned!</Text>
                <View style={{ justifyContent: 'center', flexDirection: 'row', flexWrap: 'wrap' }}>
                    <Button color="#942a21" style={styles.buttonInline} title="Edit" onPress={() => this.setEditStates(activity.name, activity.duration, activity.date, activity.calories, activity.id)} />
                    <View style={styles.spaceHorizontal} />
                    <Button color="#942a21" style={styles.buttonInline} title="Delete" onPress={() => this.deleteExercise(activity.id)} />
                </View>
            </Card>
        ))

        return <>
            {this.updateExerciseModal(this.state.editExerciseModalVisible)}
            {cardsArray}
        </>
    }

    addExercise(modalVisible, exerciseName, exerciseDuration, exerciseDate, exerciseCalories) {
        fetch('https://mysqlcs639.cs.wisc.edu/activities', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': this.props.accessToken
            },
            body: JSON.stringify({
                id: exerciseName,
                name: exerciseName,
                duration: exerciseDuration,
                date: exerciseDate,
                calories: exerciseCalories
            })
        })
            .then(res => res.json())
            .then(res => {
                this.setAddExerciseModalVisible(false);
                alert(exerciseName + " added!");
            })
            .then(res=>{

                fetch('https://mysqlcs639.cs.wisc.edu/activities', {
                    method: 'GET',
                    headers: { 'x-access-token': this.props.accessToken }
                })
                    .then(res => res.json())
                    .then(res => {
                        this.setState({
                            activities: res.activities,
                        });
                    });

            })
            .catch(err => {
                alert("Something went wrong! Verify you have filled out the fields correctly.");
            });

    }

    deleteExercise(activityId) {
        fetch('https://mysqlcs639.cs.wisc.edu/activities/' + activityId, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': this.props.accessToken
            },
        })
            .then(res => res.json()
                .then(res => {
                    alert("Deleted exercise!")
                })
                .then(res=>{

                    fetch('https://mysqlcs639.cs.wisc.edu/activities', {
                        method: 'GET',
                        headers: { 'x-access-token': this.props.accessToken }
                    })
                        .then(res => res.json())
                        .then(res => {
                            this.setState({
                                activities: res.activities,
                            });
                        });
    
                })
            ).catch(err => {
                alert("Something went wrong! Could not delete exercise.");
            });
    }

    updateExercise(modalVisible, exerciseName, exerciseDuration, exerciseDate, exerciseCalories, activityId) {
       
        fetch('https://mysqlcs639.cs.wisc.edu/activities/' + activityId, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': this.props.accessToken
            },
            body: JSON.stringify({
                id: activityId,
                name: exerciseName,
                duration: parseFloat(exerciseDuration),
                date: exerciseDate,
                calories: parseFloat(exerciseCalories)
            })
        })
            .then(res => res.json()
                .then(res => {
                    this.setEditExerciseModalVisible(!modalVisible)
                    alert("Updated " + exerciseName + "!")
                })

                .then(res=>{

                    fetch('https://mysqlcs639.cs.wisc.edu/activities', {
                        method: 'GET',
                        headers: { 'x-access-token': this.props.accessToken }
                    })
                        .then(res => res.json())
                        .then(res => {
                            this.setState({
                                activities: res.activities,
                            });
                        });
    
                })
            ).catch(err => {
                console.log(err);
                alert("Something went wrong! Could not update exercise.");
            });
    }

    addExerciseModal(modalVisible) {
        return <>
            <View style={styles.centeredView}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style= {styles.medBlackText}>
                            Add Exercise 
                            </Text>
                            <TextInput
                                style={styles.modalText}
                                placeholder="Exercise Name"
                                onChangeText={(newExerciseName) => this.setState({ newExerciseName: newExerciseName })}
                                value={this.state.newExerciseName + ""}
                            />
                            <TextInput
                                style={styles.modalText}
                                placeholder="Duration (minutes)"
                                onChangeText={(newExerciseDuration) => this.setState({ newExerciseDuration: newExerciseDuration })}
                                value={this.state.newExerciseDuration + ""}
                            />
                            <TextInput
                                style={styles.modalText}
                                placeholder="Calories"
                                onChangeText={(newExerciseCalories) => this.setState({ newExerciseCalories: newExerciseCalories })}
                                value={this.state.newExerciseCalories + ""}
                            />
                            <View style={{ justifyContent: 'center', flexDirection: 'row', flexWrap: 'wrap' }}>
                                <TouchableHighlight
                                    style={{ ...styles.openButton, backgroundColor: "#942a21" }}
                                    onPress={() => {
                                        this.addExercise(this.state.modalVisible, this.state.newExerciseName, this.state.newExerciseDuration, this.state.newExerciseDate, this.state.newExerciseCalories); //this.setModalVisible(!modalVisible);
                                    }}
                                >
                                    <Text style={styles.textStyle}>Save</Text>
                                </TouchableHighlight>
                                <View style={styles.spaceHorizontal} />
                                <TouchableHighlight
                                    style={{ ...styles.openButton, backgroundColor: "#942a21" }}
                                    onPress={() => {
                                        this.setAddExerciseModalVisible(!modalVisible);
                                    }}
                                >
                                    <Text style={styles.textStyle}>Nevermind!</Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                    </View>
                </Modal>

                <TouchableHighlight
                    style={styles.openButton}
                    onPress={() => {
                        this.setAddExerciseModalVisible(true);
                    }}
                >
                    <Text style={styles.textStyle}>Add Exercise</Text>
                </TouchableHighlight>
            </View>
        </>
    }

    updateExerciseModal(modalVisible) {
        return <>
            <View style={styles.centeredView}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style= {styles.medBlackText}>
                            Edit Exercise 
                            </Text>
                            <TextInput
                                style={styles.modalText}
                                placeholder="Exercise Name"
                                onChangeText={(editExerciseName) => this.setState({ editExerciseName: editExerciseName })}
                                value={this.state.editExerciseName + ""}
                            />
                            <TextInput
                                style={styles.modalText}
                                placeholder="Duration"
                                onChangeText={(editExerciseDuration) => this.setState({ editExerciseDuration: editExerciseDuration })}
                                value={this.state.editExerciseDuration + ""}
                            />
                            <TextInput
                                style={styles.modalText}
                                placeholder="Calories"
                                onChangeText={(editExerciseCalories) => this.setState({ editExerciseCalories: editExerciseCalories })}
                                value={this.state.editExerciseCalories + ""}
                            />
                            <View style={{ justifyContent: 'center', flexDirection: 'row', flexWrap: 'wrap' }}>
                                <TouchableHighlight
                                    style={{ ...styles.openButton, backgroundColor: "#942a21" }}
                                    onPress={() => {
                                        this.updateExercise(modalVisible, this.state.editExerciseName, this.state.editExerciseDuration, this.state.editExerciseDate, this.state.editExerciseCalories, this.state.editExerciseId); //this.setModalVisible(!modalVisible);
                                    }}
                                >
                                    <Text style={styles.textStyle}>Save</Text>
                                </TouchableHighlight>
                                <View style={styles.spaceHorizontal} />
                                <TouchableHighlight
                                    style={{ ...styles.openButton, backgroundColor: "#942a21" }}
                                    onPress={() => {
                                        this.setEditExerciseModalVisible(false);
                                    }}
                                >
                                    <Text style={styles.textStyle}>Nevermind!</Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        </>
    }

    render() {
        return <>
            <ScrollView style={styles.mainContainer} contentContainerStyle={{ flexGrow: 11, justifyContent: 'center', alignItems: "center" }}>
                <Text>
                    <FontAwesome5 name="dumbbell" size={60} color="#942a21" />
                </Text>
                <Text style={styles.bigText}>Your Exercises</Text>

                {this.addExerciseModal(this.state.addExerciseModalVisible)}

                {/*<Button color="#942a21" style={styles.buttonInline} title="Add Exercise" onPress={() => this.addExercise()} />*/}
                {this.getActivities()}
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
        textAlign: 'center',
        marginBottom: 8
    },
    medRedText: {
        fontSize: 18,
        fontWeight: "700",
        textAlign: 'center',
        marginBottom: 2,
        color: "#CEB5B7"
    },
    buttonInline: {
        display: "flex"
    },
    exerciseCard: {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#fff',
        width: '70%',
        padding: 10,
        marginTop: 20,
        alignItems: 'center'
    },
    spaceHorizontal: {
        display: "flex",
        width: 20
    },
    centeredView: {
        //flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        padding: 30,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    openButton: {
        backgroundColor: "#E69597",
        padding: 10,
        elevation: 2
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 5,
        textAlign: "left",
    }
});

export default ExercisesView;