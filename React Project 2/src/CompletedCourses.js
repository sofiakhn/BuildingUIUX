import React from 'react';
import './App.css';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
// var Rating = require('react-rating-dom');
import Rating from 'react-rating';

class CompletedCourses extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  
  }

  getCourses(){
    var courses = this.props.data.data;
    if(courses){
        var cList = [];
        cList = courses.map((course) => ( 
                        <ListGroupItem variant = 'primary'>
                            <p style ={{fontStyle:'oblique'}}> 
                            {course} <br></br> 
                            </p>
                            <p style ={{color:'gray'}} >
                            Rate it: 
                            </p>
                            
                        <Rating initialRating={0} onChange={(rate) => this.handleClick(rate, course)} />
                        </ListGroupItem>
                    
                    ));
                }

    return cList;
  }
  handleClick = (rate,course) => {
    // console.log("clicked");
    this.props.rated(rate,course);
  }

  shouldComponentUpdate(nextProps){
    return (JSON.stringify(this.props) !== JSON.stringify(nextProps))
  }

  render() {
   
    
    return (
        <div>
            <h3 style={{paddingTop:'30px'}}> Completed Courses </h3>
            <ListGroup style={{paddingTop:'50px' ,maxWidth:'50%'}}>
                {this.getCourses()}
                
            </ListGroup>

        </div>
    );
  }
}   
export default CompletedCourses;