'use strict';
const express = require('express');
const app = express();
const cors = require('cors')
const bodyParser = require('body-parser');
const API_PORT = 3000;
const DB_PROJECTS = require('./db/projects.json');
const DB_USERS = require('./db/users.json');

const PROJECT_CREATION  = {
  NAME_MISSING: `Votre projet n'a pas de nom.`
}

app.use(cors());
app.use(bodyParser.json());


// Load all the projects
app.get('/projects', (req, res) => {
  res.json(DB_PROJECTS);
});

app.post('/projects', (req, res) => {
  const name = req.body.name;
  if(!name){
    return res.status(522 ).json({name: PROJECT_CREATION.NAME_MISSING})
  }

  return res.json({name, creationDate: new Date().getTime()})
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
app.post('/user', (req, res) => {
   const login = req.body.login;
   const user = DB_USERS.find(u => u.login === login);
   if(user){
      res.json(user);
   }else {
     res.status(500).send(`No user with the login: ${login}`);
   }
});


const launchServer = () => {
    app.listen(API_PORT, () => {
        console.log(`API listening on port ${API_PORT}`);
    });
}

launchServer();
