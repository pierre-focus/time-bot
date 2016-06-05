import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';

const parse = response =>  {
  if(response.status >=200 || response.status < 300){
    return response.json()
  }
  return response.text();
};

const Project = ({name, tasks}) => <View>
  <Text>name</Text>
  {tasks.map(task => <Text key={task}>{task}</Text>)}
</View>

const ProjectViewer = ({projects}) => {
  return <View>
    <Text >
      Projects list
    </Text>
    {projects.map(project => <Project key={project.name} {...project} />)}
  </View>
}

class Projects extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      projects: []
    }
  }
  componentWillMount(){
    fetch(`http://localhost:3000/Projects`)
    .then(parse)
    .then(projects => this.setState({projects}))
    .catch(err => this.setState({projects: err}));
  }
  render(){
    const {projects} = this.state;
    return <ProjectViewer projects={projects} />
  }
}

export default Projects;
