const Discord = require("discord.js");
const { Reply } = require("../functions/helpers");

exports.run = async (client, interaction, options) => {
    const body = {
        title: options.find(item => item.name === 'title').value
    };

    const pollEmbed = require('../embeds/pollEmbed')
    const embed = new Discord.MessageEmbed(pollEmbed)

    embed.setDescription('Custom poll')
    embed.addFields(
        { name: body.title, value: `Reply below` },
        { name: '\u200B', value: '---VOTES---' },
        { name: 'YES', value: `None`, inline: true },
        { name: 'NO', value: `None`, inline: true },
        { name: `↓ Vote Below ↓`, value: `👍 = Yes || 👎 = No` },
    )

    let poll;
    Reply(client, interaction, embed, null, 'poll')
    setTimeout(async () => {
        poll = await client.guilds.resolve(interaction.guild_id).channels.resolve(interaction.channel_id).messages.fetch(client.guilds.resolve(interaction.guild_id).channels.resolve(interaction.channel_id).lastMessageID)
        await poll.react('👍')
        await poll.react('👎')
    }, 500);
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: 1
};

exports.help = {
    name: 'custompoll',
    description: 'A custom poll',
    options: [
        { name: 'title', description: 'The title of the poll', required: true, type: 3 },
    ]
};