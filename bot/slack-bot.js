'use strict';
const RtmClient = require('@slack/client').RtmClient;
const MemoryDataStore = require('@slack/client').MemoryDataStore;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
const loadUserBySlackId = require('./loadUserBySlackId');
const token = process.env.SLACK_API_TOKEN || '';

const getMessage = require('./messages');

let session = {};

console.log('TOKEN', token)
const rtm = new RtmClient(token , {
  dataStore: new MemoryDataStore()
}/*,{logLevel: 'debug'}*/);


rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, rtmStartData => {
  const user = rtm.dataStore.getUserById(rtm.activeUserId);

  // Get the team's name
  const team = rtm.dataStore.getTeamById(rtm.activeTeamId);

  // Log the slack team name and the bot's name
  console.log('Connected to ' + team.name + ' as ' + user.name);

  console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
});


const saveInSession = (userId, messageCode, data) =>  {
  session[userId] = {userId, lastMessage: messageCode, data}
}

rtm.on(RTM_EVENTS.MESSAGE, message  => {

  //console.log('user', rtm.dataStore.getUserById(message.user).name);
  //console.log('channel', rtm.dataStore.getChannelById(message.channel));
  //console.log('team', rtm.dataStore.getTeamById(message.team).name);

  const user = rtm.dataStore.getUserById(message.user)
  const dm = rtm.dataStore.getDMByName(user.name);

  console.log('Call the API');
  console.log('test', getMessage('USER_ADD_PROJECTS')(user.name));
  loadUserBySlackId(user.id).then(usr => {
    // Le user est dans la base et a au moins un projet
      if(usr && usr.records && usr.records.length > 0){
        //console.log('user has a project', usr)
        rtm.sendMessage(
          getMessage('LAST_PROJECTS')(usr),
          dm.id,
          () => saveInSession(user.id, 'LAST_PROJECTS', usr)
        );
      }else {
        // Le user n'a pas de projet on lui propose d'en ajouter ?
        //console.log('user no projects', usr)
        rtm.sendMessage(
          getMessage('USER_ADD_PROJECTS')(user.name),
          dm.id,
          () => saveInSession(user.id, 'USER_ADD_PROJECTS', usr)
        );
      }

      // Le user a des projects
        // Saisie des temps ou projet
      // Le user n'a pas de projet
        // Saisie de projet
    // Le user n'existe pas dans la base
    // on t'a créé
    // Le user n'a pas de projet
  }).catch(e => {
    console.log('Pas de user existant', e)
    rtm.sendMessage(
      getMessage('USER_CREATED')(user.name),
      dm.id,
      () => saveInSession(user.id, 'USER_CREATED', e)
    );
  });

  // Listens to all `message` events from the team
});

rtm.on(RTM_EVENTS.CHANNEL_CREATED, message => {
  // Listens to all `channel_created` events from the team
  console.log('channel', message)
});
const start = () => rtm.start();

module.exports = start;
