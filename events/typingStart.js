const Discord = require("discord.js");
const { GetServer } = require("../functions/http-functions/servers");

module.exports = async (client, channel, user) => {
    try {
        let model;
        await GetServer({ serverid: channel.guild.id })
            .then(res => model = res.data.model)
            .catch(err => model = err.response.data.model);

        if (model.status === 'success') {
            if (model.resultItems.serverid === channel.guild.id && channel.guild.channels.cache.find(item => item.id === model.resultItems.modchannelid)) {
                const eventEmbed = require('../embeds/eventEmbed')
                const embed = new Discord.MessageEmbed(eventEmbed)
    
                embed.setDescription('Started Typing')
                embed.addFields(
                    { name: `${user.username} started typing`, value: `In Channel: ${channel.name}` },
                    { name: `Channel ID: ${channel.id}`, value: `Channel NSFW: ${channel.nsfw}` },
                )
                return client.channels.cache.get(model.resultItems.modchannelid).send({ embed });
            }
        }
    } catch (err) {
        console.log(err)
    }
};