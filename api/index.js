'use strict';
const express = require('express');
const app = express();
const cors = require('cors')
const bodyParser = require('body-parser');
const API_PORT = 3000;

// DB utilities
let DB_PROJECTS = require('./db/projects.json');
let DB_USERS = require('./db/users.json');
const _findUserByLogin = login => DB_USERS.find(u => u.login === login);
const _findUserBySlackId = slackId => DB_USERS.find(u => u.slackId === slackId);
const _createUser = user => DB_USERS.push(user);
const _updateUser =  newUser => {
  const userIndex = DB_USERS.findIndex(u => u.login === newUser.login);
  if(userIndex === -1){
    // errors
  }
  DB_USERS = [...DB_USERS.slice(0, userIndex), newUser, ...DB_USERS.slice( userIndex + 1 )];
};
const _findProjectByName = name => DB_PROJECTS.find(p => p.name === name);
const _createProject = project =>DB_PROJECTS.push(project);
const _validateTimeRecord = timeRecord => {
  let err = {};
  if(!timeRecord.project || !_findProjectByName(timeRecord.project)){
    err.project = `Votre projet n'est pas dans notre base projet. Pensez à en créer un, c'est si simple...`;
  }
  if(!timeRecord.duration || typeof timeRecord.duration !== "number"){
    err.timeRecord = `Vous n'avez pas saisie une durée valide pour votre saisie de temps.`
  }
  if(!timeRecord.date || typeof timeRecord.duration !== "number"){
    err.date = `Vous n'avez pas saisie une date valide pour votre saisie de temps.`
  }
  if(!err.hasOwnProperty()){return;}
  return err;
}

const PROJECT_CREATION  = {
  NAME_MISSING: `Votre projet n'a pas de nom.`,
  ALREADY_EXIST: `Votre projet existe déjà... Un peu de sérieux...`
}

app.use(cors());
app.use(bodyParser.json());
app.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

// Load all the projects
app.get('/projects', (req, res) => {
  res.json(DB_PROJECTS);
});


app.post('/projects', (req, res) => {
  const name = req.body.name;
  const tasks = req.body.tasks
  if(!name){
    res.status(522 ).json({name: PROJECT_CREATION.NAME_MISSING})
  }else {
    const project = _findProjectByName(name);
    if(project){
      res.status(522 ).json({name: PROJECT_CREATION.ALREADY_EXIST})
    }else {
      const newProject = {name: name, tasks: tasks, creationDate: new Date().getTime() };
      _createProject(newProject);
      res.json(newProject)
    }

  }
});

/*

{
  data: {

  },
  errors: [],
  question: ''
}

*/

// Login du user
app.post('/user/login', (req, res) => {
   const login = req.body.login;
   const user = _findUserByLogin(login);
   if(user){
      res.json(user);
   }else {
     res.status(500).send(`Pas d'utilisateur avec le login renseigné: ${login}`);
   }
});
app.get('/user/login/slack/:slackId', (req, res) => {
    console.log('slack id route');
   const slackId = req.params.slackId;
   const user = _findUserBySlackId(slackId);
   if(user){
      res.json(user);
   }else {
     res.status(500).send(`Pas d'utilisateur avec l'identifiant slack renseigné: ${slackId}`);
   }
});
app.get('/users', (req, res) => {
      res.json(DB_USERS);
});

app.post('/user', (req, res) => {
   const login = req.body.login;
   const slackId = req.body.login;
   const user = _findUserByLogin(login);
   if(!user){
      const newUser = {login, records: [], slackId};
      _createUser(newUser);
      res.json(newUser);
   }else {
     res.status(500).send(`On a déjà un user avec ce login: ${login}`);
   }
});


app.post('/user/:login/time-record', (req, res) => {
  //user
  const user = _findUserByLogin(req.params.login);
  const body = req.body;
  const record = {
    project: body.project,
    duration: body.duration,
    task: body.task,
    comment: body.comment,
    type: body.type,
    date: body.date || new Date().getTime()
  };
  const errTimeRecord = _validateTimeRecord(record);
  if(errTimeRecord){
    res.status(522 ).json(errTimeRecord)
  }else {
    user.records = [...user.records, record];
    _updateUser(user);
    res.json(record);
  }
});


const launchServer = () => {
    app.listen(API_PORT, () => {
        console.log(`API listening on port ${API_PORT}`);
    });
}
launchServer();
