const RtmClient = require('@slack/client').RtmClient;
const MemoryDataStore = require('@slack/client').MemoryDataStore;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;

const token = process.env.SLACK_API_TOKEN || '';

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

rtm.on(RTM_EVENTS.MESSAGE,message => {
  ///console.log('message', message);
  //console.log('user', rtm.dataStore.getUserById(message.user).name);
  //console.log('channel', rtm.dataStore.getChannelById(message.channel));
  //console.log('team', rtm.dataStore.getTeamById(message.team).name);

  const user = rtm.dataStore.getUserById(message.user)
  const dm = rtm.dataStore.getDMByName(user.name);
  console.log('dm', dm)
  //console.log('user', user.id, 'message', message.user);
  rtm.sendMessage(`Bonjour ${user.name}`, dm.id , () => {
      // optionally, you can supply a callback to execute once the message has been sent
      console.log('Ca marche')
  });

  // Listens to all `message` events from the team
});

rtm.on(RTM_EVENTS.CHANNEL_CREATED, message => {
  // Listens to all `channel_created` events from the team
  console.log('channel', message)
});
const start = () => rtm.start();
module.exports = start;
