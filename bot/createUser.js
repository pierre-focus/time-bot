const utils = require('./utils');
const fetch = require('isomorphic-fetch');
// Superbe service
module.exports = slackUserId => fetch(`http://localhost:3000/user/login/slack/${slackUserId}`, {method: 'POST'}).then(utils.parse);
