// Init NEO
const Discord = require('discord.js');
const client = new Discord.Client();
// These are external libraries required to run additional Functions
const fs = require('fs');
const moment = require('moment');

require('./util/eventLoader')(client);

const log = message => {
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${message}`);
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./commands/', (err, files) => {
  if (err) console.error(err);
  log(`Loading a total of ${files.length} commands.`);
  files.forEach(f => {
    const props = require(`./commands/${f}`);
    log(`Loading Command: ${props.help.name}. 🟩`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./commands/${command}`)];
      const cmd = require(`./commands/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.elevation = message => {
  let permlvl = 0;
  try {
    const member_role = message.member.roles.cache.find(r => r.id === "Member");
    if (member_role && message.member.roles.cache.has(member_role.id)) permlvl = 1;
    const mod_role = message.member.roles.cache.find(r => r.name === "Moderator");
    if (mod_role && message.member.roles.cache.has(mod_role.id)) permlvl = 2;
    const admin_role = message.member.roles.cache.find(r => r.name === "Admin");
    if (admin_role && message.member.roles.cache.has(admin_role.id)) permlvl = 3;
    return permlvl;
  } 
  catch(err) {
    console.log('Error')
  }
};

//client.login(process.env.BOT_TOKEN);
client.login('NTg3OTA5MjUyODg3MjE2MTI4.XP9bKA.vNespg5NsPmI-8OvCkatppK9-E4');