import React from 'react';
import './App.css';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import Rating from 'react-rating';

class Recommended extends React.Component {
  constructor(props) {
    super(props);
  }


  getCourses(){

    let name = this.props.highRatedSubjects;
    let coursesAfterSearch = [];
  
      for(const course of this.props.data)
        {                 
            if( this.props.highRatedSubjects === course.subject){
                    coursesAfterSearch.push(course.name); 
                } 
    } 
    return coursesAfterSearch;
  }

 
 
  render() {

    return (
        <div>
            <h3 style={{paddingTop:'30px'}}> Recommended Courses </h3>
            <ListGroup  style={{paddingTop:'30px' ,maxWidth:'50%'}}>
                Based on your interests in certain interest areas, we think you'd enjoy: 
                <div> 
                    <p>
                    {this.getCourses().join(' |||  \r\n' )}
                    </p>
                </div>
                
            </ListGroup>

        </div>
    );
  }
}   
export default Recommended;