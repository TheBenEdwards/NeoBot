const Discord = require("discord.js");
const { GetServer } = require("../functions/http-functions/servers");

module.exports = async (client, emoji) => {
    let model;
    await GetServer({ serverid: emoji.guild.id })
        .then(res => model = res.data.model.resultItems)
        .catch((err) => { console.log(err) });

    if (model.serverid === emoji.guild.id && emoji.guild.channels.cache.find(item => item.id === model.modchannelid)) {
        const eventEmbed = require('../embeds/eventEmbed')
        const embed = new Discord.MessageEmbed(eventEmbed)

        embed.setDescription('Emoji Creation')
        embed.addFields(
            { name: 'A new Emoji has been added', value: `Details are listed below.` },
            { name: 'Emoji Name', value: `${emoji.name}` },
            { name: 'Emoji ID', value: `${emoji.id}` },
            { name: 'Emoji Animated', value: `${emoji.animated}`, inline: true },
        )
        return client.channels.cache.get(model.modchannelid).send({ embed });
    }
};