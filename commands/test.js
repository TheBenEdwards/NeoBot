const Discord = require('discord.js')
const settings = require('../settings.json')
const servers = require('../arrays/servers')

exports.run = (client, message) => {
  let server = servers.find(item => message.guild.id == item.serverID)
  if (server) {
    const commandEmbed = require('../embeds/commandEmbed')
    const embed = new Discord.MessageEmbed(commandEmbed)

    embed.setDescription('Test')
    embed.addFields(
      { name: 'Speed:', value: `${Date.now() - message.createdTimestamp} ms` },
      { name: 'Powered by:', value: `${settings.host}` }
    )
    return message.channel.send({ embed })
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'test',
  description: 'Test command. Check if I am online!',
  usage: 'test'
};
