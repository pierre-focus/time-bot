const RtmClient = require('@slack/client').RtmClient;

const RTM_EVENTS = require('@slack/client').RTM_EVENTS;
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;

const token = process.env.SLACK_API_TOKEN || '';

console.log('TOKEN', token)
const rtm = new RtmClient(token /*,{logLevel: 'debug'}*/);


rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, rtmStartData => {
  console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
});

rtm.on(RTM_EVENTS.MESSAGE,message => {
  console.log('message', message);
  // Listens to all `message` events from the team
});

rtm.on(RTM_EVENTS.CHANNEL_CREATED, message => {
  // Listens to all `channel_created` events from the team
  console.log('channel', message)
});
const start = () => rtm.start();
module.exports = start;
