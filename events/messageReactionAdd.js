const Discord = require("discord.js");
const fetch = require("node-fetch")

const PATH = process.env.API_URL
const KEY = process.env.API_KEY

module.exports = async (client, messageReaction, user) => {
    let data = await fetch(`${PATH}/servers/${messageReaction.message.guild.id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'API_KEY': KEY
        }
    })
        .then(res => res.json());

    addReaction = (prevEmbed, ID) => {
        if (prevEmbed.fields.find(item => item.name === ID).value === 'None') {
            return prevEmbed.fields.find(item => item.name === ID).value = `<@${user.id}>`
        } else {
            return prevEmbed.fields.find(item => item.name === ID).value = `${prevEmbed.fields.find(item => item.name === ID).value} \n <@${user.id}>`
        }
    }

    moveReaction = (prevEmbed, ID) => {
        newValue = prevEmbed.fields.find(item => item.name === ID).value.replace(`<@${user.id}>`, '')
        if (newValue === '') newValue = 'None'
        return prevEmbed.fields.find(item => item.name === ID).value = newValue
    }

    // Reactions to NeoBot Polls
    if (data.serverID === messageReaction.message.guild.id) {
        if (user.bot === false && messageReaction.message.author.username === 'NeoBot' && messageReaction.message.embeds[0].title === '**Poll**') {
            let prevEmbed = messageReaction.message.embeds[0]

            if (messageReaction._emoji.name === '👍') {
                if (prevEmbed.fields.find(item => item.name === 'YES').value.includes(`<@${user.id}>`)) {
                    return
                } else {
                    if (prevEmbed.fields.find(item => item.name === 'NO').value.includes(`<@${user.id}>`)) {
                        moveReaction(prevEmbed, 'NO')
                    }
                    addReaction(prevEmbed, 'YES')
                }
            } else if (messageReaction._emoji.name === '👎') {
                if (prevEmbed.fields.find(item => item.name === 'NO').value.includes(`<@${user.id}>`)) {
                    return
                } else {
                    if (prevEmbed.fields.find(item => item.name === 'YES').value.includes(`<@${user.id}>`)) {
                        moveReaction(prevEmbed, 'YES')
                    }
                    addReaction(prevEmbed, 'NO')
                }
            }
            const pollEmbed = require('../embeds/pollEmbed')
            const embed = new Discord.MessageEmbed(pollEmbed)

            embed.setDescription(prevEmbed.description)
            embed.addFields(
                ...prevEmbed.fields
            )

            let message = messageReaction.message
            await message.edit(embed);
        }
    }
};