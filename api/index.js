'use strict';
const express = require('express');
const app = express();
const cors = require('cors')
const bodyParser = require('body-parser');
const API_PORT = 3000;
const DB_PROJECTS = require('./db/projects.json');


app.use(cors());
app.use(bodyParser.json());
// respond with "hello world" when a GET request is made to the homepage
app.get('/projects', function(req, res) {
  res.json(DB_PROJECTS);
});

const launchServer = () => {
    app.listen(API_PORT, () => {
        console.log(`API listening on port ${API_PORT}`);
    });
}

launchServer();
