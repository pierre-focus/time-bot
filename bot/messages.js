const data = [
  {name: 'USER_KNOWN', message: name => `Bonjour ${name}`},
  {name: 'USER_CREATED',  message: name => `Bonjour ${name} vous êtes maintenant enregistré dans notre système ...`},
  {name: 'USER_ADD_PROJECTS', message: name => `Souhaitez vous ajouter un projet ${name}?`, parent: 'USER_KNOWN'},
  {
    name: 'LAST_PROJECTS',
    message : user => `Bonjour ${user.login}, voici test dernières saisies: ${user.records.reduce((p, c)=> `${p} ${c.project}`,'')}`,
    parent: 'USER_KNOWN'
  }
];

const findMessageByName = name => data.find(n => n.name === name).message;

module.exports = findMessageByName;
