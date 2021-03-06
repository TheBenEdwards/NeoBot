const Discord = require("discord.js");
const { GetServer } = require("../functions/http-functions/servers");

module.exports = async (client, role) => {
    try {
        let model;
        await GetServer({ serverid: role.guild.id })
            .then(res => model = res.data.model)
            .catch(err => model = err.response.data.model);

        if (model.status === 'success') {
            if (model.resultItems.serverid === role.guild.id && role.guild.channels.cache.find(item => item.id === model.resultItems.modchannelid)) {
                const eventEmbed = require('../embeds/eventEmbed')
                const embed = new Discord.MessageEmbed(eventEmbed)

                embed.setDescription('Role Deletion')
                embed.addFields(
                    { name: 'A Role has been Deleted', value: `Details are listed below.` },
                    { name: `Role Name: ${role.name}`, value: `Role ID: ${role.id}` },
                )
                return client.channels.cache.get(model.resultItems.modchannelid).send({ embed });
            }
        }
    } catch (err) {
        console.log(err)
    }
};
