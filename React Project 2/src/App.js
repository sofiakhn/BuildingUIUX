import React from 'react';
import './App.css';
import Sidebar from './Sidebar';
import CourseArea from './CourseArea';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import CompletedCourses from './CompletedCourses';
import Recommended from './Recommended';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allCourses: [],
      filteredCourses: [],
      subjects: [],
      cartCourses: {},
      completed:[], 
      ratings:[],
      interests:[],
      highRatings:[],
      highRatedSubjects:[],
    }
  }

  componentDidMount() {
   this.loadInitialState()
  }

  async loadInitialState(){
    let courseURL = "http://mysqlcs639.cs.wisc.edu:53706/api/react/classes";
    let courseData = await (await fetch(courseURL)).json()
    let completedURL = "http://mysqlcs639.cs.wisc.edu:53706/api/react/students/5022025924/classes/completed";
    let completedData = await(await fetch(completedURL)).json()

    this.setState({allCourses: courseData, filteredCourses: courseData, subjects: this.getSubjects(courseData)});
    this.setState({completed: completedData});
  }

  getInterests(data){
    return ['algebra','behavior','brain','ecology' , 'law', 'programming', 'trigonometry'];
  }

  getSubjects(data) {
    let subjects = [];
    subjects.push("All");

    for(let i = 0; i < data.length; i++) {
      if(subjects.indexOf(data[i].subject) === -1)
        subjects.push(data[i].subject);
    }

    return subjects;
  }
  setCompleted(courses) {
    this.setState({completed: courses})
  }

  setCourses(courses) {
    this.setState({filteredCourses: courses})
  }
 
  setInterests(interests) {
    this.setState({interests: interests})
  }

  addCartCourse(data) {
    let newCartCourses = JSON.parse(JSON.stringify(this.state.cartCourses))// I think this is a hack to deepcopy
    let courseIndex = this.state.allCourses.findIndex((x) => {return x.number===data.course})
    if (courseIndex === -1)
    {
      return 
    }

    if('subsection' in data) {
      if(data.course in this.state.cartCourses) {
        if(data.section in this.state.cartCourses[data.course]) {
          newCartCourses[data.course][data.section].push(data.subsection);
        }
        else {
          newCartCourses[data.course][data.section] = [];
          newCartCourses[data.course][data.section].push(data.subsection);
        }
      }
      else {
        newCartCourses[data.course] = {};
        newCartCourses[data.course][data.section] = [];
        newCartCourses[data.course][data.section].push(data.subsection);
      }
    }
    else if('section' in data) {
      if(data.course in this.state.cartCourses) {
        newCartCourses[data.course][data.section] = [];

        for(let i = 0; i < this.state.allCourses[courseIndex].sections[data.section].subsections.length; i++) {
          newCartCourses[data.course][data.section].push(this.state.allCourses[courseIndex].sections[data.section].subsections[i]);
        }
      
      
      }
      else {
        newCartCourses[data.course] = {};
        newCartCourses[data.course][data.section] = [];
        for(let i = 0; i < this.state.allCourses[courseIndex].sections[data.section].subsections.length; i++) { 
          newCartCourses[data.course][data.section].push(this.state.allCourses[courseIndex].sections[data.section].subsections[i]);
        }
      }
    }
    else {
      newCartCourses[data.course] = {};


      for (let i = 0; i < this.state.allCourses[courseIndex].sections.length; i++){
        newCartCourses[data.course][i] = [];

         for(let c= 0; c < this.state.allCourses[courseIndex].sections[i].subsections.length; c ++){
          newCartCourses[data.course][i].push(this.state.allCourses[courseIndex].sections[i].subsections[c]);
        }

      }


    }
    this.setState({cartCourses: newCartCourses});
  }

  removeCartCourse(data) {
    let newCartCourses = JSON.parse(JSON.stringify(this.state.cartCourses))

    if('subsection' in data) {
      newCartCourses[data.course][data.section].splice(newCartCourses[data.course][data.section].indexOf(data.subsection), 1);
      if(newCartCourses[data.course][data.section].length === 0) {
        delete newCartCourses[data.course][data.section];
      }
      if(Object.keys(newCartCourses[data.course]).length === 0) {
        delete newCartCourses[data.course];
      }
    }
    else if('section' in data) {
      delete newCartCourses[data.course][data.section];
      if(Object.keys(newCartCourses[data.course]).length === 0) {
        delete newCartCourses[data.course];
      }
    }
    else {
      delete newCartCourses[data.course];
    }
    this.setState({cartCourses: newCartCourses});
  }

  getCartData() {
    let cartData = [];

    for(const courseKey of Object.keys(this.state.cartCourses)) {
      let course = this.state.allCourses.find((x) => {return x.number === courseKey})

      cartData.push(course);
    }
    return cartData;
  }

  rated (rate,course){
     
      let highRatedSubjectTemp = '';  //Could be blank
      let highRatingsTemp =  [JSON.parse(JSON.stringify(this.state.highRatings))]; 
      let ratingsTemp = JSON.parse(JSON.stringify(this.state.ratings));
      ratingsTemp[course] = rate;
      if(rate>3){
      highRatingsTemp = course; 
        let i = 0;
          if(highRatingsTemp.indexOf('PSYCH') !== -1)
              highRatedSubjectTemp = "Psychology";
          else if(highRatingsTemp.includes('COMP'))
            highRatedSubjectTemp = "Computer Science";
          else if(highRatingsTemp.includes('CHEM'))
           highRatedSubjectTemp = "Chemistry";
          else if(highRatingsTemp.includes('MATH'))
            highRatedSubjectTemp = "math";
          else if(highRatingsTemp.includes('BIO'))
            highRatedSubjectTemp = "Biology";
          else if(highRatingsTemp.includes('STAT'))
            highRatedSubjectTemp = "Statistics";
        }

    this.setState({highRatedSubjects:highRatedSubjectTemp, ratings:ratingsTemp, highRatings: highRatingsTemp});
  }

  getMeetsRequirements(data){
    let courseReqs = data.requisites; 
    let completed = ["PSYCH 202","COMP SCI 200","COMP SCI 300","CHEM 103","MATH 114","MATH 221"];
    let pass = true; 
    let string = false; 
    for(let i =0; i < courseReqs.length; i++){
      if(completed.includes(courseReqs[i]))
        continue; 
      else{
        pass = false; 
        break; 
      }
    }
    if(pass) {
       string = "Great! You meet requirements for this course. "
    }
    else{
        string = "Sorry! You do not meet requirements for this course."
    }
    return(
      <p style={{'fontStyle':"italic", 'color':'maroon'}}>
        {string}
      </p>
    )
  }
  render() {
 
    return (
      <>
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
          integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
          crossOrigin="anonymous"
        />

        <Tabs defaultActiveKey="search" style={{position: 'fixed', zIndex: 1, width: '100%', backgroundColor: 'white'}}>
          <Tab eventKey="search" title="Search" style={{paddingTop: '5vh'}}>
            <Sidebar setCourses={(courses) => this.setCourses(courses)} courses={this.state.allCourses} subjects={this.state.subjects} interests={this.state.interests}/>
            <div style={{marginLeft: '20vw'}}>
              <CourseArea data={this.state.filteredCourses} addCartCourse={(data) => this.addCartCourse(data)} removeCartCourse={(data) => this.removeCartCourse(data)} cartCourses={this.state.cartCourses} getMeetsRequirements={(course) => this.getMeetsRequirements(course)}  />
            </div>
          </Tab>
          <Tab eventKey="cart" title="Cart" style={{paddingTop: '5vh'}}>
            <div style={{marginLeft: '20vw'}}>
            <CourseArea data={this.getCartData()} addCartCourse={(data) => this.addCartCourse(data)} removeCartCourse={(data) => this.removeCartCourse(data)} cartCourses={this.state.cartCourses} getMeetsRequirements={(course) => this.getMeetsRequirements(course)} />            </div>
          </Tab>
          <Tab eventKey="completed" title="Completed" style={{paddingTop: '5vh'}}>
            <div style={{marginLeft: '20vw'}}>
              <CompletedCourses data = {this.state.completed} rated = {this.rated.bind(this)} />
            </div>
          </Tab>
          <Tab eventKey="recommended" title="Recommended" style={{paddingTop: '5vh'}}>
            <div style={{marginLeft: '20vw'}}>
              <Recommended setCourses={(courses) => this.setCourses(courses)} data = {this.state.allCourses} completed = {this.state.completed} highRatedSubjects={this.state.highRatedSubjects} highRatings = {this.state.highRatings}/>
            </div>
          </Tab>
        </Tabs>
      </>
    )
  }
}

export default App;